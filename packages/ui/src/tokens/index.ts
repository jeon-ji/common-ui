/**
 * 디자인 토큰 배럴 — 토큰의 유일한 진실의 원천 (03 문서).
 * 수동 편집 대상은 이 디렉터리의 .ts 파일뿐이다. tokens.css·tailwind-preset.css는
 * scripts/build-tokens.ts가 생성하며, CI가 드리프트를 차단한다.
 */

export { type Hex, palette, paletteBase, semanticColor, type ThemedColor } from "./color.js";
export { motion, type MotionDurationKey, type MotionEasingKey } from "./motion.js";
export { radius, type RadiusKey } from "./radius.js";
export { shadow, type ShadowKey } from "./shadow.js";
export { spacing, type SpacingKey } from "./spacing.js";
export {
  fontFamily,
  typography,
  type TypographyStyle,
  type TypographyVariant,
} from "./typography.js";
export { zIndex, type ZIndexKey } from "./zIndex.js";
