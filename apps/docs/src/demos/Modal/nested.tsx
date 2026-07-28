import { Button, Modal, OverlayProvider, useDisclosure } from "@jeon-ji/common-ui";

/** 중첩 모달 — 공통 조상을 OverlayProvider로 감싸면 Escape가 최상단만 닫는다 */
export default function NestedDemo() {
  const first = useDisclosure();
  const second = useDisclosure();

  return (
    <OverlayProvider>
      <Button onClick={first.onOpen}>첫째 모달 열기</Button>
      <Modal open={first.open} onClose={first.onClose} title="첫째" size="md">
        <p>Escape를 눌러도 둘째가 열려 있으면 이 모달은 닫히지 않는다.</p>
        <Button size="sm" onClick={second.onOpen}>
          둘째 모달 열기
        </Button>
      </Modal>
      <Modal open={second.open} onClose={second.onClose} title="둘째" size="sm">
        여기서 Escape → 이 모달만 닫힌다.
      </Modal>
    </OverlayProvider>
  );
}
