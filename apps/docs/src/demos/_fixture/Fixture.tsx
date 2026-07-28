/**
 * 데모 블록·자동 API 표 머신 검증용 픽스처.
 * 실제 컴포넌트(Sample)가 packages/ui에 들어오면 그 문서 페이지가 이 역할을 대체한다.
 */
import { type ComponentPropsWithoutRef, forwardRef } from "react";

export interface FixtureProps extends ComponentPropsWithoutRef<"button"> {
  /** 시각 변형 */
  variant?: "solid" | "outline";
  /** 로딩 중이면 클릭이 차단된다 */
  loading?: boolean;
}

/** 문서 머신 검증용 버튼 모양 픽스처 — 배포물이 아니다 */
export const Fixture = forwardRef<HTMLButtonElement, FixtureProps>(function Fixture(
  { variant = "solid", loading = false, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled ?? loading}
      data-variant={variant}
      style={{
        padding: "var(--ui-spacing-2) var(--ui-spacing-4)",
        borderRadius: "var(--ui-radius-md)",
        border: "1px solid var(--ui-color-primary-default)",
        background: variant === "solid" ? "var(--ui-color-primary-default)" : "transparent",
        color:
          variant === "solid" ? "var(--ui-color-text-inverse)" : "var(--ui-color-primary-default)",
        font: "inherit",
        cursor: loading ? "wait" : "pointer",
      }}
      {...rest}
    >
      {loading ? "로딩…" : children}
    </button>
  );
});
