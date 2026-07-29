import { type CSSProperties, useCallback, useEffect, useLayoutEffect, useState } from "react";

import { computePosition, type PositionAlign, type PositionSide } from "./computePosition.js";

interface UseAnchorPositionOptions {
  /** 앵커 요소 — Portal 아래 소비자는 ref 객체가 아닌 요소 상태로 넘겨야 한다 */
  anchorEl: HTMLElement | null;
  /** 위치를 잡을 부동 요소 — 요소 상태로 넘겨야 마운트 시 측정 이펙트가 발동한다 */
  floatingEl: HTMLElement | null;
  side: PositionSide;
  align: PositionAlign;
  offset: number;
  /** 교차축 뷰포트 클램핑 @default false */
  clamp?: boolean;
  /** 열려 있는 동안 scroll(캡처)·resize에 반응해 재계산 @default false */
  track?: boolean;
  /** false면 계산·리스너 전부 중단 (닫힌 상태) */
  enabled: boolean;
}

interface AnchorPosition {
  style: CSSProperties | undefined;
  /** 플립 반영 후 실제 배치 방향 */
  side: PositionSide;
}

/**
 * 앵커 기준 부동 요소 배치 훅 — 측정→계산→배치를 페인트 전에 끝낸다(layoutEffect).
 * window 접근은 전부 이펙트·리스너 안에서만 일어난다(SSR-safe). 내부 전용.
 */
export function useAnchorPosition({
  anchorEl,
  floatingEl,
  side,
  align,
  offset,
  clamp = false,
  track = false,
  enabled,
}: UseAnchorPositionOptions): AnchorPosition {
  const [position, setPosition] = useState<{ top: number; left: number; side: PositionSide }>();

  const update = useCallback(() => {
    if (!enabled || !anchorEl || !floatingEl) return;
    const next = computePosition(
      anchorEl.getBoundingClientRect(),
      floatingEl.getBoundingClientRect(),
      {
        side,
        align,
        offset,
        clamp,
        viewport: { width: window.innerWidth, height: window.innerHeight },
      },
    );
    // 스크롤 추적 중 값이 그대로면 리렌더를 만들지 않는다
    setPosition((prev) =>
      prev && prev.top === next.top && prev.left === next.left && prev.side === next.side
        ? prev
        : next,
    );
  }, [enabled, anchorEl, floatingEl, side, align, offset, clamp]);

  useLayoutEffect(() => {
    update();
  }, [update]);

  useEffect(() => {
    if (!enabled || !track) return;
    const onUpdate = () => update();
    // 캡처 단계 — 중첩 스크롤 컨테이너의 scroll은 window로 버블되지 않는다
    window.addEventListener("scroll", onUpdate, { capture: true, passive: true });
    window.addEventListener("resize", onUpdate);
    return () => {
      window.removeEventListener("scroll", onUpdate, { capture: true });
      window.removeEventListener("resize", onUpdate);
    };
  }, [enabled, track, update]);

  return {
    style: enabled && position ? { top: position.top, left: position.left } : undefined,
    side: position?.side ?? side,
  };
}
