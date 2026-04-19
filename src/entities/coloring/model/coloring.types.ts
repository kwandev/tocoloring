export interface ColoringResult {
  /** 고유 식별자 */
  id: string;
  /** 변환된 도안 이미지 data URI */
  imageDataUri: string;
  /** 생성 시각 (Date.now()) */
  createdAt: number;
}
