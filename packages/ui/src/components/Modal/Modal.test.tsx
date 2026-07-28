import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { expect, test, vi } from "vitest";

import { Modal, OverlayProvider } from "./index.js";

test("role=dialog + aria-modal + 제목 자동 연결, body 포털 렌더", () => {
  const { container } = render(
    <Modal open onClose={() => undefined} title="설정">
      내용
    </Modal>,
  );
  const dialog = screen.getByRole("dialog", { name: "설정" });
  expect(dialog).toHaveAttribute("aria-modal", "true");
  expect(container.contains(dialog)).toBe(false); // 렌더 트리 밖(포털)
});

test("open=false면 아무것도 렌더하지 않는다", () => {
  render(
    <Modal open={false} onClose={() => undefined} title="숨김">
      내용
    </Modal>,
  );
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("닫기 버튼·백드롭이 onClose를 호출하고 패널 클릭은 아니다", async () => {
  const user = userEvent.setup();
  const onClose = vi.fn();
  render(
    <Modal open onClose={onClose} title="설정">
      <p>본문</p>
    </Modal>,
  );

  await user.click(screen.getByText("본문"));
  expect(onClose).not.toHaveBeenCalled();

  await user.click(screen.getByRole("button", { name: "닫기" }));
  expect(onClose).toHaveBeenCalledTimes(1);

  const backdrop = document.querySelector(".ui-modal-backdrop");
  await user.pointer({ keys: "[MouseLeft]", target: backdrop as Element });
  expect(onClose).toHaveBeenCalledTimes(2);
});

test("Escape가 onClose를 호출한다", async () => {
  const user = userEvent.setup();
  const onClose = vi.fn();
  render(
    <Modal open onClose={onClose} title="설정">
      내용
    </Modal>,
  );
  await user.keyboard("{Escape}");
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("열리면 내부로 initial focus, 닫히면 트리거로 복원", async () => {
  const user = userEvent.setup();
  function App() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>
          모달 열기
        </button>
        <Modal open={open} onClose={() => setOpen(false)} title="설정">
          <button type="button" data-autofocus>
            확인
          </button>
        </Modal>
      </>
    );
  }
  render(<App />);
  const trigger = screen.getByRole("button", { name: "모달 열기" });

  await user.click(trigger);
  expect(screen.getByRole("button", { name: "확인" })).toHaveFocus();

  await user.keyboard("{Escape}");
  expect(trigger).toHaveFocus();
});

test("열려 있는 동안 body 스크롤이 잠기고 닫히면 복원된다", async () => {
  const user = userEvent.setup();
  function App() {
    const [open, setOpen] = useState(true);
    return (
      <Modal open={open} onClose={() => setOpen(false)} title="설정">
        내용
      </Modal>
    );
  }
  render(<App />);
  expect(document.body.style.overflow).toBe("hidden");

  await user.keyboard("{Escape}");
  expect(document.body.style.overflow).toBe("");
});

test("중첩 모달: Escape가 위 모달만 닫는다 (OverlayProvider)", async () => {
  const user = userEvent.setup();
  function App() {
    const [firstOpen, setFirstOpen] = useState(true);
    const [secondOpen, setSecondOpen] = useState(false);
    return (
      <OverlayProvider>
        <Modal open={firstOpen} onClose={() => setFirstOpen(false)} title="첫째">
          <button type="button" onClick={() => setSecondOpen(true)}>
            둘째 열기
          </button>
        </Modal>
        <Modal open={secondOpen} onClose={() => setSecondOpen(false)} title="둘째">
          내용
        </Modal>
      </OverlayProvider>
    );
  }
  render(<App />);
  await user.click(screen.getByRole("button", { name: "둘째 열기" }));
  expect(screen.getByRole("dialog", { name: "둘째" })).toBeInTheDocument();

  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog", { name: "둘째" })).not.toBeInTheDocument();
  expect(screen.getByRole("dialog", { name: "첫째" })).toBeInTheDocument();

  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
