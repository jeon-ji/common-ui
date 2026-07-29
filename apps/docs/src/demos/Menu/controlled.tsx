import { Button, Menu } from "@jeon-ji/common-ui";
import { useState } from "react";

export default function ControlledDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-4)" }}>
      <Menu
        open={open}
        onOpenChange={setOpen}
        items={[
          { key: "refresh", label: "새로고침" },
          { key: "settings", label: "설정" },
        ]}
        trigger={
          <Button variant="outline" tone="neutral">
            제어형 메뉴
          </Button>
        }
      />
      <span>상태: {open ? "열림" : "닫힘"}</span>
    </div>
  );
}
