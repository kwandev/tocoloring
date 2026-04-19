'use client';

import { useCallback, useRef } from 'react';
import { Button } from '@/shared/components/ui/button';
import { createConversion, fetchConversionStatus } from '@/features/convert/api/convert.api';
import {
  useConvertStore,
  canReconvert,
  getRemainingReconvertCount,
} from '@/features/convert/model/convert.store';

// Replicate prediction 상태 폴링 간격 (2초)
const POLL_INTERVAL = 2000;

export function ConvertButton() {
  const previewUri = useConvertStore((s) => s.previewUri);
  const results = useConvertStore((s) => s.results);
  const isConverting = useConvertStore((s) => s.isConverting);
  const setConverting = useConvertStore((s) => s.setConverting);
  const addResult = useConvertStore((s) => s.addResult);
  const setError = useConvertStore((s) => s.setError);
  const abortRef = useRef<AbortController | null>(null);

  const hasResults = results.length > 0;
  const canConvert = previewUri && !isConverting && (!hasResults || canReconvert(results));
  const remainingCount = getRemainingReconvertCount(results);

  /**
   * POST /api/convert → predictionId 수신 → 2초 간격 폴링으로 완료 대기
   * Vercel Hobby 10초 타임아웃 대응을 위한 비동기 폴링 패턴
   */
  const handleConvert = useCallback(async () => {
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
          return;
        }

        if (status.status === 'failed' || status.status === 'canceled') {
          setError(status.error ?? '변환에 실패했습니다. 다시 시도해주세요.');
          return;
        }
      }
    } catch {
      if (!abortController.signal.aborted) {
        setError('변환에 실패했습니다. 다시 시도해주세요.');
      }
    }
  }, [previewUri, setConverting, addResult, setError]);

  if (!previewUri) {
    return null;
  }

  const buttonText = hasResults ? `재변환 (${remainingCount}회 남음)` : '변환하기';

  return (
    <Button size="lg" className="w-full" disabled={!canConvert} onClick={handleConvert}>
      {isConverting ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner />
          변환 중...
        </span>
      ) : (
        buttonText
      )}
    </Button>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="size-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
