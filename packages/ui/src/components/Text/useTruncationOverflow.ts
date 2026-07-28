import { type RefObject, useEffect, useState } from "react";

/**
 * 요소가 실제로 잘렸는지(ellipsis/lineClamp) 감지한다 — Text 내부 전용.
 *
 * sije-common `useTruncationOverflow`(레포 최고 품질 코드)의 패턴 계승:
 * - **싱글턴 ResizeObserver** 하나가 모든 구독 요소를 관찰하고 콜백 맵으로 분배한다
 *   (요소마다 옵저버를 만들지 않는다)
 * - SSR 가드: ResizeObserver 부재 환경에서는 조용히 no-op
 * - 초기 판정도 옵저버의 최초 알림(관찰 시작 시 1회 발화)에 맡긴다 —
 *   이펙트 본문 동기 setState 없음
 */

const callbacks = new Map<Element, () => void>();
let observer: ResizeObserver | null = null;

function ensureObserver(): ResizeObserver {
  observer ??= new ResizeObserver((entries) => {
    for (const entry of entries) callbacks.get(entry.target)?.();
  });
  return observer;
}

export function useTruncationOverflow(ref: RefObject<HTMLElement | null>): boolean {
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const check = () => {
      setTruncated(el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight);
    };

    callbacks.set(el, check);
    ensureObserver().observe(el);

    return () => {
      callbacks.delete(el);
      observer?.unobserve(el);
    };
  }, [ref]);

  return truncated;
}
