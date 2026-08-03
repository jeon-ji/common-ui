import "./Toast.css";

import {
  createContext,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AlertTriangleIcon,
  CheckCircleIcon,
  CloseIcon,
  InfoCircleIcon,
  XCircleIcon,
} from "../../icons/index.js";
import { IconButton } from "../IconButton/index.js";
import { Portal } from "../Portal/index.js";

/** 상태는 boolean 3개가 아니라 type 단일 필드다 (리뷰 M21) */
export type ToastType = "success" | "warning" | "danger" | "info";

export interface ToastOptions {
  /** 자동 닫힘까지의 ms. 0이면 수동 닫기 전용 @default Provider의 duration */
  duration?: number;
}

export interface ToastApi {
  show: (type: ToastType, message: ReactNode, options?: ToastOptions) => number;
  success: (message: ReactNode, options?: ToastOptions) => number;
  warning: (message: ReactNode, options?: ToastOptions) => number;
  danger: (message: ReactNode, options?: ToastOptions) => number;
  info: (message: ReactNode, options?: ToastOptions) => number;
  dismiss: (id: number) => void;
}

interface ToastItem {
  id: number;
  type: ToastType;
  message: ReactNode;
  duration: number;
}

const ToastContext = createContext<ToastApi | null>(null);

/** ToastProvider 컨텍스트의 알림 API를 소비한다. */
export function useToast(): ToastApi {
  const api = use(ToastContext);
  if (api === null) {
    throw new Error("useToast는 <ToastProvider> 안에서만 사용할 수 있다");
  }
  return api;
}

export interface ToastProviderProps {
  /** 동시에 표시할 최대 개수 — 초과분은 큐에서 대기한다 @default 3 */
  max?: number;
  /** 기본 자동 닫힘 ms @default 4000 */
  duration?: number;
  children: ReactNode;
}

const TYPE_ICON = {
  success: CheckCircleIcon,
  warning: AlertTriangleIcon,
  danger: XCircleIcon,
  info: InfoCircleIcon,
} as const;

interface TimerState {
  timeout: ReturnType<typeof setTimeout>;
  startedAt: number;
  remaining: number;
}

/**
 * 토스트 시스템 — useAlert/useAlertMany 2종 병렬 구현의 단일 통합판.
 * 스토어는 Provider 인스턴스마다 만들어진다 — Provider 2개를 마운트하면 각자 독립이다
 * (전역 싱글턴 금지, 리뷰 A2). 타이머는 ref로 관리하고 hover 시 일시정지하며
 * 언마운트 시 전부 정리한다 (리뷰 M1).
 */
export function ToastProvider({ max = 3, duration = 4000, children }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const visibleRef = useRef<ToastItem[]>([]);
  const queueRef = useRef<ToastItem[]>([]);
  const timersRef = useRef(new Map<number, TimerState>());
  const idRef = useRef(0);

  const sync = useCallback(() => {
    setItems([...visibleRef.current]);
  }, []);

  // dismiss ↔ startTimer 상호 참조는 ref 위임으로 끊는다 — 타이머 콜백은 항상 최신 dismiss를 본다
  const dismissRef = useRef<(id: number) => void>(() => undefined);

  const startTimer = useCallback((item: ToastItem) => {
    if (item.duration <= 0) return; // 수동 닫기 전용
    timersRef.current.set(item.id, {
      timeout: setTimeout(() => dismissRef.current(item.id), item.duration),
      startedAt: Date.now(),
      remaining: item.duration,
    });
  }, []);

  const dismiss = useCallback(
    (id: number) => {
      const timer = timersRef.current.get(id);
      if (timer) {
        clearTimeout(timer.timeout);
        timersRef.current.delete(id);
      }
      const index = visibleRef.current.findIndex((item) => item.id === id);
      if (index < 0) {
        queueRef.current = queueRef.current.filter((item) => item.id !== id);
        return;
      }
      visibleRef.current.splice(index, 1);
      const next = queueRef.current.shift();
      if (next) {
        visibleRef.current.push(next);
        startTimer(next);
      }
      sync();
    },
    [startTimer, sync],
  );

  useEffect(() => {
    dismissRef.current = dismiss;
  });

  const pause = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (!timer) return;
    clearTimeout(timer.timeout);
    timer.remaining -= Date.now() - timer.startedAt;
  }, []);

  const resume = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (!timer) return;
    timer.startedAt = Date.now();
    timer.timeout = setTimeout(() => dismissRef.current(id), Math.max(timer.remaining, 0));
  }, []);

  const show = useCallback(
    (type: ToastType, message: ReactNode, options?: ToastOptions) => {
      idRef.current += 1;
      const item: ToastItem = {
        id: idRef.current,
        type,
        message,
        duration: options?.duration ?? duration,
      };
      if (visibleRef.current.length < max) {
        visibleRef.current.push(item);
        startTimer(item);
        sync();
      } else {
        queueRef.current.push(item); // 최대 표시 수 초과 — 자리가 나면 순서대로
      }
      return item.id;
    },
    [duration, max, startTimer, sync],
  );

  // 언마운트 시 남은 타이머 전부 정리 (리뷰 M1의 useTimer 누수 유형 방지)
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const timer of timers.values()) clearTimeout(timer.timeout);
      timers.clear();
    };
  }, []);

  // ── 포커스 관리 ──────────────────────────────────────────────────────────
  // 닫기 버튼을 누르면 그 버튼이 통째로 사라진다 — 넘겨줄 곳을 정하지 않으면 포커스가
  // body로 떨어져 키보드 사용자가 위치를 잃는다 (반복 결함 유형 1)
  const regionRef = useRef<HTMLDivElement | null>(null);
  /** 포커스가 영역 바깥에서 들어올 때의 출발지 — 마지막 토스트를 닫으면 여기로 돌려보낸다 */
  const focusOriginRef = useRef<HTMLElement | null>(null);
  /** 닫힘 직후 포커스를 옮길 대상 — DOM이 갱신된 뒤에 적용해야 한다 */
  const pendingFocusRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const target = pendingFocusRef.current;
    pendingFocusRef.current = null;
    if (target?.isConnected === true) target.focus();
  }, [items]);

  const handleRegionFocus = (event: FocusEvent<HTMLDivElement>) => {
    const from = event.relatedTarget;
    const region = regionRef.current;
    if (region !== null && from instanceof HTMLElement && !region.contains(from)) {
      focusOriginRef.current = from;
    }
  };

  const handleCloseClick = (id: number, event: MouseEvent<HTMLButtonElement>) => {
    const toastEl = event.currentTarget.closest(".ui-toast");
    // 포커스가 이 토스트 안에 있을 때만 이관한다 — 마우스로만 눌렀다면 건드리지 않는다
    if (toastEl?.contains(document.activeElement) === true) {
      const sibling = toastEl.nextElementSibling ?? toastEl.previousElementSibling;
      pendingFocusRef.current =
        sibling?.querySelector<HTMLButtonElement>("button") ?? focusOriginRef.current;
    }
    dismiss(id);
  };

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (message, options) => show("success", message, options),
      warning: (message, options) => show("warning", message, options),
      danger: (message, options) => show("danger", message, options),
      info: (message, options) => show("info", message, options),
      dismiss,
    }),
    [show, dismiss],
  );

  return (
    <ToastContext value={api}>
      {children}
      <Portal>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- 영역을
            상호작용 요소로 만드는 게 아니라, 포커스가 밖에서 들어온 출발지를 기록하기만 한다
            (마지막 토스트를 닫은 뒤 돌려보낼 곳). 키보드·스크린리더 동작은 그대로다 */}
        <div
          ref={regionRef}
          className="ui-toast-region"
          role="region"
          aria-label="알림"
          onFocus={handleRegionFocus}
        >
          {items.map((item) => {
            const Icon = TYPE_ICON[item.type];
            // role=status = 항목 단위 polite 라이브 영역 — 삽입 시점에 한 번만 낭독된다 (리뷰 A8).
            // 자동 닫힘은 hover뿐 아니라 **포커스에도** 멈춘다: 닫기 버튼에 포커스를 둔 채
            // 타이머가 만료되면 사용자가 조작하려던 버튼이 발밑에서 사라진다.
            return (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <div
                key={item.id}
                role="status"
                className="ui-toast"
                data-type={item.type}
                onMouseEnter={() => pause(item.id)}
                onMouseLeave={() => resume(item.id)}
                onFocus={() => pause(item.id)}
                onBlur={() => resume(item.id)}
              >
                <Icon className="ui-toast-icon" />
                <div className="ui-toast-message">{item.message}</div>
                <IconButton
                  size="sm"
                  aria-label="알림 닫기"
                  onClick={(event) => handleCloseClick(item.id, event)}
                >
                  <CloseIcon />
                </IconButton>
              </div>
            );
          })}
        </div>
      </Portal>
    </ToastContext>
  );
}
