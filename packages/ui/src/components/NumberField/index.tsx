import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  forwardRef,
  type KeyboardEvent,
  useRef,
  useState,
} from "react";

import { composeRefs } from "../../internal/composeRefs.js";
import { useFieldControl } from "../Field/index.js";

export interface NumberFieldProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "value" | "defaultValue" | "onChange" | "type" | "min" | "max" | "step" | "size" | "children"
> {
  /** 제어 값 — 빈 입력은 null */
  value?: number | null;
  /** 비제어 초기값 */
  defaultValue?: number | null;
  /** 파싱된 숫자(또는 null)만 넘긴다 — TextField와 같은 단일 계약 */
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /**
   * ArrowUp/ArrowDown 증감 단위
   * @default 1
   */
  step?: number;
}

/** 천단위 구분 포맷 */
function format(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 20 });
}

/** 표시 문자열 → 숫자. 비어 있거나 숫자가 아니면 null */
function parse(text: string): number | null {
  const raw = text.replace(/,/g, "");
  if (raw === "" || raw === "-" || raw === "." || raw === "-.") return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

/** 숫자·부호·소수점·구분자 외 제거 — IME 조합 문자·붙여넣은 단위 텍스트를 걸러낸다 */
function sanitize(text: string): string {
  return text.replace(/[^\d.,-]/g, "");
}

function clamp(value: number, min?: number, max?: number): number {
  if (min !== undefined && value < min) return min;
  if (max !== undefined && value > max) return max;
  return value;
}

/**
 * 숫자 입력 — 파싱·천단위 포맷 내장, 외부 라이브러리 없이 자체 구현.
 * 입력 중에는 재그룹핑하지 않아 커서가 튀지 않고, blur 시점에 clamp + 포맷한다.
 */
export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  {
    value: valueProp,
    defaultValue = null,
    onChange,
    min,
    max,
    step = 1,
    disabled,
    id,
    required,
    className,
    onBlur,
    onKeyDown,
    ...rest
  },
  forwardedRef,
) {
  const [text, setText] = useState(() => {
    const initial = valueProp !== undefined ? valueProp : defaultValue;
    return initial == null ? "" : format(initial);
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const field = useFieldControl(id);

  // controlled 값이 밖에서 바뀌면(리셋 등) 표시 문자열을 동기화한다 —
  // 이펙트가 아닌 렌더 중 조정(react.dev "You Might Not Need an Effect" 패턴)
  const [prevValueProp, setPrevValueProp] = useState(valueProp);
  if (valueProp !== prevValueProp) {
    setPrevValueProp(valueProp);
    if (valueProp !== undefined && valueProp !== parse(text)) {
      setText(valueProp == null ? "" : format(valueProp));
    }
  }

  const commit = (nextText: string) => {
    setText(nextText);
    const parsed = parse(nextText);
    if (parsed !== parse(text)) onChange?.(parsed);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    commit(sanitize(event.target.value));
  };

  const setNumber = (next: number) => {
    const clamped = clamp(next, min, max);
    setText(format(clamped));
    if (clamped !== parse(text)) onChange?.(clamped);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const parsed = parse(text);
    if (parsed != null) setNumber(parsed); // clamp + 천단위 포맷
    onBlur?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const direction = event.key === "ArrowUp" ? 1 : -1;
      setNumber((parse(text) ?? 0) + direction * step);
    }
    onKeyDown?.(event);
  };

  const current = parse(text);

  return (
    <div
      className={["ui-textfield", className].filter(Boolean).join(" ")}
      data-disabled={disabled ? "" : undefined}
      data-invalid={field["aria-invalid"] ? "" : undefined}
    >
      <input
        ref={composeRefs(forwardedRef, inputRef)}
        className="ui-textfield-input"
        type="text"
        inputMode="decimal"
        role="spinbutton"
        aria-valuenow={current ?? undefined}
        aria-valuemin={min}
        aria-valuemax={max}
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        required={required ?? field.required}
        id={field.id}
        aria-describedby={field["aria-describedby"]}
        aria-invalid={field["aria-invalid"]}
        aria-errormessage={field["aria-errormessage"]}
        {...rest}
      />
    </div>
  );
});
