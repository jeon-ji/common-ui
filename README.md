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

## 시각 회귀 테스트

유닛 테스트는 `data-*`와 ARIA를 보지 **픽셀을 보지 않는다.** 토큰 값이나 `@layer` 순서를 바꿔
다른 컴포넌트가 깨져도 나머지 게이트는 전부 green이다. 특히 다크 테마는 semantic 변수 교체만으로
전환되므로 **변수 하나가 빠지면 다크에서만 깨진다.** 그 구간을 문서 사이트 데모 블록 촬영으로 덮는다.

```sh
pnpm exec playwright install chromium   # 최초 1회
pnpm test:visual                        # 문서 사이트를 빌드해 정적 서버로 띄우고 촬영
```

기준 이미지는 `tests/visual/__screenshots__/`에 `<페이지 slug>-<데모 이름>-<테마>.png`로 둔다.
촬영 단위는 페이지가 아니라 **데모 블록**이라 데모 하나가 바뀌어도 그 한 장만 무효가 된다.

### 기준 이미지 갱신

기준 이미지는 **리눅스(CI)에서 만든 것만** 쓴다. OS마다 폰트 렌더가 달라서 로컬 산출물을 섞으면
기준 자체가 의미를 잃는다 — 그래서 로컬에서 `--update-snapshots`를 돌리지 않는다.
(같은 이유로 로컬 실행은 윈도우·맥에서 실패할 수 있다. **레이아웃이 깨졌는지 눈으로 보는 용도**다.)

의도한 스타일 변경이라면:

1. Actions에서 **Visual Baseline** 워크플로를 수동 실행한다
2. `visual-baseline` 아티팩트를 받아 `tests/visual/__screenshots__/`에 덮어쓴다
3. `git diff --stat`으로 바뀐 장수가 예상과 맞는지 보고 커밋한다 — 의도한 것보다 많이 바뀌었다면
   그게 곧 회귀다

의도하지 않은 실패라면 CI가 실패 시 올리는 `visual-diff` 아티팩트에 `-expected`/`-actual`/`-diff`
세 장이 들어 있다. `-diff`를 먼저 본다.

거짓 실패를 막으려고 촬영 전에 애니메이션·트랜지션·캐럿·스크롤바를 고정한다
(`tests/visual/demos.spec.ts`의 `FREEZE_CSS`). 그래도 안 되는 데모는 같은 파일의 `EXCLUDED`에
**이유와 함께** 남긴다 — 현재는 Toast 하나뿐이다.

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

발행이 실패해도 **태그를 지우지 않는다.** 레지스트리는 같은 버전 재발행을 거부하므로,
원인을 고친 뒤 patch를 올려 새 Release를 만든다.

## 토큰 로테이션

소비 환경의 `read:packages` PAT가 만료되면 **모든 소비 앱 CI가 동시에 401**로 죽는다.
만료 전에: ① 새 PAT 발급(`read:packages`) ② 각 소비 저장소의 `NODE_AUTH_TOKEN` 시크릿 교체
③ 로컬 개발자는 `~/.npmrc`의 토큰 교체. 만료일은 캘린더에 등록해 두는 것을 권장한다.
