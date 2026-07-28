import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createRef } from "react";
import { expect, test, vi } from "vitest";

import { Button } from "./index.js";

test("기본값: type=button, solid·primary·md", () => {
  render(<Button>확인</Button>);
  const btn = screen.getByRole("button", { name: "확인" });
  expect(btn).toHaveAttribute("type", "button");
  expect(btn).toHaveAttribute("data-variant", "solid");
  expect(btn).toHaveAttribute("data-tone", "primary");
  expect(btn).toHaveAttribute("data-size", "md");
});

test("type을 명시하면 그대로 쓴다 (submit 버튼)", () => {
  render(<Button type="submit">저장</Button>);
  expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
});

test("클릭 핸들러가 호출된다", async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  render(<Button onClick={onClick}>클릭</Button>);
  await user.click(screen.getByRole("button"));
  expect(onClick).toHaveBeenCalledTimes(1);
});

test("loading: aria-busy + Spinner 표시 + 클릭 차단, 포커스는 유지 가능", async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  render(
    <Button loading onClick={onClick}>
      저장
    </Button>,
  );
  const btn = screen.getByRole("button", { name: /저장/ });
  expect(btn).toHaveAttribute("aria-busy", "true");
  expect(btn).not.toBeDisabled(); // 포커스를 잃지 않도록 native disabled를 쓰지 않는다
  expect(screen.getByRole("status", { name: "처리 중" })).toBeInTheDocument();

  await user.click(btn);
  expect(onClick).not.toHaveBeenCalled();
});

test("disabled: native disabled로 클릭 불가", async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  render(
    <Button disabled onClick={onClick}>
      비활성
    </Button>,
  );
  const btn = screen.getByRole("button");
  expect(btn).toBeDisabled();
  await user.click(btn);
  expect(onClick).not.toHaveBeenCalled();
});

test("icon·iconRight 슬롯 렌더, loading 중엔 icon이 Spinner로 대체", () => {
  const { rerender } = render(
    <Button icon={<i data-testid="left" />} iconRight={<i data-testid="right" />}>
      아이콘
    </Button>,
  );
  expect(screen.getByTestId("left")).toBeInTheDocument();
  expect(screen.getByTestId("right")).toBeInTheDocument();

  rerender(
    <Button loading icon={<i data-testid="left" />} iconRight={<i data-testid="right" />}>
      아이콘
    </Button>,
  );
  expect(screen.queryByTestId("left")).not.toBeInTheDocument();
  expect(screen.getByTestId("right")).toBeInTheDocument();
  expect(screen.getByRole("status")).toBeInTheDocument();
});

test("fullWidth·variant·tone 데이터 속성 반영", () => {
  render(
    <Button variant="ghost" tone="danger" fullWidth>
      x
    </Button>,
  );
  const btn = screen.getByRole("button");
  expect(btn).toHaveAttribute("data-variant", "ghost");
  expect(btn).toHaveAttribute("data-tone", "danger");
  expect(btn).toHaveAttribute("data-full-width");
});

test("ref가 button 요소로 연결된다", () => {
  const ref = createRef<HTMLButtonElement>();
  render(<Button ref={ref}>r</Button>);
  expect(ref.current).toBeInstanceOf(HTMLButtonElement);
});
