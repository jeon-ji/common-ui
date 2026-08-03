import { expect } from "vitest";

/**
 * 조작 뒤에도 포커스가 살아 있는지 검사한다 — 반복 결함 유형 1(포커스 유실)의 공통 단언.
 *
 * 방금 조작한 요소가 **그 조작의 결과로** 사라지거나 비활성이 되면 브라우저는 포커스를
 * body로 되돌린다. 키보드 사용자는 위치를 잃고 문서 처음부터 다시 Tab 해야 한다.
 * 사라지는 요소는 포커스를 넘겨줄 곳을 정해야 한다.
 *
 * 이 디렉터리는 배포물에 들어가지 않는다 (vite.lib.config.ts의 `EXCLUDED_DIRS`).
 */
export function expectFocusRetained(options?: { to?: HTMLElement | null }): void {
  const active = document.activeElement;

  expect(active, "포커스가 body로 떨어졌다 — 사라지는 요소는 포커스를 넘겨줘야 한다").not.toBe(
    document.body,
  );
  if (options?.to !== undefined) expect(active).toBe(options.to);
}
