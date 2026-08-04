/**
 * 번들 사이즈 버짓 (23 문서 §1) — "정당하지만 커지는 것"을 숫자로 남긴다.
 *
 * 트리셰이킹 회귀("딸려오면 안 되는 것")는 consume-check.ts의 금지 심볼 목록이 잡는다.
 * 둘은 역할이 다르다 — 이 스크립트는 정상 동작하는데 조용히 커지는 경우를 본다.
 *
 * 두 가지를 의도적으로 이렇게 만들었다:
 *
 * 1. **측정 대상은 실제 배포물이다.** `packages/ui/dist/*`는 `files: ["dist"]` 때문에
 *    tgz에 그대로 들어가고, 그 파일 목록은 smoke:pack이 스냅샷으로 고정한다. dev 번들을
 *    재는 흔한 함정을 피하려고, 설정의 `path`가 정말 `exports`가 가리키는 파일인지
 *    아래에서 대조한다 — exports만 옮기고 예산이 옛 파일을 계속 재는 사고를 막는다.
 * 2. **초과해도 실패시키지 않는다.** 처음부터 하드 실패로 두면 정당한 증가에도 빨간불이 나고,
 *    그러면 곧 무시된다. 대신 숫자를 잡 요약에 표로 남긴다 — 보이지 않으면 아무도 관리하지 않는다.
 *    초과가 의도한 것이면 `.size-limit.json`의 예산을 올리는 커밋을 남긴다.
 *
 * 사용법:  tsx scripts/size-budget.ts   (선행: pnpm build)
 */
import { execSync } from "node:child_process";
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const uiDir = path.join(rootDir, "packages", "ui");

interface BudgetEntry {
  readonly name: string;
  readonly path: string;
  readonly limit?: string;
}

interface SizeResult {
  readonly name: string;
  readonly size: number;
  readonly sizeLimit?: number;
  readonly passed?: boolean;
}

interface UiPackageJson {
  readonly exports: Record<string, string | { readonly import?: string }>;
}

function fail(message: string): never {
  console.error(`\n✖ 사이즈 버짓 실패: ${message}`);
  process.exit(1);
}

/** size-limit과 같은 단위(kB = 1000 B)로 맞춘다 */
function formatBytes(bytes: number): string {
  return bytes < 1000 ? `${String(bytes)} B` : `${(bytes / 1000).toFixed(2)} kB`;
}

function formatDelta(bytes: number): string {
  const sign = bytes >= 0 ? "+" : "−";
  return `${sign}${formatBytes(Math.abs(bytes))}`;
}

/** 한글은 터미널에서 두 칸을 차지한다 — 문자 수로 padEnd 하면 표가 어긋난다 */
function displayWidth(text: string): number {
  let width = 0;
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    const wide =
      (code >= 0x1100 && code <= 0x115f) ||
      (code >= 0x2e80 && code <= 0xa4cf) ||
      (code >= 0xac00 && code <= 0xd7a3) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0xff00 && code <= 0xff60);
    width += wide ? 2 : 1;
  }
  return width;
}

function padDisplay(text: string, width: number): string {
  return text + " ".repeat(Math.max(0, width - displayWidth(text)));
}

// ── 1. 설정의 측정 경로가 exports가 가리키는 파일인지 대조 ───────────────────
const budgets = JSON.parse(
  readFileSync(path.join(rootDir, ".size-limit.json"), "utf8"),
) as BudgetEntry[];

const uiPkg = JSON.parse(readFileSync(path.join(uiDir, "package.json"), "utf8")) as UiPackageJson;

const exportTargets = new Set(
  Object.values(uiPkg.exports)
    .map((entry) => (typeof entry === "string" ? entry : entry.import))
    .filter((target): target is string => typeof target === "string")
    .map((target) => path.posix.join("packages/ui", target.replace(/^\.\//, ""))),
);

for (const budget of budgets) {
  if (!exportTargets.has(budget.path)) {
    fail(
      `"${budget.name}"이 재는 ${budget.path}는 packages/ui의 exports가 가리키는 파일이 아니다 — ` +
        `exports를 옮겼다면 .size-limit.json도 함께 옮길 것`,
    );
  }
  if (!existsSync(path.join(rootDir, budget.path))) {
    fail(`${budget.path}가 없다 — 먼저 \`pnpm build\``);
  }
}

// ── 2. 측정 ─────────────────────────────────────────────────────────────────
console.error("• size-limit 측정");
let raw: string;
try {
  raw = execSync("pnpm exec size-limit --json", {
    cwd: rootDir,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
} catch (error) {
  // 예산 초과면 size-limit이 exit 1로 끝난다 — 결과 자체는 stdout에 있으므로 그대로 쓴다
  const failure = error as { stdout?: string; stderr?: string };
  raw = failure.stdout ?? "";
  if (!raw.trimStart().startsWith("[")) {
    console.error(failure.stderr ?? "");
    fail("size-limit이 결과를 내지 못했다");
  }
}

const results = JSON.parse(raw.slice(raw.indexOf("["))) as SizeResult[];

// ── 3. 표 출력 (콘솔 + 잡 요약) ──────────────────────────────────────────────
const rows = results.map((result) => {
  const limit = result.sizeLimit;
  const over = limit !== undefined && result.size > limit;
  return {
    name: result.name,
    size: formatBytes(result.size),
    limit: limit === undefined ? "—" : formatBytes(limit),
    slack: limit === undefined ? "—" : formatDelta(limit - result.size),
    over,
  };
});

const nameWidth = Math.max(...rows.map((row) => displayWidth(row.name)));
for (const row of rows) {
  console.error(
    `  ${row.over ? "⚠" : "✔"} ${padDisplay(row.name, nameWidth)}  ${row.size.padStart(9)} / ${row.limit.padStart(9)}  (여유 ${row.slack})`,
  );
}

const summaryPath = process.env.GITHUB_STEP_SUMMARY;
if (summaryPath) {
  const markdown = [
    "### 번들 사이즈 버짓 (gzip)",
    "",
    "| | 시나리오 | 크기 | 예산 | 여유 |",
    "| :-: | --- | ---: | ---: | ---: |",
    ...rows.map(
      (row) =>
        `| ${row.over ? "⚠" : "✔"} | ${row.name} | ${row.size} | ${row.limit} | ${row.slack} |`,
    ),
    "",
    "측정 대상은 `packages/ui/dist`(= 배포물)이고 react는 peer라 제외한다.",
    "",
  ].join("\n");
  appendFileSync(summaryPath, `${markdown}\n`);
  console.error("• 잡 요약에 표 기록");
}

// ── 4. 초과는 경고로 끝낸다 (하드 실패 아님) ────────────────────────────────
const exceeded = rows.filter((row) => row.over);
if (exceeded.length > 0) {
  console.error(
    `\n⚠ 예산 초과 ${String(exceeded.length)}건: ${exceeded.map((row) => row.name).join(", ")}`,
  );
  console.error(
    "  줄일 수 있으면 줄이고, 정당한 증가면 .size-limit.json의 예산을 올리는 커밋을 남긴다.",
  );
  console.error("  (게이트를 막지 않는 것은 의도다 — 23 문서 §1)");
} else {
  console.error("\n✔ 전 시나리오 예산 이내");
}
