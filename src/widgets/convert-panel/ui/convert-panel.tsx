'use client';

import { ImageUploader, ConvertButton, ResultList, useConvertStore } from '@/features/convert';

export function ConvertPanel() {
  const error = useConvertStore((s) => s.error);

  return (
    <div className="flex flex-col gap-6">
      <ImageUploader />

      {error && (
        <div className="border-destructive/50 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <ConvertButton />
      <ResultList />
    </div>
  );
}
