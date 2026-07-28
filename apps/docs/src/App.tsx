import { Route, Routes } from "react-router";

export function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <main style={{ padding: "var(--ui-spacing-6)" }}>
            <h1>@jeon-ji/common-ui</h1>
            <p style={{ color: "var(--ui-color-text-secondary)" }}>
              문서 사이트 부트스트랩 — 토큰 CSS 변수가 이 문장의 색을 결정하면 workspace 참조가
              동작하는 것이다.
            </p>
          </main>
        }
      />
    </Routes>
  );
}
