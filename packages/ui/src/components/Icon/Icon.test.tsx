import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { CheckIcon } from "../../icons/index.js";

test("기본값: 1em 크기, 장식용(aria-hidden)", () => {
  const { container } = render(<CheckIcon data-testid="i" />);
  const svg = container.querySelector("svg");
  expect(svg).toHaveAttribute("width", "1em");
  expect(svg).toHaveAttribute("height", "1em");
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(svg).not.toHaveAttribute("role");
});

test("aria-label을 주면 img 역할로 노출된다", () => {
  render(<CheckIcon aria-label="완료" />);
  const svg = screen.getByRole("img", { name: "완료" });
  expect(svg).not.toHaveAttribute("aria-hidden");
});

test("size prop이 width/height에 반영된다", () => {
  const { container } = render(<CheckIcon size={20} />);
  const svg = container.querySelector("svg");
  expect(svg).toHaveAttribute("width", "20");
  expect(svg).toHaveAttribute("height", "20");
});

test("currentColor 상속 — 소스 svg가 stroke=currentColor를 유지한다", () => {
  const { container } = render(<CheckIcon />);
  expect(container.querySelector("svg")).toHaveAttribute("stroke", "currentColor");
});

test("ref가 svg 요소로 연결된다", () => {
  const ref = createRef<SVGSVGElement>();
  render(<CheckIcon ref={ref} />);
  expect(ref.current).toBeInstanceOf(SVGSVGElement);
});
