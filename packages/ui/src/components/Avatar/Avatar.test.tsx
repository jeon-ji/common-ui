import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { Avatar } from "./index.js";

/** 이미지는 의도적으로 `alt=""`(장식)이라 role로 잡을 수 없다 — 이 경우만 DOM 질의를 쓴다 */
const imageIn = (container: HTMLElement) => container.querySelector("img");

test("src가 있으면 이미지를 그린다 — 폴백은 그 아래 깔려 있다", () => {
  const { container } = render(<Avatar src="/ada.png" name="Ada Lovelace" />);

  expect(imageIn(container)).toHaveAttribute("src", "/ada.png");
  expect(screen.getByText("AL")).toBeInTheDocument();
});

test("src가 없으면 이니셜만 그린다", () => {
  const { container } = render(<Avatar name="전지현" />);

  expect(imageIn(container)).toBeNull();
  expect(screen.getByText("전")).toBeInTheDocument();
});

test("로드에 실패하면 이미지를 걷어내고 폴백이 드러난다", () => {
  const { container } = render(<Avatar src="/broken.png" name="Ada Lovelace" />);

  const image = imageIn(container);
  expect(image).not.toBeNull();
  fireEvent.error(image as HTMLImageElement);

  expect(imageIn(container)).toBeNull();
  expect(screen.getByText("AL")).toBeInTheDocument();
});

test("src가 바뀌면 실패 상태가 풀려 새 이미지를 다시 시도한다", () => {
  const { container, rerender } = render(<Avatar src="/broken.png" name="Ada Lovelace" />);
  fireEvent.error(imageIn(container) as HTMLImageElement);
  expect(imageIn(container)).toBeNull();

  rerender(<Avatar src="/ada.png" name="Ada Lovelace" />);
  expect(imageIn(container)).toHaveAttribute("src", "/ada.png");
});

test("alt를 주면 접근 이름이 생기고, 로드에 실패해도 그대로다", () => {
  const { container } = render(<Avatar src="/broken.png" alt="Ada Lovelace" name="Ada Lovelace" />);
  // 이름은 alt 하나뿐 — 이니셜("AL")이 이름에 섞이지 않는다
  expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeInTheDocument();

  fireEvent.error(imageIn(container) as HTMLImageElement);

  expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeInTheDocument();
});

test("alt가 비면 장식이다 — 보조기술에 노출되지 않는다", () => {
  render(<Avatar src="/ada.png" name="Ada Lovelace" />);

  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});

test("폴백 우선순위: children > 이니셜 > 없음", () => {
  const { container, rerender } = render(
    <Avatar name="Ada Lovelace">
      <span>ICON</span>
    </Avatar>,
  );
  expect(screen.getByText("ICON")).toBeInTheDocument();
  expect(screen.queryByText("AL")).not.toBeInTheDocument();

  rerender(<Avatar name="Ada Lovelace" />);
  expect(screen.getByText("AL")).toBeInTheDocument();

  rerender(<Avatar />);
  expect(container.querySelector(".ui-avatar-fallback")).toBeEmptyDOMElement();
});

test("기본값은 md·circle이고 지정하면 데이터 속성에 반영된다", () => {
  const { container, rerender } = render(<Avatar name="A" />);
  const root = container.querySelector(".ui-avatar");
  expect(root).toHaveAttribute("data-size", "md");
  expect(root).toHaveAttribute("data-shape", "circle");

  rerender(<Avatar name="A" size="xl" shape="square" />);
  expect(container.querySelector(".ui-avatar")).toHaveAttribute("data-size", "xl");
  expect(container.querySelector(".ui-avatar")).toHaveAttribute("data-shape", "square");
});

test("imgProps는 img로, className·style·ref는 루트로 간다", () => {
  const ref = createRef<HTMLSpanElement>();
  const { container } = render(
    <Avatar
      ref={ref}
      src="/ada.png"
      className="custom"
      style={{ opacity: 0.5 }}
      imgProps={{ loading: "lazy", className: "custom-img" }}
    />,
  );

  const root = container.querySelector(".ui-avatar");
  expect(ref.current).toBe(root);
  expect(root).toHaveClass("custom");
  expect(root).toHaveStyle({ opacity: "0.5" });

  const image = imageIn(container);
  expect(image).toHaveAttribute("loading", "lazy");
  expect(image).toHaveClass("ui-avatar-img", "custom-img");
});
