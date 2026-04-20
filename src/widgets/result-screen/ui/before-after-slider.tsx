'use client';

import { useCallback, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { HorizontalResizeIcon } from '@hugeicons/core-free-icons';
import { Badge } from '@/shared/components/ui/badge';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  className?: string;
}

/**
 * Before/After 비교 슬라이더
 *
 * 포인터 이벤트 리스너는 드래그 중에만 window에 등록하여 불필요한 이벤트 처리를 방지한다.
 */
export function BeforeAfterSlider({ beforeSrc, afterSrc, className = '' }: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePos = useCallback((clientX: number) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) {
      return;
    }
    const x = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(4, Math.min(96, x)));
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      updatePos(e.clientX);

      const onMove = (ev: PointerEvent) => updatePos(ev.clientX);
      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [updatePos],
  );

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg select-none ${className}`}
      style={{ touchAction: 'none' }}
      onPointerDown={handlePointerDown}
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
