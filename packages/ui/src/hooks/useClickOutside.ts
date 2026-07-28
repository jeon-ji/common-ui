import { type RefObject, useEffect, useRef } from "react";

/**
 * ref 요소 바깥에서 pointerdown이 일어나면 handler를 호출한다.
 *
 * - React 19 시그니처: `RefObject<T | null>` (리뷰 C6)
 * - Escape 처리는 하지 않는다 — 키보드는 각 오버레이의 소유권 문제라 관심사를 분리한다
 *   (sije-common의 isESC 옵션이 Escape 3중 구현 충돌의 한 축이었다)
 * - `enabled=false`면 리스너를 아예 달지 않는다 — 닫혀 있는 동안 document 리스너 0개
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: PointerEvent) => void,
  enabled = true,
): void {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: PointerEvent) => {
      const el = ref.current;
      if (!el || !(event.target instanceof Node) || el.contains(event.target)) return;
      handlerRef.current(event);
    };

    document.addEventListener("pointerdown", listener);
    return () => {
      document.removeEventListener("pointerdown", listener);
    };
  }, [ref, enabled]);
}
