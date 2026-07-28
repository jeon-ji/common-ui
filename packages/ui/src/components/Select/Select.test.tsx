import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { Field } from "../Field/index.js";
import { Select, type SelectItem } from "./index.js";

const ITEMS: SelectItem[] = [
  { value: "apple", label: "사과" },
  { value: "banana", label: "바나나", disabled: true },
  { value: "grape", label: "포도" },
];

test("닫힌 상태: combobox 시맨틱 + placeholder", () => {
  render(<Select items={ITEMS} placeholder="과일 선택" aria-label="과일" />);
  const trigger = screen.getByRole("combobox", { name: "과일" });
  expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(trigger).toHaveTextContent("과일 선택");
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

test("클릭으로 열리고 옵션 클릭으로 선택·닫힘", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Select items={ITEMS} onChange={onChange} aria-label="과일" />);
  const trigger = screen.getByRole("combobox");

  await user.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("listbox")).toBeInTheDocument();

  await user.click(screen.getByRole("option", { name: "포도" }));
  expect(onChange).toHaveBeenCalledExactlyOnceWith("grape");
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  expect(trigger).toHaveTextContent("포도");
});

test("키보드: ArrowDown으로 열고 disabled 건너뛰며 Enter로 선택, 포커스는 트리거 유지", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Select items={ITEMS} onChange={onChange} aria-label="과일" />);
  const trigger = screen.getByRole("combobox");

  await user.tab();
  await user.keyboard("{ArrowDown}"); // 열림, 첫 활성 옵션(사과)
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(trigger).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "사과" }).id,
  );

  await user.keyboard("{ArrowDown}"); // 바나나(disabled) 건너뛰고 포도
  expect(trigger).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "포도" }).id,
  );

  await user.keyboard("{Enter}");
  expect(onChange).toHaveBeenCalledExactlyOnceWith("grape");
  expect(trigger).toHaveFocus();
});

test("Home/End가 첫/마지막 활성 옵션으로 이동한다", async () => {
  const user = userEvent.setup();
  render(<Select items={ITEMS} aria-label="과일" />);

  await user.tab();
  await user.keyboard("{ArrowDown}{End}");
  expect(screen.getByRole("combobox")).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "포도" }).id,
  );
  await user.keyboard("{Home}");
  expect(screen.getByRole("combobox")).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "사과" }).id,
  );
});

test("Escape 소유권: 열려 있을 때만 닫고 전파를 멈춘다", async () => {
  const user = userEvent.setup();
  const escapesSeen = vi.fn();
  render(
    // 전파 관찰용 하네스 — 시맨틱 없는 리스너 래퍼임을 role로 명시
    <div
      role="presentation"
      onKeyDown={(event) => {
        if (event.key === "Escape") escapesSeen();
      }}
    >
      <Select items={ITEMS} aria-label="과일" />
    </div>,
  );

  await user.tab();
  await user.keyboard("{ArrowDown}");
  await user.keyboard("{Escape}"); // 열림 상태 — Select가 소유, 바깥은 못 본다
  expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  expect(escapesSeen).not.toHaveBeenCalled();

  await user.keyboard("{Escape}"); // 닫힘 상태 — 소유권 없음, 바깥으로 전파
  expect(escapesSeen).toHaveBeenCalledTimes(1);
});

test("바깥 클릭으로 닫힌다", async () => {
  const user = userEvent.setup();
  render(
    <>
      <Select items={ITEMS} aria-label="과일" />
      <button type="button">바깥</button>
    </>,
  );
  await user.click(screen.getByRole("combobox"));
  expect(screen.getByRole("listbox")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "바깥" }));
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

test("disabled 옵션은 클릭해도 선택되지 않는다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Select items={ITEMS} onChange={onChange} aria-label="과일" />);
  await user.click(screen.getByRole("combobox"));
  await user.click(screen.getByRole("option", { name: "바나나" }));
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole("listbox")).toBeInTheDocument(); // 닫히지도 않는다
});

test("controlled: 부모가 갱신하기 전까지 표시가 바뀌지 않는다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Select items={ITEMS} value="apple" onChange={onChange} aria-label="과일" />);
  const trigger = screen.getByRole("combobox");
  expect(trigger).toHaveTextContent("사과");

  await user.click(trigger);
  await user.click(screen.getByRole("option", { name: "포도" }));
  expect(onChange).toHaveBeenCalledExactlyOnceWith("grape");
  expect(trigger).toHaveTextContent("사과");
});

test("items에 없는 value는 캐스팅 없이 placeholder로 처리한다", () => {
  render(<Select items={ITEMS} value="ghost" placeholder="선택" aria-label="과일" />);
  expect(screen.getByRole("combobox")).toHaveTextContent("선택");
});

test("선택된 옵션에 aria-selected가 붙는다", async () => {
  const user = userEvent.setup();
  render(<Select items={ITEMS} defaultValue="apple" aria-label="과일" />);
  await user.click(screen.getByRole("combobox"));
  expect(screen.getByRole("option", { name: /사과/ })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("option", { name: "포도" })).toHaveAttribute("aria-selected", "false");
});

test("Field 안에서 label·error가 자동 연결된다", () => {
  render(
    <Field label="과일" errorText="필수 선택">
      <Select items={ITEMS} />
    </Field>,
  );
  const trigger = screen.getByLabelText("과일");
  expect(trigger).toHaveAttribute("aria-invalid", "true");
});

test("disabled: 열리지 않는다", async () => {
  const user = userEvent.setup();
  render(<Select items={ITEMS} disabled aria-label="과일" />);
  await user.click(screen.getByRole("combobox"));
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});
