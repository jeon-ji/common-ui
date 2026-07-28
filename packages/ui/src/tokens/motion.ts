/** 모션 토큰 (03 문서 §3) — duration 3단 + easing 2종 */

export const motion = {
  duration: {
    fast: "100ms",
    normal: "200ms",
    slow: "300ms",
  },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    emphasized: "cubic-bezier(0.3, 0, 0.8, 0.15)",
  },
} as const satisfies {
  duration: Record<string, `${number}ms`>;
  easing: Record<string, string>;
};

export type MotionDurationKey = keyof typeof motion.duration;
export type MotionEasingKey = keyof typeof motion.easing;
