/**
 * 사이드바·라우트의 단일 소스 (04 문서 §4).
 * 05 문서의 필수 컴포넌트 목록과 이 레지스트리를 대조해 "문서 페이지 없는 컴포넌트"를
 * CI에서 잡는다 (전역 규칙 19의 기계적 강제 — scripts/check-docs-pages.ts).
 */

export interface DocEntry {
  /** URL 경로 조각 (예: "button" → /components/button) */
  readonly slug: string;
  /** 사이드바 표시 이름 */
  readonly title: string;
  /** 미구현 백로그 항목 — 사이드바에 "예정" 뱃지로 노출 */
  readonly planned?: boolean;
}

export interface DocGroup {
  readonly title: string;
  readonly base: string;
  readonly entries: readonly DocEntry[];
}

export const docGroups: readonly DocGroup[] = [
  {
    title: "시작하기",
    base: "/guide",
    entries: [
      { slug: "installation", title: "설치" },
      { slug: "usage", title: "사용법" },
    ],
  },
  {
    title: "Foundation",
    base: "/foundation",
    entries: [
      { slug: "colors", title: "Colors" },
      { slug: "typography", title: "Typography" },
      { slug: "spacing", title: "Spacing" },
      { slug: "z-index", title: "z-index" },
    ],
  },
  {
    title: "Hooks",
    base: "/hooks",
    entries: [
      { slug: "use-click-outside", title: "useClickOutside" },
      { slug: "use-controllable-state", title: "useControllableState" },
      { slug: "use-disclosure", title: "useDisclosure" },
    ],
  },
  {
    title: "Components",
    base: "/components",
    // M2에서 05 문서의 필수 컴포넌트가 순서대로 채워진다
    entries: [
      { slug: "badge", title: "Badge" },
      { slug: "button", title: "Button" },
      { slug: "checkbox", title: "Checkbox" },
      { slug: "confirm-modal", title: "ConfirmModal" },
      { slug: "field", title: "Field" },
      { slug: "icon", title: "Icon" },
      { slug: "icon-button", title: "IconButton" },
      { slug: "menu", title: "Menu" },
      { slug: "modal", title: "Modal" },
      { slug: "number-field", title: "NumberField" },
      { slug: "popover", title: "Popover" },
      { slug: "portal", title: "Portal" },
      { slug: "radio", title: "Radio · RadioGroup" },
      { slug: "segmented-control", title: "SegmentedControl" },
      { slug: "select", title: "Select" },
      { slug: "skeleton", title: "Skeleton" },
      { slug: "spinner", title: "Spinner" },
      { slug: "switch", title: "Switch" },
      { slug: "tabs", title: "Tabs" },
      { slug: "tag", title: "Tag" },
      { slug: "text", title: "Text · Heading" },
      { slug: "toast", title: "Toast" },
      { slug: "tooltip", title: "Tooltip" },
      { slug: "text-field", title: "TextField" },
      { slug: "textarea", title: "Textarea" },
    ],
  },
] as const;
