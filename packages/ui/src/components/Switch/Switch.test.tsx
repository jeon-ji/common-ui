import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { Field } from "../Field/index.js";
import { Switch } from "./index.js";

test("role=switch + aria-checked로 노출된다", () => {
  render(<Switch aria-label="알림" />);
  const el = screen.getByRole("switch", { name: "알림" });
  expect(el).toHaveAttribute("aria-checked", "false");
  expect(el).toHaveAttribute("type", "button"); // form 안 submit 방지
});

test("클릭으로 토글되고 onChange가 boolean을 받는다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Switch aria-label="알림" onChange={onChange} />);
  const el = screen.getByRole("switch");

  await user.click(el);
  expect(el).toHaveAttribute("aria-checked", "true");
  expect(onChange).toHaveBeenCalledExactlyOnceWith(true);
});

test("Space와 Enter로 토글된다", async () => {
  const user = userEvent.setup();
  render(<Switch aria-label="알림" />);
  const el = screen.getByRole("switch");

  await user.tab();
  expect(el).toHaveFocus();
  await user.keyboard(" ");
  expect(el).toHaveAttribute("aria-checked", "true");
  await user.keyboard("{Enter}");
  expect(el).toHaveAttribute("aria-checked", "false");
});

test("controlled: 부모가 갱신하기 전까지 상태가 바뀌지 않는다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Switch aria-label="알림" checked={false} onChange={onChange} />);
  const el = screen.getByRole("switch");

  await user.click(el);
  expect(onChange).toHaveBeenCalledExactlyOnceWith(true);
  expect(el).toHaveAttribute("aria-checked", "false");
});

test("disabled: 클릭·키보드 모두 불가", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Switch aria-label="알림" disabled onChange={onChange} />);
  await user.click(screen.getByRole("switch"));
  expect(onChange).not.toHaveBeenCalled();
});

test("Field 안에서 label이 자동 연결된다", () => {
  render(
    <Field label="이메일 수신">
      <Switch />
    </Field>,
  );
  expect(screen.getByLabelText("이메일 수신")).toHaveAttribute("role", "switch");
});
