import { describe, expect, it } from 'vitest';
import { POST } from './route';

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/convert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// 검증 분기는 모두 Replicate 호출 전에 끝나므로 외부 의존성 없이 테스트 가능.
// 성공(200) 분기는 Replicate SDK 모킹이 필요해 의도적으로 생략한다.
describe('POST /api/convert — 검증 실패 시 400 응답', () => {
  it('imageDataUri가 없으면 400과 안내 메시지를 반환한다', async () => {
    const response = await POST(makeRequest({}));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: '이미지가 필요합니다.' });
  });

  it('imageDataUri가 빈 문자열이면 400을 반환한다', async () => {
    const response = await POST(makeRequest({ imageDataUri: '' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: '이미지가 필요합니다.' });
  });

  it('imageDataUri가 문자열이 아니면 400을 반환한다', async () => {
    const response = await POST(makeRequest({ imageDataUri: 12_345 }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: '이미지가 필요합니다.' });
  });

  it('허용되지 않은 MIME prefix(gif)는 400과 형식 안내 메시지를 반환한다', async () => {
    const response = await POST(makeRequest({ imageDataUri: 'data:image/gif;base64,AAAA' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'jpg, png, webp 형식만 지원합니다.',
    });
  });

  it('data URI 형식이 아닌 문자열은 400을 반환한다', async () => {
    const response = await POST(makeRequest({ imageDataUri: 'not-a-data-uri' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'jpg, png, webp 형식만 지원합니다.',
    });
  });

  it('허용된 MIME 이지만 길이가 한도를 초과하면 400과 크기 안내 메시지를 반환한다', async () => {
    // MAX_DATA_URI_LENGTH = 3 * 1024 * 1024. 여유 있게 초과시킨다.
    const oversized = `data:image/jpeg;base64,${'A'.repeat(3 * 1024 * 1024)}`;

    const response = await POST(makeRequest({ imageDataUri: oversized }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: '파일 크기가 2MB를 초과합니다.',
    });
  });

  it.each(['data:image/jpeg', 'data:image/png', 'data:image/webp'] as const)(
    '%s prefix 자체는 형식 검증을 통과한다 (이후 길이 검증으로 진입)',
    async (prefix) => {
      // prefix만 통과하고 길이 한도 초과로 400을 받는지 확인
      const oversized = `${prefix};base64,${'A'.repeat(3 * 1024 * 1024)}`;

      const response = await POST(makeRequest({ imageDataUri: oversized }));

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({
        error: '파일 크기가 2MB를 초과합니다.',
      });
    },
  );
});
