import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { expect, test, vi } from "vitest";

import { Pagination } from "./index.js";

test("시맨틱: nav 이름 + 현재 페이지에 aria-current", () => {
  render(<Pagination total={5} defaultValue={3} />);

  expect(screen.getByRole("navigation", { name: "페이지네이션" })).toBeInTheDocument();
  const current = screen.getByRole("button", { current: "page" });
  expect(current).toHaveTextContent("3");
  // 나머지 페이지 버튼에는 없다
  expect(screen.getByRole("button", { name: "4 페이지" })).not.toHaveAttribute("aria-current");
});

test("페이지 버튼 이름은 번호만 담고 현재 여부는 aria-current가 알린다", () => {
  render(<Pagination total={5} defaultValue={2} />);
  const current = screen.getByRole("button", { name: "2 페이지" });
  // 이름에 "현재 페이지"를 넣으면 aria-current와 겹쳐 두 번 안내된다
  expect(current).toHaveAttribute("aria-current", "page");
  expect(current).toHaveAccessibleName("2 페이지");
});

test("total이 1 이하면 아무것도 렌더하지 않는다", () => {
  const { container } = render(<Pagination total={1} />);
  expect(container).toBeEmptyDOMElement();
  expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
});

test("페이지 버튼 클릭으로 이동한다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Pagination total={10} onChange={onChange} />);

  await user.click(screen.getByRole("button", { name: "3 페이지" }));
  expect(onChange).toHaveBeenCalledExactlyOnceWith(3);
  expect(screen.getByRole("button", { current: "page" })).toHaveTextContent("3");
});

test("이전·다음 버튼과 양 끝 비활성", async () => {
  const user = userEvent.setup();
  render(<Pagination total={3} />);

  const prev = screen.getByRole("button", { name: "이전 페이지" });
  const next = screen.getByRole("button", { name: "다음 페이지" });
  expect(prev).toHaveAttribute("aria-disabled", "true"); // 첫 페이지

  await user.click(next);
  expect(screen.getByRole("button", { current: "page" })).toHaveTextContent("2");
  expect(prev).not.toHaveAttribute("aria-disabled");

  await user.click(next);
  expect(next).toHaveAttribute("aria-disabled", "true"); // 마지막 페이지
});

test("같은 페이지를 다시 눌러도 onChange가 호출되지 않는다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Pagination total={5} defaultValue={2} onChange={onChange} />);

  await user.click(screen.getByRole("button", { name: "2 페이지" }));
  expect(onChange).not.toHaveBeenCalled();
});

test("생략 기호는 보조기술에서 감춰지고 클릭 대상이 아니다", () => {
  render(<Pagination total={20} defaultValue={10} />);

  // 가운데 페이지라 양쪽에 하나씩 — 각 생략 기호는 aria-hidden 항목 안에 있다
  const ellipses = screen.getAllByText("…");
  expect(ellipses).toHaveLength(2);
  for (const ellipsis of ellipses) {
    expect(ellipsis.closest("li")).toHaveAttribute("aria-hidden", "true");
  }
  // 버튼으로 노출되지 않는다
  expect(screen.queryByRole("button", { name: "…" })).not.toBeInTheDocument();
});

test("제어형: 부모가 바꾸지 않으면 페이지가 유지된다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Pagination total={10} value={1} onChange={onChange} />);

  await user.click(screen.getByRole("button", { name: "4 페이지" }));
  expect(onChange).toHaveBeenCalledExactlyOnceWith(4);
  expect(screen.getByRole("button", { current: "page" })).toHaveTextContent("1");
});

test("제어형 상태 갱신이 반영된다", async () => {
  const user = userEvent.setup();
  function Controlled() {
    const [page, setPage] = useState(1);
    return <Pagination total={10} value={page} onChange={setPage} />;
  }
  render(<Controlled />);

  await user.click(screen.getByRole("button", { name: "5 페이지" }));
  expect(screen.getByRole("button", { current: "page" })).toHaveTextContent("5");
});

test("total이 줄면 표시만 클램프하고 onChange를 자동 호출하지 않는다", () => {
  const onChange = vi.fn();
  function Shrinking() {
    const [total, setTotal] = useState(20);
    return (
      <>
        <button type="button" onClick={() => setTotal(3)}>
          줄이기
        </button>
        <Pagination total={total} value={18} onChange={onChange} />
      </>
    );
  }
  render(<Shrinking />);

  fireEvent.click(screen.getByRole("button", { name: "줄이기" }));
  expect(screen.getByRole("button", { current: "page" })).toHaveTextContent("3"); // 표시 클램프
  expect(onChange).not.toHaveBeenCalled(); // 제어 값을 몰래 바꾸지 않는다
});

test("직접 입력: 타이핑 중에는 페이지가 움직이지 않고 Enter에서 이동한다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Pagination total={50} pageInput onChange={onChange} />);

  const input = screen.getByRole("spinbutton", { name: "페이지 번호" });
  await user.type(input, "12");
  expect(onChange).not.toHaveBeenCalled(); // 한 글자마다 이동하지 않는다 (A3 교훈)

  await user.keyboard("{Enter}");
  expect(onChange).toHaveBeenCalledExactlyOnceWith(12);
  expect(screen.getByRole("button", { current: "page" })).toHaveTextContent("12");
});

test("직접 입력: blur에서도 커밋되고 범위를 벗어나면 클램프된다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Pagination total={10} pageInput onChange={onChange} />);

  const input = screen.getByRole("spinbutton", { name: "페이지 번호" });
  await user.type(input, "99");
  await user.tab(); // blur
  expect(onChange).toHaveBeenCalledWith(10); // total로 클램프
});

test("직접 입력: 빈 값은 무시한다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Pagination total={10} pageInput defaultValue={4} onChange={onChange} />);

  const input = screen.getByRole("spinbutton", { name: "페이지 번호" });
  await user.click(input);
  await user.keyboard("{Enter}");
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { current: "page" })).toHaveTextContent("4");
});

test("직접 입력: 페이지 버튼을 누르면 입력 커밋이 클릭을 삼키지 않는다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Pagination total={20} pageInput onChange={onChange} />);

  // 입력에 숫자를 남긴 채 다른 페이지 버튼을 클릭한다 — blur가 click보다 먼저 온다
  await user.type(screen.getByRole("spinbutton", { name: "페이지 번호" }), "7");
  await user.click(screen.getByRole("button", { name: "5 페이지" }));

  // 클릭한 페이지로 가야 한다. blur 커밋이 먼저 실행되면 목록이 재계산돼 클릭이 사라진다
  expect(onChange).toHaveBeenLastCalledWith(5);
  expect(screen.getByRole("button", { current: "page" })).toHaveTextContent("5");
});

test("직접 입력: 소수를 넣어도 정수 페이지로만 이동한다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Pagination total={50} pageInput onChange={onChange} />);

  await user.type(screen.getByRole("spinbutton", { name: "페이지 번호" }), "2.5");
  await user.keyboard("{Enter}");
  expect(onChange).toHaveBeenCalledExactlyOnceWith(3); // 2.5가 그대로 새지 않는다
});

test("직접 입력: 비어 있어도 spinbutton이 현재 페이지를 값으로 알린다", () => {
  render(<Pagination total={10} defaultValue={4} pageInput />);
  expect(screen.getByRole("spinbutton", { name: "페이지 번호" })).toHaveAttribute(
    "aria-valuenow",
    "4",
  );
});

test("양 끝 버튼은 포커스를 유지하도록 aria-disabled로 알린다", async () => {
  const user = userEvent.setup();
  render(<Pagination total={2} />);

  const next = screen.getByRole("button", { name: "다음 페이지" });
  expect(screen.getByRole("button", { name: "이전 페이지" })).toHaveAttribute(
    "aria-disabled",
    "true",
  );

  await user.click(next);
  // 마지막 페이지에 닿아도 버튼이 포커스를 잃지 않는다 (disabled면 body로 떨어진다)
  expect(next).toHaveAttribute("aria-disabled", "true");
  expect(next).toHaveFocus();
});

test("비활성 상태의 양 끝 버튼은 눌러도 이동하지 않는다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Pagination total={5} onChange={onChange} />);

  await user.click(screen.getByRole("button", { name: "이전 페이지" }));
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { current: "page" })).toHaveTextContent("1");
});

test("페이지 목록이 list 시맨틱을 유지한다", () => {
  render(<Pagination total={5} />);
  expect(screen.getByRole("list")).toBeInTheDocument();
});

test("size가 data 속성으로 노출된다", () => {
  render(<Pagination total={5} size="sm" />);
  expect(screen.getByRole("navigation")).toHaveAttribute("data-size", "sm");
});
