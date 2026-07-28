import { Button, Field, Modal, TextField, useDisclosure } from "@jeon-ji/common-ui";

export default function BasicDemo() {
  const modal = useDisclosure();

  return (
    <>
      <Button onClick={modal.onOpen}>모달 열기</Button>
      <Modal
        open={modal.open}
        onClose={modal.onClose}
        title="프로필 수정"
        footer={
          <>
            <Button variant="ghost" tone="neutral" onClick={modal.onClose}>
              취소
            </Button>
            <Button onClick={modal.onClose}>저장</Button>
          </>
        }
      >
        <Field label="이름" helperText="Escape·백드롭·닫기 버튼 모두 닫힘 요청을 보낸다">
          <TextField placeholder="홍길동" data-autofocus />
        </Field>
      </Modal>
    </>
  );
}
