import { useEffect } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * active 동안 Tab 포커스를 컨테이너 안에서 순환시키고,
 * 열릴 때 initial focus([data-autofocus] > 첫 포커서블 > 컨테이너)를 잡고
 * 닫힐 때 이전 포커스(트리거)로 복원한다 (리뷰 A8).
 *
 * 컨테이너는 ref가 아니라 **요소 상태**로 받는다 — Portal 아래 콘텐츠는 이펙트
 * 이후에야 마운트되므로, ref 객체로는 이펙트가 재실행될 계기가 없다.
 * (콜백 ref → setState로 연결하면 마운트 시점에 이 이펙트가 다시 돈다)
 * 컨테이너 자체가 폴백 포커스를 받으려면 tabIndex={-1}이 있어야 한다.
 */
export function useFocusTrap(container: HTMLElement | null, active: boolean): void {
  useEffect(() => {
    if (!active || !container) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    const initial =
      container.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0] ?? container;
    initial.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) {
        event.preventDefault(); // 포커서블이 없으면 컨테이너에 머문다
        return;
      }
      const current = document.activeElement;
      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      } else if (!(current instanceof Node) || !container.contains(current)) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus(); // 트리거로 복원
    };
  }, [container, active]);
}
