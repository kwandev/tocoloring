'use client';

import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Upload04Icon, Image01Icon, SparklesIcon } from '@hugeicons/core-free-icons';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useConvertStore, useFileUpload, useConvert } from '@/features/convert';
import { LoadingScreen } from '@/widgets/loading-screen';
import { StepIndicator } from './step-indicator';

export function UploadScreen() {
  const previewUri = useConvertStore((s) => s.previewUri);
  const isConverting = useConvertStore((s) => s.isConverting);
  const error = useConvertStore((s) => s.error);
  const { inputRef, handleDrop, handleChange, openFilePicker } = useFileUpload();
  const { convert } = useConvert();
  const [isDragOver, setIsDragOver] = useState(false);

  if (isConverting) {
    return <LoadingScreen />;
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mx-auto max-w-3xl px-6 pt-12 pb-20">
        <StepIndicator activeStep={1} />

        <h1 className="mb-2 text-3xl font-bold tracking-tight">사진을 올려주세요</h1>
        <p className="text-muted-foreground mb-8">
          인물·반려동물·사물 모두 가능. JPG 또는 PNG, 최대 2MB.
        </p>

        {error && (
          <div className="border-destructive/50 bg-destructive/10 text-destructive mb-4 rounded-lg border px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleChange}
        />

        {previewUri ? (
          <div className="mb-6 space-y-4">
            <Card className="overflow-hidden p-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- data URI 미리보기 */}
              <img
                src={previewUri}
                alt="업로드된 이미지 미리보기"
                className="max-h-80 w-full object-contain"
              />
            </Card>
            <div className="flex items-center gap-3">
              <Button size="lg" className="flex-1" onClick={convert}>
                <HugeiconsIcon icon={SparklesIcon} size={16} /> 변환하기
              </Button>
              <Button variant="outline" size="lg" onClick={openFilePicker}>
                다른 사진
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={cn(
              'w-full cursor-pointer rounded-xl border-2 border-dashed bg-card px-6 py-16 text-center transition-all',
              isDragOver
                ? 'border-primary bg-primary-soft'
                : 'border-border hover:border-muted-foreground/40 hover:bg-muted/30',
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              setIsDragOver(false);
              handleDrop(e);
            }}
            onClick={openFilePicker}
          >
            <div className="bg-primary-soft text-primary mx-auto mb-4 flex size-14 items-center justify-center rounded-full">
              <HugeiconsIcon icon={Upload04Icon} size={22} />
            </div>
            <div className="mb-1.5 text-lg font-semibold">여기에 사진을 드래그하세요</div>
            <div className="text-muted-foreground mb-5 text-sm">
              또는 아래 버튼으로 직접 선택할 수 있어요
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="bg-primary text-primary-foreground inline-flex h-8 items-center gap-1 rounded-4xl px-3 text-sm font-medium">
                <HugeiconsIcon icon={Image01Icon} size={14} /> 파일 선택
              </span>
            </div>
          </button>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              emoji: '🎯',
              t: '정면 클로즈업이 좋아요',
              d: '얼굴·주요 피사체가 선명하게 보일수록 예쁜 도안이 나와요.',
            },
            {
              emoji: '🌤',
              t: '배경은 단순하게',
              d: '배경이 복잡하면 선이 너무 많아져 아이가 어려워해요.',
            },
            {
              emoji: '🔆',
              t: '밝은 곳에서 찍은 사진',
              d: '그림자가 진한 사진은 의도하지 않은 선이 생길 수 있어요.',
            },
          ].map((h) => (
            <Card key={h.emoji} size="sm">
              <CardContent>
                <div className="mb-2 text-xl">{h.emoji}</div>
                <div className="mb-1 text-sm font-medium">{h.t}</div>
                <div className="text-muted-foreground text-xs leading-relaxed">{h.d}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
