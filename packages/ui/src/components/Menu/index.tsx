import "./Menu.css";

import {
  Children,
  cloneElement,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { useDisclosure } from "../../hooks/useDisclosure.js";
import { composeRefs } from "../../internal/composeRefs.js";
import { Popover } from "../Popover/index.js";

/**
 * React 19에서 ref는 일반 prop이다 — 이 읽기는 ref 셀(.current) 접근이 아니라
 * prop 조회라서 렌더 중에도 안전하다 (react-hooks/refs 규칙의 오탐 회피용 헬퍼).
 */
function getChildRef(element: ReactElement<TriggerLikeProps>): Ref<HTMLElement> | undefined {
  return element.props.ref;
}

interface TriggerLikeProps {
  ref?: Ref<HTMLElement>;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  "aria-haspopup"?: boolean | "menu" | "dialog" | "listbox" | "tree" | "grid" | "false" | "true";
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
}

export interface MenuItem {
  /** 항목 식별자 — onSelect로 전달된다 */
  key: string;
  /** 표시 내용 */
  label: ReactNode;
  /**
   * 선택 불가 항목 — 키보드 이동에서 건너뛴다
   * @default false
   */
  disabled?: boolean;
  /**
   * 파괴적 동작 표시 (danger 색)
   * @default false
   */
  danger?: boolean;
}

export interface MenuProps {
  /** 메뉴 항목 목록 */
  items: MenuItem[];
  /** 항목 선택 시 호출 — 선택하면 메뉴가 닫히고 포커스는 트리거로 돌아간다 */
  onSelect?: (key: string) => void;
  /** 단일 트리거 요소 — ref·클릭/키보드 핸들러·aria 속성이 주입된다 (ref 전달 필수) */
  trigger: ReactElement<TriggerLikeProps>;
  /**
   * 선호 배치 방향 — 공간이 없으면 반대편으로 플립된다
   * @default "bottom"
   */
  side?: "top" | "bottom" | "left" | "right";
  /**
   * 교차축 정렬
   * @default "start"
   */
  align?: "start" | "center" | "end";
  /** 제어 열림 상태 */
  open?: boolean;
  /**
   * 비제어 초기 열림 상태
   * @default false
   */
  defaultOpen?: boolean;
  /** 열림 상태 변경 시 호출 */
  onOpenChange?: (open: boolean) => void;
}

/** delta 방향으로 disabled를 건너뛰며 이동 — 끝에서 멈춘다 (랩 없음, Select 컨벤션) */
function moveActive(items: MenuItem[], from: number, delta: 1 | -1): number {
  let index = from + delta;
  while (index >= 0 && index < items.length) {
    if (items[index]?.disabled !== true) return index;
    index += delta;
  }
  return from;
}

/** 시작(delta=1)/끝(delta=-1)에서 첫 활성 항목 — 전부 disabled면 -1 */
function edgeActive(items: MenuItem[], delta: 1 | -1): number {
  const start = delta === 1 ? 0 : items.length - 1;
  for (let index = start; index >= 0 && index < items.length; index += delta) {
    if (items[index]?.disabled !== true) return index;
  }
  return -1;
}

/**
 * 동작 실행용 드롭다운 메뉴 — sije-common Dropdown+useDropdown(JSX 반환 훅)의 재설계.
 * 값 선택에는 Select를 쓴다 (문서에 사용 기준 명시).
 *
 * - Popover 조합: 위치 플립·스크롤 추적·Escape 스택 소유권·바깥 클릭 닫힘을 그대로 얻는다
 * - 열리면 포커스가 role="menu" 컨테이너로 이동하고 항목은 aria-activedescendant로
 *   가리킨다 — 항목이 개별 포커스를 받지 않는 점은 Select와 같은 설계다.
 *   (activedescendant를 트리거 button에 두지 않는 이유: button은 지원 role이 아니다)
 * - Escape로 닫힐 때 트리거 포커스 복원은 Popover가 담당한다 (패널 안 포커스 → 앵커)
 * - Tooltip처럼 자체 DOM 루트가 없는 조합 컴포넌트라 forwardRef가 아니다
 */
export function Menu({
  items,
  onSelect,
  trigger,
  side = "bottom",
  align = "start",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: MenuProps) {
  const { open, onOpen, onClose } = useDisclosure({ open: openProp, defaultOpen, onOpenChange });
  const anchorRef = useRef<HTMLElement | null>(null);
  // Portal 아래 리스트는 이펙트 이후에 마운트된다 — ref가 아닌 요소 상태로 연결한다
  const [listEl, setListEl] = useState<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const baseId = useId();
  const listId = `${baseId}-menu`;
  const itemId = (index: number) => `${baseId}-item-${index}`;

  const openMenu = (fromEnd: boolean) => {
    setActiveIndex(edgeActive(items, fromEnd ? -1 : 1));
    onOpen();
  };

  // 내부 닫힘(선택·Tab·트리거 토글) — 리스트에 있던 포커스를 트리거로 되돌린다.
  // Escape·바깥 클릭 닫힘의 포커스 처리는 Popover가 담당한다
  const closeMenu = () => {
    if (listEl?.contains(document.activeElement)) anchorRef.current?.focus();
    onClose();
  };

  const selectAt = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    closeMenu();
    onSelect?.(item.key);
  };

  // 열리면 포커스를 메뉴 컨테이너로 — activedescendant가 활성 항목을 가리킨다
  useEffect(() => {
    if (open && listEl) listEl.focus();
  }, [open, listEl]);

  // 활성 항목이 스크롤 밖이면 보이게 — jsdom에는 scrollIntoView가 없어 존재 가드 필수
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = document.getElementById(itemId(activeIndex));
    if (el && typeof el.scrollIntoView === "function") el.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- itemId는 baseId 파생 순수 함수
  }, [open, activeIndex]);

  const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((prev) => (prev < 0 ? edgeActive(items, 1) : moveActive(items, prev, 1)));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((prev) => (prev < 0 ? edgeActive(items, -1) : moveActive(items, prev, -1)));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(edgeActive(items, 1));
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(edgeActive(items, -1));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectAt(activeIndex);
        break;
      case "Tab":
        // 닫고 트리거로 복귀만 — 기본 이동을 막지 않아 포커스가 트리거 다음으로 흐른다
        closeMenu();
        break;
      default:
        break;
    }
  };

  const child = Children.only(trigger);
  const childProps = child.props;

  /* eslint-disable react-hooks/refs -- cloneElement로 전달하는 콜백 ref: 쓰기는 렌더가 아닌
     커밋 단계(콜백 실행 시점)에 일어난다. JSX ref 속성이 아니라 규칙이 패턴을 인식하지 못한다 */
  const triggerElement = cloneElement(child, {
    ref: composeRefs<HTMLElement>(getChildRef(child), anchorRef),
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-controls": open ? listId : undefined,
    onClick: (event: MouseEvent<HTMLElement>) => {
      childProps.onClick?.(event);
      if (open) closeMenu();
      else openMenu(false);
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      childProps.onKeyDown?.(event);
      if (open) return;
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        openMenu(event.key === "ArrowUp");
      }
    },
  });
  /* eslint-enable react-hooks/refs */

  return (
    <>
      {triggerElement}
      <Popover
        className="ui-menu"
        anchorRef={anchorRef}
        open={open}
        onOpenChange={(next) => {
          if (next) onOpen();
          else onClose();
        }}
        side={side}
        align={align}
      >
        <div
          ref={setListEl}
          id={listId}
          role="menu"
          tabIndex={-1}
          aria-activedescendant={activeIndex >= 0 ? itemId(activeIndex) : undefined}
          className="ui-menu-list"
          onKeyDown={handleListKeyDown}
        >
          {items.map((item, index) => (
            /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus --
               aria-activedescendant 설계: 포커스는 컨테이너에 있고 키보드는 컨테이너 keydown이
               처리한다. 항목은 의도적으로 포커스 불가 (Select 옵션과 동일) */
            <div
              key={item.key}
              id={itemId(index)}
              role="menuitem"
              aria-disabled={item.disabled === true || undefined}
              data-active={index === activeIndex || undefined}
              data-danger={item.danger === true || undefined}
              className="ui-menu-item"
              onClick={() => selectAt(index)}
              onPointerMove={() => {
                if (item.disabled !== true && index !== activeIndex) setActiveIndex(index);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </Popover>
    </>
  );
}
