import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createRef } from "react";
import { expect, test, vi } from "vitest";

import { Checkbox } from "./index.js";

test("클릭하면 boolean을 onChange로 넘긴다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Checkbox onChange={onChange}>동의</Checkbox>);
  const box = screen.getByRole("checkbox", { name: "동의" });

  await user.click(box);
  expect(box).toBeChecked();
  expect(onChange).toHaveBeenCalledExactlyOnceWith(true);

  await user.click(box);
  expect(onChange).toHaveBeenLastCalledWith(false);
});

test("라벨 텍스트 클릭으로도 토글된다 (label 내장)", async () => {
  const user = userEvent.setup();
  render(<Checkbox>라벨 영역</Checkbox>);
  await user.click(screen.getByText("라벨 영역"));
  expect(screen.getByRole("checkbox")).toBeChecked();
});

test("Space 키로 토글된다", async () => {
  const user = userEvent.setup();
  render(<Checkbox>키보드</Checkbox>);
  await user.tab();
  expect(screen.getByRole("checkbox")).toHaveFocus();
  await user.keyboard(" ");
  expect(screen.getByRole("checkbox")).toBeChecked();
});

test("checked만 넘기면(onChange 없음) 읽기 전용으로 동작한다", async () => {
  const user = userEvent.setup();
  render(<Checkbox checked={false}>읽기 전용</Checkbox>);
  const box = screen.getByRole("checkbox");
  await user.click(box);
  expect(box).not.toBeChecked(); // 경고 없이 상태 유지
});

test("indeterminate: DOM 프로퍼티 + aria-checked=mixed + 시각 표시 세 곳 모두", () => {
  render(<Checkbox indeterminate>전체 선택</Checkbox>);
  const box = screen.getByRole<HTMLInputElement>("checkbox");
  expect(box.indeterminate).toBe(true); // ① DOM 프로퍼티
  expect(box).toHaveAttribute("aria-checked", "mixed"); // ② 스크린리더
  expect(document.querySelector(".ui-checkbox-box")).toHaveAttribute("data-indeterminate"); // ③ 시각
});

test("indeterminate 해제 시 DOM 프로퍼티도 해제된다", () => {
  const { rerender } = render(<Checkbox indeterminate>x</Checkbox>);
  rerender(<Checkbox indeterminate={false}>x</Checkbox>);
  const box = screen.getByRole<HTMLInputElement>("checkbox");
  expect(box.indeterminate).toBe(false);
  expect(box).not.toHaveAttribute("aria-checked");
});

test("disabled: 클릭 불가", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(
    <Checkbox disabled onChange={onChange}>
      잠김
    </Checkbox>,
  );
  await user.click(screen.getByText("잠김"));
  expect(onChange).not.toHaveBeenCalled();
});

test("ref가 input 요소로 연결된다", () => {
  const ref = createRef<HTMLInputElement>();
  render(<Checkbox ref={ref}>r</Checkbox>);
  expect(ref.current).toBeInstanceOf(HTMLInputElement);
  expect(ref.current?.type).toBe("checkbox");
});
