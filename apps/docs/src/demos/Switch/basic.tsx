import { Field, Switch } from "@jeon-ji/common-ui";
import { useState } from "react";

export default function BasicDemo() {
  const [on, setOn] = useState(true);

  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-4)", justifyItems: "start" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-3)" }}>
        <Switch checked={on} onChange={setOn} aria-label="알림" />
        <span>{on ? "켜짐" : "꺼짐"}</span>
      </div>
      <Switch size="sm" defaultChecked aria-label="작은 스위치" />
      <Switch disabled aria-label="비활성" />
      <Field label="이메일 수신 동의" helperText="label 클릭으로도 토글된다">
        <Switch />
      </Field>
    </div>
  );
}
