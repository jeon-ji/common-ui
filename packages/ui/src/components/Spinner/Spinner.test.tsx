import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { Skeleton } from "../Skeleton/index.js";
import { Spinner } from "./index.js";

test("Spinner: role=status와 기본 라벨로 노출된다", () => {
  render(<Spinner />);
  const el = screen.getByRole("status", { name: "로딩 중" });
  expect(el).toHaveAttribute("data-size", "md");
});

test("Spinner: size와 aria-label 재정의", () => {
  render(<Spinner size="lg" aria-label="목록 불러오는 중" />);
  expect(screen.getByRole("status", { name: "목록 불러오는 중" })).toHaveAttribute(
    "data-size",
    "lg",
  );
});

test("Skeleton: 장식 요소라 스크린리더에 노출되지 않는다", () => {
  const { container } = render(<Skeleton data-testid="sk" />);
  const el = container.firstElementChild;
  expect(el).toHaveAttribute("aria-hidden", "true");
  expect(el).toHaveAttribute("data-variant", "text");
});

test("Skeleton: variant·width·height 반영", () => {
  const { container } = render(<Skeleton variant="circle" width={40} height={40} />);
  const el = container.firstElementChild as HTMLElement;
  expect(el).toHaveAttribute("data-variant", "circle");
  expect(el.style.width).toBe("40px");
  expect(el.style.height).toBe("40px");
});
