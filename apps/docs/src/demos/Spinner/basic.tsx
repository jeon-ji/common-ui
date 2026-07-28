import { Spinner } from "@jeon-ji/common-ui";

export default function BasicDemo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-6)" }}>
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" aria-label="목록 불러오는 중" />
    </div>
  );
}
