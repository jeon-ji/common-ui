import { Checkbox } from "@jeon-ji/common-ui";
import { useState } from "react";

const ITEMS = ["사과", "바나나", "포도"] as const;

/** CheckboxAll 패턴 — indeterminate는 "전체 선택" 체크박스로 흡수한다 */
export default function IndeterminateDemo() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["사과"]));

  const allChecked = selected.size === ITEMS.length;
  const someChecked = selected.size > 0 && !allChecked;

  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-3)" }}>
      <Checkbox
        checked={allChecked}
        indeterminate={someChecked}
        onChange={(checked) => setSelected(checked ? new Set(ITEMS) : new Set())}
      >
        전체 선택
      </Checkbox>
      <div
        style={{ display: "grid", gap: "var(--ui-spacing-2)", paddingLeft: "var(--ui-spacing-6)" }}
      >
        {ITEMS.map((item) => (
          <Checkbox
            key={item}
            checked={selected.has(item)}
            onChange={(checked) => {
              const next = new Set(selected);
              if (checked) next.add(item);
              else next.delete(item);
              setSelected(next);
            }}
          >
            {item}
          </Checkbox>
        ))}
      </div>
    </div>
  );
}
