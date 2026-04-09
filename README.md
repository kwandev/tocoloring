# Next.js Boilerplate

Next.js 16 + React 19 기반 보일러플레이트 프로젝트.

## 기술 스택

| 카테고리      | 도구                           |
| ------------- | ------------------------------ |
| Node.js       | 24.14.1 (LTS)                  |
| 프레임워크    | Next.js 16, React 19           |
| 언어          | TypeScript                     |
| 스타일링      | Tailwind CSS v4                |
| 폰트          | Pretendard (Variable)          |
| 린터          | oxlint                         |
| 포매터        | oxfmt                          |
| 단위 테스트   | Vitest + React Testing Library |
| E2E 테스트    | Playwright                     |
| Git 훅        | husky + lint-staged            |
| 패키지 매니저 | pnpm                           |

## 프로젝트 구조

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

## 시작하기

```bash
pnpm install
pnpm dev
```

http://localhost:3000 에서 확인.

## 스크립트

| 명령어              | 설명                       |
| ------------------- | -------------------------- |
| `pnpm dev`          | 개발 서버 실행             |
| `pnpm build`        | 프로덕션 빌드              |
| `pnpm start`        | 프로덕션 서버 실행         |
| `pnpm lint`         | oxlint 린트 검사           |
| `pnpm format`       | oxfmt 포매팅 적용          |
| `pnpm format:check` | 포매팅 검사 (CI용)         |
| `pnpm test`         | Vitest 단위 테스트 실행    |
| `pnpm test:watch`   | Vitest watch 모드          |
| `pnpm test:e2e`     | Playwright E2E 테스트 실행 |

## 네이밍 규칙

### 파일명

- **`.` 구분**: lib, api, model, store, types, queries 등 규칙적 파일 — `photo.api.ts`, `photo.store.ts`
- **`-` 구분**: 컴포넌트, UI 등 불규칙적 파일 — `photo-card.tsx`, `login-form.tsx`

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

## 코드 품질

커밋 시 husky + lint-staged가 자동 실행된다.

- JS/TS 파일: `oxfmt --write` + `oxlint`
- CSS/MD/JSON 파일: `oxfmt --write`

## 테스트

- **단위 테스트**: `src/**/*.test.{ts,tsx}` — Vitest + React Testing Library
- **E2E 테스트**: `e2e/**/*.spec.ts` — Playwright
