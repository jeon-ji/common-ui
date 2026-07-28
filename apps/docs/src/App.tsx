import { Route, Routes } from "react-router";

import { Layout } from "./layout/Layout";
import { ButtonPage } from "./pages/components/ButtonPage";
import { FieldPage } from "./pages/components/FieldPage";
import { IconButtonPage } from "./pages/components/IconButtonPage";
import { IconPage } from "./pages/components/IconPage";
import { NumberFieldPage } from "./pages/components/NumberFieldPage";
import { PortalPage } from "./pages/components/PortalPage";
import { SamplePage } from "./pages/components/SamplePage";
import { SkeletonPage } from "./pages/components/SkeletonPage";
import { SpinnerPage } from "./pages/components/SpinnerPage";
import { TextareaPage } from "./pages/components/TextareaPage";
import { TextFieldPage } from "./pages/components/TextFieldPage";
import { TextPage } from "./pages/components/TextPage";
import { Colors } from "./pages/foundation/Colors";
import { Spacing } from "./pages/foundation/Spacing";
import { Typography } from "./pages/foundation/Typography";
import { ZIndex } from "./pages/foundation/ZIndex";
import { Installation } from "./pages/guide/Installation";
import { Usage } from "./pages/guide/Usage";
import { Home } from "./pages/Home";
import { UseControllableStatePage } from "./pages/hooks/UseControllableStatePage";

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
        <Route path="/hooks/use-controllable-state" element={<UseControllableStatePage />} />
        <Route path="/components/button" element={<ButtonPage />} />
        <Route path="/components/field" element={<FieldPage />} />
        <Route path="/components/icon" element={<IconPage />} />
        <Route path="/components/icon-button" element={<IconButtonPage />} />
        <Route path="/components/number-field" element={<NumberFieldPage />} />
        <Route path="/components/portal" element={<PortalPage />} />
        <Route path="/components/sample" element={<SamplePage />} />
        <Route path="/components/skeleton" element={<SkeletonPage />} />
        <Route path="/components/spinner" element={<SpinnerPage />} />
        <Route path="/components/text" element={<TextPage />} />
        <Route path="/components/text-field" element={<TextFieldPage />} />
        <Route path="/components/textarea" element={<TextareaPage />} />
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
