/**
 * 패키징 스모크 — "소비자 앱에서만 터지는" 유형의 결함을 도구가 잡는 문제로 격하시킨다.
 * (02 문서 §6 / 리뷰 C1·C2·C7·M13)
 *
 * 1. `npm pack`의 파일 목록을 스냅샷과 대조 — 불필요 파일 유입·필수 파일 누락 감지
 * 2. tgz를 임시 프로젝트에 실제로 설치
 * 3. 전 서브패스 import + `tsc --noEmit` (소비자 타입 해석 검증)
 * 4. jsdom에서 전 서브패스 런타임 import + 대표 렌더 (런타임 검증)
 * 5. dist/style.css 존재·내용 assert
 *
 * 사용법:  tsx scripts/pack-smoke.ts [--update-snapshot]
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const uiDir = path.join(rootDir, "packages", "ui");
const snapshotPath = path.join(uiDir, "pack-files.snapshot.txt");
const updateSnapshot = process.argv.includes("--update-snapshot");

function run(cmd: string, cwd: string): string {
  return execSync(cmd, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
}

function fail(message: string): never {
  console.error(`\n✖ pack smoke 실패: ${message}`);
  process.exit(1);
}

// ── 1. 빌드 + pack ──────────────────────────────────────────────────────────
console.error("• 빌드");
run("pnpm --filter @jeon-ji/common-ui build", rootDir);

console.error("• npm pack");
const packJson = JSON.parse(run("npm pack --json", uiDir)) as Array<{
  filename: string;
  files: Array<{ path: string }>;
}>;
const pack = packJson[0];
if (!pack) fail("npm pack --json 결과가 비어 있다");

const tgzPath = path.join(uiDir, pack.filename);
const fileList = pack.files
  .map((f) => f.path)
  .sort()
  .join("\n");

// ── 2. 파일 목록 스냅샷 ─────────────────────────────────────────────────────
if (updateSnapshot) {
  writeFileSync(snapshotPath, `${fileList}\n`);
  console.error(`• 스냅샷 갱신: ${path.relative(rootDir, snapshotPath)}`);
} else {
  if (!existsSync(snapshotPath)) {
    fail("스냅샷이 없다 — `pnpm smoke:pack --update-snapshot`으로 생성하고 diff를 리뷰하라");
  }
  const expected = readFileSync(snapshotPath, "utf8").trim();
  if (expected !== fileList) {
    console.error("--- 스냅샷");
    console.error(expected);
    console.error("--- 실제");
    console.error(fileList);
    fail("배포 파일 목록이 스냅샷과 다르다 — 의도한 변경이면 --update-snapshot 후 diff를 커밋하라");
  }
}

// ── 3. 임시 프로젝트에 설치 ─────────────────────────────────────────────────
const tempDir = mkdtempSync(path.join(os.tmpdir(), "common-ui-smoke-"));
console.error(`• 임시 프로젝트: ${tempDir}`);

try {
  writeFileSync(
    path.join(tempDir, "package.json"),
    JSON.stringify({ name: "smoke-consumer", private: true, type: "module" }, null, 2),
  );
  // 스코프 레지스트리 매핑 없이 기본 npmjs만 사용 — tgz는 파일로 직접 설치된다
  writeFileSync(path.join(tempDir, ".npmrc"), "audit=false\nfund=false\n");

  const consumerTgz = path.join(tempDir, pack.filename);
  cpSync(tgzPath, consumerTgz);

  console.error("• npm install (react·typescript·jsdom + tgz)");
  run(
    `npm install --no-audit --no-fund --loglevel=error react react-dom typescript "@types/react" "@types/react-dom" jsdom "${consumerTgz}"`,
    tempDir,
  );

  // ── 4. 전 서브패스 import + tsc ───────────────────────────────────────────
  writeFileSync(
    path.join(tempDir, "css.d.ts"),
    // Vite 소비자의 vite/client가 하는 역할 — CSS import를 타입 수준에서 허용
    `declare module "*.css";\n`,
  );
  writeFileSync(
    path.join(tempDir, "smoke.tsx"),
    `import "@jeon-ji/common-ui/styles.css";

import * as root from "@jeon-ji/common-ui";
import * as components from "@jeon-ji/common-ui/components";
import * as hooks from "@jeon-ji/common-ui/hooks";
import * as tokens from "@jeon-ji/common-ui/tokens";

export const modules = { root, components, hooks, tokens };
`,
  );
  writeFileSync(
    path.join(tempDir, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          strict: true,
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "bundler",
          jsx: "react-jsx",
          lib: ["ES2023", "DOM", "DOM.Iterable"],
          noEmit: true,
          skipLibCheck: true,
        },
        include: ["smoke.tsx", "css.d.ts"],
      },
      null,
      2,
    ),
  );

  console.error("• tsc --noEmit (소비자 관점 타입 해석)");
  run("npx tsc -p tsconfig.json", tempDir);

  // ── 5. jsdom 런타임 import + 렌더 ─────────────────────────────────────────
  // 임시 프로젝트에 tsx까지 설치하지 않도록 순수 ESM(.mjs)로 실행한다.
  // dist JS에는 CSS import가 남지 않으므로(vite가 style.css로 추출) Node로 직접 import 가능.
  writeFileSync(
    path.join(tempDir, "render.mjs"),
    `import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
Object.defineProperty(globalThis, "window", { value: dom.window, configurable: true });
Object.defineProperty(globalThis, "document", { value: dom.window.document, configurable: true });
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });

// 전 서브패스 런타임 import — 배포물이 Node ESM에서 실제로 로드되는지 확인
await import("@jeon-ji/common-ui");
await import("@jeon-ji/common-ui/components");
await import("@jeon-ji/common-ui/hooks");
await import("@jeon-ji/common-ui/tokens");

const { createElement } = await import("react");
const { createRoot } = await import("react-dom/client");
const { Sample } = await import("@jeon-ji/common-ui/components");

// 대표 컴포넌트 렌더 — 설치된 배포물의 컴포넌트가 실제로 동작하는지 확인
const container = dom.window.document.getElementById("root");
createRoot(container).render(createElement(Sample, { tone: "primary" }, "smoke"));
await new Promise((resolve) => setTimeout(resolve, 50));

if (!container.innerHTML.includes("smoke") || !container.innerHTML.includes("ui-sample")) {
  throw new Error("렌더 결과가 비어 있다: " + container.innerHTML);
}
console.error("  렌더 OK: " + container.innerHTML);
`,
  );

  console.error("• jsdom 렌더");
  run("node render.mjs", tempDir);

  // ── 6. style.css assert ───────────────────────────────────────────────────
  const styleCss = path.join(tempDir, "node_modules", "@jeon-ji", "common-ui", "dist", "style.css");
  if (!existsSync(styleCss)) fail("설치된 패키지에 dist/style.css가 없다 (리뷰 C2 유형)");
  const css = readFileSync(styleCss, "utf8");
  if (css.trim().length === 0) fail("dist/style.css가 비어 있다");
  if (!css.includes("--ui-color-") || !css.includes('[data-theme="dark"]')) {
    fail("dist/style.css에 토큰 CSS 변수(--ui-color-)나 다크 테마 블록이 없다 (리뷰 C2 유형)");
  }
  if (!css.includes(".ui-sample")) {
    fail("dist/style.css에 컴포넌트 CSS(.ui-sample)가 없다 — 그래프 밖 CSS (리뷰 C2 유형)");
  }
  const preset = path.join(
    tempDir,
    "node_modules",
    "@jeon-ji",
    "common-ui",
    "dist",
    "tailwind-preset.css",
  );
  if (!existsSync(preset)) fail("설치된 패키지에 dist/tailwind-preset.css가 없다");
  console.error("• style.css / tailwind-preset.css OK");

  console.error("\n✔ pack smoke 통과");
} finally {
  rmSync(tempDir, { recursive: true, force: true, maxRetries: 3 });
  rmSync(tgzPath, { force: true });
}
