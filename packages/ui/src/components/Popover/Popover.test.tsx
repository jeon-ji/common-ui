import { fireEvent, render, screen } from "@testing-library/react";
import { useRef, useState } from "react";
import { expect, test, vi } from "vitest";

import { Modal, OverlayProvider } from "../Modal/index.js";
import { Popover } from "./index.js";

function Harness({
  defaultOpen,
  open,
  onOpenChange,
}: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <button type="button" ref={anchorRef}>
        앵커
      </button>
      <Popover
        role="dialog"
        anchorRef={anchorRef}
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
      >
        <button type="button">안쪽 버튼</button>
      </Popover>
    </>
  );
}

test("열리면 Portal 아래에 렌더되고 해석된 방향이 data 속성으로 노출된다", () => {
  render(<Harness defaultOpen />);
  const panel = screen.getByRole("dialog");
  expect(panel).toHaveTextContent("안쪽 버튼");
  // jsdom rect는 전부 0 — bottom은 공간이 충분해 그대로 유지된다
  expect(panel).toHaveAttribute("data-side", "bottom");
  expect(panel).toHaveAttribute("data-align", "center");
});

test("닫혀 있으면 아무것도 렌더하지 않는다", () => {
  render(<Harness />);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("바깥 pointerdown으로 닫히고 onOpenChange(false)가 호출된다", () => {
  const onOpenChange = vi.fn();
  render(<Harness defaultOpen onOpenChange={onOpenChange} />);

  fireEvent.pointerDown(document.body);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(onOpenChange).toHaveBeenCalledWith(false);
});

test("패널·앵커 안 pointerdown은 닫지 않는다", () => {
  render(<Harness defaultOpen />);

  fireEvent.pointerDown(screen.getByRole("button", { name: "안쪽 버튼" }));
  fireEvent.pointerDown(screen.getByRole("button", { name: "앵커" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});

test("닫힌 동안 바깥 pointerdown은 onOpenChange를 호출하지 않는다", () => {
  const onOpenChange = vi.fn();
  render(<Harness onOpenChange={onOpenChange} />);

  fireEvent.pointerDown(document.body);
  expect(onOpenChange).not.toHaveBeenCalled();
});

test("Escape로 닫히고, 패널 안에 있던 포커스는 앵커로 복원된다", () => {
  render(<Harness defaultOpen />);
  screen.getByRole("button", { name: "안쪽 버튼" }).focus();

  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "앵커" })).toHaveFocus();
});

test("제어형: 내부에서 상태를 바꾸지 않고 onOpenChange로만 알린다", () => {
  const onOpenChange = vi.fn();
  render(<Harness open onOpenChange={onOpenChange} />);

  fireEvent.keyDown(document, { key: "Escape" });
  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(screen.getByRole("dialog")).toBeInTheDocument(); // 부모가 안 닫으면 열려 있다
});

function NestedHarness({ onModalClose }: { onModalClose: () => void }) {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <OverlayProvider>
      <Modal open onClose={onModalClose} title="설정">
        <button type="button" ref={anchorRef} onClick={() => setOpen(true)}>
          팝오버 열기
        </button>
        <Popover role="dialog" anchorRef={anchorRef} open={open} onOpenChange={setOpen}>
          내용
        </Popover>
      </Modal>
    </OverlayProvider>
  );
}

test("Modal 안에서 Escape는 스택 최상단인 Popover만 닫는다", () => {
  const onModalClose = vi.fn();
  render(<NestedHarness onModalClose={onModalClose} />);

  fireEvent.click(screen.getByRole("button", { name: "팝오버 열기" }));
  expect(screen.getAllByRole("dialog")).toHaveLength(2); // 모달 + 팝오버

  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryAllByRole("dialog")).toHaveLength(1); // 모달만 남는다
  expect(onModalClose).not.toHaveBeenCalled();

  fireEvent.keyDown(document, { key: "Escape" });
  expect(onModalClose).toHaveBeenCalledTimes(1); // 이제 모달 차례
});
