'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { PrinterIcon, FloppyDiskIcon } from '@hugeicons/core-free-icons';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { useConvertStore } from '@/features/convert';

// TODO: 실제 재변환 파라미터 연동은 향후 구현
export function EditToolsCard() {
  const toggleSaveModal = useConvertStore((s) => s.toggleSaveModal);

  return (
    <Card className="flex flex-row flex-wrap items-center gap-6 p-4">
      <div className="flex-1" />

      <Button variant="outline" size="sm" onClick={() => window.print()}>
        <HugeiconsIcon icon={PrinterIcon} size={14} /> 프린트
      </Button>
      <Button size="sm" onClick={toggleSaveModal}>
        <HugeiconsIcon icon={FloppyDiskIcon} size={14} /> 저장
      </Button>
    </Card>
  );
}
