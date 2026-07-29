import "./Popover.css";

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type ReactNode,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import { useDisclosure } from "../../hooks/useDisclosure.js";
import { composeRefs } from "../../internal/composeRefs.js";
import { useOverlayEscape } from "../../internal/overlay/overlayStack.js";
import { useAnchorPosition } from "../../internal/positioning/useAnchorPosition.js";
import { Portal } from "../Portal/index.js";

const OFFSET = 6;

export interface PopoverProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /** 위치 기준 앵커 — 트리거 요소의 ref를 그대로 넘긴다 (공식 앵커 API) */
  anchorRef: RefObject<HTMLElement | null>;
  /** 제어 열림 상태 */
  open?: boolean;
  /**
   * 비제어 초기 열림 상태
   * @default false
   */
  defaultOpen?: boolean;
  /** 열림 상태 변경 시 호출 — Escape·바깥 클릭에 의한 닫힘도 이걸로 알린다 */
  onOpenChange?: (open: boolean) => void;
  /**
   * 선호 배치 방향 — 공간이 없으면 반대편으로 플립된다
   * @default "bottom"
   */
  side?: "top" | "bottom" | "left" | "right";
  /**
   * 교차축 정렬 (앵커의 시작/중앙/끝 모서리 기준)
   * @default "center"
   */
  align?: "start" | "center" | "end";
  children: ReactNode;
}

/**
 * 논모달 팝오버 — 앵커 요소 기준으로 배치되는 가벼운 오버레이.
 *
 * - `anchorRef`가 공식 위치 기준이다 — 트리거 내부 구조에 ref를 뚫고 들어가지 않는다
 * - 뷰포트 충돌 시 반대편 플립 + 교차축 클램핑, 열려 있는 동안 scroll/resize 추적
 * - Escape는 오버레이 스택 소유권을 따른다 — Modal 안에서는 팝오버만 닫힌다
 *   (중첩을 쓰면 공통 조상에 OverlayProvider 필요)
 * - FocusTrap/ScrollLock 없음(non-modal). 닫힐 때 패널 안에 있던 포커스만 앵커로
 *   복원해 body로 떨어지지 않게 한다
 * - role을 강제하지 않는다 — 역할 있는 위젯(메뉴 등)은 전용 컴포넌트가 부여한다
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {
    anchorRef,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    side = "bottom",
    align = "center",
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const { open, onClose } = useDisclosure({ open: openProp, defaultOpen, onOpenChange });

  // Portal 아래 패널은 이펙트 이후에 마운트된다 — ref가 아닌 요소 상태로 연결한다 (Modal과 동일)
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  // 앵커도 요소 상태로 승격 — 렌더 중에 ref.current를 읽지 않는다
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    setAnchorEl(open ? anchorRef.current : null);
  }, [open, anchorRef]);

  const position = useAnchorPosition({
    anchorEl,
    floatingEl: panel,
    side,
    align,
    offset: OFFSET,
    clamp: true,
    track: true,
    enabled: open,
  });

  // Escape 닫힘 — 패널 안에 있던 포커스는 앵커로 복원한다 (패널 언마운트로 포커스가
  // body에 떨어지는 것 방지). 바깥 클릭은 브라우저가 클릭 대상에 포커스를 주므로 불간섭
  const closeAndRestoreFocus = () => {
    if (panel?.contains(document.activeElement)) anchorRef.current?.focus();
    onClose();
  };
  useOverlayEscape(open, closeAndRestoreFocus);

  // 바깥 클릭 닫힘 — useClickOutside는 RefObject 기반이라 Portal로 빠진 패널에 쓸 수 없다.
  // 앵커·패널 서브트리를 함께 검사하고, 닫힌 동안은 document 리스너를 달지 않는다
  useEffect(() => {
    if (!open || !panel) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panel.contains(target) || anchorRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, panel, anchorRef, onClose]);

  if (!open) return null;

  return (
    <Portal>
      <div
        ref={composeRefs(ref, setPanel)}
        className={["ui-popover", className].filter(Boolean).join(" ")}
        style={{ ...style, ...position.style }}
        data-side={position.side}
        data-align={align}
        {...rest}
      >
        {children}
      </div>
    </Portal>
  );
});
