import { Radio, RadioGroup } from "@jeon-ji/common-ui";
import { useState } from "react";

export default function BasicDemo() {
  const [plan, setPlan] = useState("free");

  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-4)" }}>
      <RadioGroup
        aria-label="요금제"
        value={plan}
        onChange={setPlan}
        style={{ display: "flex", gap: "var(--ui-spacing-4)" }}
      >
        <Radio value="free">Free</Radio>
        <Radio value="pro">Pro</Radio>
        <Radio value="team" disabled>
          Team (준비 중)
        </Radio>
      </RadioGroup>
      <span style={{ color: "var(--ui-color-text-secondary)" }}>선택: {plan}</span>
    </div>
  );
}
