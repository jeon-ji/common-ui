import "./Text.css";

import { type ComponentPropsWithoutRef, type CSSProperties, forwardRef, useRef } from "react";

import { composeRefs } from "../../internal/composeRefs.js";
import type { TypographyVariant } from "../../tokens/typography.js";
import { useTruncationOverflow } from "./useTruncationOverflow.js";

type TextTag = "span" | "p" | "div" | "label" | "strong" | "em" | "code" | "small";
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type HeadingVariant = Extract<TypographyVariant, "display" | "h1" | "h2" | "h3">;

export interface TextProps extends ComponentPropsWithoutRef<"span"> {
  /**
   * 타이포 토큰 스케일 — 스타일 값은 토큰만 참조한다
   * @default "body1"
   */
  variant?: TypographyVariant;
  /**
   * 렌더할 시맨틱 태그
   * @default "span"
   */
  as?: TextTag;
  /** 1줄 말줄임 — 잘렸을 때만 title로 전체 텍스트를 노출한다 */
  ellipsis?: boolean;
  /** n줄 말줄임 (ellipsis와 동시 지정 시 lineClamp 우선) */
  lineClamp?: number;
}

/** 잘렸을 때만 title을 붙이기 위한 공통 구현 — Text와 Heading이 공유한다 */
function useTruncationTitle(
  enabled: boolean,
  children: TextProps["children"],
): {
  ref: ReturnType<typeof useRef<HTMLElement | null>>;
  title: string | undefined;
} {
  const ref = useRef<HTMLElement | null>(null);
  const truncated = useTruncationOverflow(ref);
  const title = enabled && truncated && typeof children === "string" ? children : undefined;
  return { ref, title };
}

/**
 * 본문 텍스트. 타이포 스케일은 `variant`로만 소비한다 —
 * 전역 `* { font-size }` 강제 없이 스타일은 이 컴포넌트가 소유한다.
 */
export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { variant = "body1", as: Tag = "span", ellipsis, lineClamp, className, children, ...rest },
  forwardedRef,
) {
  const truncating = Boolean(ellipsis) || typeof lineClamp === "number";
  const { ref, title } = useTruncationTitle(truncating, children);

  return (
    <Tag
      // 동적 태그라 ref 타입이 넓다 — 측정용 내부 ref와 외부 ref를 합성
      ref={composeRefs<never>(forwardedRef as never, ref as never)}
      data-variant={variant}
      data-ellipsis={ellipsis && lineClamp === undefined ? "" : undefined}
      data-line-clamp={typeof lineClamp === "number" ? "" : undefined}
      style={
        typeof lineClamp === "number"
          ? ({ "--ui-text-line-clamp": lineClamp } as CSSProperties)
          : undefined
      }
      title={title}
      className={["ui-text", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export interface HeadingProps extends ComponentPropsWithoutRef<"h1"> {
  /**
   * 제목 스케일 (display·h1~h3)
   * @default "h2"
   */
  variant?: HeadingVariant;
  /**
   * 렌더할 헤딩 태그 — 문서 구조(레벨)와 시각 스케일을 분리해 지정할 수 있다.
   * 기본값은 variant와 같은 레벨 (display는 h1)
   */
  as?: HeadingTag;
}

const HEADING_TAG: Record<HeadingVariant, HeadingTag> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
};

/** 제목 텍스트 — 시각 스케일(variant)과 문서 레벨(as)을 분리해 다룬다. */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { variant = "h2", as, className, children, ...rest },
  forwardedRef,
) {
  const Tag = as ?? HEADING_TAG[variant];

  return (
    <Tag
      ref={forwardedRef}
      data-variant={variant}
      className={["ui-text", "ui-heading", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
});
