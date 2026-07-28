/**
 * 컬러 토큰 — primitive → semantic 2계층 (03 문서 §2).
 *
 * - primitive(palette): 숫자 스케일만. 컴포넌트가 직접 참조하는 것 금지 —
 *   CSS 변수 자체를 생성하지 않아 구조적으로 참조가 불가능하다.
 * - semantic: 컴포넌트가 참조하는 유일한 계층. 값은 반드시 palette를 참조한다
 *   (hex 직접 기입은 validate-tokens가 차단).
 * - 다크 테마는 semantic의 dark 값만 재정의된다. primitive는 테마 불변.
 */

export type Hex = `#${string}`;

/** 스케일에 속하지 않는 기저색 */
export const paletteBase = {
  white: "#ffffff",
  black: "#000000",
} as const satisfies Record<string, Hex>;

type PaletteScale = Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, Hex>;

export const palette = {
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  brand: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },
  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
} as const satisfies Record<string, PaletteScale>;

/** 테마별 semantic 값 — light는 `:root`, dark는 `[data-theme="dark"]`로 생성된다 */
export interface ThemedColor {
  readonly light: Hex;
  readonly dark: Hex;
}

export const semanticColor = {
  bg: {
    default: { light: paletteBase.white, dark: palette.gray[900] },
    subtle: { light: palette.gray[50], dark: palette.gray[800] },
    muted: { light: palette.gray[100], dark: palette.gray[700] },
  },
  text: {
    primary: { light: palette.gray[900], dark: palette.gray[50] },
    secondary: { light: palette.gray[600], dark: palette.gray[300] },
    disabled: { light: palette.gray[400], dark: palette.gray[600] },
    inverse: { light: paletteBase.white, dark: palette.gray[900] },
  },
  border: {
    default: { light: palette.gray[200], dark: palette.gray[700] },
    strong: { light: palette.gray[400], dark: palette.gray[500] },
  },
  primary: {
    default: { light: palette.brand[600], dark: palette.brand[500] },
    hover: { light: palette.brand[700], dark: palette.brand[400] },
    active: { light: palette.brand[800], dark: palette.brand[300] },
    subtle: { light: palette.brand[50], dark: palette.brand[900] },
  },
  danger: {
    default: { light: palette.red[600], dark: palette.red[500] },
    hover: { light: palette.red[700], dark: palette.red[400] },
    subtle: { light: palette.red[50], dark: palette.red[900] },
    text: { light: palette.red[700], dark: palette.red[300] },
  },
  success: {
    default: { light: palette.green[600], dark: palette.green[500] },
    hover: { light: palette.green[700], dark: palette.green[400] },
    subtle: { light: palette.green[50], dark: palette.green[900] },
    text: { light: palette.green[700], dark: palette.green[300] },
  },
  warning: {
    default: { light: palette.amber[500], dark: palette.amber[400] },
    hover: { light: palette.amber[600], dark: palette.amber[300] },
    subtle: { light: palette.amber[50], dark: palette.amber[900] },
    text: { light: palette.amber[700], dark: palette.amber[300] },
  },
  info: {
    default: { light: palette.blue[600], dark: palette.blue[500] },
    hover: { light: palette.blue[700], dark: palette.blue[400] },
    subtle: { light: palette.blue[50], dark: palette.blue[900] },
    text: { light: palette.blue[700], dark: palette.blue[300] },
  },
} as const satisfies Record<string, Record<string, ThemedColor>>;
