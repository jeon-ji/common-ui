/** 페이지 버튼 자리 — 숫자이거나 생략 기호 */
export type PageSlot = number | "ellipsis";

interface VisiblePagesOptions {
  /** 전체 페이지 수 */
  total: number;
  /** 현재 페이지 (1부터) — 범위를 벗어나면 클램프한다 */
  page: number;
  /** 현재 페이지 좌우로 보여줄 개수 */
  siblings: number;
  /** 양 끝에 항상 보여줄 개수 */
  boundaries: number;
}

function range(start: number, end: number): number[] {
  if (end < start) return [];
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

/**
 * 표시할 페이지 슬롯 목록을 만든다.
 *
 * 생략 기호가 들어갈 자리에 페이지가 **하나뿐이면 생략 대신 그 페이지를 그린다** —
 * `1 … 3 … 5`처럼 생략 기호가 페이지 하나를 감추는 낭비를 막는다.
 */
export function visiblePages({
  total,
  page,
  siblings,
  boundaries,
}: VisiblePagesOptions): PageSlot[] {
  if (total <= 0) return [];
  const current = Math.min(Math.max(page, 1), total);

  // 생략 없이 전부 들어가는 경우: 양 끝(boundaries×2) + 현재 좌우(siblings×2) + 현재 + 생략 자리 2
  const maxSlots = boundaries * 2 + siblings * 2 + 3;
  if (total <= maxSlots) return range(1, total);

  const startPages = range(1, Math.min(boundaries, total));
  const endPages = range(Math.max(total - boundaries + 1, boundaries + 1), total);

  // 현재 페이지 묶음의 시작 — 오른쪽 끝에 붙었을 때도 묶음 크기가 유지되도록 당겨 준다
  const siblingsStart = Math.max(
    Math.min(current - siblings, total - boundaries - siblings * 2 - 1),
    boundaries + 2,
  );
  // 현재 페이지 묶음의 끝 — 왼쪽 끝에 붙었을 때도 크기 유지, 끝 페이지들과 겹치지 않게 제한
  const siblingsEnd = Math.min(
    Math.max(current + siblings, boundaries + siblings * 2 + 2),
    endPages.length > 0 ? (endPages[0] as number) - 2 : total - 1,
  );

  return [
    ...startPages,
    // 왼쪽: 두 칸 이상 비면 생략, 딱 한 칸 비면 그 페이지를 직접.
    // 끝 페이지를 아예 안 보여주는 boundaries=0에서는 가릴 대상이 없으므로 생략 기호도 없다
    ...(startPages.length === 0
      ? []
      : siblingsStart > boundaries + 2
        ? (["ellipsis"] as PageSlot[])
        : boundaries + 1 < total - boundaries
          ? [boundaries + 1]
          : []),
    ...range(siblingsStart, siblingsEnd),
    // 오른쪽: 같은 규칙
    ...(endPages.length === 0
      ? []
      : siblingsEnd < total - boundaries - 1
        ? (["ellipsis"] as PageSlot[])
        : total - boundaries > boundaries
          ? [total - boundaries]
          : []),
    ...endPages,
  ];
}
