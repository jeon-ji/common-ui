import { Button, Popover } from "@jeon-ji/common-ui";
import { useRef, useState } from "react";

export default function BasicDemo() {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        ref={anchorRef}
        aria-expanded={open}
        aria-controls={open ? "popover-basic" : undefined}
        onClick={() => setOpen((prev) => !prev)}
      >
        팝오버 열기
      </Button>
      <Popover id="popover-basic" anchorRef={anchorRef} open={open} onOpenChange={setOpen}>
        앵커 기준으로 배치되는 논모달 오버레이 — Escape·바깥 클릭으로 닫힌다.
      </Popover>
    </>
  );
}
