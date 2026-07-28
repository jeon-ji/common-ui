import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { CloseIcon } from "../../icons/index.js";
import { IconButton } from "./index.js";

test("aria-label로 접근 가능한 이름을 가진다", () => {
  render(
    <IconButton aria-label="닫기">
      <CloseIcon />
    </IconButton>,
  );
  const btn = screen.getByRole("button", { name: "닫기" });
  expect(btn).toHaveAttribute("type", "button");
});

test("기본값은 ghost·neutral, 재정의 가능", () => {
  const { rerender } = render(
    <IconButton aria-label="검색">
      <CloseIcon />
    </IconButton>,
  );
  let btn = screen.getByRole("button");
  expect(btn).toHaveAttribute("data-variant", "ghost");
  expect(btn).toHaveAttribute("data-tone", "neutral");

  rerender(
    <IconButton aria-label="삭제" variant="solid" tone="danger">
      <CloseIcon />
    </IconButton>,
  );
  btn = screen.getByRole("button");
  expect(btn).toHaveAttribute("data-variant", "solid");
  expect(btn).toHaveAttribute("data-tone", "danger");
});

test("aria-label 없이는 타입이 성립하지 않는다 (컴파일 검증)", () => {
  // @ts-expect-error -- aria-label은 타입 레벨 필수다
  const invalid = <IconButton>{null}</IconButton>;
  expect(invalid).toBeTruthy(); // 렌더하지 않는다 — 타입 검증이 목적
});
