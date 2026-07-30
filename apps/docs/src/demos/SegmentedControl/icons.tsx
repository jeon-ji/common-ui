import { CheckIcon, SearchIcon, SegmentedControl } from "@jeon-ji/common-ui";

export default function IconsDemo() {
  const items = [
    { value: "search", label: "검색", icon: <SearchIcon /> },
    { value: "done", label: "완료", icon: <CheckIcon /> },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-spacing-4)" }}>
      {/* 아이콘은 라이브러리가 아니라 소비자가 주입한다 */}
      <SegmentedControl aria-label="아이콘과 라벨" items={items} />
      {/* iconOnly에서도 label이 접근 이름으로 남는다 */}
      <SegmentedControl aria-label="아이콘만" items={items} iconOnly />
      <SegmentedControl aria-label="작은 크기" items={items} size="sm" />
    </div>
  );
}
