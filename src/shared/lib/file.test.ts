import { describe, expect, it } from 'vitest';
import { fileToDataUri } from './file';

describe('fileToDataUri', () => {
  it('텍스트 파일을 base64 data URI로 변환한다', async () => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    const result = await fileToDataUri(file);

    // base64('hello') === 'aGVsbG8='
    expect(result).toBe('data:text/plain;base64,aGVsbG8=');
  });

  it('이미지 MIME 타입을 그대로 보존한다', async () => {
    const file = new File([new Uint8Array([0xff, 0xd8, 0xff])], 'a.jpg', { type: 'image/jpeg' });

    const result = await fileToDataUri(file);

    expect(result.startsWith('data:image/jpeg;base64,')).toBe(true);
  });

  it('빈 파일도 정상적으로 resolve 된다', async () => {
    const file = new File([], 'empty.png', { type: 'image/png' });

    const result = await fileToDataUri(file);

    expect(result).toBe('data:image/png;base64,');
  });

  // TODO: FileReader.error 분기는 jsdom 환경에서 자연스럽게 트리거하기 어려움.
  // 실제 reject 경로는 E2E나 수동 검증으로 보완.
});
