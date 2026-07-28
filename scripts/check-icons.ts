/**
 * 아이콘 등록 검사 (05 문서 §1.2) — sije-common의 "바이트 동일 SVG 8쌍" 같은
 * 중복과 배럴 누락을 CI에서 차단한다.
 *
 * 1. md5 중복 — 내용이 같은 SVG가 다른 이름으로 두 번 들어오는 것 차단
 * 2. 네이밍 — kebab-case (`chevron-down.svg`)
 * 3. currentColor — 색을 하드코딩한 SVG 차단 (부모 color 상속이 계약)
 * 4. 배럴 완결성 — svg/ 파일 ↔ icons/index.ts export 양방향 대조
 *
 * 사용법:  tsx scripts/check-icons.ts
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const svgDir = path.join(rootDir, "packages", "ui", "src", "icons", "svg");
const barrelPath = path.join(rootDir, "packages", "ui", "src", "icons", "index.ts");

const errors: string[] = [];
const files = readdirSync(svgDir).filter((f) => f.endsWith(".svg"));

// ── 1. md5 중복 ─────────────────────────────────────────────────────────────
const byHash = new Map<string, string[]>();
for (const file of files) {
  const hash = createHash("md5")
    .update(readFileSync(path.join(svgDir, file)))
    .digest("hex");
  const list = byHash.get(hash) ?? [];
  list.push(file);
  byHash.set(hash, list);
}
for (const dupes of byHash.values()) {
  if (dupes.length > 1) {
    errors.push(
      `내용이 동일한 SVG: ${dupes.join(", ")} — 하나만 남기고 배럴에서 별칭으로 처리하라`,
    );
  }
}

// ── 2·3. 네이밍 + currentColor ──────────────────────────────────────────────
for (const file of files) {
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*\.svg$/.test(file)) {
    errors.push(`${file}: kebab-case가 아니다`);
  }
  const content = readFileSync(path.join(svgDir, file), "utf8");
  if (!content.includes("currentColor")) {
    errors.push(`${file}: currentColor가 없다 — 색 하드코딩 금지, 부모 color 상속이 계약이다`);
  }
}

// ── 4. 배럴 완결성 ──────────────────────────────────────────────────────────
const barrel = readFileSync(barrelPath, "utf8");
const imported = new Set(
  Array.from(barrel.matchAll(/from "\.\/svg\/([a-z0-9-]+)\.svg\?react"/g), (m) => m[1]),
);
for (const file of files) {
  const name = file.replace(/\.svg$/, "");
  if (!imported.has(name)) errors.push(`${file}: icons/index.ts 배럴에 등록되지 않았다`);
}
for (const name of imported) {
  if (name && !files.includes(`${name}.svg`)) {
    errors.push(`배럴의 "${name}"에 대응하는 svg 파일이 없다`);
  }
}

if (errors.length > 0) {
  console.error(`✖ 아이콘 검사 실패 (${String(errors.length)}건)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.error(`✔ 아이콘 검사 통과 — ${String(files.length)}개`);
