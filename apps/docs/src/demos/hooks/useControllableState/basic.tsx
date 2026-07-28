import { useControllableState } from "@jeon-ji/common-ui";
import { useState } from "react";

/** 같은 카운터 구현이 controlled/uncontrolled 양쪽에서 동작한다 */
function Counter({
  value,
  defaultValue = 0,
  onChange,
}: {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}) {
  const [count, setCount] = useControllableState({ value, defaultValue, onChange });
  return (
    <button type="button" onClick={() => setCount((prev) => prev + 1)}>
      count: {count}
    </button>
  );
}

export default function BasicDemo() {
  const [outer, setOuter] = useState(10);

  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-3)", justifyItems: "start" }}>
      <div>
        uncontrolled — <Counter defaultValue={0} />
      </div>
      <div style={{ display: "flex", gap: "var(--ui-spacing-3)", alignItems: "center" }}>
        controlled — <Counter value={outer} onChange={setOuter} />
        <button type="button" onClick={() => setOuter(0)}>
          부모에서 0으로 리셋
        </button>
      </div>
    </div>
  );
}
