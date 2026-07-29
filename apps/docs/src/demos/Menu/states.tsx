import { Button, Menu } from "@jeon-ji/common-ui";

export default function StatesDemo() {
  return (
    <Menu
      items={[
        { key: "edit", label: "편집" },
        { key: "duplicate", label: "복제", disabled: true },
        { key: "archive", label: "보관" },
        { key: "delete", label: "영구 삭제", danger: true },
      ]}
      trigger={
        <Button variant="outline" tone="neutral">
          상태 데모
        </Button>
      }
    />
  );
}
