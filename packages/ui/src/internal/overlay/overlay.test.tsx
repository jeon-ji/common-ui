import { render, renderHook, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useRef, useState } from "react";
import { expect, test, vi } from "vitest";

import { OverlayProvider, useOverlayEscape } from "./overlayStack.js";
import { useFocusTrap } from "./useFocusTrap.js";
import { useScrollLock } from "./useScrollLock.js";

// ── Escape 소유권 (중첩 스택) ────────────────────────────────────────────────

function FakeOverlay({ name, children }: { name: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  useOverlayEscape(open, () => setOpen(false));
  if (!open) return null;
  return (
    <div>
      <span>{name} 열림</span>
      {children}
    </div>
  );
}

test("Escape는 스택 최상단(나중에 열린) 오버레이만 닫는다", async () => {
  const user = userEvent.setup();
  // 실사용 시나리오: 첫 모달이 열린 뒤 사용자가 그 안에서 두 번째를 연다 (시간차 마운트)
  function App() {
    const [secondOpen, setSecondOpen] = useState(false);
    return (
      <OverlayProvider>
        <FakeOverlay name="아래">
          <button type="button" onClick={() => setSecondOpen(true)}>
            더 열기
          </button>
        </FakeOverlay>
        {secondOpen && <FakeOverlay name="위" />}
      </OverlayProvider>
    );
  }
  render(<App />);
  await user.click(screen.getByRole("button", { name: "더 열기" }));
  expect(screen.getByText("위 열림")).toBeInTheDocument();

  await user.keyboard("{Escape}"); // 최상단(위)만
  expect(screen.queryByText("위 열림")).not.toBeInTheDocument();
  expect(screen.getByText("아래 열림")).toBeInTheDocument();

  await user.keyboard("{Escape}"); // 이제 아래가 최상단
  expect(screen.queryByText("아래 열림")).not.toBeInTheDocument();
});

test("이미 소비된(defaultPrevented) Escape는 처리하지 않는다", async () => {
  const user = userEvent.setup();
  const onEscape = vi.fn();
  function Harness() {
    useOverlayEscape(true, onEscape);
    return <input aria-label="입력" onKeyDown={(event) => event.preventDefault()} />;
  }
  render(
    <OverlayProvider>
      <Harness />
    </OverlayProvider>,
  );
  await user.click(screen.getByRole("textbox"));
  await user.keyboard("{Escape}"); // input이 먼저 preventDefault — 하위 위젯이 소유한 상황
  expect(onEscape).not.toHaveBeenCalled();
});

// ── scroll lock 참조 카운팅 ──────────────────────────────────────────────────

test("scroll lock: 카운팅 + 원래 값 복원", () => {
  document.body.style.overflow = "scroll"; // 소비 앱이 지정해 둔 원래 값

  const first = renderHook(({ active }) => useScrollLock(active), {
    initialProps: { active: true },
  });
  const second = renderHook(({ active }) => useScrollLock(active), {
    initialProps: { active: true },
  });
  expect(document.body.style.overflow).toBe("hidden");

  first.unmount(); // 하나 닫혀도 잠금 유지
  expect(document.body.style.overflow).toBe("hidden");

  second.unmount(); // 마지막 해제 — 원래 값 복원
  expect(document.body.style.overflow).toBe("scroll");
  document.body.style.overflow = "";
});

// ── focus trap ───────────────────────────────────────────────────────────────

function TrapHarness({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, active);
  return (
    <div ref={ref} tabIndex={-1}>
      <button type="button">첫째</button>
      <button type="button">둘째</button>
    </div>
  );
}

test("focus trap: initial focus + Tab 순환 + 트리거 복원", async () => {
  const user = userEvent.setup();
  function App() {
    const [active, setActive] = useState(false);
    return (
      <>
        <button type="button" onClick={() => setActive(true)}>
          트리거
        </button>
        {active && <TrapHarness active />}
        <button type="button" onClick={() => setActive(false)}>
          끄기
        </button>
      </>
    );
  }
  render(<App />);

  const trigger = screen.getByRole("button", { name: "트리거" });
  await user.click(trigger);
  expect(screen.getByRole("button", { name: "첫째" })).toHaveFocus(); // initial focus

  await user.tab();
  expect(screen.getByRole("button", { name: "둘째" })).toHaveFocus();

  await user.tab(); // 마지막에서 Tab → 첫째로 순환
  expect(screen.getByRole("button", { name: "첫째" })).toHaveFocus();

  await user.tab({ shift: true }); // 첫째에서 Shift+Tab → 마지막으로 순환
  expect(screen.getByRole("button", { name: "둘째" })).toHaveFocus();

  await user.click(screen.getByRole("button", { name: "끄기" }));
  expect(trigger).toHaveFocus(); // 언마운트 시 트리거 복원...
});

test("focus trap: [data-autofocus]가 있으면 그 요소가 initial focus", () => {
  function Harness() {
    const ref = useRef<HTMLDivElement>(null);
    useFocusTrap(ref, true);
    return (
      <div ref={ref} tabIndex={-1}>
        <button type="button">먼저</button>
        <button type="button" data-autofocus>
          지정
        </button>
      </div>
    );
  }
  render(<Harness />);
  expect(screen.getByRole("button", { name: "지정" })).toHaveFocus();
});
