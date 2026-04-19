# 비동기 폴링 아키텍처

## 배경

Replicate API의 이미지 변환은 보통 10~30초가 소요된다.
Vercel Hobby 플랜의 서버리스 함수 실행 시간 제한은 **10초**이므로,
`replicate.run()`처럼 완료까지 블로킹하는 방식은 타임아웃으로 항상 실패한다.

## 동기 방식 (사용 불가)

```
클라이언트 → POST /api/convert → replicate.run() (10~30초 블로킹) → ❌ 10초 타임아웃
```

Replicate SDK의 `run()` 함수는 prediction 생성부터 완료까지 하나의 호출에서 대기한다.

```ts
// 이 방식은 Vercel Hobby에서 사용 불가
const output = await replicate.run('prunaai/flux-kontext-fast', { input });
```

## 비동기 폴링 방식 (현재 구현)

각 요청을 1초 이내로 끝내고, 클라이언트가 완료를 감지하는 구조.

```
클라이언트 → POST /api/convert → predictions.create() (~1초) → { predictionId }
클라이언트 → GET /api/convert/[id] → predictions.get() (~1초) → { status: "processing" }
클라이언트 → GET /api/convert/[id] → predictions.get() (~1초) → { status: "processing" }
클라이언트 → GET /api/convert/[id] → predictions.get() (~1초) → { status: "succeeded", imageDataUri }
```

### 흐름

1. **POST /api/convert** — `replicate.predictions.create()`로 prediction만 생성하고 즉시 `{ predictionId }` 반환
2. **클라이언트 폴링** — 2초 간격으로 GET 요청 반복
3. **GET /api/convert/[id]** — `replicate.predictions.get(id)`로 상태만 조회하고 즉시 반환
4. **완료 시** — 서버에서 Replicate CDN 이미지를 fetch → base64 data URI로 변환하여 반환

### Replicate CDN 이미지를 서버에서 프록시하는 이유

Replicate 출력 이미지 URL은 CORS 제한이 있어 브라우저에서 직접 접근할 수 없다.
서버에서 이미지를 fetch하여 base64 data URI로 변환 후 클라이언트에 전달한다.

## 플랜별 대안

| 플랜         | 타임아웃  | 권장 방식                        |
| ------------ | --------- | -------------------------------- |
| Vercel Hobby | 10초      | 비동기 폴링 (현재)               |
| Vercel Pro   | 300초     | `replicate.run()` 동기 호출 가능 |
| 자체 서버    | 제한 없음 | `replicate.run()` 또는 Webhook   |
