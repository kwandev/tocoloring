/** POST /api/convert 요청 바디 */
export interface ConvertRequest {
  imageDataUri: string;
}

/** POST /api/convert 응답 — prediction 생성 결과 */
export interface ConvertResponse {
  predictionId: string;
}

/** GET /api/convert/[id] 응답 — prediction 상태 조회 */
export interface ConversionStatusResponse {
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  /** 변환 완료 시 이미지 data URI */
  imageDataUri?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}
