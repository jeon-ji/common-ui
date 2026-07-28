import { Route, Routes } from "react-router";

import { Layout } from "./layout/Layout";
import { DemoBlockDev } from "./pages/dev/DemoBlockDev";
import { Home } from "./pages/Home";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dev/demo-block" element={<DemoBlockDev />} />
        <Route
          path="*"
          element={
            <article>
              <h1>페이지 없음</h1>
              <p>아직 작성되지 않은 문서입니다.</p>
            </article>
          }
        />
      </Route>
    </Routes>
  );
}
