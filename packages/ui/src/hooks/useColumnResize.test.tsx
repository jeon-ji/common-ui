import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";

import { useColumnResize, type UseColumnResizeOptions } from "./useColumnResize.js";

beforeEach(() => {
  window.localStorage.clear();
  document.body.style.userSelect = "";
});

/** 핸들은 소비자가 헤더에 그린다 — 훅은 props만 준다 (전역 규칙 13) */
function Harness(options: UseColumnResizeOptions) {
  const { widths, getHandleProps, reset } = useColumnResize(options);

  return (
    <div>
      <button type="button" onClick={reset}>
        초기화
      </button>
      <table>
        <caption>표</caption>
        <thead>
          <tr>
            {options.columnKeys.map((key) => (
              <th key={key} scope="col">
                {key}
                <span data-testid={`handle-${key}`} {...getHandleProps(key)} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {options.columnKeys.map((key) => (
              <td key={key}>{widths[key] == null ? "-" : String(widths[key])}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function drag(key: string, from: number, to: number) {
  const handle = screen.getByTestId(`handle-${key}`);
  fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientX: from });
  fireEvent.pointerMove(window, { pointerId: 1, clientX: to });
  fireEvent.pointerUp(window, { pointerId: 1, clientX: to });
}

test("핸들은 separator가 요구하는 값을 전부 갖는다", () => {
  render(<Harness columnKeys={["name"]} defaultWidths={{ name: 120 }} />);

  const handle = screen.getByRole("separator", { name: "열 너비 조절" });
  expect(handle).toHaveAttribute("aria-orientation", "vertical");
  expect(handle).toHaveAttribute("aria-valuenow", "120");
  expect(handle).toHaveAttribute("aria-valuemin", "48");
  expect(handle).toHaveAttribute("aria-valuemax", "640");
  expect(handle).toHaveAttribute("tabindex", "0");
});

test("handleLabel로 컬럼을 식별할 수 있는 이름을 만든다", () => {
  render(
    <Harness
      columnKeys={["name", "age"]}
      defaultWidths={{ name: 120, age: 80 }}
      handleLabel={(key) => `${key} 열 너비 조절`}
    />,
  );

  // 기본값 하나로 두면 핸들 둘이 같은 이름이라 목록에서 구분되지 않는다 (규칙 26)
  expect(screen.getByRole("separator", { name: "name 열 너비 조절" })).toBeInTheDocument();
  expect(screen.getByRole("separator", { name: "age 열 너비 조절" })).toBeInTheDocument();
});

test("키보드: 좌우 화살표로 폭을 조절한다", () => {
  render(<Harness columnKeys={["name"]} defaultWidths={{ name: 120 }} />);
  const handle = screen.getByRole("separator");

  fireEvent.keyDown(handle, { key: "ArrowRight" });
  expect(screen.getByRole("cell")).toHaveTextContent("128");

  fireEvent.keyDown(handle, { key: "ArrowLeft" });
  fireEvent.keyDown(handle, { key: "ArrowLeft" });
  expect(screen.getByRole("cell")).toHaveTextContent("112");
});

test("키보드: min·max를 넘지 않는다", () => {
  render(<Harness columnKeys={["name"]} defaultWidths={{ name: 52 }} min={48} max={60} />);
  const handle = screen.getByRole("separator");

  fireEvent.keyDown(handle, { key: "ArrowLeft" });
  expect(screen.getByRole("cell")).toHaveTextContent("48");

  for (let i = 0; i < 5; i += 1) fireEvent.keyDown(handle, { key: "ArrowRight" });
  expect(screen.getByRole("cell")).toHaveTextContent("60");
});

test("키보드: 화살표 외의 키는 폭을 바꾸지 않는다", () => {
  render(<Harness columnKeys={["name"]} defaultWidths={{ name: 120 }} />);
  fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowUp" });
  expect(screen.getByRole("cell")).toHaveTextContent("120"); // defaultWidths 그대로
});

test("드래그: 포인터 이동만큼 폭이 늘어난다", () => {
  render(<Harness columnKeys={["name"]} defaultWidths={{ name: 100 }} />);

  drag("name", 200, 260);
  expect(screen.getByRole("cell")).toHaveTextContent("160");
});

test("드래그: 리스너를 한 번만 등록하고 끝날 때 해제한다", () => {
  const addSpy = vi.spyOn(window, "addEventListener");
  const removeSpy = vi.spyOn(window, "removeEventListener");
  render(<Harness columnKeys={["name"]} defaultWidths={{ name: 100 }} />);

  const handle = screen.getByTestId("handle-name");
  fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientX: 200 });

  // 이동이 여러 번 일어나도 등록은 그대로다 — 매 프레임 재등록이 원본의 결함이었다
  fireEvent.pointerMove(window, { pointerId: 1, clientX: 220 });
  fireEvent.pointerMove(window, { pointerId: 1, clientX: 240 });
  fireEvent.pointerMove(window, { pointerId: 1, clientX: 260 });

  const moveRegistrations = addSpy.mock.calls.filter(([type]) => type === "pointermove");
  expect(moveRegistrations).toHaveLength(1);

  fireEvent.pointerUp(window, { pointerId: 1, clientX: 260 });
  expect(removeSpy.mock.calls.filter(([type]) => type === "pointermove")).toHaveLength(1);

  addSpy.mockRestore();
  removeSpy.mockRestore();
});

test("드래그: 끝난 뒤의 포인터 이동은 폭을 바꾸지 않는다", () => {
  render(<Harness columnKeys={["name"]} defaultWidths={{ name: 100 }} />);

  drag("name", 200, 260);
  expect(screen.getByRole("cell")).toHaveTextContent("160");

  fireEvent.pointerMove(window, { pointerId: 1, clientX: 400 });
  expect(screen.getByRole("cell")).toHaveTextContent("160"); // 리스너가 남아 있지 않다
});

test("드래그: user-select를 걸고 끝나면 되돌린다", () => {
  render(<Harness columnKeys={["name"]} defaultWidths={{ name: 100 }} />);
  const handle = screen.getByTestId("handle-name");

  fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientX: 200 });
  expect(document.body.style.userSelect).toBe("none");

  fireEvent.pointerUp(window, { pointerId: 1, clientX: 200 });
  expect(document.body.style.userSelect).toBe(""); // 적용과 복원은 쌍이다
});

test("드래그 중 언마운트: 리스너가 남지 않고 user-select도 되돌아간다", () => {
  const removeSpy = vi.spyOn(window, "removeEventListener");
  const { unmount } = render(<Harness columnKeys={["name"]} defaultWidths={{ name: 100 }} />);

  fireEvent.pointerDown(screen.getByTestId("handle-name"), {
    button: 0,
    pointerId: 1,
    clientX: 200,
  });
  expect(document.body.style.userSelect).toBe("none");

  unmount();
  expect(removeSpy.mock.calls.filter(([type]) => type === "pointermove")).toHaveLength(1);
  expect(document.body.style.userSelect).toBe("");
  removeSpy.mockRestore();
});

test("드래그 중 컬럼이 사라지면 드래그를 끝내고 포커스를 표로 되돌린다", () => {
  const removeSpy = vi.spyOn(window, "removeEventListener");
  const { rerender } = render(
    <Harness columnKeys={["name", "age"]} defaultWidths={{ name: 100, age: 80 }} />,
  );

  fireEvent.pointerDown(screen.getByTestId("handle-age"), {
    button: 0,
    pointerId: 1,
    clientX: 200,
  });

  // 가변 columns — 드래그하던 컬럼이 없어진다
  rerender(<Harness columnKeys={["name"]} defaultWidths={{ name: 100, age: 80 }} />);

  expect(removeSpy.mock.calls.filter(([type]) => type === "pointermove")).toHaveLength(1);
  expect(document.body.style.userSelect).toBe("");
  // 핸들이 언마운트되며 포커스가 body로 떨어지지 않는다 (전역 규칙 23)
  expect(screen.getByRole("table")).toHaveFocus();
  removeSpy.mockRestore();
});

test("storageKey가 없으면 localStorage에 아무것도 쓰지 않는다", () => {
  render(<Harness columnKeys={["name"]} defaultWidths={{ name: 100 }} />);

  fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight" });
  expect(screen.getByRole("cell")).toHaveTextContent("108");
  expect(window.localStorage.length).toBe(0);
});

test("storageKey가 있으면 네임스페이스된 키에 저장한다", () => {
  render(<Harness columnKeys={["name"]} defaultWidths={{ name: 100 }} storageKey="members" />);

  fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight" });

  // 앱 전역 키에 저장해 화면끼리 덮어쓰던 결함(S3)의 차단
  const raw = window.localStorage.getItem("@jeon-ji/common-ui:table:members");
  expect(raw).not.toBeNull();
  expect(JSON.parse(raw ?? "{}")).toEqual({ name: 108 });
});

test("저장된 폭을 다음 마운트에서 되살린다", () => {
  window.localStorage.setItem("@jeon-ji/common-ui:table:members", JSON.stringify({ name: 222 }));
  render(<Harness columnKeys={["name"]} defaultWidths={{ name: 100 }} storageKey="members" />);

  expect(screen.getByRole("cell")).toHaveTextContent("222");
});

test("첫 마운트만으로는 저장하지 않는다 — 저장은 바뀐 뒤에 일어난다", () => {
  render(<Harness columnKeys={["name"]} defaultWidths={{ name: 100 }} storageKey="members" />);
  expect(window.localStorage.getItem("@jeon-ji/common-ui:table:members")).toBeNull();
});

test("손상된 저장값은 무시하고 기본값으로 간다", () => {
  window.localStorage.setItem("@jeon-ji/common-ui:table:members", "{{ 깨진 JSON");
  render(<Harness columnKeys={["name"]} defaultWidths={{ name: 100 }} storageKey="members" />);

  expect(screen.getByRole("cell")).toHaveTextContent("100"); // defaultWidths로 간다
  expect(screen.getByRole("separator")).toHaveAttribute("aria-valuenow", "100");
});

test("숫자가 아닌 저장값은 걸러낸다", () => {
  window.localStorage.setItem(
    "@jeon-ji/common-ui:table:members",
    JSON.stringify({ name: "150", age: 90 }),
  );
  render(
    <Harness
      columnKeys={["name", "age"]}
      defaultWidths={{ name: 100, age: 80 }}
      storageKey="members"
    />,
  );

  const cells = screen.getAllByRole("cell");
  expect(cells[0]).toHaveTextContent("100"); // 문자열 "150"은 버리고 defaultWidths가 남는다
  expect(cells[1]).toHaveTextContent("90");
});

test("reset은 초기 폭으로 되돌린다", () => {
  render(<Harness columnKeys={["name"]} defaultWidths={{ name: 100 }} />);

  fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight" });
  expect(screen.getByRole("cell")).toHaveTextContent("108");

  fireEvent.click(screen.getByRole("button", { name: "초기화" }));
  expect(screen.getByRole("cell")).toHaveTextContent("100");
});

test("onChange는 바뀐 폭 전체를 넘긴다", () => {
  const onChange = vi.fn();
  render(<Harness columnKeys={["name"]} defaultWidths={{ name: 100 }} onChange={onChange} />);

  fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight" });
  expect(onChange).toHaveBeenCalledExactlyOnceWith({ name: 108 });
});

test("왼쪽 버튼이 아니면 드래그를 시작하지 않는다", () => {
  const addSpy = vi.spyOn(window, "addEventListener");
  render(<Harness columnKeys={["name"]} defaultWidths={{ name: 100 }} />);

  fireEvent.pointerDown(screen.getByTestId("handle-name"), {
    button: 2,
    pointerId: 1,
    clientX: 200,
  });
  expect(addSpy.mock.calls.filter(([type]) => type === "pointermove")).toHaveLength(0);
  addSpy.mockRestore();
});
