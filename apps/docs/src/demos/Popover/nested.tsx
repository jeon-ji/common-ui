import { Button, Modal, OverlayProvider, Popover, useDisclosure } from "@jeon-ji/common-ui";
import { useRef, useState } from "react";

export default function NestedDemo() {
  const modal = useDisclosure();
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <OverlayProvider>
      <Button onClick={modal.onOpen}>모달 열기</Button>
      <Modal open={modal.open} onClose={modal.onClose} title="중첩 오버레이">
        <p>Escape를 누르면 스택 최상단인 팝오버부터 닫히고, 한 번 더 누르면 모달이 닫힌다.</p>
        <Button
          ref={anchorRef}
          variant="outline"
          tone="neutral"
          aria-expanded={popoverOpen}
          onClick={() => setPopoverOpen((prev) => !prev)}
        >
          팝오버 열기
        </Button>
        <Popover anchorRef={anchorRef} open={popoverOpen} onOpenChange={setPopoverOpen}>
          중첩을 쓸 때는 공통 조상에 OverlayProvider가 있어야 Escape 소유권이 올바르다.
        </Popover>
      </Modal>
    </OverlayProvider>
  );
}
