import { SegmentedControl } from "@jeon-ji/common-ui";
import { useState } from "react";

export default function BasicDemo() {
  const [value, setValue] = useState("list");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-4)" }}>
      <SegmentedControl
        aria-label="보기 방식"
        value={value}
        onChange={setValue}
        items={[
          { value: "list", label: "목록" },
          { value: "board", label: "보드" },
          { value: "calendar", label: "캘린더" },
        ]}
      />
      <span>현재: {value}</span>
    </div>
  );
}
