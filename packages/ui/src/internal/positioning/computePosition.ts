/**
 * 앵커 기준 부동 요소(툴팁·팝오버)의 위치 계산 — 순수 함수.
 * viewport를 인자로 받아 DOM 없이 유닛 테스트할 수 있다. 내부 전용, public API가 아니다.
 */

export type PositionSide = "top" | "bottom" | "left" | "right";
export type PositionAlign = "start" | "center" | "end";

/** getBoundingClientRect 결과에서 필요한 필드만 — DOMRect를 직접 요구하지 않는다 */
export interface RectLike {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface ComputePositionOptions {
  /** 선호 배치 방향 — 공간이 없으면 플립된다 */
  side: PositionSide;
  /** 교차축 정렬 */
  align: PositionAlign;
  /** 앵커와 부동 요소 사이 간격(px) */
  offset: number;
  /** 뷰포트 크기 — 플립·클램핑 판정 기준 */
  viewport: { width: number; height: number };
  /** true면 교차축 좌표를 뷰포트 안으로 클램핑한다 @default false */
  clamp?: boolean;
}

export interface ComputePositionResult {
  top: number;
  left: number;
  /** 플립 반영 후 실제 배치 방향 */
  side: PositionSide;
}

const OPPOSITE: Record<PositionSide, PositionSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

/** 둘 다 안 들어갈 때의 폴백 — 축의 end쪽(bottom/right). 기존 Tooltip의 top/bottom 동작과 동치다 */
const FALLBACK: Record<PositionSide, PositionSide> = {
  top: "bottom",
  bottom: "bottom",
  left: "right",
  right: "right",
};

function fits(
  side: PositionSide,
  anchor: RectLike,
  floating: RectLike,
  offset: number,
  viewport: { width: number; height: number },
): boolean {
  switch (side) {
    case "top":
      return anchor.top - floating.height - offset >= 0;
    case "bottom":
      return anchor.bottom + floating.height + offset <= viewport.height;
    case "left":
      return anchor.left - floating.width - offset >= 0;
    case "right":
      return anchor.right + floating.width + offset <= viewport.width;
  }
}

function clampAxis(value: number, floatingSize: number, viewportSize: number): number {
  return Math.max(0, Math.min(value, viewportSize - floatingSize));
}

export function computePosition(
  anchor: RectLike,
  floating: RectLike,
  { side, align, offset, viewport, clamp = false }: ComputePositionOptions,
): ComputePositionResult {
  let resolved = side;
  if (!fits(side, anchor, floating, offset, viewport)) {
    resolved = fits(OPPOSITE[side], anchor, floating, offset, viewport)
      ? OPPOSITE[side]
      : FALLBACK[side];
  }

  const vertical = resolved === "top" || resolved === "bottom";

  // 주축 좌표 — 방향이 확정된 뒤 앵커에서 offset만큼 떨어뜨린다
  const main =
    resolved === "top"
      ? anchor.top - floating.height - offset
      : resolved === "bottom"
        ? anchor.bottom + offset
        : resolved === "left"
          ? anchor.left - floating.width - offset
          : anchor.right + offset;

  // 교차축 좌표 — align 기준 정렬
  const anchorStart = vertical ? anchor.left : anchor.top;
  const anchorSize = vertical ? anchor.width : anchor.height;
  const floatingSize = vertical ? floating.width : floating.height;
  let cross =
    align === "start"
      ? anchorStart
      : align === "center"
        ? anchorStart + anchorSize / 2 - floatingSize / 2
        : anchorStart + anchorSize - floatingSize;

  if (clamp) {
    cross = clampAxis(cross, floatingSize, vertical ? viewport.width : viewport.height);
  }

  return vertical
    ? { top: main, left: cross, side: resolved }
    : { top: cross, left: main, side: resolved };
}
