import "./Checkbox.css";

import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  forwardRef,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

import { useControllableState } from "../../hooks/useControllableState.js";
import { composeRefs } from "../../internal/composeRefs.js";
import { useFieldControl } from "../Field/index.js";

export interface CheckboxProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "checked" | "defaultChecked" | "onChange" | "value" | "size" | "children"
> {
  /** 제어 체크 상태 — onChange 없이 넘기면 읽기 전용으로 동작한다 */
  checked?: boolean;
  /** 비제어 초기 상태 */
  defaultChecked?: boolean;
  /** 파싱된 상태만 넘긴다 — 이벤트 객체가 아니라 boolean */
  onChange?: (checked: boolean) => void;
  /**
   * 부분 선택 상태 — 시각·DOM 프로퍼티(`el.indeterminate`)·`aria-checked="mixed"`
   * **세 곳 모두** 반영된다. 시각만 바꾸면 스크린리더가 상태를 틀리게 읽는다 (리뷰 A7)
   */
  indeterminate?: boolean;
  /** 라벨 슬롯 — label 요소가 내장되어 클릭 영역이 라벨까지 넓어진다 */
  children?: ReactNode;
}

/**
 * 체크박스. 체크 표시는 CSS로만 그린다 — 외부 파일 참조가 없어
 * "소비자 앱에서 체크가 안 보이는" 유형의 결함(리뷰 C1)이 원천 불가능하다.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    checked: checkedProp,
    defaultChecked = false,
    onChange,
    indeterminate = false,
    disabled,
    id,
    required,
    className,
    children,
    ...rest
  },
  forwardedRef,
) {
  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const field = useFieldControl(id);

  // ① DOM 프로퍼티 — indeterminate는 attribute가 없어 프로퍼티로만 설정할 수 있다
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <label
      className={["ui-checkbox", className].filter(Boolean).join(" ")}
      data-disabled={disabled ? "" : undefined}
    >
      <input
        ref={composeRefs(forwardedRef, inputRef)}
        className="ui-checkbox-input"
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        required={required ?? field.required}
        id={field.id}
        // ② 스크린리더 — checked prop만으로는 mixed를 표현할 수 없다
        aria-checked={indeterminate ? "mixed" : undefined}
        aria-describedby={field["aria-describedby"]}
        aria-invalid={field["aria-invalid"]}
        aria-errormessage={field["aria-errormessage"]}
        {...rest}
      />
      {/* ③ 시각 — 체크·바 모두 CSS ::after로만 그린다 */}
      <span className="ui-checkbox-box" data-indeterminate={indeterminate ? "" : undefined} />
      {children != null && <span className="ui-checkbox-label">{children}</span>}
    </label>
  );
});
