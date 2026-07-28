import { useClickOutside } from "@jeon-ji/common-ui";
import { useRef, useState } from "react";

export default function BasicDemo() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useClickOutside(panelRef, () => setOpen(false), open);

  return (
    <div style={{ position: "relative", minHeight: 120 }}>
      <button type="button" onClick={() => setOpen((prev) => !prev)}>
        패널 {open ? "닫기" : "열기"}
      </button>
      {open && (
        <div
          ref={panelRef}
          style={{
            position: "absolute",
            top: "var(--ui-spacing-10)",
            padding: "var(--ui-spacing-4)",
            background: "var(--ui-color-bg-subtle)",
            border: "1px solid var(--ui-color-border-default)",
            borderRadius: "var(--ui-radius-md)",
            boxShadow: "var(--ui-shadow-md)",
          }}
        >
          이 패널 바깥을 클릭하면 닫힙니다. 패널 안 클릭은 무시됩니다.
        </div>
      )}
    </div>
  );
}
