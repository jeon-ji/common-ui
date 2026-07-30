import { createContext, type ReactNode, use, useEffect, useMemo, useRef, useState } from "react";

/**
 * 오버레이 스택 — Escape는 스택 최상단 소유자만 처리한다 (리뷰 A4·D3의 근본 해결).
 * 스토어는 Provider 인스턴스마다 팩토리로 생성한다 — 전역 싱글턴 금지 (리뷰 A2).
 */

export interface OverlayStack {
  push(id: symbol): void;
  remove(id: symbol): void;
  isTop(id: symbol): boolean;
  size(): number;
}

export function createOverlayStack(): OverlayStack {
  const stack: symbol[] = [];
  return {
    push(id) {
      stack.push(id);
    },
    remove(id) {
      const index = stack.indexOf(id);
      if (index >= 0) stack.splice(index, 1);
    },
    isTop(id) {
      return stack[stack.length - 1] === id;
    },
    size() {
      return stack.length;
    },
  };
}

const OverlayStackContext = createContext<OverlayStack | null>(null);

/**
 * 오버레이 스택의 경계. 중첩 오버레이(모달 위의 모달)의 Escape 소유권을 올바르게
 * 판정하려면 공통 조상에 이 Provider가 있어야 한다 — 없으면 각 오버레이가 자기만의
 * 스택을 갖게 되어 Escape 한 번에 전부 닫힌다.
 */
export function OverlayProvider({ children }: { children: ReactNode }) {
  const [stack] = useState(createOverlayStack);
  return <OverlayStackContext value={stack}>{children}</OverlayStackContext>;
}

export interface OverlayLayer {
  /**
   * 이 오버레이가 스택 최상단 소유자인지 — Escape 외의 소유권 판정에도 쓴다.
   * 예: 바깥 클릭 닫힘은 최상단만 처리해야 중첩 오버레이(팝오버 안의 메뉴)의
   * 패널 클릭이 상위를 닫지 않는다. 포털은 body 형제로 붙으므로 DOM 포함 검사만으로는
   * 중첩을 판정할 수 없다.
   */
  isTop(): boolean;
}

/**
 * active 동안 스택에 등록하고, 자신이 최상단일 때의 Escape만 처리한다.
 * document 레벨 리스너라 포커스가 어디에 있어도 동작하며, 하위 오버레이의
 * 리스너는 isTop 검사에서 조용히 물러난다 — stopPropagation 경쟁이 없다.
 */
export function useOverlayLayer(active: boolean, onEscape: () => void): OverlayLayer {
  const contextStack = use(OverlayStackContext);
  const [ownStack] = useState(createOverlayStack);
  const stack = contextStack ?? ownStack;
  const [id] = useState(() => Symbol("overlay"));

  const onEscapeRef = useRef(onEscape);
  useEffect(() => {
    onEscapeRef.current = onEscape;
  });

  useEffect(() => {
    if (!active) return;

    stack.push(id);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || !stack.isTop(id)) return;
      event.preventDefault(); // 소유권 확인 후에만 소비를 표시한다 (전역 규칙 15)
      onEscapeRef.current();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      stack.remove(id);
    };
  }, [active, stack, id]);

  // 정체성 고정 — 소비자가 이펙트 deps에 그대로 넣을 수 있어야 한다
  return useMemo(() => ({ isTop: () => stack.isTop(id) }), [stack, id]);
}
