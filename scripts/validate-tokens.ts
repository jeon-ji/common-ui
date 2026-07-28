/**
 * 토큰 검증 (03 문서 §4) — 컴파일러가 못 잡는 값 수준의 오류를 거른다.
 * sije-common의 깨진 hex `##1BA75C`·`FFA552`(C4)가 이 검증의 존재 이유다.
 *
 * 1. 모든 컬러 값이 hex 형식(`#rrggbb` 또는 `#rrggbbaa`) 통과
 * 2. semantic 계층이 primitive(palette·paletteBase) 값만 참조
 * 3. zIndex 단조 증가
 * 4. 토큰 소스가 전부 `as const satisfies` 형태 (타입 수준 검증 누락 방지)
 * 5. 컴포넌트 CSS에 hex·z-index 숫자 리터럴 금지 (토큰 변수만 참조)
 * 6. 생성물 드리프트 — build-tokens 재실행 후 git diff가 없어야 한다
 *
 * 사용법:  tsx scripts/validate-tokens.ts   (CI 게이트 + pre-commit)
 */
import { execSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  palette,
  paletteBase,
  semanticColor,
  type ThemedColor,
} from "../packages/ui/src/tokens/color.js";
import { zIndex } from "../packages/ui/src/tokens/zIndex.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokensDir = path.join(rootDir, "packages", "ui", "src", "tokens");
const srcDir = path.join(rootDir, "packages", "ui", "src");

const HEX_RE = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/;
const errors: string[] = [];

// ── 1. hex 형식 ─────────────────────────────────────────────────────────────
const primitiveValues = new Set<string>();

for (const [name, value] of Object.entries(paletteBase)) {
  primitiveValues.add(value);
  if (!HEX_RE.test(value)) errors.push(`paletteBase.${name}: 잘못된 hex "${value}"`);
}
for (const [scale, steps] of Object.entries(palette)) {
  for (const [step, value] of Object.entries(steps)) {
    primitiveValues.add(value);
    if (!HEX_RE.test(value)) errors.push(`palette.${scale}.${step}: 잘못된 hex "${value}"`);
  }
}

// ── 2. semantic → primitive 참조만 ──────────────────────────────────────────
for (const [group, names] of Object.entries(semanticColor)) {
  for (const [name, themed] of Object.entries<ThemedColor>(names)) {
    for (const theme of ["light", "dark"] as const) {
      const value = themed[theme];
      if (!HEX_RE.test(value)) {
        errors.push(`semanticColor.${group}.${name}.${theme}: 잘못된 hex "${value}"`);
      } else if (!primitiveValues.has(value)) {
        errors.push(
          `semanticColor.${group}.${name}.${theme}: "${value}"는 palette에 없는 값 — hex 직접 기입 금지`,
        );
      }
    }
  }
}

// ── 3. zIndex 단조 증가 ─────────────────────────────────────────────────────
const zEntries = Object.entries(zIndex);
for (let i = 1; i < zEntries.length; i += 1) {
  const prev = zEntries[i - 1];
  const curr = zEntries[i];
  if (prev && curr && curr[1] <= prev[1]) {
    errors.push(
      `zIndex.${curr[0]}(${String(curr[1])}) ≤ zIndex.${prev[0]}(${String(prev[1])}) — 단조 증가 위반`,
    );
  }
}

// ── 4. `as const satisfies` 형태 ────────────────────────────────────────────
for (const file of readdirSync(tokensDir)) {
  if (!file.endsWith(".ts") || file === "index.ts") continue;
  const content = readFileSync(path.join(tokensDir, file), "utf8");
  if (!content.includes("as const satisfies")) {
    errors.push(
      `tokens/${file}: \`as const satisfies\`가 없다 — 리터럴 고정과 타입 검증을 함께 걸 것`,
    );
  }
}

// ── 5. 컴포넌트 CSS의 hex·z-index 리터럴 ────────────────────────────────────
// (TS/TSX 쪽은 eslint no-restricted-syntax가 담당 — 이 검사는 CSS 파일용)
const GENERATED = new Set(["tokens.css", "tailwind-preset.css"]);

function scanCss(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanCss(full);
      continue;
    }
    if (!entry.name.endsWith(".css") || GENERATED.has(entry.name)) continue;

    const rel = path.relative(rootDir, full).split(path.sep).join("/");
    const lines = readFileSync(full, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (/#[0-9a-fA-F]{3,8}\b/.test(line)) {
        errors.push(
          `${rel}:${String(i + 1)}: hex 리터럴 — var(--ui-color-*)만 참조 (전역 규칙 12)`,
        );
      }
      if (/z-index\s*:\s*-?\d/.test(line)) {
        errors.push(`${rel}:${String(i + 1)}: z-index 숫자 리터럴 — var(--ui-z-*)만 참조`);
      }
    });
  }
}
scanCss(srcDir);

// ── 6. 생성물 드리프트 ──────────────────────────────────────────────────────
execSync("tsx scripts/build-tokens.ts", { cwd: rootDir, stdio: ["ignore", "ignore", "ignore"] });
try {
  execSync(
    "git diff --exit-code -- packages/ui/src/styles/tokens.css packages/ui/src/styles/tailwind-preset.css",
    { cwd: rootDir, stdio: ["ignore", "ignore", "inherit"] },
  );
} catch {
  errors.push(
    "생성물 드리프트 — tokens.css/tailwind-preset.css가 소스와 다르다. `pnpm build:tokens` 후 함께 커밋하라",
  );
}

// ── 결과 ────────────────────────────────────────────────────────────────────
if (errors.length > 0) {
  console.error(`✖ 토큰 검증 실패 (${String(errors.length)}건)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.error("✔ 토큰 검증 통과");
