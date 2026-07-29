# @jeon-ji/common-ui

React 19 디자인 시스템 — CSS 변수 토큰 기반, ESM 전용.

- **문서**: `pnpm dev`로 로컬 문서 사이트 실행 (모든 컴포넌트의 데모·API·접근성 노트)
- **패키지**: GitHub Packages `@jeon-ji/common-ui`
- **구성**: `packages/ui`(배포물) + `apps/docs`(문서 사이트, 미배포)

## 설치

GitHub Packages는 **public 패키지도 토큰이 필요하다**. `read:packages` 권한의 PAT를 준비한다.

```ini
# 프로젝트 .npmrc — 스코프 매핑만 둔다
@jeon-ji:registry=https://npm.pkg.github.com
```

```ini
# ~/.npmrc (사용자 설정) — 인증은 여기에. 프로젝트 파일에 두면 토큰 커밋 사고와
# 변수 미설정 경고의 원인이 된다
//npm.pkg.github.com/:_authToken=<read:packages PAT>
```

```sh
pnpm add @jeon-ji/common-ui
```

## 사용

```tsx
import "@jeon-ji/common-ui/styles.css"; // 앱 진입점에서 한 번

import { Button, Field, TextField } from "@jeon-ji/common-ui";
```

다크 테마는 `document.documentElement.dataset.theme = "dark"` 한 줄이다.
Tailwind v4 사용자는 선택적으로 `@jeon-ji/common-ui/tailwind-preset.css`를 import 한다.

## 소비 앱 요구사항

| 항목       | 값                                            |
| ---------- | --------------------------------------------- |
| React      | `^19` (peer)                                  |
| 모듈 형식  | **ESM 전용** — Jest/CJS `require()` 소비 불가 |
| TypeScript | `moduleResolution: "bundler"` 이상            |

## 개발

```sh
corepack enable   # packageManager 필드의 pnpm 버전을 그대로 쓴다
pnpm install
pnpm dev          # 문서 사이트 = 개발 환경
pnpm test
```

Node 버전은 `.nvmrc`, 패키지 매니저는 `packageManager` 필드가 유일한 소스다.
`engines`로 소비자를 제약하지 않는다.

## 기여 규칙

[docs/personal_plan/common-ui/00-INDEX.md](docs/personal_plan/common-ui/00-INDEX.md)의
전역 규칙·커밋 규칙을 따른다. 요지:

- 컴포넌트 1개 = 1커밋 (구현 + 테스트 + 문서 페이지) — **데모 없는 머지 금지**
- 스타일 값은 토큰만 참조 (hex/px 리터럴은 린트가 차단)
- PR마다 changeset 첨부 — 버전·CHANGELOG·태그는 changesets가 한 흐름으로 보장

## 릴리스

1. changeset이 쌓인 상태에서 `pnpm changeset version` → 커밋
2. GitHub Release(태그 `vX.Y.Z`) 발행 → publish 워크플로가 전체 게이트 통과 후 발행
3. prerelease Release는 자동으로 `--tag next`로 분리된다
4. 발행 후 `Consume Check` 워크플로(workflow_dispatch)로 레지스트리 실설치 검증

## 토큰 로테이션

소비 환경의 `read:packages` PAT가 만료되면 **모든 소비 앱 CI가 동시에 401**로 죽는다.
만료 전에: ① 새 PAT 발급(`read:packages`) ② 각 소비 저장소의 `NODE_AUTH_TOKEN` 시크릿 교체
③ 로컬 개발자는 `~/.npmrc`의 토큰 교체. 만료일은 캘린더에 등록해 두는 것을 권장한다.
