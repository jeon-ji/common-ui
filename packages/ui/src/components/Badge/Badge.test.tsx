import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { Badge } from "./index.js";

test("count를 표시하고 max 초과는 N+로 줄인다", () => {
  const { rerender } = render(<Badge count={5} />);
  expect(screen.getByText("5")).toBeInTheDocument();

  rerender(<Badge count={120} />);
  expect(screen.getByText("99+")).toBeInTheDocument();

  rerender(<Badge count={120} max={999} />);
  expect(screen.getByText("120")).toBeInTheDocument();
});

test("count 0은 숨긴다", () => {
  const { container } = render(<Badge count={0} />);
  expect(container.querySelector(".ui-badge")).toBeNull();
});

test("dot: 장식 점만 표시 (aria-hidden)", () => {
  const { container } = render(<Badge dot />);
  const dot = container.querySelector(".ui-badge");
  expect(dot).toHaveAttribute("data-dot");
  expect(dot).toHaveAttribute("aria-hidden", "true");
  expect(dot).toHaveTextContent("");
});

test("래핑형: 자식과 뱃지가 함께 렌더된다", () => {
  render(
    <Badge count={3}>
      <button type="button">알림</button>
    </Badge>,
  );
  expect(screen.getByRole("button", { name: /알림/ })).toBeInTheDocument();
  expect(screen.getByText("3")).toBeInTheDocument();
});
