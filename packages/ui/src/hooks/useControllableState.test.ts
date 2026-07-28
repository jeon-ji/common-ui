import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { useControllableState } from "./useControllableState.js";

test("uncontrolled: defaultValue로 시작하고 set으로 갱신된다", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() => useControllableState({ defaultValue: "a", onChange }));
  expect(result.current[0]).toBe("a");

  act(() => result.current[1]("b"));
  expect(result.current[0]).toBe("b");
  expect(onChange).toHaveBeenCalledExactlyOnceWith("b");
});

test("uncontrolled: 업데이터 함수가 이전 값을 받는다", () => {
  const { result } = renderHook(() => useControllableState({ defaultValue: 1 }));
  act(() => result.current[1]((prev) => prev + 1));
  act(() => result.current[1]((prev) => prev + 1));
  expect(result.current[0]).toBe(3);
});

test("uncontrolled: 같은 이벤트 안의 연속 set도 최신값을 본다", () => {
  const { result } = renderHook(() => useControllableState({ defaultValue: 0 }));
  act(() => {
    result.current[1]((prev) => prev + 1);
    result.current[1]((prev) => prev + 1);
  });
  expect(result.current[0]).toBe(2);
});

test("controlled: 표시 값은 항상 value prop이고 set은 onChange만 호출한다", () => {
  const onChange = vi.fn();
  const { result, rerender } = renderHook(
    ({ value }) => useControllableState({ value, defaultValue: "x", onChange }),
    { initialProps: { value: "v1" } },
  );
  expect(result.current[0]).toBe("v1");

  act(() => result.current[1]("v2"));
  expect(onChange).toHaveBeenCalledExactlyOnceWith("v2");
  expect(result.current[0]).toBe("v1"); // 부모가 갱신하기 전까지 그대로

  rerender({ value: "v2" });
  expect(result.current[0]).toBe("v2");
});

test("controlled: 업데이터가 현재 controlled 값을 받는다", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useControllableState({ value: 10, defaultValue: 0, onChange }),
  );
  act(() => result.current[1]((prev) => prev + 5));
  expect(onChange).toHaveBeenCalledExactlyOnceWith(15);
});

test("같은 값으로의 set은 onChange를 호출하지 않는다", () => {
  const onChange = vi.fn();
  const { result } = renderHook(() => useControllableState({ defaultValue: "same", onChange }));
  act(() => result.current[1]("same"));
  expect(onChange).not.toHaveBeenCalled();
  expect(result.current[0]).toBe("same");
});

test("setter 정체성이 렌더 간 불변이다", () => {
  const { result, rerender } = renderHook(
    ({ value }) => useControllableState({ value, defaultValue: 0 }),
    { initialProps: { value: 1 } },
  );
  const firstSetter = result.current[1];
  rerender({ value: 2 });
  expect(result.current[1]).toBe(firstSetter);
});

test("최신 onChange를 호출한다 (핸들러 교체 후)", () => {
  const first = vi.fn();
  const second = vi.fn();
  const { result, rerender } = renderHook(
    ({ onChange }) => useControllableState({ defaultValue: 0, onChange }),
    { initialProps: { onChange: first } },
  );
  rerender({ onChange: second });
  act(() => result.current[1](1));
  expect(first).not.toHaveBeenCalled();
  expect(second).toHaveBeenCalledExactlyOnceWith(1);
});
