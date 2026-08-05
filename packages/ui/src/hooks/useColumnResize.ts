import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useControllableState } from "./useControllableState.js";

/** 저장 키 네임스페이스 — 앱 전역 키를 쓰다 화면끼리 폭을 덮어쓰던 결함(리뷰 S3)의 차단. */
const STORAGE_PREFIX = "@jeon-ji/common-ui:table:";

/** 화살표 한 번에 움직이는 폭 (px) */
const KEYBOARD_STEP = 8;

/** 리사이즈 핸들에 펼쳐 넣는 props — `role="separator"`가 요구하는 값이 전부 들어 있다. */
export interface ColumnResizeHandleProps {
  role: "separator";
  "aria-orientation": "vertical";
  "aria-label": string;
  "aria-valuenow": number;
  "aria-valuemin": number;
  "aria-valuemax": number;
  tabIndex: 0;
  /** 드래그 중인 핸들 — CSS로 잡는다 */
  "data-resizing"?: "";
  style: CSSProperties;
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void;
}

export interface UseColumnResizeOptions {
  /** 폭을 조절할 컬럼 키. 드래그 중 이 배열에서 키가 사라지면 드래그를 안전하게 끝낸다 */
  columnKeys: string[];
  /** 초기 폭 (px) — 없는 컬럼은 드래그 시작 시 실제 렌더 폭을 재서 이어간다 */
  defaultWidths?: Record<string, number>;
  /**
   * 최소 폭 (px)
   * @default 48
   */
  min?: number;
  /**
   * 최대 폭 (px). `role="separator"`는 값의 범위를 요구하므로 상한을 비워 둘 수 없다 —
   * 더 넓은 컬럼이 필요하면 올린다
   * @default 640
   */
  max?: number;
  /**
   * 있으면 localStorage에 폭을 저장한다. **없으면 아무것도 쓰지 않는다.**
   * 실제 키는 `@jeon-ji/common-ui:table:<storageKey>`이라 화면끼리 덮어쓰지 않는다
   */
  storageKey?: string;
  /**
   * 핸들의 접근 이름 — **컬럼을 식별할 수 있게** 만든다("이름 열 너비 조절").
   * 기본값은 모든 핸들에서 같아 목록에서 구분되지 않는다 (규칙 26)
   */
  handleLabel?: (key: string) => string;
  /** 폭이 바뀔 때 호출 */
  onChange?: (widths: Record<string, number>) => void;
}

export interface UseColumnResizeReturn {
  /**
   * 현재 폭. `defaultWidths`로 시작해 조절·저장값이 얹힌다.
   * `defaultWidths`에도 없고 아직 조절하지 않은 컬럼은 키가 없으므로
   * `widths[key] ?? column.width`로 읽는다
   */
  widths: Record<string, number>;
  /** 헤더의 리사이즈 핸들에 펼쳐 넣는다 */
  getHandleProps: (key: string) => ColumnResizeHandleProps;
  /** 초기 폭으로 되돌린다 */
  reset: () => void;
}

function storageName(storageKey: string) {
  return `${STORAGE_PREFIX}${storageKey}`;
}

/** 저장값은 남이 쓴 데이터다 — 형태를 믿지 않고 숫자만 걸러 받는다. */
function readWidths(name: string): Record<string, number> | null {
  try {
    const raw = window.localStorage.getItem(name);
    if (raw == null) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;

    const result: Record<string, number> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value === "number" && Number.isFinite(value)) result[key] = value;
    }
    return result;
  } catch {
    // 손상된 값·프라이빗 모드의 접근 거부 — 저장은 부가 기능이므로 조용히 포기한다
    return null;
  }
}

function writeWidths(name: string, widths: Record<string, number>) {
  try {
    window.localStorage.setItem(name, JSON.stringify(widths));
  } catch {
    // 용량 초과 등 — 폭 저장 실패가 표를 못 쓰게 만들어서는 안 된다
  }
}

/**
 * 포인터 캡처는 **부가 기능**이다 — 실제로 이동을 잡는 것은 창 리스너다.
 * jsdom처럼 미구현인 환경에서 던지더라도 드래그가 멈추면 안 된다.
 */
function capturePointer(element: HTMLElement, pointerId: number) {
  try {
    element.setPointerCapture(pointerId);
  } catch {
    /* 미지원 환경 */
  }
}

function releasePointer(element: HTMLElement, pointerId: number) {
  try {
    if (element.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId);
  } catch {
    /* 미지원 환경 */
  }
}

/**
 * 컬럼 폭 조절 — sije-common Table에 얽혀 있던 리사이즈 로직의 분리·재설계.
 *
 * 원본의 결함을 구조로 배제한다:
 * - **리스너를 매 프레임 재등록하지 않는다.** `pointerdown`에서 `pointermove`/`pointerup`을
 *   한 번 등록하고 끝날 때 한 번 해제한다. 최신 폭은 함수형 업데이트로 읽으므로 핸들러를
 *   다시 만들 이유가 없다 (전역 규칙 15)
 * - **포인터 이벤트**를 쓴다. mouse 전용이면 터치에서 동작하지 않는다. `setPointerCapture`로
 *   포인터를 잡아 커서가 창 밖으로 나가도 놓치지 않는다
 * - **`user-select: none`은 적용과 복원이 쌍이다.** 드래그 종료·언마운트 양쪽에서 되돌린다
 * - **SSR 안전**: `localStorage`를 렌더 단계에서 읽지 않는다. 초기값은 `defaultWidths`이고
 *   저장값은 이펙트에서 얹는다 (전역 규칙 16)
 * - **저장 키는 네임스페이스를 갖는다.** `storageKey`가 없으면 아무것도 쓰지 않는다 —
 *   앱 전역 키에 저장해 화면끼리 폭을 덮어쓰던 결함(리뷰 S3)의 차단이다
 * - **키보드로도 조절한다.** 핸들은 `role="separator"` + `tabIndex=0`이고 좌우 화살표가 폭을 바꾼다
 */
export function useColumnResize({
  columnKeys,
  defaultWidths,
  min = 48,
  max = 640,
  storageKey,
  handleLabel,
  onChange,
}: UseColumnResizeOptions): UseColumnResizeReturn {
  const [widths, setWidths] = useControllableState<Record<string, number>>({
    defaultValue: defaultWidths ?? {},
    onChange,
  });
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // reset의 기준 — 옵션 객체는 렌더마다 새로 올 수 있으므로 첫 값을 붙잡아 둔다
  const initialWidthsRef = useRef(defaultWidths ?? {});
  const widthsRef = useRef(widths);
  useEffect(() => {
    widthsRef.current = widths;
  });

  /** 진행 중인 드래그를 끝내는 함수 — 리스너 해제·user-select 복원·포인터 반환이 여기 모인다 */
  const stopRef = useRef<(() => void) | null>(null);
  /** 드래그 중 컬럼이 사라졌을 때 포커스를 돌려놓을 자리 */
  const tableRef = useRef<HTMLTableElement | null>(null);

  const clamp = useCallback(
    (value: number) => Math.round(Math.min(Math.max(value, min), max)),
    [min, max],
  );

  const widthOf = useCallback(
    (key: string) => clamp(widths[key] ?? initialWidthsRef.current[key] ?? min),
    [widths, clamp, min],
  );

  const setWidth = useCallback(
    (key: string, next: number) => {
      setWidths((prev) => (prev[key] === next ? prev : { ...prev, [key]: next }));
    },
    [setWidths],
  );

  // ── 저장값 읽기 — 렌더가 아니라 이펙트에서 (SSR 안전) ──────────────────
  const skipSaveRef = useRef(true);
  useEffect(() => {
    // storageKey가 바뀐 커밋에서는 저장을 건너뛴다 — 새 키에 옛 폭을 덮어쓰지 않기 위해서다
    skipSaveRef.current = true;
    if (storageKey == null) return;

    const stored = readWidths(storageName(storageKey));
    if (stored == null || Object.keys(stored).length === 0) return;
    setWidths((prev) => ({ ...prev, ...stored }));
  }, [storageKey, setWidths]);

  useEffect(() => {
    if (storageKey == null) return;
    if (skipSaveRef.current) {
      // 첫 커밋에서는 쓰지 않는다. 저장은 "바뀐 뒤"에만 일어난다
      skipSaveRef.current = false;
      return;
    }
    writeWidths(storageName(storageKey), widths);
  }, [storageKey, widths]);

  // ── 드래그 ────────────────────────────────────────────────────────────
  const endDrag = useCallback(() => {
    stopRef.current?.();
    stopRef.current = null;
  }, []);

  // 언마운트에서도 리스너와 user-select를 되돌린다 — 적용과 복원은 쌍이다
  useEffect(() => endDrag, [endDrag]);

  // 드래그 중 컬럼이 사라지면(가변 columns) 안전하게 끝내고 포커스를 표로 되돌린다.
  // 핸들이 언마운트되며 포커스가 body로 떨어지는 것이 유형 1이다 (전역 규칙 23)
  useEffect(() => {
    if (activeKey == null || columnKeys.includes(activeKey)) return;
    endDrag();

    const table = tableRef.current;
    if (table == null) return;
    // 표는 원래 포커스를 받지 않는다 — 갈 곳을 만들어 주고 보낸다
    if (!table.hasAttribute("tabindex")) table.setAttribute("tabindex", "-1");
    table.focus();
  }, [activeKey, columnKeys, endDrag]);

  const handlePointerDown = useCallback(
    (key: string) => (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;
      // 텍스트 선택·네이티브 드래그가 끼어들지 않게 한다
      event.preventDefault();
      endDrag(); // 이전 드래그가 남아 있으면 먼저 정리한다

      const handle = event.currentTarget;
      const { pointerId } = event;
      const startX = event.clientX;
      const headerCell = handle.closest("th");
      tableRef.current = handle.closest("table");

      // 저장된 폭이 없으면 실제 렌더 폭에서 이어간다 — 첫 드래그에서 폭이 튀지 않는다
      const startWidth = clamp(
        widthsRef.current[key] ??
          initialWidthsRef.current[key] ??
          headerCell?.getBoundingClientRect().width ??
          min,
      );

      const previousUserSelect = document.body.style.userSelect;

      const onMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== pointerId) return;
        setWidth(key, clamp(startWidth + (moveEvent.clientX - startX)));
      };

      // 끝내는 경로는 하나뿐이다 — endDrag가 stopRef에 담긴 stop을 부른다.
      // 언마운트·컬럼 소멸도 같은 자리를 지나므로 정리가 갈라지지 않는다
      const onEnd = (endEvent: PointerEvent) => {
        if (endEvent.pointerId !== pointerId) return;
        endDrag();
      };

      const stop = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);
        document.body.style.userSelect = previousUserSelect;
        releasePointer(handle, pointerId);
        setActiveKey(null);
      };

      capturePointer(handle, pointerId);
      document.body.style.userSelect = "none";
      // 창 단위로 듣는다 — 핸들이 드래그 도중 언마운트돼도 pointerup을 놓치지 않는다
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);

      stopRef.current = stop;
      setActiveKey(key);
    },
    [clamp, endDrag, min, setWidth],
  );

  const handleKeyDown = useCallback(
    (key: string) => (event: ReactKeyboardEvent<HTMLElement>) => {
      const delta =
        event.key === "ArrowLeft" ? -KEYBOARD_STEP : event.key === "ArrowRight" ? KEYBOARD_STEP : 0;
      if (delta === 0) return;

      event.preventDefault(); // 화살표가 표를 가로 스크롤시키지 않게
      const current = widthsRef.current[key] ?? initialWidthsRef.current[key] ?? min;
      setWidth(key, clamp(current + delta));
    },
    [clamp, min, setWidth],
  );

  const getHandleProps = useCallback(
    (key: string): ColumnResizeHandleProps => ({
      role: "separator",
      "aria-orientation": "vertical",
      "aria-label": handleLabel?.(key) ?? "열 너비 조절",
      "aria-valuenow": widthOf(key),
      "aria-valuemin": min,
      "aria-valuemax": max,
      tabIndex: 0,
      ...(activeKey === key ? { "data-resizing": "" as const } : {}),
      // 터치에서 드래그가 스크롤로 가로채이지 않게 한다
      style: { touchAction: "none" },
      onPointerDown: handlePointerDown(key),
      onKeyDown: handleKeyDown(key),
    }),
    [activeKey, handleKeyDown, handleLabel, handlePointerDown, max, min, widthOf],
  );

  const reset = useCallback(() => {
    setWidths(initialWidthsRef.current);
  }, [setWidths]);

  return { widths, getHandleProps, reset };
}
