/**
 * 간격 토큰 — 4px 그리드 (03 문서 §3).
 * 키는 4px 배수(예: `4` = 16px). CSS 변수명에서 `.`은 `_`로 치환된다(`--ui-spacing-0_5`).
 */

export const spacing = {
  "0": "0px",
  "0.5": "2px",
  "1": "4px",
  "1.5": "6px",
  "2": "8px",
  "3": "12px",
  "4": "16px",
  "5": "20px",
  "6": "24px",
  "8": "32px",
  "10": "40px",
  "12": "48px",
  "16": "64px",
  "20": "80px",
  "24": "96px",
} as const satisfies Record<string, `${number}px`>;

export type SpacingKey = keyof typeof spacing;
