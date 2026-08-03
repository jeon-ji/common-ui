import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { expect, test, vi } from "vitest";

import { Field } from "../Field/index.js";
import { Select, type SelectItem } from "./index.js";

const ITEMS: SelectItem[] = [
  { value: "apple", label: "사과" },
  { value: "banana", label: "바나나", disabled: true },
  { value: "grape", label: "포도" },
];

test("옵션이 줄어든 뒤에도 화살표 이동이 계속 동작한다 (공용 인덱스 유틸 계약)", async () => {
  const user = userEvent.setup();
  function Shrinking() {
    const [items, setItems] = useState(ITEMS);
    return (
      <>
        {/* pointerdown이 아닌 click만 발생시키므로 목록이 닫히지 않는다 */}
        <button type="button" onClick={() => setItems(ITEMS.slice(0, 1))}>
          줄이기
        </button>
        <Select items={items} aria-label="과일" />
      </>
    );
  }
  render(<Shrinking />);
  const trigger = screen.getByRole("combobox");

  await user.click(trigger);
  await user.keyboard("{End}"); // 마지막 옵션(포도) 활성
  fireEvent.click(screen.getByRole("button", { name: "줄이기" })); // 활성 인덱스가 범위 밖이 된다

  await user.keyboard("{ArrowDown}");
  expect(trigger).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "사과" }).id,
  );
});

test("닫힌 상태: combobox 시맨틱 + placeholder", () => {
  render(<Select items={ITEMS} placeholder="과일 선택" aria-label="과일" />);
  const trigger = screen.getByRole("combobox", { name: "과일" });
  expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
  expect(trigger).toHaveAttribute("aria-expanded", "false");
  expect(trigger).toHaveTextContent("과일 선택");
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

test("클릭으로 열리고 옵션 클릭으로 선택·닫힘", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Select items={ITEMS} onChange={onChange} aria-label="과일" />);
  const trigger = screen.getByRole("combobox");

  await user.click(trigger);
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("listbox")).toBeInTheDocument();

  await user.click(screen.getByRole("option", { name: "포도" }));
  expect(onChange).toHaveBeenCalledExactlyOnceWith("grape");
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  expect(trigger).toHaveTextContent("포도");
});

test("키보드: ArrowDown으로 열고 disabled 건너뛰며 Enter로 선택, 포커스는 트리거 유지", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Select items={ITEMS} onChange={onChange} aria-label="과일" />);
  const trigger = screen.getByRole("combobox");

  await user.tab();
  await user.keyboard("{ArrowDown}"); // 열림, 첫 활성 옵션(사과)
  expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(trigger).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "사과" }).id,
  );

  await user.keyboard("{ArrowDown}"); // 바나나(disabled) 건너뛰고 포도
  expect(trigger).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "포도" }).id,
  );

  await user.keyboard("{Enter}");
  expect(onChange).toHaveBeenCalledExactlyOnceWith("grape");
  expect(trigger).toHaveFocus();
});

test("Home/End가 첫/마지막 활성 옵션으로 이동한다", async () => {
  const user = userEvent.setup();
  render(<Select items={ITEMS} aria-label="과일" />);

  await user.tab();
  await user.keyboard("{ArrowDown}{End}");
  expect(screen.getByRole("combobox")).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "포도" }).id,
  );
  await user.keyboard("{Home}");
  expect(screen.getByRole("combobox")).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "사과" }).id,
  );
});

test("Escape 소유권: 열려 있을 때만 닫고 전파를 멈춘다", async () => {
  const user = userEvent.setup();
  const escapesSeen = vi.fn();
  render(
    // 전파 관찰용 하네스 — 시맨틱 없는 리스너 래퍼임을 role로 명시
    <div
      role="presentation"
      onKeyDown={(event) => {
        if (event.key === "Escape") escapesSeen();
      }}
    >
      <Select items={ITEMS} aria-label="과일" />
    </div>,
  );

  await user.tab();
  await user.keyboard("{ArrowDown}");
  await user.keyboard("{Escape}"); // 열림 상태 — Select가 소유, 바깥은 못 본다
  expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  expect(escapesSeen).not.toHaveBeenCalled();

  await user.keyboard("{Escape}"); // 닫힘 상태 — 소유권 없음, 바깥으로 전파
  expect(escapesSeen).toHaveBeenCalledTimes(1);
});

test("바깥 클릭으로 닫힌다", async () => {
  const user = userEvent.setup();
  render(
    <>
      <Select items={ITEMS} aria-label="과일" />
      <button type="button">바깥</button>
    </>,
  );
  await user.click(screen.getByRole("combobox"));
  expect(screen.getByRole("listbox")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "바깥" }));
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

test("disabled 옵션은 클릭해도 선택되지 않는다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Select items={ITEMS} onChange={onChange} aria-label="과일" />);
  await user.click(screen.getByRole("combobox"));
  await user.click(screen.getByRole("option", { name: "바나나" }));
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole("listbox")).toBeInTheDocument(); // 닫히지도 않는다
});

test("controlled: 부모가 갱신하기 전까지 표시가 바뀌지 않는다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Select items={ITEMS} value="apple" onChange={onChange} aria-label="과일" />);
  const trigger = screen.getByRole("combobox");
  expect(trigger).toHaveTextContent("사과");

  await user.click(trigger);
  await user.click(screen.getByRole("option", { name: "포도" }));
  expect(onChange).toHaveBeenCalledExactlyOnceWith("grape");
  expect(trigger).toHaveTextContent("사과");
});

test("items에 없는 value는 캐스팅 없이 placeholder로 처리한다", () => {
  render(<Select items={ITEMS} value="ghost" placeholder="선택" aria-label="과일" />);
  expect(screen.getByRole("combobox")).toHaveTextContent("선택");
});

test("선택된 옵션에 aria-selected가 붙는다", async () => {
  const user = userEvent.setup();
  render(<Select items={ITEMS} defaultValue="apple" aria-label="과일" />);
  await user.click(screen.getByRole("combobox"));
  expect(screen.getByRole("option", { name: /사과/ })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("option", { name: "포도" })).toHaveAttribute("aria-selected", "false");
});

test("Field 안에서 label·error가 자동 연결된다", () => {
  render(
    <Field label="과일" errorText="필수 선택">
      <Select items={ITEMS} />
    </Field>,
  );
  const trigger = screen.getByLabelText("과일");
  expect(trigger).toHaveAttribute("aria-invalid", "true");
});

test("disabled: 열리지 않는다", async () => {
  const user = userEvent.setup();
  render(<Select items={ITEMS} disabled aria-label="과일" />);
  await user.click(screen.getByRole("combobox"));
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});

test("multiple: 토글 선택되고 목록이 열린 채 유지된다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Select multiple items={ITEMS} onChange={onChange} aria-label="과일" />);
  const trigger = screen.getByRole("combobox");

  await user.click(trigger);
  expect(screen.getByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");

  await user.click(screen.getByRole("option", { name: "사과" }));
  expect(onChange).toHaveBeenLastCalledWith(["apple"]);
  expect(screen.getByRole("listbox")).toBeInTheDocument(); // 닫히지 않는다

  await user.click(screen.getByRole("option", { name: "포도" }));
  expect(onChange).toHaveBeenLastCalledWith(["apple", "grape"]);

  // 다시 클릭하면 해제
  await user.click(screen.getByRole("option", { name: /사과/ }));
  expect(onChange).toHaveBeenLastCalledWith(["grape"]);
});

test("multiple: 트리거에 선택 라벨이 나열된다", async () => {
  const user = userEvent.setup();
  render(<Select multiple items={ITEMS} defaultValue={["apple", "grape"]} aria-label="과일" />);
  const trigger = screen.getByRole("combobox");
  expect(trigger).toHaveTextContent("사과, 포도");

  await user.click(trigger);
  expect(screen.getByRole("option", { name: /사과/ })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("option", { name: /포도/ })).toHaveAttribute("aria-selected", "true");
});

test("multiple: Enter로 토글해도 포커스와 목록이 유지된다", async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(<Select multiple items={ITEMS} onChange={onChange} aria-label="과일" />);

  await user.tab();
  await user.keyboard("{ArrowDown}{Enter}");
  expect(onChange).toHaveBeenLastCalledWith(["apple"]);
  expect(screen.getByRole("listbox")).toBeInTheDocument();
  expect(screen.getByRole("combobox")).toHaveFocus();

  await user.keyboard("{ArrowDown}{Enter}");
  expect(onChange).toHaveBeenLastCalledWith(["apple", "grape"]);
});

test("판별 유니온: 모드에 맞지 않는 타입은 컴파일되지 않는다", () => {
  // @ts-expect-error -- 단일 모드에 배열 value 금지
  const invalidSingle = <Select items={ITEMS} value={["a"]} />;
  // @ts-expect-error -- 다중 모드에 문자열 콜백 금지
  const invalidMultiple = <Select multiple items={ITEMS} onChange={(v: string) => v} />;
  expect(invalidSingle).toBeTruthy();
  expect(invalidMultiple).toBeTruthy();
});

test("빈 items로 마운트한 뒤 항목이 도착해도 이동할 수 있다 (가변 items 계약)", async () => {
  const user = userEvent.setup();
  const { rerender } = render(<Select items={[]} aria-label="과일" />);

  await user.click(screen.getByRole("combobox"));
  expect(screen.getByRole("listbox")).toBeEmptyDOMElement();

  rerender(<Select items={ITEMS} aria-label="과일" />);
  await user.keyboard("{ArrowDown}");

  expect(screen.getByRole("combobox")).toHaveAttribute(
    "aria-activedescendant",
    screen.getByRole("option", { name: "사과" }).id,
  );
});

test("목록에 접근 이름이 있다 — Field 안이면 라벨, 단독이면 트리거", async () => {
  const user = userEvent.setup();
  const { unmount } = render(
    <Field label="과일">
      <Select items={ITEMS} />
    </Field>,
  );
  await user.click(screen.getByRole("combobox"));
  expect(screen.getByRole("listbox", { name: "과일" })).toBeInTheDocument();
  unmount();

  render(<Select items={ITEMS} placeholder="선택" aria-label="디저트" />);
  await user.click(screen.getByRole("combobox"));
  // 트리거를 가리키므로 트리거의 접근 이름을 그대로 물려받는다
  expect(screen.getByRole("listbox", { name: "디저트" })).toBeInTheDocument();
});
