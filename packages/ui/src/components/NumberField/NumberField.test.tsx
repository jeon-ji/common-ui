import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { expect, test, vi } from "vitest";

import { Field } from "../Field/index.js";
import { NumberField } from "./index.js";

test("입력하면 파싱된 숫자를 onChange로 넘긴다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<NumberField onChange={onChange} aria-label="수량" />);
  const input = screen.getByRole("spinbutton", { name: "수량" });

  await user.type(input, "1234");
  expect(onChange).toHaveBeenLastCalledWith(1234);
});

test("붙여넣기: 단위 텍스트·한글이 걸러진다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<NumberField onChange={onChange} aria-label="금액" />);
  const input = screen.getByRole("spinbutton");

  await user.click(input);
  await user.paste("1,234원");
  expect(input).toHaveValue("1,234");
  expect(onChange).toHaveBeenLastCalledWith(1234);
});

test("blur 시 천단위 포맷 + min/max clamp", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<NumberField max={5000} onChange={onChange} aria-label="금액" />);
  const input = screen.getByRole("spinbutton");

  await user.type(input, "1234567");
  await user.tab();
  expect(input).toHaveValue("5,000"); // clamp 후 포맷
  expect(onChange).toHaveBeenLastCalledWith(5000);
});

test("ArrowUp/ArrowDown이 step 단위로 증감하고 clamp된다", async () => {
  const user = userEvent.setup();
  render(<NumberField defaultValue={10} step={5} min={0} max={12} aria-label="수량" />);
  const input = screen.getByRole("spinbutton");

  await user.click(input);
  await user.keyboard("{ArrowUp}");
  expect(input).toHaveValue("12"); // 15 → max 12로 clamp
  await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
  expect(input).toHaveValue("0"); // 12→7→2→-3 → min 0
});

test("전부 지우면 null을 넘긴다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<NumberField defaultValue={42} onChange={onChange} aria-label="수량" />);
  await user.clear(screen.getByRole("spinbutton"));
  expect(onChange).toHaveBeenLastCalledWith(null);
});

test("controlled: 부모 리셋이 표시 문자열에 동기화된다", async () => {
  const user = userEvent.setup();
  function Harness() {
    const [value, setValue] = useState<number | null>(1000);
    return (
      <>
        <NumberField value={value} onChange={setValue} aria-label="금액" />
        <button type="button" onClick={() => setValue(0)}>
          리셋
        </button>
      </>
    );
  }
  render(<Harness />);
  const input = screen.getByRole("spinbutton");
  expect(input).toHaveValue("1,000");

  await user.click(screen.getByRole("button", { name: "리셋" }));
  expect(input).toHaveValue("0");
});

test("spinbutton 시맨틱: aria-valuenow/min/max", () => {
  render(<NumberField defaultValue={7} min={0} max={10} aria-label="점수" />);
  const input = screen.getByRole("spinbutton");
  expect(input).toHaveAttribute("aria-valuenow", "7");
  expect(input).toHaveAttribute("aria-valuemin", "0");
  expect(input).toHaveAttribute("aria-valuemax", "10");
});

test("Field 안에서 label·error가 자동 연결된다", () => {
  render(
    <Field label="수량" errorText="필수 입력">
      <NumberField />
    </Field>,
  );
  const input = screen.getByLabelText("수량");
  expect(input).toHaveAttribute("aria-invalid", "true");
});
