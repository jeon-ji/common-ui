/**
 * 하네스 스모크 — jsdom + Testing Library + user-event 조합이 동작하는지 확인한다.
 * 첫 실제 컴포넌트가 들어오면 그 테스트가 이 역할을 대신하므로 삭제해도 된다.
 */
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { expect, test } from "vitest";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button type="button" onClick={() => setCount((c) => c + 1)}>
      count: {count}
    </button>
  );
}

test("렌더와 사용자 이벤트가 동작한다", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  const button = screen.getByRole("button", { name: "count: 0" });
  await user.click(button);

  expect(button).toHaveTextContent("count: 1");
});
