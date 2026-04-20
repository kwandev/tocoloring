'use client';

import type { ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  PrinterIcon,
  FloppyDiskIcon,
  Share01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Separator } from '@/shared/components/ui/separator';
import { useConvertStore } from '@/features/convert';
import { downloadImage } from '@/shared/lib';

export function SaveModal() {
  const showSaveModal = useConvertStore((s) => s.showSaveModal);
  const toggleSaveModal = useConvertStore((s) => s.toggleSaveModal);
  const results = useConvertStore((s) => s.results);

  const latestResult = results[results.length - 1];

  const handleDownload = () => {
    if (!latestResult) {
      return;
    }
    const filename = `coloring-${results.length}-${Date.now()}.png`;
    downloadImage(latestResult.imageDataUri, filename);
    toggleSaveModal();
  };

  const handlePrint = () => {
    window.print();
    toggleSaveModal();
  };

  return (
    <Dialog open={showSaveModal} onOpenChange={toggleSaveModal}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>도안이 준비됐어요</DialogTitle>
          <DialogDescription>어떻게 받으시겠어요?</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="space-y-1">
          <SaveOption
            icon={<HugeiconsIcon icon={PrinterIcon} size={18} />}
            title="A4 용지로 프린트"
            desc="연결된 프린터로 바로 출력"
            primary
            onSelect={handlePrint}
          />
          <SaveOption
            icon={<HugeiconsIcon icon={FloppyDiskIcon} size={18} />}
            title="PNG로 저장"
            desc="고해상도 이미지 다운로드"
            onSelect={handleDownload}
          />
          <SaveOption
            icon={<HugeiconsIcon icon={Share01Icon} size={18} />}
            title="링크 공유"
            desc="카톡·밴드·메일로 가족에게 보내기"
            // TODO: 공유 기능 구현
            onSelect={() => {}}
          />
        </div>
        <Separator />
        <div className="text-muted-foreground text-center text-xs">
          이 도안은 브라우저를 닫으면 사라져요. 꼭 저장해두세요!
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SaveOption({
  icon,
  title,
  desc,
  primary = false,
  onSelect,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  primary?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className="group hover:bg-accent flex w-full items-center gap-4 rounded-md p-3 text-left transition-colors"
      onClick={onSelect}
    >
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-md ${
          primary ? 'bg-primary text-white' : 'bg-secondary text-foreground'
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-muted-foreground text-xs">{desc}</div>
      </div>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={16}
        className="text-muted-foreground group-hover:text-foreground transition-colors"
      />
    </button>
  );
}
