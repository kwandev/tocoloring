export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAX_RECONVERT_COUNT = 2;

export type ValidationError = 'FILE_TOO_LARGE' | 'INVALID_FORMAT';

/** 이미지 파일 유효성 검사. 유효하면 null, 아니면 에러 코드 반환 */
export function validateImageFile(file: File): ValidationError | null {
  if (file.size > MAX_FILE_SIZE) {
    return 'FILE_TOO_LARGE';
  }

  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    return 'INVALID_FORMAT';
  }

  return null;
}

/** ValidationError를 사용자 메시지로 변환 */
export function getValidationMessage(error: ValidationError): string {
  switch (error) {
    case 'FILE_TOO_LARGE': {
      return '파일 크기가 2MB를 초과합니다.';
    }
    case 'INVALID_FORMAT': {
      return 'jpg, png, webp 형식만 지원합니다.';
    }
  }
}
