# PRD — ToColoring

## 개요

사용자가 이미지를 업로드하면 AI 모델을 통해 색칠공부 도안(라인 아트)으로 변환해주는 웹 서비스.
포트폴리오 겸 수익화를 목표로 하며, Next.js 풀스택으로 구현한다.

## 타겟 사용자

- 커스텀 색칠공부 도안을 원하는 **아이가 있는 부모**
- 교육 자료가 필요한 **유치원/어린이집 교사**

## 핵심 사용자 플로우

1. 홈(/) — 서비스 소개, CTA
2. 이미지 업로드(/convert) — 원본 이미지 선택
3. AI 변환 — 로딩 화면 표시 (평균 5초)
4. 결과 확인(/result) — Before/After 비교, 다운로드(webp)
5. 같은 원본으로 재변환 가능 (최대 2회)

---

## 페이즈 구성

### Phase 1 — MVP (현재)

- 홈/랜딩 페이지 (서비스 소개, CTA)
- 이미지 업로드 UI (최대 2MB, jpg/png/webp)
- AI 모델을 통한 도안 변환 (결과 포맷: webp)
- Before/After 비교 슬라이더
- 변환 결과 webp 다운로드
- 라우트: `/` (홈), `/convert` (업로드+로딩), `/result` (결과)

### Phase 2 — 계정 연결

- 로그인 기능 (BetterAuth, Google 로그인만 제공)
- 회원가입/로그인 연동
- 크레딧 잔액 관리
- 크레딧 충전/사용 이력 조회

### Phase 3 — 결제 모듈

- 토스페이먼츠 연동
- 크레딧 충전 (패키지 구성)
- 결제 내역 관리

---

## 기술 스택

| 영역       | 기술                                    |
| ---------- | --------------------------------------- |
| 프레임워크 | Next.js 16 (풀스택, App Router)         |
| AI 모델    | Replicate — `prunaai/flux-kontext-fast` |
| 상태관리   | Zustand                                 |
| 스타일     | Tailwind CSS 4, shadcn/ui               |
| DB         | Supabase (Phase 2~)                     |
| 인증       | BetterAuth (Phase 2~)                   |
| 결제       | 토스페이먼츠 (Phase 3)                  |
| 배포       | Vercel                                  |

### AI 모델 관련

- Replicate 유료 API(`prunaai/flux-kontext-fast`)로 구현
- 출력 포맷: webp (output_format: 'webp', output_quality: 70)
- 변환 결과는 서버에서 base64 data URI로 변환하여 클라이언트에 전달, 서버 저장 없음
- 비동기 폴링 아키텍처 사용 (Vercel Hobby 10초 타임아웃 대응)

### 이미지 업로드

- 최대 2MB
- 허용 형식: jpg, png, webp
- 클라이언트에서 사전 검증, 서버에서 재검증

---

> 비즈니스 모델, 법적 검토, 미결정 사항은 `docs/business.md` 참고 (비공개)
