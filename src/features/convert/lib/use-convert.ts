import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createConversion, fetchConversionStatus } from '@/features/convert/api/convert.api';
import { useConvertStore } from '@/features/convert/model/convert.store';

/** Replicate prediction 상태 폴링 간격 (2초) */
const POLL_INTERVAL = 2000;

/**
 * 이미지 변환 로직 훅
 *
 * POST /api/convert → predictionId 수신 → 2초 간격 폴링으로 완료 대기.
 * 변환 완료 시 /result 페이지로 자동 이동한다.
 */
export function useConvert() {
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);

  // 언마운트 시 진행 중인 폴링을 중단하여 메모리 누수를 방지한다
  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  const convert = useCallback(async () => {
    // 호출 시점의 최신 상태를 읽어 stale closure 문제를 방지한다
    const { previewUri, setConverting, addResult, setError } = useConvertStore.getState();

    if (!previewUri) {
      return;
    }

    abortRef.current?.abort();
    const abortController = new AbortController();
    abortRef.current = abortController;

    setConverting(true);

    try {
      const { predictionId } = await createConversion(previewUri);

      // eslint-disable-next-line no-await-in-loop -- 폴링 패턴: 이전 응답에 따라 다음 요청 결정
      while (!abortController.signal.aborted) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));

        if (abortController.signal.aborted) {
          break;
        }

        // eslint-disable-next-line no-await-in-loop
        const status = await fetchConversionStatus(predictionId);

        if (status.status === 'succeeded' && status.imageDataUri) {
          addResult({
            id: crypto.randomUUID(),
            imageDataUri: status.imageDataUri,
            createdAt: Date.now(),
          });
          router.push('/result');
          return;
        }

        if (status.status === 'failed' || status.status === 'canceled') {
          setError(status.error ?? '변환에 실패했습니다. 다시 시도해주세요.');
          return;
        }
      }
    } catch {
      if (!abortController.signal.aborted) {
        useConvertStore.getState().setError('변환에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      // abort로 인한 종료(언마운트)든 정상 종료든 isConverting을 해제한다
      if (abortController.signal.aborted) {
        useConvertStore.getState().setConverting(false);
      }
    }
  }, [router]);

  return { convert };
}
