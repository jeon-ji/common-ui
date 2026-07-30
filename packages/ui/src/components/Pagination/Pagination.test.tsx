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

test("현재 페이지 버튼은 접근 이름으로 현재임을 알린다", () => {
  render(<Pagination total={5} defaultValue={2} />);
  expect(screen.getByRole("button", { name: "현재 페이지, 2" })).toBeInTheDocument();
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
  expect(prev).toBeDisabled(); // 첫 페이지

  await user.click(next);
  expect(screen.getByRole("button", { current: "page" })).toHaveTextContent("2");
  expect(prev).toBeEnabled();

  await user.click(next);
  expect(next).toBeDisabled(); // 마지막 페이지
});

test("같은 페이지를 다시 눌러도 onChange가 호출되지 않는다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Pagination total={5} defaultValue={2} onChange={onChange} />);

  await user.click(screen.getByRole("button", { name: "현재 페이지, 2" }));
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

test("size가 data 속성으로 노출된다", () => {
  render(<Pagination total={5} size="sm" />);
  expect(screen.getByRole("navigation")).toHaveAttribute("data-size", "sm");
});
