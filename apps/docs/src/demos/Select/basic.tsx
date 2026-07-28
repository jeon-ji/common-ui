import { Field, Select, type SelectItem } from "@jeon-ji/common-ui";
import { useState } from "react";

const FRUITS: SelectItem[] = [
  { value: "apple", label: "사과" },
  { value: "banana", label: "바나나", disabled: true },
  { value: "grape", label: "포도" },
  { value: "peach", label: "복숭아" },
  { value: "melon", label: "멜론" },
];

export default function BasicDemo() {
  const [fruit, setFruit] = useState<string | null>(null);

  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-6)", maxWidth: 280 }}>
      <Field label="과일" helperText={`값: ${fruit ?? "null"}`}>
        <Select items={FRUITS} value={fruit} onChange={setFruit} placeholder="과일 선택" />
      </Field>
      <Select items={FRUITS} defaultValue="grape" aria-label="비제어 셀렉트" />
      <Select items={FRUITS} disabled placeholder="비활성" aria-label="비활성 셀렉트" />
    </div>
  );
}
