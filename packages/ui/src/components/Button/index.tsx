import "./Button.css";

import { type ComponentPropsWithoutRef, forwardRef, type MouseEvent, type ReactNode } from "react";

import { Spinner } from "../Spinner/index.js";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  /**
   * 시각 변형
   * @default "solid"
   */
  variant?: "solid" | "outline" | "ghost";
  /**
   * 색 톤 — 파생 버튼(BtnDelete 등)을 만들지 않고 조합으로 표현한다
   * @default "primary"
   */
  tone?: "primary" | "neutral" | "danger";
  /**
   * 크기
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * 로딩 중 — Spinner를 표시하고 클릭을 차단한다.
   * 포커스를 잃지 않도록 native disabled 대신 aria-busy + 클릭 억제를 쓴다.
   */
  loading?: boolean;
  /** 텍스트 앞 아이콘 슬롯 (loading 중에는 Spinner로 대체) */
  icon?: ReactNode;
  /** 텍스트 뒤 아이콘 슬롯 */
  iconRight?: ReactNode;
  /** 부모 너비를 가득 채운다 */
  fullWidth?: boolean;
}

/**
 * 기본 버튼. `type="button"`이 기본값이다 — form 안에서 의도치 않은 submit을 막는다.
 * 포커스 링은 `:focus-visible`로만 그린다 (마우스 클릭에는 링 없음).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "solid",
    tone = "primary",
    size = "md",
    loading = false,
    icon,
    iconRight,
    fullWidth,
    type = "button",
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      type={type}
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-loading={loading ? "" : undefined}
      data-full-width={fullWidth ? "" : undefined}
      aria-busy={loading || undefined}
      className={["ui-button", className].filter(Boolean).join(" ")}
      onClick={handleClick}
      {...rest}
    >
      {loading ? <Spinner size="sm" aria-label="처리 중" /> : icon}
      {children}
      {iconRight}
    </button>
  );
});
