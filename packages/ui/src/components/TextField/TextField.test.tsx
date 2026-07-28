import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createRef } from "react";
import { expect, test, vi } from "vitest";

import { Field } from "../Field/index.js";
import { TextField } from "./index.js";

test("uncontrolled: 입력하면 onChange가 값 문자열을 받는다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<TextField defaultValue="" onChange={onChange} aria-label="이름" />);
  const input = screen.getByRole("textbox", { name: "이름" });

  await user.type(input, "ab");
  expect(input).toHaveValue("ab");
  expect(onChange).toHaveBeenLastCalledWith("ab");
});

test("controlled: 표시 값은 항상 value prop이다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<TextField value="고정" onChange={onChange} aria-label="이름" />);
  const input = screen.getByRole("textbox");

  await user.type(input, "x");
  expect(onChange).toHaveBeenLastCalledWith("고정x");
  expect(input).toHaveValue("고정"); // 부모가 갱신하기 전까지 그대로
});

test("password: 표시 토글 버튼이 type을 전환한다", async () => {
  const user = userEvent.setup();
  const { container } = render(
    <TextField type="password" defaultValue="pw" aria-label="비밀번호" />,
  );
  const input = container.querySelector("input");
  expect(input).toHaveAttribute("type", "password");

  const toggle = screen.getByRole("button", { name: "비밀번호 표시" });
  await user.click(toggle);
  expect(input).toHaveAttribute("type", "text");
  expect(screen.getByRole("button", { name: "비밀번호 숨기기" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("search: 값이 있을 때만 클리어 버튼, 클릭하면 비우고 포커스 복원", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<TextField type="search" defaultValue="" onChange={onChange} aria-label="검색" />);
  expect(screen.queryByRole("button", { name: "입력 지우기" })).not.toBeInTheDocument();

  const input = screen.getByRole("searchbox");
  await user.type(input, "abc");
  const clear = screen.getByRole("button", { name: "입력 지우기" });

  await user.click(clear);
  expect(input).toHaveValue("");
  expect(onChange).toHaveBeenLastCalledWith("");
  expect(input).toHaveFocus();
});

test("clearable: search가 아니어도 클리어 버튼을 켤 수 있다", async () => {
  const user = userEvent.setup();
  render(<TextField clearable defaultValue="지울 값" aria-label="메모" />);
  await user.click(screen.getByRole("button", { name: "입력 지우기" }));
  expect(screen.getByRole("textbox")).toHaveValue("");
});

test("prefix·suffix 슬롯이 렌더된다", () => {
  render(<TextField aria-label="금액" prefix={<span>₩</span>} suffix={<span>KRW</span>} />);
  expect(screen.getByText("₩")).toBeInTheDocument();
  expect(screen.getByText("KRW")).toBeInTheDocument();
});

test("Field 안에서 label·error가 자동 연결된다", () => {
  render(
    <Field label="이메일" errorText="형식 오류">
      <TextField defaultValue="x" />
    </Field>,
  );
  const input = screen.getByLabelText("이메일");
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveAccessibleDescription("형식 오류");
});

test("disabled: 입력·클리어 모두 불가", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(
    <TextField disabled clearable defaultValue="잠김" onChange={onChange} aria-label="잠김" />,
  );
  const input = screen.getByRole("textbox");
  expect(input).toBeDisabled();
  expect(screen.queryByRole("button", { name: "입력 지우기" })).not.toBeInTheDocument();
  await user.type(input, "x");
  expect(onChange).not.toHaveBeenCalled();
});

test("ref가 input 요소로 연결된다", () => {
  const ref = createRef<HTMLInputElement>();
  render(<TextField ref={ref} aria-label="r" />);
  expect(ref.current).toBeInstanceOf(HTMLInputElement);
});
