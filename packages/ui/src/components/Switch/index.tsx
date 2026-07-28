import "./Switch.css";

import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from "react";

import { useControllableState } from "../../hooks/useControllableState.js";
import { useFieldControl } from "../Field/index.js";

export interface SwitchProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "type" | "onChange" | "value" | "children" | "role"
> {
  /** 제어 상태 */
  checked?: boolean;
  /** 비제어 초기 상태 */
  defaultChecked?: boolean;
  /** 파싱된 상태만 넘긴다 — 이벤트 객체가 아니라 boolean */
  onChange?: (checked: boolean) => void;
  /**
   * 크기 2단
   * @default "md"
   */
  size?: "sm" | "md";
  /** 라벨 슬롯 */
  children?: ReactNode;
}

/**
 * 온/오프 토글. sije-common InputToggle(`styled.div`+onClick뿐)의 전면 재설계 —
 * `<button role="switch">` + `aria-checked`가 기본이라 Space/Enter 토글과 포커스가
 * 네이티브로 동작한다 (리뷰 A8).
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked: checkedProp,
    defaultChecked = false,
    onChange,
    size = "md",
    disabled,
    id,
    className,
    onClick,
    ...rest
  },
  ref,
) {
  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange,
  });
  const field = useFieldControl(id);

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      data-size={size}
      disabled={disabled}
      id={field.id}
      aria-describedby={field["aria-describedby"]}
      aria-invalid={field["aria-invalid"]}
      aria-errormessage={field["aria-errormessage"]}
      className={["ui-switch", className].filter(Boolean).join(" ")}
      onClick={(event) => {
        setChecked((prev) => !prev);
        onClick?.(event);
      }}
      {...rest}
    >
      <span className="ui-switch-thumb" aria-hidden="true" />
    </button>
  );
});
