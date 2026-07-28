import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { ToastProvider, useToast } from "./index.js";

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

function Trigger({
  label = "알림",
  onFire,
}: {
  label?: string;
  onFire?: (fire: () => void) => void;
}) {
  const toast = useToast();
  const fire = () => toast.success(`${label} 메시지`);
  onFire?.(fire);
  return (
    <button type="button" onClick={fire}>
      {label}
    </button>
  );
}

test("show: aria-live region에 type 아이콘과 함께 표시된다", () => {
  render(
    <ToastProvider>
      <Trigger />
    </ToastProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "알림" }));

  const region = screen.getByRole("region", { name: "알림" });
  const toast = region.querySelector(".ui-toast");
  expect(toast).toHaveAttribute("role", "status"); // 개별 polite 라이브 영역
  expect(toast).toHaveAttribute("data-type", "success");
  expect(toast).toHaveTextContent("알림 메시지");
});

test("duration 경과 후 자동으로 사라진다 (타이머 정리 포함)", () => {
  render(
    <ToastProvider duration={1000}>
      <Trigger />
    </ToastProvider>,
  );
  fireEvent.click(screen.getByRole("button"));
  expect(document.querySelectorAll(".ui-toast")).toHaveLength(1);

  act(() => {
    vi.advanceTimersByTime(1100);
  });
  expect(document.querySelectorAll(".ui-toast")).toHaveLength(0);
});

test("hover 시 타이머가 일시정지되고 벗어나면 남은 시간부터 재개된다", () => {
  render(
    <ToastProvider duration={1000}>
      <Trigger />
    </ToastProvider>,
  );
  fireEvent.click(screen.getByRole("button"));
  const toast = document.querySelector(".ui-toast") as HTMLElement;

  act(() => {
    vi.advanceTimersByTime(600);
  });
  fireEvent.mouseEnter(toast); // 일시정지 (잔여 400ms)
  act(() => {
    vi.advanceTimersByTime(5000);
  });
  expect(document.querySelectorAll(".ui-toast")).toHaveLength(1); // 아직 살아있다

  fireEvent.mouseLeave(toast); // 재개
  act(() => {
    vi.advanceTimersByTime(500);
  });
  expect(document.querySelectorAll(".ui-toast")).toHaveLength(0);
});

test("max 초과분은 큐에서 대기하고 자리가 나면 순서대로 나온다", () => {
  function Burst() {
    const toast = useToast();
    return (
      <button
        type="button"
        onClick={() => {
          toast.info("첫째", { duration: 1000 });
          toast.info("둘째", { duration: 5000 });
          toast.info("셋째", { duration: 5000 });
        }}
      >
        연발
      </button>
    );
  }
  render(
    <ToastProvider max={2}>
      <Burst />
    </ToastProvider>,
  );
  fireEvent.click(screen.getByRole("button"));
  expect(screen.getByText("첫째")).toBeInTheDocument();
  expect(screen.getByText("둘째")).toBeInTheDocument();
  expect(screen.queryByText("셋째")).not.toBeInTheDocument(); // 큐 대기

  act(() => {
    vi.advanceTimersByTime(1100);
  }); // 첫째 만료 → 셋째 입장
  expect(screen.queryByText("첫째")).not.toBeInTheDocument();
  expect(screen.getByText("셋째")).toBeInTheDocument();
});

test("닫기 버튼으로 즉시 닫힌다", () => {
  render(
    <ToastProvider>
      <Trigger />
    </ToastProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "알림" }));
  fireEvent.click(screen.getByRole("button", { name: "알림 닫기" }));
  expect(document.querySelectorAll(".ui-toast")).toHaveLength(0);
});

test("Provider 2개는 각자 독립이다 (전역 싱글턴 아님)", () => {
  render(
    <>
      <ToastProvider>
        <Trigger label="A" />
      </ToastProvider>
      <ToastProvider>
        <Trigger label="B" />
      </ToastProvider>
    </>,
  );
  fireEvent.click(screen.getByRole("button", { name: "A" }));

  const regions = screen.getAllByRole("region", { name: "알림" });
  expect(regions).toHaveLength(2);
  const counts = regions.map((region) => region.querySelectorAll(".ui-toast").length);
  expect(counts.sort()).toEqual([0, 1]); // 한쪽에만 뜬다
});

test("Provider 밖 useToast는 명시적 에러", () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
  function Naked() {
    useToast();
    return null;
  }
  expect(() => render(<Naked />)).toThrow(/ToastProvider> 안에서만/);
  spy.mockRestore();
});
