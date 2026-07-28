import { Button, useDisclosure } from "@jeon-ji/common-ui";

export default function BasicDemo() {
  const panel = useDisclosure();

  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-3)", justifyItems: "start" }}>
      <div style={{ display: "flex", gap: "var(--ui-spacing-2)" }}>
        <Button size="sm" onClick={panel.onOpen}>
          열기
        </Button>
        <Button size="sm" variant="outline" onClick={panel.onClose}>
          닫기
        </Button>
        <Button size="sm" variant="ghost" tone="neutral" onClick={panel.onToggle}>
          토글
        </Button>
      </div>
      {panel.open && (
        <div
          style={{
            padding: "var(--ui-spacing-4)",
            background: "var(--ui-color-bg-subtle)",
            border: "1px solid var(--ui-color-border-default)",
            borderRadius: "var(--ui-radius-md)",
          }}
        >
          열림 상태의 패널
        </div>
      )}
    </div>
  );
}
