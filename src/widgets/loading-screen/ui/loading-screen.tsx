'use client';

import { useEffect, useState } from 'react';
import { useConvertStore } from '@/features/convert';

// τ=7s: 실측 평균 변환 시간(약 10초)에 ~76%까지 차도록 선택. cap 0.95로 100% 도달을 막아
// 실제 완료(컴포넌트 unmount) 전에 진행률이 가짜로 100%를 알리지 않게 한다.
const TIME_CONSTANT_SEC = 7;
const PROGRESS_CAP = 0.95;
const TICK_MS = 200;

// 경과 시간대별 안내 멘트. 위에서부터 차례로 매칭한다.
const STAGES: readonly { until: number; message: string }[] = [
  { until: 3, message: '이미지를 분석하고 있어요' },
  { until: 7, message: '선을 따고 있어요' },
  { until: 12, message: '디테일을 다듬고 있어요' },
  { until: Infinity, message: '거의 다 됐어요' },
];

function getStageMessage(elapsedSec: number): string {
  return STAGES.find((s) => elapsedSec < s.until)?.message ?? '';
}

export function LoadingScreen() {
  const startedAt = useConvertStore((s) => s.conversionStartedAt);
  // 마운트 시점이 startedAt보다 늦은 경우(예: 변환 도중 화면 복귀)에도 첫 프레임부터
  // 정확한 진행률을 보여주기 위해 lazy 초기값으로 즉시 경과 시간을 계산한다.
  const [elapsedMs, setElapsedMs] = useState(() => (startedAt ? Date.now() - startedAt : 0));

  useEffect(() => {
    if (!startedAt) {
      return;
    }
    const id = setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [startedAt]);

  const elapsedSec = elapsedMs / 1000;
  const progress = Math.min(PROGRESS_CAP, 1 - Math.exp(-elapsedSec / TIME_CONSTANT_SEC));

  return (
    <div className="bg-background animate-in fade-in fixed inset-0 z-10 flex flex-col items-center justify-center duration-300">
      <span className="border-muted border-t-primary mb-6 size-12 animate-spin rounded-full border-[3px]" />

      <div className="text-foreground mb-1 text-base font-medium">
        {getStageMessage(elapsedSec)}
      </div>
      <div className="text-muted-foreground mb-5 text-sm">잠시만 기다려주세요 · 평균 10초 소요</div>

      <div className="bg-muted h-1.5 w-[240px] overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-[width] duration-200 ease-out"
          style={{ width: `${(progress * 100).toFixed(2)}%` }}
        />
      </div>
    </div>
  );
}
