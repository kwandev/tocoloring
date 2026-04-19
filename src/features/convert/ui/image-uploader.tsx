'use client';

import { useCallback, useRef, useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { fileToDataUri } from '@/shared/lib';
import { validateImageFile, getValidationMessage } from '@/features/convert/lib/convert.validation';
import { useConvertStore } from '@/features/convert/model/convert.store';

/**
 * 이미지 업로드 영역 컴포넌트
 *
 * 드래그 앤 드롭 또는 클릭으로 이미지를 선택한다.
 * 선택된 파일은 클라이언트에서 검증(크기, 형식) 후 base64 data URI로 변환하여 스토어에 저장한다.
 * 업로드된 이미지가 있으면 미리보기를 표시한다.
 */
export function ImageUploader() {
  const previewUri = useConvertStore((s) => s.previewUri);
  const isConverting = useConvertStore((s) => s.isConverting);
  const setUploadedFile = useConvertStore((s) => s.setUploadedFile);
  const setError = useConvertStore((s) => s.setError);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 파일 검증 → base64 변환 → 스토어 저장
  const handleFile = useCallback(
    async (file: File) => {
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(getValidationMessage(validationError));
        return;
      }

      const dataUri = await fileToDataUri(file);
      setUploadedFile(file, dataUri);
    },
    [setUploadedFile, setError],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const [file] = e.dataTransfer.files;
      if (file) {
        handleFile(file);
      }
    },
    [handleFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
      // 같은 파일을 다시 선택할 수 있도록 value 초기화
      e.target.value = '';
    },
    [handleFile],
  );

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        className={cn(
          'relative flex min-h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors',
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50',
          isConverting && 'pointer-events-none opacity-60',
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        {previewUri ? (
          <div className="flex flex-col items-center gap-4 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- data URI 미리보기에는 next/image 불필요 */}
            <img
              src={previewUri}
              alt="업로드된 이미지 미리보기"
              className="max-h-48 max-w-full rounded-lg object-contain"
            />
            <p className="text-muted-foreground text-sm">
              클릭하거나 드래그하여 다른 이미지로 변경
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 p-8">
            <div className="bg-muted rounded-full p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-medium">이미지를 드래그하거나 클릭하여 업로드</p>
              <p className="text-muted-foreground mt-1 text-sm">JPG, PNG, WebP (최대 2MB)</p>
            </div>
          </div>
        )}
      </button>
    </>
  );
}
