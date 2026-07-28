import { Tag } from "@jeon-ji/common-ui";
import { useState } from "react";

const TONES = ["neutral", "primary", "success", "warning", "danger", "info"] as const;

export default function BasicDemo() {
  const [labels, setLabels] = useState(["React", "TypeScript", "pnpm"]);

  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-4)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ui-spacing-2)" }}>
        {TONES.map((tone) => (
          <Tag key={tone} tone={tone}>
            {tone}
          </Tag>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ui-spacing-2)" }}>
        {TONES.map((tone) => (
          <Tag key={tone} tone={tone} variant="outline">
            {tone}
          </Tag>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ui-spacing-2)" }}>
        {labels.map((label) => (
          <Tag
            key={label}
            tone="primary"
            closable
            onClose={() => setLabels((prev) => prev.filter((item) => item !== label))}
          >
            {label}
          </Tag>
        ))}
        {labels.length === 0 && <span>전부 제거됨</span>}
      </div>
    </div>
  );
}
