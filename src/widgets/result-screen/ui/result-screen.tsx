'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon } from '@hugeicons/core-free-icons';
import { Badge } from '@/shared/components/ui/badge';
import { useConvert, useConvertStore } from '@/features/convert';
import { BeforeAfterSlider } from '@/shared/components/before-after-slider';
import { LoadingScreen } from '@/widgets/loading-screen';
import { EditToolsCard } from './edit-tools-card';

export function ResultScreen() {
  const previewUri = useConvertStore((s) => s.previewUri);
  const results = useConvertStore((s) => s.results);
  const isConverting = useConvertStore((s) => s.isConverting);
  const conversionDurationMs = useConvertStore((s) => s.conversionDurationMs);
  // useConvert는 ResultScreen 레벨에서 호출해야 isConverting 시 LoadingScreen으로 전환되어도
  // 훅이 살아남는다. EditToolsCard에 두면 unmount 시 cleanup의 abort가 폴링을 죽인다.
  const { convert } = useConvert();

  const latestResult = results[results.length - 1];
  const durationText = conversionDurationMs
    ? `${(conversionDurationMs / 1000).toFixed(1)}초`
    : null;

  if (isConverting) {
    return <LoadingScreen />;
  }
  if (!previewUri || !latestResult) {
    return null;
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mx-auto max-w-5xl px-6 pt-6 pb-16">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight">변환 결과</h2>
          <Badge variant="default" className="gap-1">
            <HugeiconsIcon icon={Tick01Icon} size={11} /> 변환 완료
            {durationText && ` · ${durationText}`}
          </Badge>
          <div className="flex-1" />
          <span className="text-muted-foreground text-sm">좌우로 드래그해서 비교해보세요</span>
        </div>

        <BeforeAfterSlider
          beforeSrc={previewUri}
          afterSrc={latestResult.imageDataUri}
          className="bg-card h-[440px] border shadow-sm"
        />

        <div className="mt-4">
          <EditToolsCard onReconvert={convert} />
        </div>
      </div>
    </div>
  );
}
