import { useCallback, useEffect, useRef, useState } from "react";

export interface UseControllableStateOptions<T> {
  /** 지정하면 controlled — 표시 값은 항상 이 값이다 */
  value?: T;
  /** uncontrolled일 때의 초기값 */
  defaultValue: T;
  /** 값이 바뀔 때 호출 — controlled/uncontrolled 모두 동일하게 불린다 */
  onChange?: (value: T) => void;
}

/**
 * controlled/uncontrolled 전환을 한 곳에서 처리한다 — 전 폼 컴포넌트의 기반.
 *
 * 계약:
 * - `value !== undefined`면 controlled — 내부 상태를 두지 않고 onChange만 호출한다
 * - setter는 값 또는 업데이터 함수를 받고, 정체성이 렌더 간 불변이다
 * - 같은 값으로의 set은 onChange를 호출하지 않는다 (Object.is)
 * - onChange는 setState 업데이터 밖에서 호출한다 — StrictMode의 업데이터 이중 실행에도
 *   콜백이 두 번 불리지 않는다
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: T | ((prev: T) => T)) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  // 최신 상태를 ref에 커밋 후 보관 — setter 정체성을 불변으로 유지하기 위한 장치.
  // 이벤트 핸들러는 커밋 이후에 실행되므로 ref는 항상 최신이다.
  const currentRef = useRef(current);
  const isControlledRef = useRef(isControlled);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    currentRef.current = current;
    isControlledRef.current = isControlled;
    onChangeRef.current = onChange;
  });

  const setValue = useCallback((next: T | ((prev: T) => T)) => {
    const prev = currentRef.current;
    const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
    if (Object.is(resolved, prev)) return;

    if (!isControlledRef.current) {
      currentRef.current = resolved; // 같은 이벤트 안의 연속 set도 최신값을 보게 한다
      setInternal(resolved);
    }
    onChangeRef.current?.(resolved);
  }, []);

  return [current, setValue];
}
