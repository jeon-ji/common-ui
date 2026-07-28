import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "ui-docs-theme";
const listeners = new Set<() => void>();

function readTheme(): Theme {
  // index.html의 인라인 스크립트가 마운트 전에 dataset.theme을 채워 둔다
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
  for (const notify of listeners) notify();
}

/** 다크 토글 — 토큰 시스템이 semantic 변수 교체만으로 전환되는지 검증하는 도구를 겸한다 */
export function useTheme(): [Theme, (theme: Theme) => void] {
  const theme = useSyncExternalStore(
    (notify) => {
      listeners.add(notify);
      return () => listeners.delete(notify);
    },
    readTheme,
    () => "light" as const,
  );
  return [theme, setTheme];
}
