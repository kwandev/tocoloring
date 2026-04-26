'use client';

import { Card } from '@/shared/components/ui/card';
import { RabbitSvg } from './rabbit-svg';

export function LoadingScreen() {
  return (
    <div className="bg-background animate-in fade-in fixed inset-0 z-10 flex flex-col items-center justify-center duration-300">
      <div className="text-muted-foreground mb-6 flex items-center gap-2 text-sm">
        <span className="border-muted border-t-primary size-3 animate-spin rounded-full border-2" />
        AI가 선을 추출하고 있어요 · 곧 완성됩니다
      </div>

      <Card className="relative flex size-[320px] items-center justify-center overflow-hidden p-6">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle at 50% 45%, #ffcdbd 0, #ff9b7b 60%, #e06a45 100%)',
          }}
        />
        <div className="text-foreground relative size-full">
          <RabbitSvg stroke={2.2} animated />
        </div>
      </Card>

      <div className="text-primary mt-6 text-sm font-medium">그리는 중...</div>
      <div className="bg-muted mt-3 h-1.5 w-[200px] overflow-hidden rounded-full">
        <div className="progress-fill bg-primary h-full rounded-full" />
      </div>
      <div className="text-muted-foreground mt-2 text-xs">평균 5초 소요</div>
    </div>
  );
}
