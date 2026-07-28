import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useRef, useState } from "react";
import { expect, test, vi } from "vitest";

import { useClickOutside } from "./useClickOutside.js";

function Harness({
  onOutside,
  enabled = true,
}: {
  onOutside: (event: PointerEvent) => void;
  enabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onOutside, enabled);
  return (
    <>
      <div ref={ref}>
        <button type="button">안</button>
      </div>
      <button type="button">밖</button>
    </>
  );
}

test("바깥 클릭에서만 handler가 호출된다", async () => {
  const user = userEvent.setup();
  const onOutside = vi.fn();
  render(<Harness onOutside={onOutside} />);

  await user.click(screen.getByRole("button", { name: "안" }));
  expect(onOutside).not.toHaveBeenCalled();

  await user.click(screen.getByRole("button", { name: "밖" }));
  expect(onOutside).toHaveBeenCalledTimes(1);
});

test("enabled=false면 리스너를 달지 않는다", async () => {
  const user = userEvent.setup();
  const onOutside = vi.fn();
  render(<Harness onOutside={onOutside} enabled={false} />);
  await user.click(screen.getByRole("button", { name: "밖" }));
  expect(onOutside).not.toHaveBeenCalled();
});

test("언마운트 시 리스너가 정리된다", async () => {
  const user = userEvent.setup();
  const onOutside = vi.fn();
  const { unmount } = render(<Harness onOutside={onOutside} />);
  unmount();
  await user.click(document.body);
  expect(onOutside).not.toHaveBeenCalled();
});

test("최신 handler를 호출한다 (핸들러 교체 후)", async () => {
  const user = userEvent.setup();
  const first = vi.fn();
  const second = vi.fn();

  function Swappable() {
    const [swapped, setSwapped] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useClickOutside(ref, swapped ? second : first);
    return (
      <>
        <div ref={ref}>
          <button type="button" onClick={() => setSwapped(true)}>
            교체
          </button>
        </div>
        <button type="button">밖</button>
      </>
    );
  }

  render(<Swappable />);
  await user.click(screen.getByRole("button", { name: "교체" }));
  await user.click(screen.getByRole("button", { name: "밖" }));
  expect(first).not.toHaveBeenCalled();
  expect(second).toHaveBeenCalledTimes(1);
});
