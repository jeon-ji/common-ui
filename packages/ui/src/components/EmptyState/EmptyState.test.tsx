import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createRef } from "react";
import { expect, test, vi } from "vitest";

import { EmptyState } from "./index.js";

const rootOf = (container: HTMLElement) => container.querySelector(".ui-empty-state");

test("제목·설명·액션을 그리고 액션은 실제로 눌린다", async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  render(
    <EmptyState
      title="결과가 없습니다"
      description="검색어를 바꿔 보세요"
      action={
        <button type="button" onClick={onClick}>
          새로 만들기
        </button>
      }
    />,
  );

  expect(screen.getByText("결과가 없습니다")).toBeInTheDocument();
  expect(screen.getByText("검색어를 바꿔 보세요")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "새로 만들기" }));
  expect(onClick).toHaveBeenCalledTimes(1);
});

test("설명·액션을 안 넘기면 그 자리를 만들지 않는다", () => {
  const { container } = render(<EmptyState title="결과가 없습니다" />);

  expect(container.querySelector(".ui-empty-state-description")).toBeNull();
  expect(container.querySelector(".ui-empty-state-action")).toBeNull();
});

test("아이콘 3상태: 미지정은 status 기본값, null은 없음, 노드는 그대로", () => {
  const { container, rerender } = render(<EmptyState title="비었습니다" />);
  // empty의 기본 아이콘은 없다
  expect(container.querySelector(".ui-empty-state-icon")).toBeNull();

  rerender(<EmptyState status="error" title="불러오지 못했습니다" />);
  expect(container.querySelector(".ui-empty-state-icon svg")).toBeInTheDocument();

  rerender(<EmptyState status="error" title="불러오지 못했습니다" icon={null} />);
  expect(container.querySelector(".ui-empty-state-icon")).toBeNull();

  rerender(<EmptyState title="비었습니다" icon={<span>CUSTOM</span>} />);
  expect(screen.getByText("CUSTOM")).toBeInTheDocument();
});

test("아이콘은 장식이다 — aria-hidden", () => {
  const { container } = render(<EmptyState status="error" title="불러오지 못했습니다" />);

  expect(container.querySelector(".ui-empty-state-icon")).toHaveAttribute("aria-hidden", "true");
});

test("기본으로는 낭독하지 않는다 — role도 aria-live도 붙이지 않는다", () => {
  const { container } = render(<EmptyState status="error" title="불러오지 못했습니다" />);

  const root = rootOf(container);
  expect(root).not.toHaveAttribute("role");
  expect(root).not.toHaveAttribute("aria-live");
});

test("낭독이 필요하면 소비자가 role을 내려보낸다", () => {
  render(<EmptyState role="status" title="결과가 없습니다" />);

  expect(screen.getByRole("status")).toHaveTextContent("결과가 없습니다");
});

test("기본값은 empty·md이고 지정하면 데이터 속성에 반영된다", () => {
  const { container, rerender } = render(<EmptyState title="비었습니다" />);
  expect(rootOf(container)).toHaveAttribute("data-status", "empty");
  expect(rootOf(container)).toHaveAttribute("data-size", "md");

  rerender(<EmptyState title="비었습니다" status="error" size="sm" />);
  expect(rootOf(container)).toHaveAttribute("data-status", "error");
  expect(rootOf(container)).toHaveAttribute("data-size", "sm");
});

test("className·style·ref는 루트로 간다", () => {
  const ref = createRef<HTMLDivElement>();
  const { container } = render(
    <EmptyState ref={ref} title="비었습니다" className="custom" style={{ opacity: 0.5 }} />,
  );

  const root = rootOf(container);
  expect(ref.current).toBe(root);
  expect(root).toHaveClass("custom");
  expect(root).toHaveStyle({ opacity: "0.5" });
});
