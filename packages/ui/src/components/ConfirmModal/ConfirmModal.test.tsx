import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { ConfirmModal } from "./index.js";

test("primary 기본: 확인 문구·확인 버튼에 initial focus", () => {
  render(
    <ConfirmModal open onClose={() => undefined} onConfirm={() => undefined} title="저장할까요?" />,
  );
  expect(screen.getByRole("dialog", { name: "저장할까요?" })).toBeInTheDocument();
  const confirm = screen.getByRole("button", { name: "확인" });
  expect(confirm).toHaveFocus();
  expect(confirm).toHaveAttribute("data-tone", "primary");
});

test("danger: 기본 문구 '삭제' + 취소 버튼에 initial focus (오입력 방지)", () => {
  render(
    <ConfirmModal
      open
      tone="danger"
      onClose={() => undefined}
      onConfirm={() => undefined}
      title="삭제할까요?"
      description="되돌릴 수 없습니다."
    />,
  );
  expect(screen.getByRole("button", { name: "삭제" })).toHaveAttribute("data-tone", "danger");
  expect(screen.getByRole("button", { name: "취소" })).toHaveFocus();
  expect(screen.getByText("되돌릴 수 없습니다.")).toBeInTheDocument();
});

test("확인 클릭: onConfirm 후 onClose가 이어진다", async () => {
  const user = userEvent.setup();
  const order: string[] = [];
  render(
    <ConfirmModal
      open
      onClose={() => order.push("close")}
      onConfirm={() => order.push("confirm")}
      title="진행?"
    />,
  );
  await user.click(screen.getByRole("button", { name: "확인" }));
  expect(order).toEqual(["confirm", "close"]);
});

test("취소·Escape는 onClose만 호출한다", async () => {
  const user = userEvent.setup();
  const onConfirm = vi.fn();
  const onClose = vi.fn();
  render(<ConfirmModal open onClose={onClose} onConfirm={onConfirm} title="진행?" />);

  await user.click(screen.getByRole("button", { name: "취소" }));
  expect(onClose).toHaveBeenCalledTimes(1);

  await user.keyboard("{Escape}");
  expect(onClose).toHaveBeenCalledTimes(2);
  expect(onConfirm).not.toHaveBeenCalled();
});

test("confirmText/cancelText 재정의", () => {
  render(
    <ConfirmModal
      open
      tone="danger"
      onClose={() => undefined}
      onConfirm={() => undefined}
      title="탈퇴"
      confirmText="영구 삭제"
      cancelText="돌아가기"
    />,
  );
  expect(screen.getByRole("button", { name: "영구 삭제" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "돌아가기" })).toBeInTheDocument();
});
