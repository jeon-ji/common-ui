import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  /**
   * 포털 대상 컨테이너. 생략하면 body 아래에 전용 컨테이너를 만들고 언마운트 시 정리한다.
   */
  container?: Element | null;
  children: ReactNode;
}

/**
 * 포털 타겟 해석의 **유일 창구** — Modal·Toast·Tooltip 전부 이 컴포넌트를 사용한다
 * (sije-common의 3중 구현 + non-null 단언 문제의 재발 방지).
 *
 * `document` 접근은 이펙트에서만 한다 — 렌더 단계 접근은 SSR에서 즉시 깨진다(리뷰 M6).
 * 따라서 서버와 첫 클라이언트 렌더에서는 null을 반환하고, 마운트 후에 포털이 열린다.
 */
export function Portal({ container, children }: PortalProps) {
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
    // 마운트 후에만 DOM을 만질 수 있으므로 타겟 확정은 effect 안 1회 setState가 불가피하다
    // (SSR-safe 포털의 표준 패턴 — "자동 생성 + 정리" 스펙이 렌더 단계 생성으로는 불가능)
    if (container) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 상단 주석 참조
      setTarget(container);
      return;
    }

    const el = document.createElement("div");
    el.setAttribute("data-ui-portal", "");
    document.body.appendChild(el);
    setTarget(el);

    return () => {
      el.remove();
    };
  }, [container]);

  if (!target) return null;
  return createPortal(children, target);
}
