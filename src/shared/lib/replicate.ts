import Replicate from 'replicate';

/** Replicate API 클라이언트 싱글턴 (서버 사이드 전용) */
export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
