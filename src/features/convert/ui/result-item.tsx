'use client';

import { useCallback } from 'react';
import { Button } from '@/shared/components/ui/button';
import { downloadImage } from '@/shared/lib';
import type { ColoringResult } from '@/entities/coloring';

interface ResultItemProps {
  result: ColoringResult;
  index: number;
}

export function ResultItem({ result, index }: ResultItemProps) {
  const handleDownload = useCallback(() => {
    const filename = `coloring-${index + 1}-${Date.now()}.png`;
    downloadImage(result.imageDataUri, filename);
  }, [result.imageDataUri, index]);

  return (
    <div className="bg-card flex flex-col gap-2 rounded-lg border p-3">
      <div className="overflow-hidden rounded-md bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element -- data URI 표시에는 next/image 불필요 */}
        <img
          src={result.imageDataUri}
          alt={`변환 결과 ${index + 1}`}
          className="aspect-square w-full object-contain"
        />
      </div>
      <Button variant="outline" size="sm" onClick={handleDownload} className="w-full">
        다운로드
      </Button>
    </div>
  );
}
