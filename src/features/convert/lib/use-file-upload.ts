import { useCallback, useRef } from 'react';
import { fileToDataUri } from '@/shared/lib';
import { validateImageFile, getValidationMessage } from '@/features/convert/lib/convert.validation';
import { useConvertStore } from '@/features/convert/model/convert.store';

/**
 * 파일 업로드 로직 훅
 *
 * 파일 검증 → base64 data URI 변환 → 스토어 저장을 수행한다.
 * ImageUploader나 새 UploadScreen의 dropzone에서 재사용 가능.
 */
export function useFileUpload() {
  const setUploadedFile = useConvertStore((s) => s.setUploadedFile);
  const setError = useConvertStore((s) => s.setError);
  const inputRef = useRef<HTMLInputElement>(null);

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
      e.target.value = '';
    },
    [handleFile],
  );

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return { inputRef, handleFile, handleDrop, handleChange, openFilePicker };
}
