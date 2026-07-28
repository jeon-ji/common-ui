import type { Ref } from "react";

/**
 * 여러 ref(포워딩된 외부 ref + 내부 측정용 ref)를 하나의 콜백 ref로 합친다.
 * 내부 전용 유틸 — public API가 아니다.
 */
export function composeRefs<T>(...refs: Array<Ref<T> | undefined>): (node: T | null) => void {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else ref.current = node;
    }
  };
}
