/**
 * 소비 검증 (06 문서 §4) — pack 스모크와 달리 **레지스트리(GitHub Packages)에서 실제 설치**한다.
 * sije-common에서 소비자 앱에서만 터졌던 유형을 설치본에서 재확인한다:
 *
 * 1. 전 서브패스 import + tsc (소비자 타입 해석)
 * 2. jsdom 렌더 — Button + Checkbox(checked)
 * 3. style.css 안에 체크 표시 CSS가 있는지 (C1: 외부 파일 참조였으면 여기 없다)
 * 4. z-index 계층 순서 (C3: overlay < modal < popover < tooltip < toast)
 * 5. 다크 테마 블록 존재 (C2)
 * 6. 트리셰이킹 — Button만 import한 vite 번들에 Select 코드가 없는지
 *
 * 사용법:  NODE_AUTH_TOKEN=<read:packages 토큰> tsx scripts/consume-check.ts [버전=latest]
 */
import { execSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const version = process.argv[2] ?? "latest";

if (!process.env.NODE_AUTH_TOKEN) {
  console.error("✖ NODE_AUTH_TOKEN이 필요하다 (read:packages)");
  process.exit(1);
}

function run(cmd: string, cwd: string): string {
  return execSync(cmd, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
}

function fail(message: string): never {
  console.error(`\n✖ 소비 검증 실패: ${message}`);
  process.exit(1);
}

const tempDir = mkdtempSync(path.join(os.tmpdir(), "common-ui-consume-"));
console.error(`• 임시 소비 앱: ${tempDir} (버전: ${version})`);

try {
  writeFileSync(
    path.join(tempDir, "package.json"),
    JSON.stringify({ name: "consume-check", private: true, type: "module" }, null, 2),
  );
  // GitHub Packages 인증 — public 패키지도 토큰이 필요하다
  writeFileSync(
    path.join(tempDir, ".npmrc"),
    [
      "@jeon-ji:registry=https://npm.pkg.github.com",

      "//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}",
      "audit=false",
      "fund=false",
    ].join("\n"),
  );

  console.error("• npm install (레지스트리에서 실제 설치)");
  run(
    `npm install --no-audit --no-fund --loglevel=error react react-dom typescript "@types/react" "@types/react-dom" jsdom vite "@jeon-ji/common-ui@${version}"`,
    tempDir,
  );

  // ── 1. 전 서브패스 import + tsc ───────────────────────────────────────────
  writeFileSync(path.join(tempDir, "css.d.ts"), `declare module "*.css";\n`);
  writeFileSync(
    path.join(tempDir, "smoke.tsx"),
    `import "@jeon-ji/common-ui/styles.css";

import * as root from "@jeon-ji/common-ui";
import * as components from "@jeon-ji/common-ui/components";
import * as hooks from "@jeon-ji/common-ui/hooks";
import * as icons from "@jeon-ji/common-ui/icons";
import * as tokens from "@jeon-ji/common-ui/tokens";

export const modules = { root, components, hooks, icons, tokens };
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
  console.error("• tsc --noEmit");
  run("npx tsc -p tsconfig.json", tempDir);

  // ── 2. jsdom 렌더 (Button + Checkbox) ─────────────────────────────────────
  writeFileSync(
    path.join(tempDir, "render.mjs"),
    `import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>');
Object.defineProperty(globalThis, "window", { value: dom.window, configurable: true });
Object.defineProperty(globalThis, "document", { value: dom.window.document, configurable: true });
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });

const { createElement } = await import("react");
const { createRoot } = await import("react-dom/client");
const { Button, Checkbox } = await import("@jeon-ji/common-ui/components");

const container = dom.window.document.getElementById("root");
createRoot(container).render(
  createElement("div", null,
    createElement(Button, { tone: "primary" }, "확인"),
    createElement(Checkbox, { defaultChecked: true }, "동의"),
  ),
);
await new Promise((resolve) => setTimeout(resolve, 50));

if (!container.querySelector(".ui-button")) throw new Error("Button 렌더 실패");
const box = container.querySelector(".ui-checkbox-input");
if (!box || !box.checked) throw new Error("Checkbox checked 상태 실패");
console.error("  렌더 OK: Button + Checkbox(checked)");
`,
  );
  console.error("• jsdom 렌더");
  run("node render.mjs", tempDir);

  // ── 3~5. style.css 검사 ───────────────────────────────────────────────────
  const cssPath = path.join(tempDir, "node_modules", "@jeon-ji", "common-ui", "dist", "style.css");
  const css = readFileSync(cssPath, "utf8");

  if (!/\.ui-checkbox-input:checked \+ \.ui-checkbox-box/.test(css)) {
    fail("체크 표시 CSS가 style.css에 없다 — 외부 파일 참조 회귀 (C1 유형)");
  }
  const zOrder = [
    "--ui-z-overlay",
    "--ui-z-modal",
    "--ui-z-popover",
    "--ui-z-tooltip",
    "--ui-z-toast",
  ].map((name) => {
    const match = new RegExp(`${name}: (\\d+);`).exec(css);
    if (!match?.[1]) fail(`${name} 변수가 style.css에 없다`);
    return Number(match[1]);
  });
  if (!zOrder.every((v, i) => i === 0 || v > (zOrder[i - 1] ?? 0))) {
    fail(`z-index 계층 역전: ${zOrder.join(" → ")} (C3 유형)`);
  }
  if (!css.includes('[data-theme="dark"]')) fail("다크 테마 블록이 없다 (C2 유형)");
  console.error("• style.css OK (체크 표시 CSS · z-index 계층 · 다크 테마)");

  // ── 6. 트리셰이킹 — Button만 import한 번들에 Select가 없어야 한다 ──────────
  writeFileSync(
    path.join(tempDir, "index.html"),
    `<!doctype html><html><body><div id="app"></div><script type="module" src="/main.js"></script></body></html>`,
  );
  writeFileSync(
    path.join(tempDir, "main.js"),
    `import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "@jeon-ji/common-ui";
createRoot(document.getElementById("app")).render(createElement(Button, null, "hi"));
`,
  );
  console.error("• vite build (트리셰이킹 확인)");
  run("npx vite build --logLevel error", tempDir);

  const assetsDir = path.join(tempDir, "dist", "assets");
  const jsBundle = readdirSync(assetsDir)
    .filter((f) => f.endsWith(".js"))
    .map((f) => readFileSync(path.join(assetsDir, f), "utf8"))
    .join("");
  if (!jsBundle.includes("ui-button")) fail("번들에 Button 코드가 없다");
  // 무거운 계열을 대표하는 심볼들 — 폼(Select)·오버레이(Popover/Menu)·그 인프라(위치 엔진)가
  // Button 하나 때문에 딸려오면 안 된다. 오버레이는 Portal·스택·리스너를 함께 끌고 오므로
  // 트리셰이킹이 깨졌을 때 소비자 번들에 가장 크게 남는다
  // 클래스명 문자열로 검사한다 — 소비자 번들러가 최소화하면 함수·변수 이름은 사라지지만
  // 문자열 리터럴은 남는다(위치 엔진은 이 세 컴포넌트만 쓰므로 함께 걸러진다)
  const FORBIDDEN: Record<string, string> = {
    "ui-select-trigger": "Select",
    "ui-popover": "Popover",
    "ui-menu-item": "Menu",
    "ui-tooltip": "Tooltip",
  };
  for (const [symbol, name] of Object.entries(FORBIDDEN)) {
    if (jsBundle.includes(symbol)) {
      fail(`Button만 import했는데 번들에 ${name} 코드가 있다 — 트리셰이킹 실패`);
    }
  }
  console.error(`• 트리셰이킹 OK (${Object.values(FORBIDDEN).join("·")} 미포함)`);

  console.error("\n✔ 소비 검증 통과");
} finally {
  rmSync(tempDir, { recursive: true, force: true, maxRetries: 3 });
}
