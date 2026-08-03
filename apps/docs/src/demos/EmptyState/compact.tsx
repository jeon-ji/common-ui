import { EmptyState } from "@jeon-ji/common-ui";

export default function CompactDemo() {
  return (
    <div
      style={{
        border: "1px solid var(--ui-color-border-default)",
        borderRadius: "var(--ui-radius-md)",
        width: "320px",
      }}
    >
      <EmptyState size="sm" title="검색 결과 없음" description="다른 키워드로 찾아보세요." />
    </div>
  );
}
