/**
 * 데모 블록 시각 회귀 (16 문서).
 *
 * 촬영 단위는 **페이지가 아니라 데모 블록**이다 — 페이지 전체를 찍으면 데모 하나가 바뀔 때
 * 그 페이지의 기준 이미지가 전부 무효가 된다. 각 `DemoBlock`이 미리보기 영역에
 * `data-visual-target="<데모 파일명>"`을 달고, 여기서는 그 요소만 찍는다.
 *
 * 대상 목록은 문서 사이트의 단일 소스(`apps/docs/src/registry.ts`)를 그대로 쓴다.
 * 시각 테스트 전용 픽스처를 따로 만들지 않는다 — 두 벌이 되면 한 벌은 반드시 낡는다.
 */
import { expect, type Page, test } from "@playwright/test";

import { docGroups } from "../../apps/docs/src/registry.js";

/**
 * 촬영에서 제외하는 데모와 그 이유. 키는 `<페이지 slug>/<데모 이름>`.
 *
 * 제외는 **마지막 수단**이다 — 먼저 아래 `freeze()`로 고정할 수 있는지 본다.
 * 여기 남은 항목은 "고정해도 찍을 가치가 없거나, 찍으려면 상호작용이 필요한" 것들이다.
 */
const EXCLUDED = new Map<string, string>([
  [
    "toast/basic",
    "토스트는 클릭해야 열리고 자동 닫힘 타이머가 돈다. 열린 상태를 찍으려면 상호작용이 필요한데 " +
      "그 순간이 타이머와 경합하고, 닫힌 상태는 버튼 4개뿐이라 회귀 가치가 없다",
  ],
]);

/**
 * 거짓 실패의 원인을 촬영 전에 고정한다 (16 문서 Group 2).
 * 시각 회귀는 거짓 실패가 몇 번 나면 아무도 안 보게 되므로, 도입과 동시에 못 박는다.
 */
const FREEZE_CSS = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
  }
  html { scrollbar-width: none; }
  ::-webkit-scrollbar { display: none; }
`;

async function freeze(page: Page) {
  // Avatar 폴백 데모는 일부러 404 이미지를 걸어 두었다 — 그 실패가 확정된 뒤에 찍는다
  await page.waitForLoadState("networkidle");
  // motion 토큰 자체는 건드리지 않는다. 촬영용 스타일만 위에 덮는다
  await page.addStyleTag({ content: FREEZE_CSS });
  await page.evaluate(async () => {
    // 웹폰트가 생기면 로드 완료까지 기다리는 자리다. 현재는 `@font-face`가 없고
    // --ui-font-sans가 시스템 폰트 폴백 스택이라 즉시 resolve된다
    await document.fonts.ready;
    (document.activeElement as HTMLElement | null)?.blur();
  });
}

/** 데모가 있는 그룹만 — 시작하기·Foundation 페이지에는 DemoBlock이 없다 */
const pages = docGroups
  .filter((group) => group.base === "/components" || group.base === "/hooks")
  .flatMap((group) => group.entries.map((entry) => ({ base: group.base, slug: entry.slug })));

test.describe("데모 블록 시각 회귀", () => {
  for (const { base, slug } of pages) {
    test(`${base.slice(1)}/${slug}`, async ({ page }, testInfo) => {
      const theme = testInfo.project.name;

      await page.goto(`${base.slice(1)}/${slug}`);
      // 테마가 실제로 걸렸는지 먼저 확인한다 — 안 걸리면 라이트 화면을 다크 기준으로 찍는다
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

      await freeze(page);

      const targets = page.locator("[data-visual-target]");
      const names = await targets.evaluateAll((els) =>
        els.map((el) => el.dataset.visualTarget ?? ""),
      );

      expect(names.length, `${slug}: 촬영 대상이 없다 — DemoBlock이 사라졌는가?`).toBeGreaterThan(
        0,
      );
      expect(
        new Set(names).size,
        `${slug}: DemoBlock name이 중복됐다 (${names.join(", ")}) — 기준 이미지가 겹친다`,
      ).toBe(names.length);

      // 이 페이지 몫의 제외 항목이 실제로 존재하는지 — 데모가 사라졌는데 제외만 남는 것을 막는다
      for (const key of EXCLUDED.keys()) {
        const [excludedSlug, excludedName] = key.split("/");
        if (excludedSlug !== slug) continue;
        expect(names, `${key}: 제외 목록에 있는데 그런 데모가 없다`).toContain(excludedName);
      }

      for (const [index, name] of names.entries()) {
        if (EXCLUDED.has(`${slug}/${name}`)) continue;
        await expect(targets.nth(index)).toHaveScreenshot(`${slug}-${name}.png`);
      }
    });
  }
});
