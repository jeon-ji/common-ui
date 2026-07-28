import { Route, Routes } from "react-router";

import { Layout } from "./layout/Layout";
import { BadgePage } from "./pages/components/BadgePage";
import { ButtonPage } from "./pages/components/ButtonPage";
import { CheckboxPage } from "./pages/components/CheckboxPage";
import { ConfirmModalPage } from "./pages/components/ConfirmModalPage";
import { FieldPage } from "./pages/components/FieldPage";
import { IconButtonPage } from "./pages/components/IconButtonPage";
import { IconPage } from "./pages/components/IconPage";
import { ModalPage } from "./pages/components/ModalPage";
import { NumberFieldPage } from "./pages/components/NumberFieldPage";
import { PortalPage } from "./pages/components/PortalPage";
import { RadioPage } from "./pages/components/RadioPage";
import { SamplePage } from "./pages/components/SamplePage";
import { SelectPage } from "./pages/components/SelectPage";
import { SkeletonPage } from "./pages/components/SkeletonPage";
import { SpinnerPage } from "./pages/components/SpinnerPage";
import { SwitchPage } from "./pages/components/SwitchPage";
import { TagPage } from "./pages/components/TagPage";
import { TextareaPage } from "./pages/components/TextareaPage";
import { TextFieldPage } from "./pages/components/TextFieldPage";
import { TextPage } from "./pages/components/TextPage";
import { ToastPage } from "./pages/components/ToastPage";
import { TooltipPage } from "./pages/components/TooltipPage";
import { Colors } from "./pages/foundation/Colors";
import { Spacing } from "./pages/foundation/Spacing";
import { Typography } from "./pages/foundation/Typography";
import { ZIndex } from "./pages/foundation/ZIndex";
import { Installation } from "./pages/guide/Installation";
import { Usage } from "./pages/guide/Usage";
import { Home } from "./pages/Home";
import { UseClickOutsidePage } from "./pages/hooks/UseClickOutsidePage";
import { UseControllableStatePage } from "./pages/hooks/UseControllableStatePage";
import { UseDisclosurePage } from "./pages/hooks/UseDisclosurePage";

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
        <Route path="/hooks/use-click-outside" element={<UseClickOutsidePage />} />
        <Route path="/hooks/use-controllable-state" element={<UseControllableStatePage />} />
        <Route path="/hooks/use-disclosure" element={<UseDisclosurePage />} />
        <Route path="/components/badge" element={<BadgePage />} />
        <Route path="/components/button" element={<ButtonPage />} />
        <Route path="/components/checkbox" element={<CheckboxPage />} />
        <Route path="/components/confirm-modal" element={<ConfirmModalPage />} />
        <Route path="/components/field" element={<FieldPage />} />
        <Route path="/components/icon" element={<IconPage />} />
        <Route path="/components/icon-button" element={<IconButtonPage />} />
        <Route path="/components/modal" element={<ModalPage />} />
        <Route path="/components/number-field" element={<NumberFieldPage />} />
        <Route path="/components/portal" element={<PortalPage />} />
        <Route path="/components/radio" element={<RadioPage />} />
        <Route path="/components/sample" element={<SamplePage />} />
        <Route path="/components/select" element={<SelectPage />} />
        <Route path="/components/skeleton" element={<SkeletonPage />} />
        <Route path="/components/spinner" element={<SpinnerPage />} />
        <Route path="/components/switch" element={<SwitchPage />} />
        <Route path="/components/tag" element={<TagPage />} />
        <Route path="/components/text" element={<TextPage />} />
        <Route path="/components/toast" element={<ToastPage />} />
        <Route path="/components/tooltip" element={<TooltipPage />} />
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
