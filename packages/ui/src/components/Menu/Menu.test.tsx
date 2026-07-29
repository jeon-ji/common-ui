import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { Menu, type MenuItem } from "./index.js";

const ITEMS: MenuItem[] = [
  { key: "rename", label: "이름 변경" },
  { key: "duplicate", label: "복제", disabled: true },
  { key: "delete", label: "삭제", danger: true },
];

function Harness({
  onSelect,
  onOpenChange,
  defaultOpen,
}: {
  onSelect?: (key: string) => void;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}) {
  return (
    <Menu
      items={ITEMS}
      onSelect={onSelect}
      onOpenChange={onOpenChange}
      defaultOpen={defaultOpen}
      trigger={<button type="button">메뉴</button>}
    />
  );
}

test("트리거 aria 배선: haspopup/expanded/controls가 열림 상태를 따른다", () => {
  render(<Harness />);
  const trigger = screen.getByRole("button", { name: "메뉴" });
  expect(trigger).toHaveAttribute("aria-haspopup", "menu");
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(trigger).not.toHaveAttribute("aria-controls");

  fireEvent.click(trigger);
  const menu = screen.getByRole("menu");
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(trigger).toHaveAttribute("aria-controls", menu.id);
});

test("열리면 포커스가 메뉴 컨테이너로 가고 첫 활성 항목을 activedescendant로 가리킨다", () => {
  render(<Harness />);
  fireEvent.click(screen.getByRole("button", { name: "메뉴" }));

  const menu = screen.getByRole("menu");
  expect(menu).toHaveFocus();
  const first = screen.getByRole("menuitem", { name: "이름 변경" });
  expect(menu).toHaveAttribute("aria-activedescendant", first.id);
  expect(first).toHaveAttribute("data-active");
});

test("화살표 이동: disabled를 건너뛰고 끝에서 멈춘다 (랩 없음)", () => {
  render(<Harness />);
  fireEvent.click(screen.getByRole("button", { name: "메뉴" }));
  const menu = screen.getByRole("menu");
  const deleteItem = screen.getByRole("menuitem", { name: "삭제" });

  fireEvent.keyDown(menu, { key: "ArrowDown" }); // 복제(disabled) 건너뛰고 삭제로
  expect(menu).toHaveAttribute("aria-activedescendant", deleteItem.id);

  fireEvent.keyDown(menu, { key: "ArrowDown" }); // 끝 — 그대로 유지
  expect(menu).toHaveAttribute("aria-activedescendant", deleteItem.id);

  fireEvent.keyDown(menu, { key: "Home" });
  expect(menu).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("menuitem", { name: "이름 변경" }).id,
  );
  fireEvent.keyDown(menu, { key: "End" });
  expect(menu).toHaveAttribute("aria-activedescendant", deleteItem.id);
});

test("트리거에서 ArrowUp으로 열면 마지막 활성 항목부터 시작한다", () => {
  render(<Harness />);
  const trigger = screen.getByRole("button", { name: "메뉴" });
  fireEvent.keyDown(trigger, { key: "ArrowUp" });

  const menu = screen.getByRole("menu");
  expect(menu).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("menuitem", { name: "삭제" }).id,
  );
});

test("Enter로 활성 항목을 선택하면 onSelect 후 닫히고 트리거로 포커스가 돌아온다", () => {
  const onSelect = vi.fn();
  render(<Harness onSelect={onSelect} />);
  const trigger = screen.getByRole("button", { name: "메뉴" });
  fireEvent.click(trigger);

  fireEvent.keyDown(screen.getByRole("menu"), { key: "Enter" });
  expect(onSelect).toHaveBeenCalledWith("rename");
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test("클릭 선택: disabled 항목은 선택되지 않는다", () => {
  const onSelect = vi.fn();
  render(<Harness onSelect={onSelect} />);
  fireEvent.click(screen.getByRole("button", { name: "메뉴" }));

  fireEvent.click(screen.getByRole("menuitem", { name: "복제" }));
  expect(onSelect).not.toHaveBeenCalled();
  expect(screen.getByRole("menu")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("menuitem", { name: "삭제" }));
  expect(onSelect).toHaveBeenCalledWith("delete");
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
});

test("Escape: 닫히고 트리거로 포커스 복원, onSelect는 호출되지 않는다", () => {
  const onSelect = vi.fn();
  render(<Harness onSelect={onSelect} />);
  const trigger = screen.getByRole("button", { name: "메뉴" });
  fireEvent.click(trigger);
  expect(screen.getByRole("menu")).toHaveFocus();

  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(onSelect).not.toHaveBeenCalled();
  expect(trigger).toHaveFocus();
});

test("Tab: 닫고 트리거로 복귀하되 기본 포커스 이동은 막지 않는다", () => {
  render(<Harness />);
  const trigger = screen.getByRole("button", { name: "메뉴" });
  fireEvent.click(trigger);

  const menu = screen.getByRole("menu");
  const defaultAllowed = fireEvent.keyDown(menu, { key: "Tab" });
  expect(defaultAllowed).toBe(true); // preventDefault 안 함
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});

test("danger 항목은 data-danger로 노출된다", () => {
  render(<Harness defaultOpen />);
  expect(screen.getByRole("menuitem", { name: "삭제" })).toHaveAttribute("data-danger");
  expect(screen.getByRole("menuitem", { name: "이름 변경" })).not.toHaveAttribute("data-danger");
});

test("바깥 pointerdown으로 닫히고 onOpenChange(false)가 호출된다", () => {
  const onOpenChange = vi.fn();
  render(<Harness onOpenChange={onOpenChange} />);
  fireEvent.click(screen.getByRole("button", { name: "메뉴" }));

  fireEvent.pointerDown(document.body);
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
});

test("포인터 이동으로 활성 항목이 바뀌고 disabled 위에서는 바뀌지 않는다", () => {
  render(<Harness defaultOpen />);
  const menu = screen.getByRole("menu");
  const deleteItem = screen.getByRole("menuitem", { name: "삭제" });

  fireEvent.pointerMove(deleteItem);
  expect(menu).toHaveAttribute("aria-activedescendant", deleteItem.id);

  fireEvent.pointerMove(screen.getByRole("menuitem", { name: "복제" }));
  expect(menu).toHaveAttribute("aria-activedescendant", deleteItem.id); // 그대로
});
