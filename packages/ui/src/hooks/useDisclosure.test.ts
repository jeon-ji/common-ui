import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { useDisclosure } from "./useDisclosure.js";

test("기본값 false, onOpen/onClose/onToggle 동작", () => {
  const { result } = renderHook(() => useDisclosure());
  expect(result.current.open).toBe(false);

  act(() => result.current.onOpen());
  expect(result.current.open).toBe(true);

  act(() => result.current.onClose());
  expect(result.current.open).toBe(false);

  act(() => result.current.onToggle());
  expect(result.current.open).toBe(true);
});

test("controlled: onOpenChange만 호출되고 상태는 부모 소유", () => {
  const onOpenChange = vi.fn();
  const { result } = renderHook(() => useDisclosure({ open: false, onOpenChange }));

  act(() => result.current.onOpen());
  expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
  expect(result.current.open).toBe(false);
});

test("defaultOpen 초기값", () => {
  const { result } = renderHook(() => useDisclosure({ defaultOpen: true }));
  expect(result.current.open).toBe(true);
});

test("콜백 정체성이 렌더 간 불변이다", () => {
  const { result, rerender } = renderHook(() => useDisclosure());
  const { onOpen, onClose, onToggle } = result.current;
  act(() => result.current.onToggle());
  rerender();
  expect(result.current.onOpen).toBe(onOpen);
  expect(result.current.onClose).toBe(onClose);
  expect(result.current.onToggle).toBe(onToggle);
});
