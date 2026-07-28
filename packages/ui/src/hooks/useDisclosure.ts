import { useCallback } from "react";

import { useControllableState } from "./useControllableState.js";

export interface UseDisclosureOptions {
  /** 제어 열림 상태 */
  open?: boolean;
  /** 비제어 초기 상태 @default false */
  defaultOpen?: boolean;
  /** 열림 상태 변경 시 호출 */
  onOpenChange?: (open: boolean) => void;
}

export interface UseDisclosureReturn {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

/**
 * 열림/닫힘 상태의 표준 반환형 — Modal·Popover류의 open/onClose 배선을 통일한다.
 * useControllableState 기반이라 controlled/uncontrolled 모두 지원한다.
 */
export function useDisclosure(options: UseDisclosureOptions = {}): UseDisclosureReturn {
  const { open: openProp, defaultOpen = false, onOpenChange } = options;
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  return {
    open,
    onOpen: useCallback(() => setOpen(true), [setOpen]),
    onClose: useCallback(() => setOpen(false), [setOpen]),
    onToggle: useCallback(() => setOpen((prev) => !prev), [setOpen]),
  };
}
