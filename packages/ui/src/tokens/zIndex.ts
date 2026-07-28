/**
 * z-index 토큰 (03 문서 §3).
 *
 * 규칙(sije-common 계승 — 3곳 분산으로 한 칸씩 어긋났던 사고 C3의 재발 방지):
 * - 계층 간 간격은 100 단위 — 계층 사이에 새 계층이 필요해져도 재배열 없이 끼워 넣는다.
 * - 같은 계층 안의 중첩(모달 위의 모달 등)은 +1씩만 올린다.
 * - **어떤 파일에도 z-index 숫자 리터럴 금지** — 항상 이 토큰의 CSS 변수를 참조한다.
 * - 단조 증가는 validate-tokens가 assert 한다.
 */

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1700,
} as const satisfies Record<string, number>;

export type ZIndexKey = keyof typeof zIndex;
