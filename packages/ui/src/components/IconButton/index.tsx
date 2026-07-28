import "./IconButton.css";

import { forwardRef, type ReactNode } from "react";

import { Button, type ButtonProps } from "../Button/index.js";

export interface IconButtonProps extends Omit<
  ButtonProps,
  "icon" | "iconRight" | "fullWidth" | "children" | "aria-label"
> {
  /**
   * 스크린리더용 라벨 — **타입 레벨 필수**.
   * sije-common의 "이름 없는 아이콘 버튼" 문제를 컴파일 단계에서 차단한다.
   */
  "aria-label": string;
  /** 표시할 아이콘 (단일 슬롯) */
  children: ReactNode;
}

/**
 * 아이콘 전용 정사각 버튼. 기본은 ghost·neutral — 닫기·더보기류 보조 동작에 맞는 톤이다.
 * 텍스트가 없으므로 aria-label 없이는 타입이 성립하지 않는다.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = "ghost", tone = "neutral", className, children, ...rest },
  ref,
) {
  return (
    <Button
      ref={ref}
      variant={variant}
      tone={tone}
      className={["ui-icon-button", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </Button>
  );
});
