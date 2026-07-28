import "./Select.css";

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { useClickOutside } from "../../hooks/useClickOutside.js";
import { useControllableState } from "../../hooks/useControllableState.js";
import { CheckIcon, ChevronDownIcon } from "../../icons/index.js";
import { useFieldControl } from "../Field/index.js";

export interface SelectItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "value" | "defaultValue" | "onChange" | "children" | "type" | "role"
> {
  /** 선택지 목록 — 렌더는 컴포넌트가, 데이터는 소비자가 소유한다 */
  items: SelectItem[];
  /** 제어 선택 값 (미선택은 null) */
  value?: string | null;
  /** 비제어 초기 선택 값 */
  defaultValue?: string | null;
  /** 선택된 항목의 value만 넘긴다 */
  onChange?: (value: string) => void;
  /** 미선택 상태에 표시할 문구 */
  placeholder?: string;
}

/** 다음 활성(비활성 제외) 인덱스 — direction 방향으로 탐색, 없으면 현재 유지 */
function nextEnabled(items: SelectItem[], from: number, direction: 1 | -1): number {
  for (let i = from + direction; i >= 0 && i < items.length; i += direction) {
    const item = items[i];
    if (item && !item.disabled) return i;
  }
  return from;
}

function edgeEnabled(items: SelectItem[], direction: 1 | -1): number {
  return nextEnabled(items, direction === 1 ? -1 : items.length, direction);
}

/**
 * 단일 선택 셀렉트. sije-common Select의 키보드 내비 패턴을 계승하고
 * ARIA 결손을 수정했다 — Trigger는 combobox, List는 listbox/option 시맨틱.
 *
 * 열려 있는 동안 포커스는 Trigger에 남고 활성 옵션은 aria-activedescendant로
 * 가리킨다(combobox 표준 패턴). Escape는 열려 있을 때만 이 컴포넌트가 소유한다 —
 * 소유권 확인 후에만 stopPropagation 한다 (전역 규칙 15).
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    items,
    value: valueProp,
    defaultValue = null,
    onChange,
    placeholder = "선택",
    disabled,
    id,
    className,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const [value, setValue] = useControllableState<string | null>({
    value: valueProp,
    defaultValue,
    onChange: onChange as (value: string | null) => void,
  });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const field = useFieldControl(id);
  const baseId = useId();
  const listId = `${baseId}-list`;
  const optionId = (index: number) => `${baseId}-opt-${String(index)}`;

  // 매칭 실패는 캐스팅으로 덮지 않는다 — undefined면 placeholder를 그대로 보여준다 (리뷰 M12)
  const selected = items.find((item) => item.value === value);

  const openList = () => {
    const selectedIndex = items.findIndex((item) => item.value === value && !item.disabled);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : edgeEnabled(items, 1));
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const selectAt = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    setValue(item.value);
    close();
  };

  useClickOutside(rootRef, close, open);

  // 활성 옵션을 뷰포트 안으로 — jsdom에는 scrollIntoView가 없어 가드한다
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = document.getElementById(optionId(activeIndex));
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ block: "nearest" });
    }
    // optionId는 baseId 파생 순수 함수라 deps에 필요 없다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIndex]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      onKeyDown?.(event);
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((prev) => nextEnabled(items, prev, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((prev) => nextEnabled(items, prev, -1));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(edgeEnabled(items, 1));
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(edgeEnabled(items, -1));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectAt(activeIndex);
        break;
      case "Escape":
        // 열려 있는 동안은 이 컴포넌트가 Escape의 소유자다 — 바깥(Modal 등)에 전파하지 않는다
        event.preventDefault();
        event.stopPropagation();
        close();
        break;
      case "Tab":
        close(); // 기본 동작(포커스 이동)은 막지 않는다
        break;
      default:
        break;
    }
    onKeyDown?.(event);
  };

  return (
    <div
      ref={rootRef}
      className={["ui-select", className].filter(Boolean).join(" ")}
      data-disabled={disabled ? "" : undefined}
    >
      <button
        ref={ref}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        disabled={disabled}
        id={field.id}
        aria-describedby={field["aria-describedby"]}
        aria-invalid={field["aria-invalid"]}
        aria-errormessage={field["aria-errormessage"]}
        className="ui-select-trigger"
        data-invalid={field["aria-invalid"] ? "" : undefined}
        onClick={() => (open ? close() : openList())}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        <span className="ui-select-value" data-placeholder={selected ? undefined : ""}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDownIcon className="ui-select-chevron" data-open={open ? "" : undefined} />
      </button>

      {open && (
        // div + role — jsx-a11y strict는 ul/li에 인터랙티브 역할 부여를 금지한다.
        // 키보드는 트리거(aria-activedescendant)가 담당하므로 옵션 자체는 포커스 대상이 아니다.
        <div className="ui-select-list" role="listbox" id={listId}>
          {items.map((item, index) => (
            // activedescendant 패턴: 옵션은 설계상 포커스 대상이 아니며 키보드는 combobox(트리거)가 전담한다
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
            <div
              key={item.value}
              id={optionId(index)}
              role="option"
              aria-selected={item.value === value}
              aria-disabled={item.disabled || undefined}
              data-active={index === activeIndex ? "" : undefined}
              className="ui-select-option"
              onClick={() => selectAt(index)}
              onPointerMove={() => {
                if (!item.disabled && index !== activeIndex) setActiveIndex(index);
              }}
            >
              <span className="ui-select-option-label">{item.label}</span>
              {item.value === value && <CheckIcon className="ui-select-option-check" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
