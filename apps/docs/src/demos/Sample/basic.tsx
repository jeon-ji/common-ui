import { Sample } from "@jeon-ji/common-ui";

export default function BasicDemo() {
  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-3)" }}>
      <Sample>중립 톤 — 기본값</Sample>
      <Sample tone="primary">primary 톤</Sample>
    </div>
  );
}
