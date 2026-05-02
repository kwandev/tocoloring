# Phase 1 — MVP

## 랜딩 (`/`)

- [x] 히어로 섹션 (서비스 소개 + Before/After 카드 + CTA "도안 만들기" → `/convert`)
- [x] 사용 방법 3단계 안내 섹션
- [x] 다양한 예시 섹션 (카테고리별 Before/After 슬라이더 3개 — 캐릭터/반려동물/장난감)
- [x] 타겟 페르소나 안내 섹션 ("이런 분들이 사용하면 좋아요" — 부모/교사 카드)
- [x] 상단 네비게이션 (로고 + 홈 링크, 변환 중 자동 숨김)

## 업로드 (`/convert`)

- [x] 드래그 앤 드롭 + 파일 선택 업로드 영역
- [x] 업로드 이미지 미리보기 + 변환 버튼
- [x] 변환 중 로딩 화면 (spinner + 단계별 안내 멘트 + 점근 progress)
- [x] 최적화 팁 카드

## 결과 (`/result`)

- [x] Before/After 비교 슬라이더 (최신 결과 1개 표시)
- [x] 변환 완료 badge (소요 시간 표시)
- [x] 결과 다운로드 버튼 (webp)
- [x] 처음으로 / 다른 사진 버튼
- [x] 결과 없을 시 `/convert` 자동 리다이렉트
- [x] 재변환 버튼 (잔여 횟수 표시, 최대 2회) — 슬라이더의 After 이미지만 최신 결과로 교체

## 에러 / 검증

- [x] 클라이언트 검증 (2MB 이하, jpg/png/webp)
- [x] 서버 재검증 (data URI prefix + 길이)
- [x] 변환 실패 에러 표시
- [x] 파일 크기 초과 / 형식 오류 에러 표시

## 백엔드

- [x] `POST /api/convert` — Replicate prediction 생성, predictionId 즉시 반환 (Vercel Hobby 10초 타임아웃 대응을 위한 비동기 폴링 구조)
- [x] `GET /api/convert/[id]` — 상태 조회 + 성공 시 Replicate CDN URL → base64 data URI 변환 (서버 미저장)
- [x] Replicate `prunaai/flux-kontext-fast` 연동 (`output_format: 'webp'`, `output_quality: 70`)
- [x] 프롬프트 구성 및 튜닝
- [x] Vercel 배포 설정
