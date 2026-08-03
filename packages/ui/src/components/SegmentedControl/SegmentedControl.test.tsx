import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { expect, test, vi } from "vitest";

import { SegmentedControl, type SegmentedItem } from "./index.js";

const ITEMS: SegmentedItem[] = [
  { value: "list", label: "목록" },
  { value: "board", label: "보드", disabled: true },
  { value: "calendar", label: "캘린더" },
];

/** 실제로 포커스를 받는 항목(tabIndex 0) — 키 이벤트는 여기서 발생한다 */
function focusableItem(): HTMLElement {
  const item = screen.getAllByRole("radio").find((el) => el.getAttribute("tabindex") === "0");
  if (!item) throw new Error("포커스 가능한 항목이 없다");
  return item;
}

test("radiogroup·radio 시맨틱과 선택 상태", () => {
  render(<SegmentedControl items={ITEMS} aria-label="보기 방식" />);

  expect(screen.getByRole("radiogroup", { name: "보기 방식" })).toBeInTheDocument();
  const radios = screen.getAllByRole("radio");
  expect(radios).toHaveLength(3);
  expect(radios[0]).toHaveAttribute("aria-checked", "true"); // 첫 활성 항목
  expect(radios[2]).toHaveAttribute("aria-checked", "false");
});

test("roving tabindex: 선택된 항목만 탭 순서에 들어간다", () => {
  render(<SegmentedControl items={ITEMS} />);
  const radios = screen.getAllByRole("radio");
  expect(radios[0]).toHaveAttribute("tabindex", "0");
  expect(radios[1]).toHaveAttribute("tabindex", "-1");
  expect(radios[2]).toHaveAttribute("tabindex", "-1");
});

test("화살표 이동이 곧 선택이고 disabled를 건너뛴다", () => {
  const onChange = vi.fn();
  render(<SegmentedControl items={ITEMS} onChange={onChange} />);

  fireEvent.keyDown(focusableItem(), { key: "ArrowRight" }); // 보드(disabled) 건너뛰고 캘린더
  expect(onChange).toHaveBeenLastCalledWith("calendar");
  expect(screen.getByRole("radio", { name: "캘린더" })).toHaveAttribute("aria-checked", "true");
  expect(screen.getByRole("radio", { name: "캘린더" })).toHaveFocus();
});

test("세로 화살표도 같은 이동을 한다", () => {
  render(<SegmentedControl items={ITEMS} />);
  fireEvent.keyDown(focusableItem(), { key: "ArrowDown" });
  expect(screen.getByRole("radio", { name: "캘린더" })).toHaveAttribute("aria-checked", "true");

  fireEvent.keyDown(focusableItem(), { key: "ArrowUp" });
  expect(screen.getByRole("radio", { name: "목록" })).toHaveAttribute("aria-checked", "true");
});

test("양 끝에서 순환한다 (라디오 관례)", () => {
  render(<SegmentedControl items={ITEMS} />);

  fireEvent.keyDown(focusableItem(), { key: "ArrowLeft" }); // 첫 항목에서 왼쪽 → 마지막
  expect(screen.getByRole("radio", { name: "캘린더" })).toHaveAttribute("aria-checked", "true");

  fireEvent.keyDown(focusableItem(), { key: "ArrowRight" }); // 마지막에서 오른쪽 → 첫 항목
  expect(screen.getByRole("radio", { name: "목록" })).toHaveAttribute("aria-checked", "true");
});

test("Home·End로 양 끝 활성 항목을 고른다", () => {
  render(<SegmentedControl items={ITEMS} defaultValue="calendar" />);

  fireEvent.keyDown(focusableItem(), { key: "Home" });
  expect(screen.getByRole("radio", { name: "목록" })).toHaveAttribute("aria-checked", "true");

  fireEvent.keyDown(focusableItem(), { key: "End" });
  expect(screen.getByRole("radio", { name: "캘린더" })).toHaveAttribute("aria-checked", "true");
});

test("disabled 항목은 클릭해도 선택되지 않는다", () => {
  const onChange = vi.fn();
  render(<SegmentedControl items={ITEMS} onChange={onChange} />);

  fireEvent.click(screen.getByRole("radio", { name: "보드" }));
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole("radio", { name: "목록" })).toHaveAttribute("aria-checked", "true");
});

test("클릭으로 값을 바꾼다", () => {
  const onChange = vi.fn();
  render(<SegmentedControl items={ITEMS} onChange={onChange} />);

  fireEvent.click(screen.getByRole("radio", { name: "캘린더" }));
  expect(onChange).toHaveBeenCalledWith("calendar");
});

test("제어형: 부모가 바꾸지 않으면 선택이 유지된다", () => {
  const onChange = vi.fn();
  render(<SegmentedControl items={ITEMS} value="list" onChange={onChange} />);

  fireEvent.click(screen.getByRole("radio", { name: "캘린더" }));
  expect(onChange).toHaveBeenCalledWith("calendar");
  expect(screen.getByRole("radio", { name: "목록" })).toHaveAttribute("aria-checked", "true");
});

test("제어형 상태 갱신이 반영된다", () => {
  function Controlled() {
    const [value, setValue] = useState("list");
    return <SegmentedControl items={ITEMS} value={value} onChange={setValue} />;
  }
  render(<Controlled />);

  fireEvent.click(screen.getByRole("radio", { name: "캘린더" }));
  expect(screen.getByRole("radio", { name: "캘린더" })).toHaveAttribute("aria-checked", "true");
});

test("iconOnly: 라벨은 감춰지지만 접근 이름으로 남는다", () => {
  render(
    <SegmentedControl
      iconOnly
      items={[
        { value: "list", label: "목록", icon: <svg aria-hidden="true" /> },
        { value: "grid", label: "그리드", icon: <svg aria-hidden="true" /> },
      ]}
    />,
  );
  // 이름으로 찾을 수 있다 = 접근 이름이 살아 있다
  expect(screen.getByRole("radio", { name: "목록" })).toBeInTheDocument();
  expect(screen.getByRole("radio", { name: "그리드" })).toBeInTheDocument();
});

test("아이콘은 주입형이며 장식 요소로 감춰진다", () => {
  render(
    <SegmentedControl
      items={[{ value: "a", label: "가", icon: <span data-testid="injected">★</span> }]}
    />,
  );
  const icon = screen.getByTestId("injected");
  expect(icon).toBeInTheDocument();
  expect(icon.parentElement).toHaveAttribute("aria-hidden", "true");
});

test("선택 값이 disabled 항목이어도 활성 항목으로 키보드 진입이 가능하다", () => {
  render(<SegmentedControl items={ITEMS} defaultValue="board" />);

  const enabled = screen.getByRole("radio", { name: "목록" });
  expect(enabled).toHaveAttribute("tabindex", "0"); // 포커스 가능한 항목이 실제로 활성 항목이다
  expect(screen.getByRole("radio", { name: "보드" })).toHaveAttribute("tabindex", "-1");

  fireEvent.keyDown(enabled, { key: "ArrowRight" });
  expect(screen.getByRole("radio", { name: "캘린더" })).toHaveAttribute("aria-checked", "true");
});

test("items가 나중에 도착해도 첫 활성 항목이 선택된다", () => {
  function AsyncItems() {
    const [items, setItems] = useState<SegmentedItem[]>([]);
    return (
      <>
        <button type="button" onClick={() => setItems(ITEMS)}>
          불러오기
        </button>
        <SegmentedControl items={items} />
      </>
    );
  }
  render(<AsyncItems />);
  fireEvent.click(screen.getByRole("button", { name: "불러오기" }));
  expect(screen.getByRole("radio", { name: "목록" })).toHaveAttribute("aria-checked", "true");
});

test("목록에 없는 value: 아무것도 선택되지 않지만 그룹 진입은 유지한다", () => {
  render(<SegmentedControl items={ITEMS} value="없음" />);

  expect(
    screen.getAllByRole("radio").every((radio) => radio.getAttribute("aria-checked") === "false"),
  ).toBe(true);
  expect(screen.getByRole("radio", { name: "목록" })).toHaveAttribute("tabindex", "0");
});

test("항목이 줄어든 뒤에도 이동이 계속 동작한다", () => {
  function Shrinking() {
    const [items, setItems] = useState(ITEMS);
    return (
      <>
        <button type="button" onClick={() => setItems(ITEMS.slice(0, 1))}>
          줄이기
        </button>
        <SegmentedControl items={items} defaultValue="calendar" />
      </>
    );
  }
  render(<Shrinking />);
  fireEvent.click(screen.getByRole("button", { name: "줄이기" }));

  fireEvent.keyDown(focusableItem(), { key: "ArrowRight" });
  expect(screen.getByRole("radio", { name: "목록" })).toHaveAttribute("aria-checked", "true");
});

test("radiogroup의 접근 이름은 소비자가 준 aria-label에서 온다", () => {
  render(<SegmentedControl items={ITEMS} aria-label="보기 방식" />);

  expect(screen.getByRole("radiogroup", { name: "보기 방식" })).toBeInTheDocument();
});
