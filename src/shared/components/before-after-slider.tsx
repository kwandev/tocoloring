'use client';

import { useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { HorizontalResizeIcon } from '@hugeicons/core-free-icons';
import { Badge } from '@/shared/components/ui/badge';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  className?: string;
}

export function BeforeAfterSlider({ beforeSrc, afterSrc, className = '' }: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePos = (clientX: number) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) {
      return;
    }
    const x = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(4, Math.min(96, x)));
  };

  // setPointerCapture: 드래그가 컨테이너 밖으로 나가도 이벤트가 계속 들어오게 하면서,
  // unmount 시 캡처가 자동 해제되어 window 리스너 누수가 발생하지 않는다.
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePos(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      updatePos(e.clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg select-none ${className}`}
      style={{ touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- data URI 비교 뷰 */}
      <img src={beforeSrc} alt="원본" className="block size-full object-contain" />

      <div className="absolute inset-0 bg-white" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- data URI 비교 뷰 */}
        <img src={afterSrc} alt="변환 결과" className="size-full object-contain" />
      </div>

      <div
        className="bg-primary absolute top-0 bottom-0 z-10 w-[2px]"
        style={{ left: `calc(${pos}% - 1px)` }}
      >
        <div className="border-primary text-primary absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md">
          <HugeiconsIcon icon={HorizontalResizeIcon} size={14} />
        </div>
      </div>

      <Badge
        variant="secondary"
        className="border-border absolute bottom-4 left-4 border bg-white/95"
      >
        BEFORE
      </Badge>
      <Badge className="bg-primary absolute right-4 bottom-4 border-transparent text-white">
        AFTER
      </Badge>
    </div>
  );
}
