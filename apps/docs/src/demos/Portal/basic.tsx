import { Portal } from "@jeon-ji/common-ui";
import { useState } from "react";

export default function BasicDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        overflow: "hidden", // 부모가 overflow를 잘라도 포털 내용은 body 아래라 잘리지 않는다
        border: "1px dashed var(--ui-color-border-strong)",
        borderRadius: "var(--ui-radius-md)",
        padding: "var(--ui-spacing-4)",
      }}
    >
      <button type="button" onClick={() => setOpen((prev) => !prev)}>
        {open ? "포털 닫기" : "포털 열기"}
      </button>
      {open && (
        <Portal>
          <div
            role="status"
            style={{
              position: "fixed",
              right: "var(--ui-spacing-6)",
              bottom: "var(--ui-spacing-6)",
              zIndex: "var(--ui-z-toast)",
              padding: "var(--ui-spacing-4)",
              background: "var(--ui-color-primary-subtle)",
              border: "1px solid var(--ui-color-primary-default)",
              borderRadius: "var(--ui-radius-md)",
              boxShadow: "var(--ui-shadow-overlay)",
            }}
          >
            body 아래 [data-ui-portal] 컨테이너에서 렌더되는 중
          </div>
        </Portal>
      )}
    </div>
  );
}
