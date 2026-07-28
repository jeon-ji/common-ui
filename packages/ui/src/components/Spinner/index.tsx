import "./Spinner.css";

import { type ComponentPropsWithoutRef, forwardRef } from "react";

export interface SpinnerProps extends ComponentPropsWithoutRef<"span"> {
  /**
   * 크기 3단
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * 스크린리더용 라벨
   * @default "로딩 중"
   */
  "aria-label"?: string;
}

/** 진행 상태 표시. Button loading·Table 로딩의 기반. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = "md", className, "aria-label": ariaLabel = "로딩 중", ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role="status"
      aria-label={ariaLabel}
      data-size={size}
      className={["ui-spinner", className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
});
