import { Button, ConfirmModal, useDisclosure } from "@jeon-ji/common-ui";
import { useState } from "react";

export default function BasicDemo() {
  const remove = useDisclosure();
  const save = useDisclosure();
  const [last, setLast] = useState("없음");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-3)" }}>
      <Button tone="danger" variant="outline" onClick={remove.onOpen}>
        삭제…
      </Button>
      <Button onClick={save.onOpen}>저장…</Button>
      <span style={{ color: "var(--ui-color-text-secondary)" }}>마지막 확인: {last}</span>

      <ConfirmModal
        open={remove.open}
        onClose={remove.onClose}
        tone="danger"
        title="항목을 삭제할까요?"
        description="이 동작은 되돌릴 수 없습니다. 위험 동작이라 초기 포커스가 취소에 있다."
        onConfirm={() => setLast("삭제")}
      />
      <ConfirmModal
        open={save.open}
        onClose={save.onClose}
        title="변경 사항을 저장할까요?"
        onConfirm={() => setLast("저장")}
      />
    </div>
  );
}
