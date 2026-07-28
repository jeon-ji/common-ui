import { useEffect } from "react";

// body는 DOM 싱글턴이므로 참조 카운트도 모듈 레벨이 올바른 모델이다 —
// A2(전역 스토어 금지)는 앱 상태에 관한 규칙이지 DOM 자원 조정에 관한 것이 아니다.
let lockCount = 0;
let originalOverflow = "";

/**
 * active 동안 body 스크롤을 잠근다 — 참조 카운팅이라 중첩 오버레이 중 하나가
 * 닫혀도 잠금이 유지되고, 마지막 잠금 해제 시 **원래 값으로 복원**한다 (리뷰 A4).
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, [active]);
}
