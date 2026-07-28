import { Field, Select, type SelectItem } from "@jeon-ji/common-ui";
import { useState } from "react";

const TOPPINGS: SelectItem[] = [
  { value: "cheese", label: "치즈" },
  { value: "bacon", label: "베이컨" },
  { value: "mushroom", label: "버섯" },
  { value: "onion", label: "양파" },
];

export default function MultipleDemo() {
  const [toppings, setToppings] = useState<string[]>(["cheese"]);

  return (
    <div style={{ maxWidth: 280 }}>
      <Field
        label="토핑"
        helperText={`선택 ${String(toppings.length)}개 — 목록이 열린 채 토글된다`}
      >
        <Select multiple items={TOPPINGS} value={toppings} onChange={setToppings} />
      </Field>
    </div>
  );
}
