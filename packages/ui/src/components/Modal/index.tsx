import "./Modal.css";

import { type ComponentPropsWithoutRef, forwardRef, type ReactNode, useId, useState } from "react";

import { CloseIcon } from "../../icons/index.js";
import { composeRefs } from "../../internal/composeRefs.js";
import { OverlayProvider, useOverlayLayer } from "../../internal/overlay/overlayStack.js";
import { useFocusTrap } from "../../internal/overlay/useFocusTrap.js";
import { useScrollLock } from "../../internal/overlay/useScrollLock.js";
import { IconButton } from "../IconButton/index.js";
import { Portal } from "../Portal/index.js";

export { OverlayProvider };

export interface ModalProps extends Omit<ComponentPropsWithoutRef<"div">, "title" | "role"> {
  /**
   * 열림 상태 — **제어형 단일 API**. defaultOpen 같은 반쪽 옵션은 두지 않는다
   * (sije-common A4의 defaultOpen 버그 유형 원천 배제)
   */
  open: boolean;
  /** 닫힘 요청 — Escape·백드롭·닫기 버튼이 모두 이걸 호출한다 */
  onClose: () => void;
  /** 제목 — aria-labelledby로 자동 연결된다 */
  title?: ReactNode;
  /**
   * 패널 폭 프리셋
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /** 하단 액션 슬롯 */
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * 모달 다이얼로그 — Portal 위에 role="dialog" + aria-modal + FocusTrap + ScrollLock.
 * Escape는 오버레이 스택 레지스트리를 통해 최상단 모달만 처리한다.
 * 중첩 모달을 쓸 때는 공통 조상을 OverlayProvider로 감싼다.
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  { open, onClose, title, size = "md", footer, className, children, ...rest },
  ref,
) {
  // Portal 아래 패널은 이펙트 이후에 마운트되므로, ref 객체가 아닌 요소 상태로
  // 연결해야 focus trap이 마운트 시점에 발동한다
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  const titleId = useId();

  const layer = useOverlayLayer(open, onClose);
  useScrollLock(open);
  useFocusTrap(panel, open);

  if (!open) return null;

  return (
    <Portal>
      {/* 백드롭 닫힘도 Escape와 같은 스택 소유권을 따른다 — 위에 팝오버가 열려 있으면
          그쪽이 먼저 닫히고 모달은 남는다 (한 번의 클릭에 두 겹이 닫히지 않게) */}
      <div
        className="ui-modal-backdrop"
        onPointerDown={() => {
          if (layer.isTop()) onClose();
        }}
        aria-hidden="true"
      />
      <div className="ui-modal-viewport">
        <div
          ref={composeRefs(ref, setPanel)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title != null ? titleId : undefined}
          data-size={size}
          tabIndex={-1}
          className={["ui-modal", className].filter(Boolean).join(" ")}
          {...rest}
        >
          <header className="ui-modal-header">
            {title != null && (
              <h2 className="ui-modal-title" id={titleId}>
                {title}
              </h2>
            )}
            {/* svg에 onClick을 다는 방식 금지 — 라벨 있는 버튼이 닫기를 담당한다 (리뷰 A8) */}
            <IconButton size="sm" aria-label="닫기" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </header>
          <div className="ui-modal-body">{children}</div>
          {footer != null && <footer className="ui-modal-footer">{footer}</footer>}
        </div>
      </div>
    </Portal>
  );
});
