import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { Radio, RadioGroup } from "./index.js";

function Fruits(props: { onChange?: (value: string) => void; defaultValue?: string }) {
  return (
    <RadioGroup aria-label="과일" {...props}>
      <Radio value="apple">사과</Radio>
      <Radio value="banana">바나나</Radio>
      <Radio value="grape">포도</Radio>
    </RadioGroup>
  );
}

test("클릭으로 단일 선택되고 onChange가 value를 받는다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Fruits onChange={onChange} />);

  await user.click(screen.getByRole("radio", { name: "사과" }));
  expect(onChange).toHaveBeenCalledExactlyOnceWith("apple");

  await user.click(screen.getByRole("radio", { name: "포도" }));
  expect(onChange).toHaveBeenLastCalledWith("grape");
  expect(screen.getByRole("radio", { name: "사과" })).not.toBeChecked();
  expect(screen.getByRole("radio", { name: "포도" })).toBeChecked();
});

test("defaultValue가 초기 선택을 정한다", () => {
  render(<Fruits defaultValue="banana" />);
  expect(screen.getByRole("radio", { name: "바나나" })).toBeChecked();
});

test("모든 Radio가 같은 name을 공유한다 (자동 생성)", () => {
  render(<Fruits />);
  const radios = screen.getAllByRole("radio");
  const names = new Set(radios.map((radio) => (radio as HTMLInputElement).name));
  expect(names.size).toBe(1);
  expect([...names][0]).not.toBe("");
});

test("화살표 키로 그룹 내 이동·선택된다 (네이티브 roving)", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Fruits defaultValue="apple" onChange={onChange} />);

  await user.click(screen.getByRole("radio", { name: "사과" }));
  await user.keyboard("{ArrowDown}");
  expect(screen.getByRole("radio", { name: "바나나" })).toBeChecked();
  expect(onChange).toHaveBeenLastCalledWith("banana");
});

test("그룹 disabled가 전체에 전파되고 개별 재정의도 된다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(
    <RadioGroup aria-label="옵션" disabled onChange={onChange}>
      <Radio value="a">A</Radio>
      <Radio value="b" disabled={false}>
        B
      </Radio>
    </RadioGroup>,
  );
  expect(screen.getByRole("radio", { name: "A" })).toBeDisabled();

  await user.click(screen.getByRole("radio", { name: "B" }));
  expect(onChange).toHaveBeenCalledExactlyOnceWith("b");
});

test("controlled: 부모가 갱신하기 전까지 선택이 바뀌지 않는다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(
    <RadioGroup aria-label="옵션" value="a" onChange={onChange}>
      <Radio value="a">A</Radio>
      <Radio value="b">B</Radio>
    </RadioGroup>,
  );
  await user.click(screen.getByRole("radio", { name: "B" }));
  expect(onChange).toHaveBeenCalledExactlyOnceWith("b");
  expect(screen.getByRole("radio", { name: "A" })).toBeChecked();
});

test("RadioGroup 밖의 Radio는 명시적 에러를 던진다", () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
  expect(() => render(<Radio value="x">고아</Radio>)).toThrow(/RadioGroup> 안에서만/);
  spy.mockRestore();
});
