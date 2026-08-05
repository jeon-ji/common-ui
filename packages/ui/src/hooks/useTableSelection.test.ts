import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { useTableSelection, type UseTableSelectionOptions } from "./useTableSelection.js";

const page1 = ["a", "b", "c"];

test("비제어: toggle로 선택하고 다시 눌러 해제한다", () => {
  const { result } = renderHook(() => useTableSelection({ keys: page1 }));
  expect(result.current.selectedKeys).toEqual([]);

  act(() => {
    result.current.toggle("b");
  });
  expect(result.current.selectedKeys).toEqual(["b"]);
  expect(result.current.isSelected("b")).toBe(true);

  act(() => {
    result.current.toggle("b");
  });
  expect(result.current.selectedKeys).toEqual([]);
});

test("allState: none → some → all", () => {
  const { result } = renderHook(() => useTableSelection({ keys: page1 }));
  expect(result.current.allState).toBe("none");

  act(() => {
    result.current.toggle("a");
  });
  expect(result.current.allState).toBe("some");

  act(() => {
    result.current.toggle("b");
    result.current.toggle("c");
  });
  expect(result.current.allState).toBe("all");
});

test("disabledKeys는 toggle이 건드리지 않고 isDisabled로 드러난다", () => {
  const { result } = renderHook(() => useTableSelection({ keys: page1, disabledKeys: ["b"] }));

  expect(result.current.isDisabled("b")).toBe(true);
  expect(result.current.isDisabled("a")).toBe(false);

  act(() => {
    result.current.toggle("b");
  });
  expect(result.current.selectedKeys).toEqual([]);
});

test("allState의 분모에서 비활성 행을 뺀다", () => {
  const { result } = renderHook(() => useTableSelection({ keys: page1, disabledKeys: ["c"] }));

  act(() => {
    result.current.toggleAll();
  });
  // 비활성 c는 선택되지 않지만, 조작 가능한 것을 전부 골랐으므로 "all"이다.
  // c를 분모에 넣으면 더 고를 수 없는데도 헤더가 영원히 "일부 선택"으로 남는다
  expect(result.current.selectedKeys).toEqual(["a", "b"]);
  expect(result.current.allState).toBe("all");
});

test("선택 가능한 행이 하나도 없으면 allState는 none이고 toggleAll은 아무것도 하지 않는다", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useTableSelection({ keys: page1, disabledKeys: page1, onChange }),
  );

  expect(result.current.allState).toBe("none");
  act(() => {
    result.current.toggleAll();
  });
  expect(onChange).not.toHaveBeenCalled();
});

test("toggleAll: 전부 고르고, 다시 누르면 전부 푼다", () => {
  const { result } = renderHook(() => useTableSelection({ keys: page1 }));

  act(() => {
    result.current.toggleAll();
  });
  expect(result.current.selectedKeys).toEqual(["a", "b", "c"]);

  act(() => {
    result.current.toggleAll();
  });
  expect(result.current.selectedKeys).toEqual([]);
});

test("toggleAll: 일부만 선택된 상태에서는 나머지를 채운다", () => {
  const { result } = renderHook(() => useTableSelection({ keys: page1, defaultValue: ["b"] }));

  act(() => {
    result.current.toggleAll();
  });
  expect(result.current.selectedKeys).toEqual(["b", "a", "c"]);
});

test("keys가 바뀌어도 화면을 벗어난 선택은 남는다", () => {
  const { result, rerender } = renderHook(
    (props: UseTableSelectionOptions) => useTableSelection(props),
    { initialProps: { keys: page1 } },
  );

  act(() => {
    result.current.toggle("a");
  });
  // 페이지 이동 — 선택된 "a"는 더 이상 화면에 없다
  rerender({ keys: ["d", "e"] });

  // 자동으로 걷어내지 않는다: 3페이지에서 고른 것이 4페이지에 다녀오면 사라지는 동작을 막는다
  expect(result.current.selectedKeys).toEqual(["a"]);
  // 다만 헤더 상태는 지금 화면 기준이다 — 보이는 두 행 중 선택된 것이 없다
  expect(result.current.allState).toBe("none");
});

test("toggleAll은 다른 페이지의 선택을 지우지 않는다", () => {
  const { result, rerender } = renderHook(
    (props: UseTableSelectionOptions) => useTableSelection(props),
    { initialProps: { keys: page1 } },
  );

  act(() => {
    result.current.toggle("a");
  });
  rerender({ keys: ["d", "e"] });

  act(() => {
    result.current.toggleAll();
  });
  expect(result.current.selectedKeys).toEqual(["a", "d", "e"]);

  act(() => {
    result.current.toggleAll(); // 지금 화면만 푼다
  });
  expect(result.current.selectedKeys).toEqual(["a"]);
});

test("clear는 화면 밖 선택까지 전부 비운다", () => {
  const { result, rerender } = renderHook(
    (props: UseTableSelectionOptions) => useTableSelection(props),
    { initialProps: { keys: page1 } },
  );

  act(() => {
    result.current.toggleAll();
  });
  rerender({ keys: ["d", "e"] });
  act(() => {
    result.current.clear();
  });
  expect(result.current.selectedKeys).toEqual([]);
});

test("이미 비어 있으면 clear가 onChange를 부르지 않는다", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() => useTableSelection({ keys: page1, onChange }));

  act(() => {
    result.current.clear();
  });
  expect(onChange).not.toHaveBeenCalled();
});

test("controlled: 값은 부모 소유이고 onChange만 호출된다", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() => useTableSelection({ keys: page1, value: ["a"], onChange }));

  act(() => {
    result.current.toggle("b");
  });
  expect(onChange).toHaveBeenCalledExactlyOnceWith(["a", "b"]);
  // 부모가 갱신하지 않았으므로 표시 값은 그대로다
  expect(result.current.selectedKeys).toEqual(["a"]);
});

test("defaultValue로 초기 선택을 준다", () => {
  const { result } = renderHook(() => useTableSelection({ keys: page1, defaultValue: ["c"] }));
  expect(result.current.selectedKeys).toEqual(["c"]);
  expect(result.current.allState).toBe("some");
});
