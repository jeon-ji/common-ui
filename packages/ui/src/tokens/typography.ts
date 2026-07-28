/**
 * 타이포그래피 토큰 (03 문서 §3).
 * 전역 `* { font-size }` 강제 금지 — 스타일은 컴포넌트(Text/Heading)가 소유한다.
 */

export const fontFamily = {
  sans: `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif`,
  mono: `ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`,
} as const satisfies Record<string, string>;

export interface TypographyStyle {
  readonly fontSize: `${number}rem`;
  readonly lineHeight: `${number}rem`;
  readonly fontWeight: 400 | 500 | 600 | 700;
}

export const typography = {
  display: { fontSize: "2.5rem", lineHeight: "3.25rem", fontWeight: 700 },
  h1: { fontSize: "2rem", lineHeight: "2.75rem", fontWeight: 700 },
  h2: { fontSize: "1.5rem", lineHeight: "2.125rem", fontWeight: 600 },
  h3: { fontSize: "1.25rem", lineHeight: "1.75rem", fontWeight: 600 },
  body1: { fontSize: "1rem", lineHeight: "1.5rem", fontWeight: 400 },
  body2: { fontSize: "0.875rem", lineHeight: "1.3125rem", fontWeight: 400 },
  caption: { fontSize: "0.75rem", lineHeight: "1.125rem", fontWeight: 400 },
  code: { fontSize: "0.875rem", lineHeight: "1.3125rem", fontWeight: 400 },
} as const satisfies Record<string, TypographyStyle>;

export type TypographyVariant = keyof typeof typography;
