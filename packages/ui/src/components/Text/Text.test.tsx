import { render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { Heading, Text } from "./index.js";

// ── 싱글턴 ResizeObserver 스텁 — 콜백을 수동 발화시켜 잘림 판정을 검증한다 ──
type ROCallback = (entries: Array<{ target: Element }>) => void;
let roCallback: ROCallback | null = null;
const observed = new Set<Element>();

class ResizeObserverStub {
  constructor(cb: ROCallback) {
    roCallback = cb;
  }
  observe(el: Element) {
    observed.add(el);
  }
  unobserve(el: Element) {
    observed.delete(el);
  }
  disconnect() {
    observed.clear();
  }
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
});
afterEach(() => {
  vi.unstubAllGlobals();
  observed.clear();
});

function setScrollSize(el: Element, scrollWidth: number, clientWidth: number) {
  Object.defineProperty(el, "scrollWidth", { value: scrollWidth, configurable: true });
  Object.defineProperty(el, "clientWidth", { value: clientWidth, configurable: true });
  Object.defineProperty(el, "scrollHeight", { value: 0, configurable: true });
  Object.defineProperty(el, "clientHeight", { value: 0, configurable: true });
}

test("기본값: span + body1 variant", () => {
  render(<Text>본문</Text>);
  const el = screen.getByText("본문");
  expect(el.tagName).toBe("SPAN");
  expect(el).toHaveAttribute("data-variant", "body1");
});

test("as로 시맨틱 태그를 바꾼다", () => {
  render(
    <Text as="p" variant="caption">
      문단
    </Text>,
  );
  expect(screen.getByText("문단").tagName).toBe("P");
});

test("ellipsis: 잘렸을 때만 title이 붙는다", () => {
  render(<Text ellipsis>긴 텍스트</Text>);
  const el = screen.getByText("긴 텍스트");
  expect(el).toHaveAttribute("data-ellipsis");
  expect(el).not.toHaveAttribute("title");

  // 잘림 발생 시뮬레이션 → 옵저버 발화
  setScrollSize(el, 200, 100);
  act(() => roCallback?.([{ target: el }]));
  expect(el).toHaveAttribute("title", "긴 텍스트");

  // 공간이 충분해지면 title 제거
  setScrollSize(el, 100, 100);
  act(() => roCallback?.([{ target: el }]));
  expect(el).not.toHaveAttribute("title");
});

test("lineClamp: 줄 수를 커스텀 프로퍼티로 주입한다", () => {
  render(<Text lineClamp={3}>여러 줄</Text>);
  const el = screen.getByText("여러 줄");
  expect(el).toHaveAttribute("data-line-clamp");
  expect(el.style.getPropertyValue("--ui-text-line-clamp")).toBe("3");
});

test("언마운트 시 관찰을 해제한다", () => {
  const { unmount } = render(<Text ellipsis>x</Text>);
  expect(observed.size).toBe(1);
  unmount();
  expect(observed.size).toBe(0);
});

test("Heading: variant가 태그와 스케일을 함께 정한다", () => {
  render(<Heading variant="h3">제목</Heading>);
  const el = screen.getByRole("heading", { level: 3, name: "제목" });
  expect(el).toHaveAttribute("data-variant", "h3");
});

test("Heading: as로 문서 레벨과 시각 스케일을 분리한다", () => {
  render(
    <Heading variant="display" as="h2">
      큰 제목
    </Heading>,
  );
  const el = screen.getByRole("heading", { level: 2 });
  expect(el).toHaveAttribute("data-variant", "display");
});
