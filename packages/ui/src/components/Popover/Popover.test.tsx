import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useRef, useState } from "react";
import { expect, test, vi } from "vitest";

import { Menu } from "../Menu/index.js";
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

function MenuInPopoverHarness({ onSelect }: { onSelect: (key: string) => void }) {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(true);
  return (
    <OverlayProvider>
      <button type="button" ref={anchorRef}>
        앵커
      </button>
      <Popover role="dialog" anchorRef={anchorRef} open={open} onOpenChange={setOpen}>
        <Menu
          items={[{ key: "a", label: "항목 A" }]}
          onSelect={onSelect}
          trigger={<button type="button">메뉴</button>}
        />
      </Popover>
    </OverlayProvider>
  );
}

test("중첩 포털: 팝오버 안 메뉴의 항목 클릭이 상위 팝오버를 닫지 않는다", async () => {
  // 포털 패널은 body 형제라 DOM 포함 검사만으로는 '안쪽'을 알 수 없다 —
  // 스택 소유권 없이는 pointerdown이 상위를 닫아 click 전에 항목이 사라진다
  const user = userEvent.setup();
  const onSelect = vi.fn();
  render(<MenuInPopoverHarness onSelect={onSelect} />);

  await user.click(screen.getByRole("button", { name: "메뉴" }));
  expect(screen.getByRole("menu")).toBeInTheDocument();
  expect(screen.getByRole("dialog")).toBeInTheDocument();

  await user.click(screen.getByRole("menuitem", { name: "항목 A" }));
  expect(onSelect).toHaveBeenCalledWith("a");
  expect(screen.getByRole("dialog")).toBeInTheDocument(); // 상위 팝오버는 유지
});

test("중첩 포털: 바깥 클릭은 최상단부터 한 겹씩 닫는다 (Escape와 같은 규칙)", async () => {
  const user = userEvent.setup();
  render(<MenuInPopoverHarness onSelect={vi.fn()} />);
  await user.click(screen.getByRole("button", { name: "메뉴" }));

  await user.click(document.body);
  expect(screen.queryByRole("menu")).not.toBeInTheDocument(); // 메뉴만
  expect(screen.getByRole("dialog")).toBeInTheDocument();

  await user.click(document.body);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); // 이제 팝오버
});

test("Modal 백드롭 클릭도 한 겹씩 — 팝오버가 위에 있으면 모달은 남는다", () => {
  const onModalClose = vi.fn();
  render(<NestedHarness onModalClose={onModalClose} />);
  fireEvent.click(screen.getByRole("button", { name: "팝오버 열기" }));
  expect(screen.getAllByRole("dialog")).toHaveLength(2);

  const backdrop = document.querySelector(".ui-modal-backdrop");
  fireEvent.pointerDown(backdrop as Element);
  expect(screen.queryAllByRole("dialog")).toHaveLength(1); // 팝오버만 닫힘
  expect(onModalClose).not.toHaveBeenCalled();

  fireEvent.pointerDown(backdrop as Element);
  expect(onModalClose).toHaveBeenCalledTimes(1); // 이제 모달 차례
});

test("열린 동안 앵커가 리마운트되면 새 앵커를 측정한다 (분리된 노드 금지)", () => {
  function RemountHarness() {
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const [key, setKey] = useState(0);
    return (
      <>
        <button type="button" key={key} ref={anchorRef} data-testid={`anchor-${key}`}>
          앵커
        </button>
        <button type="button" onClick={() => setKey(1)}>
          앵커 교체
        </button>
        <Popover role="dialog" anchorRef={anchorRef} defaultOpen>
          내용
        </Popover>
      </>
    );
  }
  render(<RemountHarness />);

  fireEvent.click(screen.getByRole("button", { name: "앵커 교체" }));
  const fresh = screen.getByTestId("anchor-1");
  const spy = vi.spyOn(fresh, "getBoundingClientRect");

  fireEvent.scroll(window); // track: true — 재측정 시점
  expect(spy).toHaveBeenCalled(); // 옛 노드가 아니라 현재 ref 대상을 잰다
});

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
