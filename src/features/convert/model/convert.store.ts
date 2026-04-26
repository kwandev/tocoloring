import { create } from 'zustand';
import type { ColoringResult } from '@/entities/coloring';
import { MAX_RECONVERT_COUNT } from '@/features/convert/lib/convert.validation';

interface ConvertState {
  uploadedFileName: string | null;
  previewUri: string | null;
  results: ColoringResult[];
  isConverting: boolean;
  error: string | null;
  /** 변환 시작 시각 (소요 시간 계산용) */
  conversionStartedAt: number | null;
  /** 마지막 변환 소요 시간 (ms) */
  conversionDurationMs: number | null;
}

interface ConvertActions {
  /** 새 이미지를 업로드하면 이전 결과를 초기화한다 */
  setUploadedFile: (file: File, previewUri: string) => void;
  addResult: (result: ColoringResult) => void;
  setConverting: (isConverting: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: ConvertState = {
  uploadedFileName: null,
  previewUri: null,
  results: [],
  isConverting: false,
  error: null,
  conversionStartedAt: null,
  conversionDurationMs: null,
};

export const useConvertStore = create<ConvertState & ConvertActions>()((set, get) => ({
  ...initialState,

  setUploadedFile: (file, previewUri) => {
    const currentName = get().uploadedFileName;
    const fileIdentity = `${file.name}:${file.size}`;
    const isSameFile = currentName === fileIdentity;
    if (currentName && !isSameFile) {
      set({
        ...initialState,
        uploadedFileName: fileIdentity,
        previewUri,
      });
      return;
    }
    set({ uploadedFileName: fileIdentity, previewUri, error: null });
  },

  addResult: (result) => {
    const { results, conversionStartedAt } = get();
    const durationMs = conversionStartedAt ? Date.now() - conversionStartedAt : null;
    set({
      results: [...results, result],
      isConverting: false,
      error: null,
      conversionDurationMs: durationMs,
      conversionStartedAt: null,
    });
  },

  setConverting: (isConverting) => {
    if (isConverting) {
      set({ isConverting: true, error: null, conversionStartedAt: Date.now() });
    } else {
      set({ isConverting: false });
    }
  },

  setError: (error) => set({ error, isConverting: false }),

  reset: () => set(initialState),
}));

/** 재변환 가능 여부 — 첫 변환 제외, 최대 MAX_RECONVERT_COUNT회 재변환 가능 */
export function canReconvert(results: ColoringResult[]): boolean {
  return results.length > 0 && results.length <= MAX_RECONVERT_COUNT;
}

/** 남은 재변환 횟수 */
export function getRemainingReconvertCount(results: ColoringResult[]): number {
  return MAX_RECONVERT_COUNT - Math.max(0, results.length - 1);
}
