<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## 최우선 원칙 (가장 중요)

> AI는 이 프로젝트의 "보조 사고 도구"이다.  
> 최종 판단과 책임은 항상 사람에게 있다.

이 원칙을 어기는 요청이 들어오면,
AI는 그 위험을 먼저 경고해야 한다.

## 커밋 컨벤션

Conventional Commits prefix를 반드시 사용하고, 제목과 본문은 한국어로 작성한다.

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 formatting, 세미콜론 누락 등 코드 변경이 없는 경우
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드 추가/수정
- `chore`: 빌드 업무 수정, 패키지 매니저 수정

형식: `type: 한국어 제목`

## Node.js

**Node.js 24.14.1 (LTS)** 를 사용한다.

## 패키지 매니저

**pnpm**만 사용한다. npm, yarn 사용 금지.

- 패키지 설치: `pnpm add` / `pnpm add -D`
- 스크립트 실행: `pnpm run` 또는 `pnpm <script>`

## 네이밍 규칙

### 파일명

- **`.` 구분**: lib, api, model, store, types, queries 등 규칙적 파일 — `photo.api.ts`, `photo.store.ts`
- **`-` 구분**: 컴포넌트, UI 등 불규칙적 파일 — `photo-card.tsx`, `login-form.tsx`
- 폴더, 파일명은 kebab-case 사용 (예: `photo-card.tsx`)
- 컴포넌트명은 PascalCase 사용 (import, export 등) (예: `PhotoCard`)

### API 함수 접두사

| 동작 | 접두사   | 예시          |
| ---- | -------- | ------------- |
| 조회 | `fetch`  | `fetchPhotos` |
| 생성 | `create` | `createPhoto` |
| 수정 | `update` | `updatePhoto` |
| 삭제 | `delete` | `deletePhoto` |

### Query 훅 접두사

| 동작 | 접두사      | 예시             |
| ---- | ----------- | ---------------- |
| 조회 | `use`       | `usePhotos`      |
| 생성 | `useCreate` | `useCreatePhoto` |
| 수정 | `useUpdate` | `useUpdatePhoto` |
| 삭제 | `useDelete` | `useDeletePhoto` |

## 코드 생성 가이드

### 코드 생성 시 AI에게 요구할 것

- 과도한 추상화 금지
- 명확한 책임 단위
- TODO로 불확실성 표시
- 주요 코드 및 로직은 주석으로 의도 설명
- ES modules(import/export) 사용, CommonJS(require) 금지
- 특별한 요구가 없다면 함수형 기반 생성
- SOLID원칙 준수

### 코드 수정 시

- 전체 코드 재작성 금지
- 특정 함수 / 모듈 단위 수정

### 프로젝트 구조

[FSD (Feature-Sliced Design)](https://feature-sliced.design/) 아키텍처를 따른다.

```
src/
├── app/          # Next.js App Router (라우팅, 레이아웃)
├── widgets/      # 독립적인 UI 블록 조합
├── features/     # 사용자 시나리오 단위 기능
├── entities/     # 비즈니스 엔티티
└── shared/       # 공유 유틸리티, UI 컴포넌트
    └── lib/      # fetch 래퍼 등 범용 라이브러리
```

## 코드 품질 도구

- **Formatter**: oxfmt (설정: `.oxfmtrc.json`) — `pnpm format` / `pnpm format:check`
- **Linter**: oxlint (설정: `.oxlintrc.json`) — `pnpm lint`

코드 작성/수정 후 반드시 format과 lint 검사를 통과해야 한다.

- **Pre-commit Hook**: husky + lint-staged로 커밋 시 자동 실행
  - JS/TS 파일: `oxfmt --write` + `oxlint`
  - CSS/MD/JSON 파일: `oxfmt --write`

## 테스트

- **단위 테스트**: Vitest + React Testing Library — `pnpm test` / `pnpm test:watch`
  - 테스트 파일: `src/**/*.test.{ts,tsx}`
  - 설정: `vitest.config.ts`
- **E2E 테스트**: Playwright — `pnpm test:e2e`
  - 테스트 파일: `e2e/**/*.spec.ts`
  - 설정: `playwright.config.ts`

### 테스트 모킹 원칙

테스트 대상의 핵심 의존성은 모킹하지 않는다. 모킹은 테스트 대상의 경계 바깥을 격리할 때만 사용한다.

- **모킹 금지**: 테스트 대상이 직접 수행하는 동작의 의존성 (예: fetch 래퍼 테스트에서 fetch 모킹)
- **모킹 허용**: 테스트 대상의 관심사가 아닌 외부 의존성 격리 (예: 컴포넌트 테스트에서 API 호출 모킹)
- **모킹 필요**: 외부 서비스 호출처럼 실행이 불가능하거나 부작용이 있는 경우 (예: 결제 API)

IO가 포함된 모듈은 실제 서버(`node:http`)를 테스트 내에서 띄워 검증하는 방식을 우선한다.
