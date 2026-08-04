/**
 * 시각 회귀 테스트 설정 (16 문서).
 *
 * 유닛 테스트는 `data-*`와 ARIA를 보지 픽셀을 보지 않는다. 토큰 값 하나나 `@layer` 순서를
 * 바꿔 다른 컴포넌트가 깨져도 전 게이트가 green인 구간을 이 설정이 덮는다.
 *
 * 대상은 **문서 사이트의 프로덕션 빌드**다 — dev 서버는 HMR·개발 전용 오버레이가 화면에 낀다.
 * 브라우저는 chromium 하나뿐이고 뷰포트·배율도 하나다(16 문서 §3.3 · 명시적 비목표).
 */
import { defineConfig } from "@playwright/test";

const PORT = 4173;
/** vite의 `base: "/common-ui/"`까지 포함해야 상대 경로 goto가 맞는다 */
const BASE_URL = `http://127.0.0.1:${String(PORT)}/common-ui/`;

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./tests/visual",

  // 기준 이미지는 CI(리눅스)에서만 만든다 — 파일명에 플랫폼을 넣지 않아 한 벌만 유지한다.
  // 늘리는 순간 데모 수 × 테마 × 플랫폼으로 배수 증가한다 (16 문서 §3.3).
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}-{projectName}{ext}",

  fullyParallel: true,
  forbidOnly: isCI,
  // 재시도는 플레이키를 감춘다 — 거짓 실패가 나면 재시도가 아니라 원인을 고정한다 (16 문서 Group 2)
  retries: 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [["list"], ["html", { open: "never" }]] : [["list"]],

  expect: {
    toHaveScreenshot: {
      // 0으로 두면 폰트 힌팅·안티에일리어싱 편차만으로 빨간불이 난다 (16 문서 Group 2)
      maxDiffPixelRatio: 0.002,
      animations: "disabled",
      caret: "hide",
      scale: "css",
    },
  },

  use: {
    baseURL: BASE_URL,
    browserName: "chromium",
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    trace: "off",
  },

  // 테마는 프로젝트로 가른다 — index.html의 인라인 스크립트가 저장값이 없을 때
  // `prefers-color-scheme`을 읽으므로, colorScheme 에뮬레이션만으로 data-theme이 정해진다.
  projects: [
    { name: "light", use: { colorScheme: "light" } },
    { name: "dark", use: { colorScheme: "dark" } },
  ],

  // `--host 127.0.0.1`이 없으면 vite preview가 `localhost`(환경에 따라 ::1)에만 바인딩해
  // Playwright의 IPv4 폴링이 영영 실패한다.
  webServer: {
    command:
      "pnpm --filter @jeon-ji/common-ui-docs build && pnpm --filter @jeon-ji/common-ui-docs preview --host 127.0.0.1 --port 4173 --strictPort",
    url: BASE_URL,
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
});
