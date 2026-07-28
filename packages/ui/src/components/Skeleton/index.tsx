import "./Skeleton.css";

import { type ComponentPropsWithoutRef, forwardRef } from "react";

export interface SkeletonProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * 자리 표시 형태 — text는 줄 높이, rect는 블록, circle은 원
   * @default "text"
   */
  variant?: "text" | "rect" | "circle";
  /** 너비 (숫자는 px) */
  width?: number | string;
  /** 높이 (숫자는 px) */
  height?: number | string;
}

/** 로딩 중 콘텐츠 자리 표시. 장식 요소이므로 스크린리더에는 노출하지 않는다. */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant = "text", width, height, className, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-variant={variant}
      className={["ui-skeleton", className].filter(Boolean).join(" ")}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
});
