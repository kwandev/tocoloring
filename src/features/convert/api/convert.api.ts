import { api } from '@/shared/lib';
import type {
  ConvertResponse,
  ConversionStatusResponse,
} from '@/features/convert/model/convert.types';

/** 이미지 변환 요청 (prediction 생성) */
export function createConversion(imageDataUri: string) {
  return api.post<ConvertResponse>('/api/convert', {
    body: { imageDataUri },
  });
}

/** 변환 상태 조회 (폴링용) */
export function fetchConversionStatus(predictionId: string) {
  return api.get<ConversionStatusResponse>(`/api/convert/${predictionId}`);
}
