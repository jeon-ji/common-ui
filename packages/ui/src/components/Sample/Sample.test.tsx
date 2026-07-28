import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { Sample } from "./index.js";

test("children을 렌더하고 기본 tone은 neutral이다", () => {
  render(<Sample>내용</Sample>);
  const el = screen.getByText("내용");
  expect(el).toHaveAttribute("data-tone", "neutral");
  expect(el).toHaveClass("ui-sample");
});

test("tone·className·네이티브 prop이 전달된다", () => {
  render(
    <Sample tone="primary" className="extra" id="s1">
      x
    </Sample>,
  );
  const el = screen.getByText("x");
  expect(el).toHaveAttribute("data-tone", "primary");
  expect(el).toHaveClass("ui-sample", "extra");
  expect(el).toHaveAttribute("id", "s1");
});

test("ref가 DOM 요소로 연결된다", () => {
  const ref = createRef<HTMLDivElement>();
  render(<Sample ref={ref}>r</Sample>);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
});
