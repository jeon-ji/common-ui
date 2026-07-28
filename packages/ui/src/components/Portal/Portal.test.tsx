import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { Portal } from "./index.js";

test("children을 body 아래 전용 컨테이너로 렌더한다", () => {
  const { container } = render(
    <div data-testid="parent">
      <Portal>
        <span>포털 내용</span>
      </Portal>
    </div>,
  );

  const content = screen.getByText("포털 내용");
  // 렌더 트리의 부모가 아니라 body 아래 [data-ui-portal] 컨테이너에 있어야 한다
  expect(container.contains(content)).toBe(false);
  expect(content.closest("[data-ui-portal]")).not.toBeNull();
  expect(document.body.contains(content)).toBe(true);
});

test("언마운트 시 자동 생성한 컨테이너를 정리한다", () => {
  const { unmount } = render(
    <Portal>
      <span>x</span>
    </Portal>,
  );
  expect(document.querySelector("[data-ui-portal]")).not.toBeNull();

  unmount();
  expect(document.querySelector("[data-ui-portal]")).toBeNull();
});

test("container를 주면 그 안에 렌더하고 정리하지 않는다", () => {
  const host = document.createElement("aside");
  document.body.appendChild(host);

  const { unmount } = render(
    <Portal container={host}>
      <span>지정 타겟</span>
    </Portal>,
  );
  expect(host.textContent).toBe("지정 타겟");

  unmount();
  // 외부 소유 컨테이너는 Portal이 제거하지 않는다
  expect(document.body.contains(host)).toBe(true);
  host.remove();
});

test("Portal 2개가 각자의 컨테이너를 가진다", () => {
  render(
    <>
      <Portal>
        <span>a</span>
      </Portal>
      <Portal>
        <span>b</span>
      </Portal>
    </>,
  );
  expect(document.querySelectorAll("[data-ui-portal]")).toHaveLength(2);
});
