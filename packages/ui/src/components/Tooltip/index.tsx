import "./Tooltip.css";

import {
  Children,
  cloneElement,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { composeRefs } from "../../internal/composeRefs.js";
import { motion } from "../../tokens/motion.js";
import { Portal } from "../Portal/index.js";

/** 표시 지연 기본값 — 모션 토큰(normal)과 동기화한다 */
const DEFAULT_DELAY = Number.parseInt(motion.duration.normal, 10);
const OFFSET = 6;

/**
 * React 19에서 ref는 일반 prop이다 — 이 읽기는 ref 셀(.current) 접근이 아니라
 * prop 조회라서 렌더 중에도 안전하다 (react-hooks/refs 규칙의 오탐 회피용 헬퍼).
 */
function getChildRef(element: ReactElement<TriggerLikeProps>): Ref<HTMLElement> | undefined {
  return element.props.ref;
}

interface TriggerLikeProps {
  ref?: Ref<HTMLElement>;
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  "aria-describedby"?: string;
}

export interface TooltipProps {
  /** 툴팁 내용 */
  content: ReactNode;
  /** 단일 트리거 요소 — 핸들러와 aria-describedby가 주입된다 (ref 전달 필수) */
  children: ReactElement<TriggerLikeProps>;
  /**
   * 기본 배치 — 뷰포트를 벗어나면 반대편으로 플립된다
   * @default "top"
   */
  placement?: "top" | "bottom";
  /** hover 표시 지연 ms. 키보드 포커스는 지연 없이 즉시 표시된다 @default 모션 토큰 normal(200) */
  delay?: number;
}

/**
 * 자체 구현 툴팁 — 외부 라이브러리 없음 (문자열 id 매칭·중복 인스턴스 리스크 해소, 리뷰 A5).
 *
 * - **hover + focus** 트리거: 키보드 사용자도 동일하게 접근한다 (A8)
 * - 트리거의 aria-describedby로 연결 — 포커스 시 스크린리더가 내용을 읽는다
 * - Escape로 닫히며, 이때 이벤트를 소비(preventDefault)하므로 Modal 안에서도
 *   Escape 한 번에 모달까지 닫히지 않는다 (오버레이 레지스트리는 소비된 Escape를 무시)
 */
export function Tooltip({
  content,
  children,
  placement = "top",
  delay = DEFAULT_DELAY,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<CSSProperties>();
  const [actualPlacement, setActualPlacement] = useState(placement);
  const triggerRef = useRef<HTMLElement | null>(null);
  // Portal 아래 툴팁은 이펙트 이후에 마운트된다 — ref가 아닌 요소 상태여야 측정 이펙트가 발동한다
  const [tipEl, setTipEl] = useState<HTMLDivElement | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const clearShowTimer = () => {
    if (showTimer.current !== null) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
  };

  const show = () => setOpen(true);
  const hide = () => {
    clearShowTimer();
    setOpen(false);
  };

  // 언마운트 시 대기 중 타이머 정리
  useEffect(() => clearShowTimer, []);

  // 열릴 때 위치 계산 — 측정(트리거·툴팁 rect) 후 배치하고, 뷰포트를 벗어나면 플립한다.
  // 측정→배치는 페인트 전에 끝나야 하므로 layoutEffect + setState가 표준 패턴이다.
  useLayoutEffect(() => {
    if (!open || !tipEl) return;
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const tipRect = tipEl.getBoundingClientRect();

    let resolved = placement;
    if (placement === "top" && rect.top - tipRect.height - OFFSET < 0) resolved = "bottom";
    if (
      placement === "bottom" &&
      rect.bottom + tipRect.height + OFFSET > window.innerHeight &&
      rect.top - tipRect.height - OFFSET >= 0
    ) {
      resolved = "top";
    }

    const top = resolved === "top" ? rect.top - tipRect.height - OFFSET : rect.bottom + OFFSET;

    setActualPlacement(resolved);
    setStyle({
      top,
      left: rect.left + rect.width / 2,
      transform: "translateX(-50%)",
    });
  }, [open, placement, tipEl]);

  // Escape — 열려 있는 동안만, 소비를 표시해 상위 오버레이(Modal)로 새지 않게 한다
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      setOpen(false);
    };
    // 캡처 단계 — 버블 단계의 오버레이(Modal) 레지스트리보다 먼저 소비해야
    // "툴팁만 닫힘"이 리스너 등록 순서와 무관하게 보장된다
    document.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      document.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, [open]);

  const child = Children.only(children);
  const childProps = child.props;

  /* eslint-disable react-hooks/refs -- cloneElement로 전달하는 콜백 ref: 쓰기는 렌더가 아닌
     커밋 단계(콜백 실행 시점)에 일어난다. JSX ref 속성이 아니라 규칙이 패턴을 인식하지 못한다 */
  const trigger = cloneElement(child, {
    ref: composeRefs<HTMLElement>(getChildRef(child), (node) => {
      triggerRef.current = node;
    }),
    "aria-describedby": open ? tooltipId : childProps["aria-describedby"],
    onMouseEnter: (event: MouseEvent<HTMLElement>) => {
      childProps.onMouseEnter?.(event);
      clearShowTimer();
      showTimer.current = setTimeout(show, delay);
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      childProps.onMouseLeave?.(event);
      hide();
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      childProps.onFocus?.(event);
      show(); // 키보드 포커스는 지연 없이
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      childProps.onBlur?.(event);
      hide();
    },
  });
  /* eslint-enable react-hooks/refs */

  return (
    <>
      {trigger}
      {open && (
        <Portal>
          <div
            ref={setTipEl}
            id={tooltipId}
            role="tooltip"
            data-placement={actualPlacement}
            className="ui-tooltip"
            style={style}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}
