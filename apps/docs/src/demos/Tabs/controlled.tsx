import { Button, Tabs } from "@jeon-ji/common-ui";
import { useState } from "react";

export default function ControlledDemo() {
  const [value, setValue] = useState("summary");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-spacing-4)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-3)" }}>
        <Button variant="outline" tone="neutral" onClick={() => setValue("detail")}>
          바깥에서 상세로 이동
        </Button>
        <span>현재: {value}</span>
      </div>
      <Tabs
        aria-label="보고서"
        value={value}
        onChange={setValue}
        items={[
          { value: "summary", label: "요약", content: "요약 내용" },
          { value: "detail", label: "상세", content: "상세 내용" },
        ]}
      />
    </div>
  );
}
