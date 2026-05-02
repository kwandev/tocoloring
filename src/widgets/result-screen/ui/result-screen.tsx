'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon } from '@hugeicons/core-free-icons';
import { Badge } from '@/shared/components/ui/badge';
import { useConvertStore } from '@/features/convert';
import { BeforeAfterSlider } from '@/shared/components/before-after-slider';
import { EditToolsCard } from './edit-tools-card';

export function ResultScreen() {
  const previewUri = useConvertStore((s) => s.previewUri);
  const results = useConvertStore((s) => s.results);
  const conversionDurationMs = useConvertStore((s) => s.conversionDurationMs);

  const latestResult = results[results.length - 1];
  const durationText = conversionDurationMs
    ? `${(conversionDurationMs / 1000).toFixed(1)}초`
    : null;

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
          <Badge variant="outline">윤곽선 단일</Badge>
          <div className="flex-1" />
          <span className="text-muted-foreground text-sm">← 좌우로 드래그해서 비교해보세요</span>
        </div>

        <BeforeAfterSlider
          beforeSrc={previewUri}
          afterSrc={latestResult.imageDataUri}
          className="bg-card h-[440px] border shadow-sm"
        />

        <div className="mt-4">
          <EditToolsCard />
        </div>
      </div>
    </div>
  );
}
