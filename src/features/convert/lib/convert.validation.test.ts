import { describe, expect, it } from 'vitest';
import {
  ALLOWED_TYPES,
  MAX_FILE_SIZE,
  getValidationMessage,
  validateImageFile,
} from './convert.validation';

function createFile(size: number, type: string, name = 'sample'): File {
  return new File([new ArrayBuffer(size)], name, { type });
}

describe('validateImageFile', () => {
  describe('정상 케이스', () => {
    it.each(ALLOWED_TYPES)('%s 타입은 통과한다', (type) => {
      const file = createFile(1024, type);

      expect(validateImageFile(file)).toBeNull();
    });

    it('정확히 MAX_FILE_SIZE 바이트는 허용된다 (경계값)', () => {
      const file = createFile(MAX_FILE_SIZE, 'image/jpeg');

      expect(validateImageFile(file)).toBeNull();
    });
  });

  describe('크기 초과', () => {
    it('MAX_FILE_SIZE를 1바이트라도 초과하면 FILE_TOO_LARGE를 반환한다', () => {
      const file = createFile(MAX_FILE_SIZE + 1, 'image/png');

      expect(validateImageFile(file)).toBe('FILE_TOO_LARGE');
    });

    it('크기 검사가 타입 검사보다 먼저 수행된다 (큰 gif → FILE_TOO_LARGE)', () => {
      const file = createFile(MAX_FILE_SIZE + 1, 'image/gif');

      expect(validateImageFile(file)).toBe('FILE_TOO_LARGE');
    });
  });

  describe('잘못된 형식', () => {
    it('허용되지 않은 MIME 타입은 INVALID_FORMAT을 반환한다', () => {
      const file = createFile(1024, 'image/gif');

      expect(validateImageFile(file)).toBe('INVALID_FORMAT');
    });

    it('빈 타입 문자열은 INVALID_FORMAT을 반환한다', () => {
      const file = createFile(1024, '');

      expect(validateImageFile(file)).toBe('INVALID_FORMAT');
    });

    it('image가 아닌 타입은 INVALID_FORMAT을 반환한다', () => {
      const file = createFile(1024, 'application/pdf');

      expect(validateImageFile(file)).toBe('INVALID_FORMAT');
    });
  });
});

describe('getValidationMessage', () => {
  it('FILE_TOO_LARGE는 2MB 초과 메시지를 반환한다', () => {
    expect(getValidationMessage('FILE_TOO_LARGE')).toBe('파일 크기가 2MB를 초과합니다.');
  });

  it('INVALID_FORMAT은 지원 형식 안내 메시지를 반환한다', () => {
    expect(getValidationMessage('INVALID_FORMAT')).toBe('jpg, png, webp 형식만 지원합니다.');
  });
});
