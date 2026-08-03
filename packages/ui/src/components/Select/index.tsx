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
import { edgeEnabledIndex, nextEnabledIndex } from "../../internal/enabledIndex.js";
import { useFieldControl } from "../Field/index.js";

export interface SelectItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

interface SelectBaseProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "value" | "defaultValue" | "onChange" | "children" | "type" | "role"
> {
  /** 선택지 목록 — 렌더는 컴포넌트가, 데이터는 소비자가 소유한다 */
  items: SelectItem[];
  /** 미선택 상태에 표시할 문구 */
  placeholder?: string;
}

export interface SelectSingleProps extends SelectBaseProps {
  /** 단일 선택 (기본) */
  multiple?: false;
  /** 제어 선택 값 (미선택은 null) */
  value?: string | null;
  /** 비제어 초기 선택 값 */
  defaultValue?: string | null;
  /** 선택된 항목의 value만 넘긴다 */
  onChange?: (value: string) => void;
}

export interface SelectMultipleProps extends SelectBaseProps {
  /** 다중 선택 — 옵션 선택 후에도 목록이 열려 있는다 */
  multiple: true;
  /** 제어 선택 값 배열 */
  value?: string[];
  /** 비제어 초기 선택 값 배열 */
  defaultValue?: string[];
  /** 선택된 value 배열만 넘긴다 */
  onChange?: (value: string[]) => void;
}

/**
 * 판별 유니온 — `multiple` 여부가 value/onChange의 타입을 결정한다.
 * 단일 모드에 배열을 넣거나 다중 모드에 문자열 콜백을 넣으면 컴파일되지 않는다
 * (sije-common 최고 자산으로 꼽힌 패턴의 계승).
 */
export type SelectProps = SelectSingleProps | SelectMultipleProps;

/** 유니온을 내부 공통 표현(string[])으로 정규화한다 */
function normalizeProps(props: SelectProps) {
  if (props.multiple) {
    const { multiple, value, defaultValue, onChange, ...rest } = props;
    void multiple;
    return {
      multiple: true,
      value,
      defaultValue: defaultValue ?? [],
      onChange,
      rest,
    } as const;
  }
  const { multiple, value, defaultValue, onChange, ...rest } = props;
  void multiple;
  return {
    multiple: false,
    value: value === undefined ? undefined : value === null ? [] : [value],
    defaultValue: defaultValue == null ? [] : [defaultValue],
    onChange: onChange
      ? (values: string[]) => {
          const first = values[0];
          if (first !== undefined) onChange(first);
        }
      : undefined,
    rest,
  } as const;
}

/**
 * 단일 선택 셀렉트. sije-common Select의 키보드 내비 패턴을 계승하고
 * ARIA 결손을 수정했다 — Trigger는 combobox, List는 listbox/option 시맨틱.
 *
 * 열려 있는 동안 포커스는 Trigger에 남고 활성 옵션은 aria-activedescendant로
 * 가리킨다(combobox 표준 패턴). Escape는 열려 있을 때만 이 컴포넌트가 소유한다 —
 * 소유권 확인 후에만 stopPropagation 한다 (전역 규칙 15).
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(props, ref) {
  const normalized = normalizeProps(props);
  const { multiple } = normalized;
  const {
    items,
    placeholder = "선택",
    disabled,
    id,
    className,
    onKeyDown,
    ...rest
  } = normalized.rest;

  const [values, setValues] = useControllableState<string[]>({
    value: normalized.value,
    defaultValue: normalized.defaultValue,
    onChange: normalized.onChange,
  });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const field = useFieldControl(id);
  const baseId = useId();
  const listId = `${baseId}-list`;
  // 목록의 이름을 위해 트리거에는 항상 id가 있어야 한다 — Field가 준 id(소비자 지정 id 포함)를
  // 그대로 쓰고, 단독 사용이라 없으면 만든다 (Menu가 role="menu" 이름을 붙일 때와 같은 방식)
  const triggerId = field.id ?? `${baseId}-trigger`;
  const optionId = (index: number) => `${baseId}-opt-${String(index)}`;

  // 매칭 실패는 캐스팅으로 덮지 않는다 — undefined면 placeholder를 그대로 보여준다 (리뷰 M12)
  const selectedItems = items.filter((item) => values.includes(item.value));

  const openList = () => {
    const selectedIndex = items.findIndex((item) => values.includes(item.value) && !item.disabled);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : edgeEnabledIndex(items, 1));
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const selectAt = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    if (multiple) {
      // 토글 — 목록은 열린 채 유지한다 (연속 선택)
      setValues((prev) =>
        prev.includes(item.value) ? prev.filter((v) => v !== item.value) : [...prev, item.value],
      );
      return;
    }
    setValues([item.value]);
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
        setActiveIndex((prev) => nextEnabledIndex(items, prev, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((prev) => nextEnabledIndex(items, prev, -1));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(edgeEnabledIndex(items, 1));
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(edgeEnabledIndex(items, -1));
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
        id={triggerId}
        aria-describedby={field["aria-describedby"]}
        aria-invalid={field["aria-invalid"]}
        aria-errormessage={field["aria-errormessage"]}
        className="ui-select-trigger"
        data-invalid={field["aria-invalid"] ? "" : undefined}
        onClick={() => (open ? close() : openList())}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        <span
          className="ui-select-value"
          data-placeholder={selectedItems.length > 0 ? undefined : ""}
        >
          {selectedItems.length > 0
            ? selectedItems.map((item, index) => (
                <span key={item.value}>
                  {index > 0 && ", "}
                  {item.label}
                </span>
              ))
            : placeholder}
        </span>
        <ChevronDownIcon className="ui-select-chevron" data-open={open ? "" : undefined} />
      </button>

      {open && (
        // div + role — jsx-a11y strict는 ul/li에 인터랙티브 역할 부여를 금지한다.
        // 키보드는 트리거(aria-activedescendant)가 담당하므로 옵션 자체는 포커스 대상이 아니다.
        <div
          className="ui-select-list"
          role="listbox"
          id={listId}
          // role을 부여한 컨테이너는 이름을 가져야 한다. Field 안이면 그 라벨을, 아니면
          // 트리거를 가리킨다 — 이름 없는 listbox는 "목록 상자"로만 읽힌다 (Menu 리뷰 5번과 같은 유형)
          aria-labelledby={field.labelId ?? triggerId}
          aria-multiselectable={multiple || undefined}
        >
          {items.map((item, index) => (
            // activedescendant 패턴: 옵션은 설계상 포커스 대상이 아니며 키보드는 combobox(트리거)가 전담한다
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
            <div
              key={item.value}
              id={optionId(index)}
              role="option"
              aria-selected={values.includes(item.value)}
              aria-disabled={item.disabled || undefined}
              data-active={index === activeIndex ? "" : undefined}
              className="ui-select-option"
              onClick={() => selectAt(index)}
              onPointerMove={() => {
                if (!item.disabled && index !== activeIndex) setActiveIndex(index);
              }}
            >
              <span className="ui-select-option-label">{item.label}</span>
              {values.includes(item.value) && <CheckIcon className="ui-select-option-check" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
