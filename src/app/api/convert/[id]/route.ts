import type { NextRequest } from 'next/server';
import { replicate } from '@/shared/lib/replicate';

/**
 * GET /api/convert/[id]
 *
 * Replicate prediction 상태를 조회한다.
 * 클라이언트가 2초 간격으로 폴링하여 변환 완료 여부를 확인하는 용도.
 *
 * 성공 시 Replicate 출력 이미지를 서버에서 fetch → base64 data URI로 변환하여 반환한다.
 * (Replicate CDN URL은 CORS 제한이 있어 클라이언트에서 직접 접근 불가하므로 서버 프록시 필요)
 */
export async function GET(_req: NextRequest, ctx: RouteContext<'/api/convert/[id]'>) {
  const { id } = await ctx.params;

  try {
    const prediction = await replicate.predictions.get(id);

    // 아직 처리 중 — 클라이언트는 이 응답을 받으면 계속 폴링
    if (prediction.status === 'starting' || prediction.status === 'processing') {
      return Response.json({ status: prediction.status });
    }

    // 실패 또는 취소
    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      return Response.json({
        status: prediction.status,
        error: prediction.error ?? '변환에 실패했습니다.',
      });
    }

    // --- 변환 성공: 출력 이미지를 data URI로 변환하여 반환 ---
    // Replicate 모델에 따라 output이 배열(여러 이미지) 또는 단일 문자열일 수 있음
    const { output } = prediction;
    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (!imageUrl || typeof imageUrl !== 'string') {
      return Response.json({
        status: 'failed',
        error: '변환 결과를 가져올 수 없습니다.',
      });
    }

    // 서버에서 Replicate CDN 이미지를 fetch하여 base64 data URI로 변환 (CORS 우회)
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const contentType = imageResponse.headers.get('content-type') ?? 'image/png';
    const imageDataUri = `data:${contentType};base64,${base64}`;

    return Response.json({
      status: 'succeeded',
      imageDataUri,
    });
  } catch (error) {
    console.error('Prediction 상태 조회 실패:', error);
    return Response.json({ status: 'failed', error: '상태 조회에 실패했습니다.' }, { status: 500 });
  }
}
