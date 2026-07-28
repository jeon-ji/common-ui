/**
 * 문서 페이지 누락 검사 (04 문서 §4) — "데모 없는 머지 금지"(전역 규칙 19)의 기계적 강제.
 *
 * packages/ui/src/components/의 컴포넌트 폴더와 문서 레지스트리(apps/docs/src/registry.ts)의
 * Components 그룹을 양방향 대조한다:
 *   - 컴포넌트 폴더가 있는데 레지스트리 항목이 없으면 실패 (문서 없는 컴포넌트)
 *   - planned가 아닌 레지스트리 항목인데 컴포넌트 폴더가 없으면 실패 (죽은 문서 링크)
 *   - 레지스트리 항목이 있는데 데모 파일(apps/docs/src/demos/<폴더>/*.tsx)이 없으면 실패
 *
 * 사용법:  tsx scripts/check-docs-pages.ts
 */
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { docGroups } from "../apps/docs/src/registry.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentsDir = path.join(rootDir, "packages", "ui", "src", "components");
const demosDir = path.join(rootDir, "apps", "docs", "src", "demos");

const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const errors: string[] = [];

const componentFolders = readdirSync(componentsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const componentGroup = docGroups.find((group) => group.base === "/components");
if (!componentGroup) {
  errors.push("레지스트리에 /components 그룹이 없다");
}
const registrySlugs = new Map(
  (componentGroup?.entries ?? []).map((entry) => [entry.slug, entry] as const),
);

// 컴포넌트 → 레지스트리·데모
for (const folder of componentFolders) {
  const slug = kebab(folder);
  const entry = registrySlugs.get(slug);

  if (!entry || entry.planned) {
    errors.push(
      `components/${folder}: 문서 레지스트리에 없다 — apps/docs/src/registry.ts의 Components 그룹에 "${slug}"를 추가하고 문서 페이지를 만들 것 (전역 규칙 19)`,
    );
    continue;
  }

  const demoDir = path.join(demosDir, folder);
  const hasDemo =
    existsSync(demoDir) && readdirSync(demoDir).some((file) => /^[a-z].*\.tsx$/.test(file));
  if (!hasDemo) {
    errors.push(
      `components/${folder}: 데모 파일이 없다 — apps/docs/src/demos/${folder}/<demo>.tsx를 만들 것`,
    );
  }
}

// 레지스트리 → 컴포넌트 (죽은 링크)
const folderSlugs = new Set(componentFolders.map(kebab));
for (const [slug, entry] of registrySlugs) {
  if (!entry.planned && !folderSlugs.has(slug)) {
    errors.push(
      `registry "${slug}": 대응하는 packages/ui/src/components 폴더가 없다 (죽은 문서 링크)`,
    );
  }
}

// ── 훅도 같은 DoD를 적용한다 — 훅 파일 ↔ /hooks 레지스트리 양방향 대조 ──────
const hooksDir = path.join(rootDir, "packages", "ui", "src", "hooks");
const hookFiles = readdirSync(hooksDir)
  .filter((f) => /^use[A-Z].*\.ts$/.test(f) && !f.includes(".test."))
  .map((f) => f.replace(/\.ts$/, ""));

const hookGroup = docGroups.find((group) => group.base === "/hooks");
const hookSlugs = new Map((hookGroup?.entries ?? []).map((entry) => [entry.slug, entry] as const));

for (const hook of hookFiles) {
  const slug = kebab(hook);
  const entry = hookSlugs.get(slug);
  if (!entry || entry.planned) {
    errors.push(
      `hooks/${hook}: 문서 레지스트리에 없다 — Hooks 그룹에 "${slug}"를 추가하고 문서 페이지를 만들 것 (전역 규칙 19)`,
    );
    continue;
  }
  const demoDir = path.join(demosDir, "hooks", hook);
  const hasDemo =
    existsSync(demoDir) && readdirSync(demoDir).some((file) => /^[a-z].*\.tsx$/.test(file));
  if (!hasDemo) {
    errors.push(`hooks/${hook}: 데모 파일이 없다 — apps/docs/src/demos/hooks/${hook}/<demo>.tsx`);
  }
}
const hookFileSlugs = new Set(hookFiles.map(kebab));
for (const [slug, entry] of hookSlugs) {
  if (!entry.planned && !hookFileSlugs.has(slug)) {
    errors.push(`registry(hooks) "${slug}": 대응하는 훅 파일이 없다 (죽은 문서 링크)`);
  }
}

if (errors.length > 0) {
  console.error(`✖ 문서 페이지 검사 실패 (${String(errors.length)}건)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.error(
  `✔ 문서 페이지 검사 통과 — 컴포넌트 ${String(componentFolders.length)}개 · 훅 ${String(hookFiles.length)}개`,
);
