import { createContext, type ReactNode, use } from "react";

/**
 * 하위 Portal의 기본 컨테이너 — 내부 전용.
 *
 * `aria-modal="true"` 다이얼로그는 보조기술이 **그 서브트리 밖을 노출하지 않는다**.
 * 모달 안에서 열린 팝오버·메뉴가 body 아래로 포털되면 화면에는 보이지만 스크린리더로는
 * 도달할 수 없다 — 그래서 모달이 자기 패널을 기본 컨테이너로 공급하고, 하위 Portal이
 * 그것을 물려받는다. 패널은 `position: fixed`라 조상 overflow에 잘리지 않는다.
 */
const PortalContainerContext = createContext<Element | null>(null);

export function PortalContainerProvider({
  container,
  children,
}: {
  container: Element | null;
  children: ReactNode;
}) {
  return <PortalContainerContext value={container}>{children}</PortalContainerContext>;
}

export function usePortalContainer(): Element | null {
  return use(PortalContainerContext);
}
