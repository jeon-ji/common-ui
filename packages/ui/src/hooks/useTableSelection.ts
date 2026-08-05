import { useCallback, useMemo } from "react";

import type { TableSelection } from "../components/Table/index.js";
import { useControllableState } from "./useControllableState.js";

export interface UseTableSelectionOptions {
  /**
   * 지금 화면에 있는 전체 행 키. `allState`와 `toggleAll`의 범위가 이것이다 —
   * 페이지를 넘기면 이 배열만 바뀌고 선택은 유지된다
   */
  keys: string[];
  /** 지정하면 controlled */
  value?: string[];
  /** uncontrolled일 때의 초기 선택 */
  defaultValue?: string[];
  /** 선택이 바뀔 때 호출 — 선택된 키 배열만 넘긴다 */
  onChange?: (keys: string[]) => void;
  /** 선택할 수 없는 행 — `toggle`·`toggleAll`이 건드리지 않고 체크박스가 비활성으로 그려진다 */
  disabledKeys?: string[];
}

/**
 * 표 행 선택 상태 — sije-common `useCheckbox`를 흡수한 재설계.
 *
 * 원본은 훅이 체크박스 UI까지 만들었다. 여기서는 **상태와 헬퍼만** 돌려주고 체크박스 열은
 * Table이 `selection` prop을 받아 그린다 (전역 규칙 13).
 *
 * **`keys`가 바뀌어도 사라진 키를 선택에서 걷어내지 않는다.** 필터·페이지 이동으로 화면을
 * 벗어난 행의 선택을 지우면 "3페이지에서 고른 항목이 4페이지로 갔다 오니 사라지는" 동작이 된다.
 * 제어 값을 몰래 고치지 않는다는 원칙이기도 하다 (전역 규칙 25). 대신 `allState`는 **언제나
 * 현재 `keys` 기준으로** 계산하므로 헤더 체크박스는 지금 보이는 화면을 정확히 말한다.
 *
 * 화면 밖 선택까지 비우려면 `clear()`를 쓴다 — 그것이 유일하게 전체를 비우는 동작이다.
 */
export function useTableSelection({
  keys,
  value,
  defaultValue = [],
  onChange,
  disabledKeys,
}: UseTableSelectionOptions): TableSelection {
  const [selectedKeys, setSelectedKeys] = useControllableState<string[]>({
    value,
    defaultValue,
    onChange,
  });

  const disabled = useMemo(() => new Set(disabledKeys), [disabledKeys]);
  const selected = useMemo(() => new Set(selectedKeys), [selectedKeys]);

  // 사용자가 실제로 조작할 수 있는 행 — allState·toggleAll의 분모다.
  // 비활성 행을 분모에 넣으면 "전부 선택했는데 헤더가 일부 선택으로 남는" 상태가 된다
  const selectable = useMemo(() => keys.filter((key) => !disabled.has(key)), [keys, disabled]);

  const allState = useMemo<TableSelection["allState"]>(() => {
    if (selectable.length === 0) return "none";
    const count = selectable.filter((key) => selected.has(key)).length;
    if (count === 0) return "none";
    return count === selectable.length ? "all" : "some";
  }, [selectable, selected]);

  const isSelected = useCallback((key: string) => selected.has(key), [selected]);
  const isDisabled = useCallback((key: string) => disabled.has(key), [disabled]);

  const toggle = useCallback(
    (key: string) => {
      if (disabled.has(key)) return;
      setSelectedKeys((prev) =>
        prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
      );
    },
    [disabled, setSelectedKeys],
  );

  const toggleAll = useCallback(() => {
    setSelectedKeys((prev) => {
      if (selectable.length === 0) return prev; // 같은 배열을 돌려줘 onChange가 헛돌지 않게 한다
      const prevSet = new Set(prev);
      const everySelected = selectable.every((key) => prevSet.has(key));

      if (everySelected) {
        // 지금 화면의 선택만 걷어낸다 — 다른 페이지에서 고른 것은 남긴다
        const remove = new Set(selectable);
        return prev.filter((key) => !remove.has(key));
      }
      const added = selectable.filter((key) => !prevSet.has(key));
      return added.length === 0 ? prev : [...prev, ...added];
    });
  }, [selectable, setSelectedKeys]);

  const clear = useCallback(() => {
    setSelectedKeys((prev) => (prev.length === 0 ? prev : []));
  }, [setSelectedKeys]);

  return { selectedKeys, isSelected, isDisabled, toggle, toggleAll, allState, clear };
}
