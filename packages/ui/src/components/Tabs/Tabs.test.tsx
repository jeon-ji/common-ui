import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { expect, test, vi } from "vitest";

import { type TabItem, Tabs } from "./index.js";

const ITEMS: TabItem[] = [
  { value: "profile", label: "프로필", content: "프로필 내용" },
  { value: "billing", label: "결제", content: "결제 내용", disabled: true },
  { value: "team", label: "팀", content: "팀 내용" },
];

/** 실제로 포커스를 받는 탭(tabIndex 0) — 키 이벤트는 여기서 발생한다 */
function focusableTab(): HTMLElement {
  const tab = screen.getAllByRole("tab").find((el) => el.getAttribute("tabindex") === "0");
  if (!tab) throw new Error("포커스 가능한 탭이 없다");
  return tab;
}

test("시맨틱 배선: tablist·tab·tabpanel과 aria 연결", () => {
  render(<Tabs items={ITEMS} aria-label="설정 탭" />);

  const list = screen.getByRole("tablist", { name: "설정 탭" });
  expect(list).toBeInTheDocument();

  const tabs = screen.getAllByRole("tab");
  expect(tabs).toHaveLength(3);
  expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  expect(tabs[2]).toHaveAttribute("aria-selected", "false");

  const panel = screen.getByRole("tabpanel");
  expect(panel).toHaveTextContent("프로필 내용");
  expect(panel).toHaveAttribute("aria-labelledby", tabs[0]?.id);
  expect(tabs[0]).toHaveAttribute("aria-controls", panel.id);
  // 렌더되지 않는 패널은 참조하지 않는다
  expect(tabs[2]).not.toHaveAttribute("aria-controls");
});

test("roving tabindex: 활성 탭만 Tab 키로 진입 가능하다", () => {
  render(<Tabs items={ITEMS} />);
  const tabs = screen.getAllByRole("tab");
  expect(tabs[0]).toHaveAttribute("tabindex", "0");
  expect(tabs[1]).toHaveAttribute("tabindex", "-1");
  expect(tabs[2]).toHaveAttribute("tabindex", "-1");
});

test("활성 패널만 렌더된다", () => {
  render(<Tabs items={ITEMS} />);
  expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
  expect(screen.queryByText("팀 내용")).not.toBeInTheDocument();
});

test("화살표: disabled를 건너뛰고 이동이 곧 활성화다", () => {
  const onChange = vi.fn();
  render(<Tabs items={ITEMS} onChange={onChange} />);

  fireEvent.keyDown(focusableTab(), { key: "ArrowRight" }); // 결제(disabled) 건너뛰고 팀
  expect(onChange).toHaveBeenLastCalledWith("team");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("팀 내용");
  expect(screen.getByRole("tab", { name: "팀" })).toHaveFocus(); // 포커스도 따라간다
});

test("화살표: 끝에서 순환한다 (WAI-ARIA 탭 관례)", () => {
  render(<Tabs items={ITEMS} />);

  fireEvent.keyDown(focusableTab(), { key: "ArrowLeft" }); // 첫 탭에서 왼쪽 → 마지막
  expect(screen.getByRole("tab", { name: "팀" })).toHaveAttribute("aria-selected", "true");

  fireEvent.keyDown(focusableTab(), { key: "ArrowRight" }); // 마지막에서 오른쪽 → 첫 탭
  expect(screen.getByRole("tab", { name: "프로필" })).toHaveAttribute("aria-selected", "true");
});

test("Home·End로 양 끝 활성 탭으로 이동한다", () => {
  render(<Tabs items={ITEMS} defaultValue="team" />);

  fireEvent.keyDown(focusableTab(), { key: "Home" });
  expect(screen.getByRole("tab", { name: "프로필" })).toHaveAttribute("aria-selected", "true");

  fireEvent.keyDown(focusableTab(), { key: "End" });
  expect(screen.getByRole("tab", { name: "팀" })).toHaveAttribute("aria-selected", "true");
});

test("disabled 탭은 클릭해도 선택되지 않는다", () => {
  const onChange = vi.fn();
  render(<Tabs items={ITEMS} onChange={onChange} />);

  fireEvent.click(screen.getByRole("tab", { name: "결제" }));
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole("tabpanel")).toHaveTextContent("프로필 내용");
});

test("클릭으로 탭을 바꾼다", () => {
  const onChange = vi.fn();
  render(<Tabs items={ITEMS} onChange={onChange} />);

  fireEvent.click(screen.getByRole("tab", { name: "팀" }));
  expect(onChange).toHaveBeenCalledWith("team");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("팀 내용");
});

test("비제어 기본값은 첫 활성 탭이다 (첫 항목이 disabled여도)", () => {
  const items: TabItem[] = [
    { value: "a", label: "가", content: "가 내용", disabled: true },
    { value: "b", label: "나", content: "나 내용" },
  ];
  render(<Tabs items={items} />);
  expect(screen.getByRole("tab", { name: "나" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("나 내용");
});

test("제어형: 부모가 바꾸지 않으면 활성 탭이 유지된다", () => {
  const onChange = vi.fn();
  render(<Tabs items={ITEMS} value="profile" onChange={onChange} />);

  fireEvent.click(screen.getByRole("tab", { name: "팀" }));
  expect(onChange).toHaveBeenCalledWith("team");
  expect(screen.getByRole("tab", { name: "프로필" })).toHaveAttribute("aria-selected", "true");
});

test("제어형 상태 갱신이 패널에 반영된다", () => {
  function Controlled() {
    const [value, setValue] = useState("profile");
    return <Tabs items={ITEMS} value={value} onChange={setValue} />;
  }
  render(<Controlled />);

  fireEvent.click(screen.getByRole("tab", { name: "팀" }));
  expect(screen.getByRole("tabpanel")).toHaveTextContent("팀 내용");
});

test("목록에 없는 value: 패널을 렌더하지 않고 탭 목록 진입은 유지한다", () => {
  render(<Tabs items={ITEMS} value="없는키" />);

  expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
  expect(
    screen.getAllByRole("tab").every((tab) => tab.getAttribute("aria-selected") === "false"),
  ).toBe(true);
  // 활성 탭이 없어도 키보드로 들어올 수 있어야 한다
  expect(screen.getByRole("tab", { name: "프로필" })).toHaveAttribute("tabindex", "0");
});

test("활성 값이 disabled 탭이어도 다른 활성 탭으로 키보드 진입이 가능하다", () => {
  // disabled 버튼은 tabIndex와 무관하게 탭 순서에서 제외된다 — 거기에 roving을 걸면
  // 탭 스톱이 0개가 되어 화살표 이동에 도달할 수 없다
  render(<Tabs items={ITEMS} defaultValue="billing" />);

  const enabled = screen.getByRole("tab", { name: "프로필" });
  expect(enabled).toHaveAttribute("tabindex", "0"); // 포커스 가능한 탭이 실제로 활성 탭이다
  expect(screen.getByRole("tab", { name: "결제" })).toHaveAttribute("tabindex", "-1");

  // 그 탭에서 화살표 이동이 동작한다
  fireEvent.keyDown(enabled, { key: "ArrowRight" });
  expect(screen.getByRole("tab", { name: "팀" })).toHaveAttribute("aria-selected", "true");
});

test("items가 나중에 도착해도 첫 활성 탭이 활성화된다", () => {
  function AsyncItems() {
    const [items, setItems] = useState<TabItem[]>([]);
    return (
      <>
        <button type="button" onClick={() => setItems(ITEMS)}>
          불러오기
        </button>
        <Tabs items={items} />
      </>
    );
  }
  render(<AsyncItems />);
  expect(screen.queryByRole("tab")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "불러오기" }));
  expect(screen.getByRole("tab", { name: "프로필" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("프로필 내용");
});

test("전부 disabled면 패널이 없고 이동해도 선택되지 않는다", () => {
  const items: TabItem[] = [
    { value: "a", label: "가", content: "가 내용", disabled: true },
    { value: "b", label: "나", content: "나 내용", disabled: true },
  ];
  render(<Tabs items={items} />);
  expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
  // 활성화할 탭이 없으므로 탭 순서에 들어가는 탭도 없다
  expect(screen.getAllByRole("tab").some((tab) => tab.getAttribute("tabindex") === "0")).toBe(
    false,
  );
});

test("탭이 줄어든 뒤에도 화살표 이동이 계속 동작한다", () => {
  function Shrinking() {
    const [items, setItems] = useState(ITEMS);
    return (
      <>
        <button type="button" onClick={() => setItems(ITEMS.slice(0, 1))}>
          줄이기
        </button>
        <Tabs items={items} defaultValue="team" />
      </>
    );
  }
  render(<Shrinking />);
  fireEvent.click(screen.getByRole("button", { name: "줄이기" }));

  fireEvent.keyDown(focusableTab(), { key: "ArrowRight" });
  expect(screen.getByRole("tab", { name: "프로필" })).toHaveAttribute("aria-selected", "true");
});

test("variant·size가 data 속성으로 노출된다", () => {
  const { container } = render(<Tabs items={ITEMS} variant="solid" size="sm" />);
  const root = container.firstElementChild;
  expect(root).toHaveAttribute("data-variant", "solid");
  expect(root).toHaveAttribute("data-size", "sm");
});
