import "./Textarea.css";

import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useRef,
} from "react";

import { useControllableState } from "../../hooks/useControllableState.js";
import { composeRefs } from "../../internal/composeRefs.js";
import { useFieldControl } from "../Field/index.js";

export interface TextareaProps extends Omit<
  ComponentPropsWithoutRef<"textarea">,
  "value" | "defaultValue" | "onChange" | "children"
> {
  /** 제어 값 */
  value?: string;
  /** 비제어 초기값 */
  defaultValue?: string;
  /** 파싱된 값만 넘긴다 — TextField와 같은 단일 계약 */
  onChange?: (value: string) => void;
  /** 내용 높이에 맞춰 자동으로 늘어난다 (rows가 최소 높이) */
  autoResize?: boolean;
  /** 지정하면 우하단에 글자 수 카운터를 표시하고 입력을 제한한다 */
  maxLength?: number;
}

/** 여러 줄 텍스트 입력 — Field 래퍼 공유, autoResize·maxLength 카운터 내장. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    value: valueProp,
    defaultValue = "",
    onChange,
    autoResize = false,
    maxLength,
    rows = 3,
    disabled,
    id,
    required,
    className,
    ...rest
  },
  forwardedRef,
) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange,
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const field = useFieldControl(id);

  // 내용이 바뀔 때마다 스크롤 높이에 맞춘다 — DOM 스타일 쓰기만 하므로 렌더 루프가 없다
  useEffect(() => {
    const el = textareaRef.current;
    if (!autoResize || !el) return;
    el.style.height = "auto";
    el.style.height = `${String(el.scrollHeight)}px`;
  }, [autoResize, value]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  return (
    <div
      className={["ui-textarea", className].filter(Boolean).join(" ")}
      data-disabled={disabled ? "" : undefined}
      data-invalid={field["aria-invalid"] ? "" : undefined}
    >
      <textarea
        ref={composeRefs(forwardedRef, textareaRef)}
        className="ui-textarea-input"
        value={value}
        onChange={handleChange}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        required={required ?? field.required}
        id={field.id}
        aria-describedby={field["aria-describedby"]}
        aria-invalid={field["aria-invalid"]}
        aria-errormessage={field["aria-errormessage"]}
        data-auto-resize={autoResize ? "" : undefined}
        {...rest}
      />
      {maxLength !== undefined && (
        <span className="ui-textarea-counter" aria-hidden="true">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
});
