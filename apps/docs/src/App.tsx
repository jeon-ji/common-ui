import { Route, Routes } from "react-router";

import { Layout } from "./layout/Layout";
import { IconPage } from "./pages/components/IconPage";
import { PortalPage } from "./pages/components/PortalPage";
import { SamplePage } from "./pages/components/SamplePage";
import { SkeletonPage } from "./pages/components/SkeletonPage";
import { SpinnerPage } from "./pages/components/SpinnerPage";
import { TextPage } from "./pages/components/TextPage";
import { Colors } from "./pages/foundation/Colors";
import { Spacing } from "./pages/foundation/Spacing";
import { Typography } from "./pages/foundation/Typography";
import { ZIndex } from "./pages/foundation/ZIndex";
import { Installation } from "./pages/guide/Installation";
import { Usage } from "./pages/guide/Usage";
import { Home } from "./pages/Home";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/guide/installation" element={<Installation />} />
        <Route path="/guide/usage" element={<Usage />} />
        <Route path="/foundation/colors" element={<Colors />} />
        <Route path="/foundation/typography" element={<Typography />} />
        <Route path="/foundation/spacing" element={<Spacing />} />
        <Route path="/foundation/z-index" element={<ZIndex />} />
        <Route path="/components/icon" element={<IconPage />} />
        <Route path="/components/portal" element={<PortalPage />} />
        <Route path="/components/sample" element={<SamplePage />} />
        <Route path="/components/skeleton" element={<SkeletonPage />} />
        <Route path="/components/spinner" element={<SpinnerPage />} />
        <Route path="/components/text" element={<TextPage />} />
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
