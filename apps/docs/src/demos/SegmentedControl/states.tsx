import { SegmentedControl } from "@jeon-ji/common-ui";

export default function StatesDemo() {
  return (
    <SegmentedControl
      aria-label="기간"
      defaultValue="week"
      items={[
        { value: "day", label: "일" },
        { value: "week", label: "주" },
        { value: "month", label: "월", disabled: true },
      ]}
    />
  );
}
