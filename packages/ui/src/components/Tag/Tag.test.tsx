import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { Tag } from "./index.js";

test("기본값: neutral·subtle", () => {
  render(<Tag>라벨</Tag>);
  const tag = screen.getByText("라벨");
  expect(tag).toHaveAttribute("data-tone", "neutral");
  expect(tag).toHaveAttribute("data-variant", "subtle");
});

test("tone·variant 데이터 속성 반영", () => {
  render(
    <Tag tone="danger" variant="outline">
      만료
    </Tag>,
  );
  const tag = screen.getByText("만료");
  expect(tag).toHaveAttribute("data-tone", "danger");
  expect(tag).toHaveAttribute("data-variant", "outline");
});

test("closable: 라벨 있는 닫기 버튼이 onClose를 호출한다", async () => {
  const user = userEvent.setup();
  const onClose = vi.fn();
  render(
    <Tag closable onClose={onClose}>
      제거 가능
    </Tag>,
  );
  const close = screen.getByRole("button", { name: "제거" });
  expect(close).toHaveAttribute("type", "button");

  await user.click(close);
  expect(onClose).toHaveBeenCalledTimes(1);
});

test("closable이 아니면 버튼이 없다", () => {
  render(<Tag>순수 라벨</Tag>);
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
