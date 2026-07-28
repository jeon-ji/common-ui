import "./Toast.css";

import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
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
        <div className="ui-toast-region" role="region" aria-label="알림">
          {items.map((item) => {
            const Icon = TYPE_ICON[item.type];
            // role=status = 항목 단위 polite 라이브 영역 — 삽입 시점에 한 번만 낭독된다 (리뷰 A8).
            // hover 일시정지는 포인터 사용자 전용 보강이라(키보드/SR 경험 불변) 규칙의 예외다.
            return (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <div
                key={item.id}
                role="status"
                className="ui-toast"
                data-type={item.type}
                onMouseEnter={() => pause(item.id)}
                onMouseLeave={() => resume(item.id)}
              >
                <Icon className="ui-toast-icon" />
                <div className="ui-toast-message">{item.message}</div>
                <IconButton size="sm" aria-label="알림 닫기" onClick={() => dismiss(item.id)}>
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
