import { Button, Menu } from "@jeon-ji/common-ui";
import { useState } from "react";

export default function BasicDemo() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-4)" }}>
      <Menu
        items={[
          { key: "rename", label: "이름 변경" },
          { key: "duplicate", label: "복제" },
          { key: "delete", label: "삭제", danger: true },
        ]}
        onSelect={setSelected}
        trigger={
          <Button variant="outline" tone="neutral">
            동작 메뉴
          </Button>
        }
      />
      <span>선택: {selected ?? "없음"}</span>
    </div>
  );
}
