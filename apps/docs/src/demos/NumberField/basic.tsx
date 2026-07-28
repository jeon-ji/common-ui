import { Field, NumberField } from "@jeon-ji/common-ui";
import { useState } from "react";

export default function BasicDemo() {
  const [price, setPrice] = useState<number | null>(1234567);

  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-6)", maxWidth: 320 }}>
      <Field label="금액" helperText={`값: ${price === null ? "null" : String(price)}`}>
        <NumberField value={price} onChange={setPrice} />
      </Field>
      <Field label="수량 (0~99, 화살표 키로 5씩)" helperText="blur 시 범위로 clamp">
        <NumberField defaultValue={10} min={0} max={99} step={5} />
      </Field>
    </div>
  );
}
