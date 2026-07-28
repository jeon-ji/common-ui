/** 모서리 반경 토큰 (03 문서 §3) */

export const radius = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  full: "9999px",
} as const satisfies Record<string, `${number}px`>;

export type RadiusKey = keyof typeof radius;
