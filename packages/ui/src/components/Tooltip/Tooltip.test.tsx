import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { Modal } from "../Modal/index.js";
import { Tooltip } from "./index.js";

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

function Harness({ delay }: { delay?: number }) {
  return (
    <Tooltip content="설명 문구" delay={delay}>
      <button type="button">트리거</button>
    </Tooltip>
  );
}

test("hover: 지연 후 표시되고 aria-describedby로 연결된다", () => {
  render(<Harness delay={200} />);
  const trigger = screen.getByRole("button", { name: "트리거" });

  fireEvent.mouseEnter(trigger);
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument(); // 아직 지연 중

  act(() => {
    vi.advanceTimersByTime(250);
  });
  const tooltip = screen.getByRole("tooltip");
  expect(tooltip).toHaveTextContent("설명 문구");
  expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);
  expect(trigger).toHaveAccessibleDescription("설명 문구");

  fireEvent.mouseLeave(trigger);
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
});

test("지연 중 벗어나면 표시되지 않는다 (타이머 취소)", () => {
  render(<Harness delay={200} />);
  const trigger = screen.getByRole("button");

  fireEvent.mouseEnter(trigger);
  fireEvent.mouseLeave(trigger);
  act(() => {
    vi.advanceTimersByTime(1000);
  });
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
});

test("키보드 포커스는 지연 없이 즉시 표시, blur로 닫힌다", () => {
  render(<Harness delay={200} />);
  const trigger = screen.getByRole("button");

  fireEvent.focus(trigger);
  expect(screen.getByRole("tooltip")).toBeInTheDocument(); // 지연 없음

  fireEvent.blur(trigger);
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
});

test("Escape: 툴팁만 닫고 이벤트를 소비한다 — Modal은 유지", () => {
  const onClose = vi.fn();
  render(
    <Modal open onClose={onClose} title="설정">
      <Tooltip content="도움말">
        <button type="button">트리거</button>
      </Tooltip>
    </Modal>,
  );
  fireEvent.focus(screen.getByRole("button", { name: "트리거" }));
  expect(screen.getByRole("tooltip")).toBeInTheDocument();

  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  expect(onClose).not.toHaveBeenCalled(); // 소비된 Escape — 모달은 안 닫힌다

  fireEvent.keyDown(document, { key: "Escape" });
  expect(onClose).toHaveBeenCalledTimes(1); // 이제 모달 차례
});

test("뷰포트 상단 충돌 시 bottom으로 플립된다", () => {
  render(<Harness />);
  const trigger = screen.getByRole("button");
  fireEvent.focus(trigger);
  // jsdom rect는 전부 0 — top 배치는 항상 상단 충돌로 계산되어 플립된다
  expect(screen.getByRole("tooltip")).toHaveAttribute("data-placement", "bottom");
});

test("트리거의 기존 핸들러가 함께 호출된다", () => {
  const onFocus = vi.fn();
  render(
    <Tooltip content="x">
      <button type="button" onFocus={onFocus}>
        트리거
      </button>
    </Tooltip>,
  );
  fireEvent.focus(screen.getByRole("button"));
  expect(onFocus).toHaveBeenCalledTimes(1);
});
