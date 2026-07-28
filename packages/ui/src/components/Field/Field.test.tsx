import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { Field, useFieldControl } from "./index.js";

/** Field 컨텍스트를 소비하는 최소 컨트롤 — TextField류가 하는 일과 동일 */
function TestInput() {
  const control = useFieldControl();
  return <input {...control} />;
}

test("label의 htmlFor가 컨트롤 id와 연결된다", () => {
  render(
    <Field label="이름">
      <TestInput />
    </Field>,
  );
  const input = screen.getByLabelText("이름");
  expect(input.tagName).toBe("INPUT");
});

test("required: 라벨에 * 표시 + 컨트롤에 required 전파", () => {
  render(
    <Field label="이메일" required>
      <TestInput />
    </Field>,
  );
  const input = screen.getByLabelText(/이메일/);
  expect(input).toBeRequired();
});

test("helperText가 aria-describedby로 연결된다", () => {
  render(
    <Field label="비밀번호" helperText="8자 이상">
      <TestInput />
    </Field>,
  );
  const input = screen.getByLabelText("비밀번호");
  expect(input).toHaveAccessibleDescription("8자 이상");
  expect(input).not.toHaveAttribute("aria-invalid");
});

test("errorText: invalid 상태 + helper를 대체 + aria-errormessage 연결", () => {
  render(
    <Field label="비밀번호" helperText="8자 이상" errorText="너무 짧습니다">
      <TestInput />
    </Field>,
  );
  const input = screen.getByLabelText("비밀번호");
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveAccessibleDescription("너무 짧습니다");
  expect(screen.queryByText("8자 이상")).not.toBeInTheDocument();

  const errorId = input.getAttribute("aria-errormessage");
  expect(errorId).toBeTruthy();
  expect(document.getElementById(errorId ?? "")).toHaveTextContent("너무 짧습니다");
});

test("Field 밖에서 쓰인 컨트롤은 아무 속성도 받지 않는다", () => {
  render(<TestInput />);
  const input = screen.getByRole("textbox");
  expect(input).not.toHaveAttribute("id");
  expect(input).not.toHaveAttribute("aria-describedby");
  expect(input).not.toBeRequired();
});
