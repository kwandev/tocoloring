import { replicate } from '@/shared/lib/replicate';

// 클라이언트에서 전송하는 data URI의 MIME 타입 허용
const ALLOWED_MIME_PREFIXES = ['data:image/jpeg', 'data:image/png', 'data:image/webp'];
// 2MB 파일 → base64 인코딩 시 약 2.7MB (4/3 비율)
const MAX_DATA_URI_LENGTH = 3 * 1024 * 1024;

// 색칠공부 도안 변환용 프롬프트 — 아이들이 색칠하기 적합한 굵은 라인 아트로 변환
const COLORING_PROMPT = [
  'Convert this image into a clean black-and-white coloring book page.',
  'Use bold, smooth outlines suitable for children to color.',
  'Remove all colors, shading, and textures.',
  'Keep only clear line art on a pure white background.',
  "Simplify complex details while preserving the main subject's recognizable features.",
].join(' ');

/**
 * POST /api/convert
 *
 * 이미지 변환 요청을 처리한다.
 * Replicate prediction을 생성만 하고 즉시 predictionId를 반환한다.
 * (Vercel Hobby 플랜 10초 타임아웃 대응 — 완료 대기 없이 비동기 처리)
 *
 * 클라이언트는 반환된 predictionId로 GET /api/convert/[id]를 폴링하여 결과를 가져간다.
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { imageDataUri } = body as { imageDataUri: string };

  // --- 서버 사이드 검증 (클라이언트 검증과 이중으로 수행) ---
  if (!imageDataUri || typeof imageDataUri !== 'string') {
    return Response.json({ error: '이미지가 필요합니다.' }, { status: 400 });
  }

  // data URI prefix로 MIME 타입 검증
  const hasValidPrefix = ALLOWED_MIME_PREFIXES.some((prefix) => imageDataUri.startsWith(prefix));
  if (!hasValidPrefix) {
    return Response.json({ error: 'jpg, png, webp 형식만 지원합니다.' }, { status: 400 });
  }

  // base64 문자열 길이로 파일 크기 검증
  if (imageDataUri.length > MAX_DATA_URI_LENGTH) {
    return Response.json({ error: '파일 크기가 2MB를 초과합니다.' }, { status: 400 });
  }

  try {
    // prediction 생성만 수행하고 완료를 대기하지 않음 (비동기 폴링 패턴)
    const prediction = await replicate.predictions.create({
      model: 'prunaai/flux-kontext-fast',
      input: {
        prompt: COLORING_PROMPT,
        img_cond_path: imageDataUri,
        output_format: 'webp',
        output_quality: 70,
      },
    });

    return Response.json({ predictionId: prediction.id });
  } catch (error) {
    console.error('Replicate prediction 생성 실패:', error);
    return Response.json(
      { error: '변환 요청에 실패했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 },
    );
  }
}
