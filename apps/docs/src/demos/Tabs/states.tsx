import { Tabs } from "@jeon-ji/common-ui";

const ITEMS = [
  { value: "all", label: "전체", content: "전체 목록" },
  { value: "archived", label: "보관됨", content: "보관된 항목", disabled: true },
  { value: "trash", label: "휴지통", content: "삭제 예정 항목" },
];

export default function StatesDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-spacing-8)" }}>
      <Tabs aria-label="line 변형" items={ITEMS} />
      <Tabs aria-label="solid 변형" items={ITEMS} variant="solid" />
      <Tabs aria-label="작은 크기" items={ITEMS} size="sm" />
    </div>
  );
}
