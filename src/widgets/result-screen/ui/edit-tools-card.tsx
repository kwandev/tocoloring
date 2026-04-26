'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { FloppyDiskIcon, Home11Icon } from '@hugeicons/core-free-icons';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useConvertStore } from '@/features/convert';
import { downloadImage } from '@/shared/lib';
import Link from 'next/link';

export function EditToolsCard() {
  const results = useConvertStore((s) => s.results);
  const reset = useConvertStore((s) => s.reset);

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
      <Button size="sm" onClick={handleDownload}>
        <HugeiconsIcon icon={FloppyDiskIcon} size={14} /> 저장
      </Button>
    </Card>
  );
}
