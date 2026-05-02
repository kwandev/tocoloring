'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { FloppyDiskIcon, Home11Icon, Refresh01Icon } from '@hugeicons/core-free-icons';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { canReconvert, getRemainingReconvertCount, useConvertStore } from '@/features/convert';
import { downloadImage } from '@/shared/lib';
import Link from 'next/link';

interface EditToolsCardProps {
  onReconvert: () => void;
}

export function EditToolsCard({ onReconvert }: EditToolsCardProps) {
  const results = useConvertStore((s) => s.results);
  const isConverting = useConvertStore((s) => s.isConverting);
  const reset = useConvertStore((s) => s.reset);

  const remainingReconvert = getRemainingReconvertCount(results);
  const reconvertDisabled = !canReconvert(results) || isConverting;

  const handleDownload = () => {
    const latestResult = results[results.length - 1];
    if (!latestResult) {
      return;
    }
    const filename = `coloring-${results.length}-${Date.now()}.webp`;
    downloadImage(latestResult.imageDataUri, filename);
  };

  return (
    <Card className="flex flex-row flex-wrap items-center gap-6 p-4">
      <Button variant="outline" size="lg" render={<Link href="/" />} onClick={reset}>
        <HugeiconsIcon icon={Home11Icon} size={16} /> 처음으로
      </Button>
      <div className="flex-1" />
      <Button variant="outline" size="sm" onClick={onReconvert} disabled={reconvertDisabled}>
        <HugeiconsIcon icon={Refresh01Icon} size={14} /> 다시 변환 · {remainingReconvert}회 남음
      </Button>
      <Button size="sm" onClick={handleDownload}>
        <HugeiconsIcon icon={FloppyDiskIcon} size={14} /> 저장
      </Button>
    </Card>
  );
}
