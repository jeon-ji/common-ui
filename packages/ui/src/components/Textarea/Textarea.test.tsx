import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createRef } from "react";
import { expect, test, vi } from "vitest";

import { Field } from "../Field/index.js";
import { Textarea } from "./index.js";

test("입력하면 onChange가 값 문자열을 받는다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Textarea onChange={onChange} aria-label="메모" />);
  await user.type(screen.getByRole("textbox"), "안녕");
  expect(onChange).toHaveBeenLastCalledWith("안녕");
});

test("maxLength: 카운터 표시 + 초과 입력 차단", async () => {
  const user = userEvent.setup();
  render(<Textarea maxLength={5} aria-label="메모" />);
  const textarea = screen.getByRole("textbox");
  expect(screen.getByText("0/5")).toBeInTheDocument();

  await user.type(textarea, "1234567");
  expect(textarea).toHaveValue("12345");
  expect(screen.getByText("5/5")).toBeInTheDocument();
});

test("autoResize: 내용이 바뀌면 scrollHeight로 높이를 맞춘다", async () => {
  const user = userEvent.setup();
  render(<Textarea autoResize aria-label="메모" />);
  const textarea = screen.getByRole("textbox");
  Object.defineProperty(textarea, "scrollHeight", { value: 120, configurable: true });

  await user.type(textarea, "줄바꿈");
  expect(textarea.style.height).toBe("120px");
});

test("Field 안에서 label·error가 자동 연결된다", () => {
  render(
    <Field label="소개" errorText="필수 입력">
      <Textarea />
    </Field>,
  );
  const textarea = screen.getByLabelText("소개");
  expect(textarea).toHaveAttribute("aria-invalid", "true");
  expect(textarea).toHaveAccessibleDescription("필수 입력");
});

test("ref가 textarea 요소로 연결된다", () => {
  const ref = createRef<HTMLTextAreaElement>();
  render(<Textarea ref={ref} aria-label="r" />);
  expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
});
