import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { expect, test, vi } from "vitest";

import { Table, type TableColumn, type TableSelection, type TableSort } from "./index.js";

interface Person {
  id: string;
  name: string;
  age: number;
}

const people: Person[] = [
  { id: "a", name: "김하나", age: 30 },
  { id: "b", name: "이두리", age: 24 },
  { id: "c", name: "박세찬", age: 41 },
];

const columns: TableColumn<Person>[] = [
  { key: "name", header: "이름", render: (row) => row.name, sortable: true },
  { key: "age", header: "나이", render: (row) => row.age, align: "right" },
];

/** 선택 계약의 최소 구현 — 훅(Group 2)과 무관하게 Table의 렌더 계약만 검증한다 */
function stubSelection(overrides: Partial<TableSelection> = {}): TableSelection {
  return {
    selectedKeys: [],
    isSelected: () => false,
    isDisabled: () => false,
    toggle: vi.fn(),
    toggleAll: vi.fn(),
    allState: "none",
    clear: vi.fn(),
    ...overrides,
  };
}

test("시맨틱: caption이 표의 접근 이름이 되고 헤더는 scope=col이다", () => {
  render(<Table caption="직원 목록" columns={columns} rows={people} rowKey={(row) => row.id} />);

  expect(screen.getByRole("table", { name: "직원 목록" })).toBeInTheDocument();
  for (const header of screen.getAllByRole("columnheader")) {
    expect(header).toHaveAttribute("scope", "col");
  }
});

test("caption 없이 aria-label로도 이름을 줄 수 있다", () => {
  render(<Table aria-label="직원 목록" columns={columns} rows={people} rowKey={(row) => row.id} />);
  expect(screen.getByRole("table", { name: "직원 목록" })).toBeInTheDocument();
});

test("render가 그린 것만 나온다 — row[key] 자동 렌더는 없다", () => {
  render(
    <Table
      caption="표"
      columns={[{ key: "name", header: "이름", render: (row) => `${row.name}님` }]}
      rows={people}
      rowKey={(row) => row.id}
    />,
  );

  expect(screen.getByText("김하나님")).toBeInTheDocument();
  // age 컬럼을 선언하지 않았으므로 데이터에 있어도 그려지지 않는다
  expect(screen.queryByText("30")).not.toBeInTheDocument();
});

test("정렬 가능한 컬럼만 aria-sort를 갖는다", () => {
  render(<Table caption="표" columns={columns} rows={people} rowKey={(row) => row.id} />);

  expect(screen.getByRole("columnheader", { name: "이름" })).toHaveAttribute("aria-sort", "none");
  // 정렬과 무관한 컬럼의 "none"은 소음이라 아예 부여하지 않는다
  expect(screen.getByRole("columnheader", { name: "나이" })).not.toHaveAttribute("aria-sort");
});

test("정렬 상태는 aria-sort가 말하고 버튼 이름은 헤더 텍스트뿐이다", () => {
  render(
    <Table
      caption="표"
      columns={columns}
      rows={people}
      rowKey={(row) => row.id}
      sort={{ key: "name", direction: "desc" }}
    />,
  );

  expect(screen.getByRole("columnheader", { name: "이름" })).toHaveAttribute(
    "aria-sort",
    "descending",
  );
  // 이름에 "내림차순"을 넣으면 aria-sort와 겹쳐 두 번 안내된다 (규칙 26)
  expect(screen.getByRole("button", { name: "이름" })).toHaveAccessibleName("이름");
});

test("헤더는 버튼이라 키보드로 정렬할 수 있다", async () => {
  const user = userEvent.setup();
  const onSortChange = vi.fn();
  render(
    <Table
      caption="표"
      columns={columns}
      rows={people}
      rowKey={(row) => row.id}
      onSortChange={onSortChange}
    />,
  );

  await user.tab();
  expect(screen.getByRole("button", { name: "이름" })).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(onSortChange).toHaveBeenCalledExactlyOnceWith({ key: "name", direction: "asc" });
});

test("같은 컬럼을 다시 누르면 방향만 뒤집힌다", async () => {
  const user = userEvent.setup();
  const onSortChange = vi.fn();
  render(
    <Table
      caption="표"
      columns={columns}
      rows={people}
      rowKey={(row) => row.id}
      sort={{ key: "name", direction: "asc" }}
      onSortChange={onSortChange}
    />,
  );

  await user.click(screen.getByRole("button", { name: "이름" }));
  expect(onSortChange).toHaveBeenCalledExactlyOnceWith({ key: "name", direction: "desc" });
});

test("정렬은 제어형이다 — rows 순서를 Table이 바꾸지 않는다", async () => {
  const user = userEvent.setup();
  render(
    <Table
      caption="표"
      columns={columns}
      rows={people}
      rowKey={(row) => row.id}
      onSortChange={vi.fn()}
    />,
  );

  await user.click(screen.getByRole("button", { name: "이름" }));
  const cells = screen.getAllByRole("cell").map((cell) => cell.textContent);
  expect(cells).toEqual(["김하나", "30", "이두리", "24", "박세찬", "41"]);
});

test("빈 상태: empty 슬롯이 전체 폭 셀 하나에 그려진다", () => {
  render(
    <Table
      caption="표"
      columns={columns}
      rows={[]}
      rowKey={(row) => row.id}
      empty={<span>결과가 없습니다</span>}
    />,
  );

  const cell = screen.getByRole("cell");
  expect(within(cell).getByText("결과가 없습니다")).toBeInTheDocument();
  expect(cell).toHaveAttribute("colspan", "2");
});

test("빈 상태: empty를 넘기지 않으면 아무 행도 그리지 않는다", () => {
  render(<Table caption="표" columns={columns} rows={[]} rowKey={(row) => row.id} />);
  expect(screen.queryAllByRole("cell")).toHaveLength(0);
});

test("로딩: aria-busy가 붙고 Skeleton 행이 그려진다", () => {
  render(
    <Table
      caption="표"
      columns={columns}
      rows={[]}
      rowKey={(row) => row.id}
      loading
      loadingRows={2}
    />,
  );

  expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
  expect(screen.getAllByRole("row")).toHaveLength(3); // 헤더 1 + Skeleton 2
});

test("로딩과 빈 상태는 동시에 보이지 않는다", () => {
  render(
    <Table
      caption="표"
      columns={columns}
      rows={[]}
      rowKey={(row) => row.id}
      loading
      empty={<span>결과가 없습니다</span>}
    />,
  );
  expect(screen.queryByText("결과가 없습니다")).not.toBeInTheDocument();
});

test("로딩 중에는 기존 행 대신 Skeleton만 보인다", () => {
  render(
    <Table
      caption="표"
      columns={columns}
      rows={people}
      rowKey={(row) => row.id}
      loading
      loadingRows={1}
    />,
  );
  expect(screen.queryByText("김하나")).not.toBeInTheDocument();
});

test("고정 컬럼: 오프셋이 CSS 변수로 전달되고 그림자는 data 속성이 켠다", () => {
  render(
    <Table
      caption="표"
      columns={[
        { key: "a", header: "A", render: () => "a", sticky: "left", width: 80 },
        { key: "b", header: "B", render: () => "b", sticky: "left", width: 120 },
        { key: "c", header: "C", render: () => "c" },
        { key: "d", header: "D", render: () => "d", sticky: "right", width: 60 },
      ]}
      rows={[{ id: "a", name: "", age: 0 }]}
      rowKey={(row) => row.id}
    />,
  );

  const headers = screen.getAllByRole("columnheader");
  expect(headers[0]).toHaveAttribute("data-sticky", "left");
  expect(headers[0]?.style.getPropertyValue("--ui-table-sticky-offset")).toBe("0px");
  // 두 번째 고정 컬럼은 첫 번째 폭만큼 밀린다
  expect(headers[1]?.style.getPropertyValue("--ui-table-sticky-offset")).toBe("80px");
  expect(headers[2]).not.toHaveAttribute("data-sticky");
  expect(headers[3]).toHaveAttribute("data-sticky", "right");
  expect(headers[3]?.style.getPropertyValue("--ui-table-sticky-offset")).toBe("0px");
});

test("선택 열: 헤더와 행 체크박스가 각자 이름을 갖는다", () => {
  render(
    <Table
      caption="표"
      columns={columns}
      rows={people}
      rowKey={(row) => row.id}
      selection={stubSelection()}
      selectionLabel={(row) => `${row.name} 선택`}
    />,
  );

  expect(screen.getByRole("checkbox", { name: "전체 선택" })).toBeInTheDocument();
  // 행 체크박스는 행을 식별할 수 있는 이름을 갖는다 (규칙 26)
  expect(screen.getByRole("checkbox", { name: "김하나 선택" })).toBeInTheDocument();
  expect(screen.getByRole("checkbox", { name: "박세찬 선택" })).toBeInTheDocument();
});

test("선택 열: allState=some이면 헤더 체크박스가 mixed로 읽힌다", () => {
  render(
    <Table
      caption="표"
      columns={columns}
      rows={people}
      rowKey={(row) => row.id}
      selection={stubSelection({ allState: "some" })}
    />,
  );
  expect(screen.getByRole("checkbox", { name: "전체 선택" })).toHaveAttribute(
    "aria-checked",
    "mixed",
  );
});

test("선택 열: 행 체크박스가 toggle을, 헤더가 toggleAll을 부른다", async () => {
  const user = userEvent.setup();
  const selection = stubSelection();
  render(
    <Table
      caption="표"
      columns={columns}
      rows={people}
      rowKey={(row) => row.id}
      selection={selection}
      selectionLabel={(row) => `${row.name} 선택`}
    />,
  );

  await user.click(screen.getByRole("checkbox", { name: "이두리 선택" }));
  expect(selection.toggle).toHaveBeenCalledExactlyOnceWith("b");

  await user.click(screen.getByRole("checkbox", { name: "전체 선택" }));
  expect(selection.toggleAll).toHaveBeenCalledOnce();
});

test("선택 열: isDisabled인 행은 체크박스가 비활성이다", () => {
  render(
    <Table
      caption="표"
      columns={columns}
      rows={people}
      rowKey={(row) => row.id}
      selection={stubSelection({ isDisabled: (key) => key === "b" })}
      selectionLabel={(row) => `${row.name} 선택`}
    />,
  );

  expect(screen.getByRole("checkbox", { name: "이두리 선택" })).toBeDisabled();
  expect(screen.getByRole("checkbox", { name: "김하나 선택" })).toBeEnabled();
});

test("columns가 줄면 빈 상태 셀의 colSpan이 따라 줄어든다", async () => {
  const user = userEvent.setup();
  function Shrinking() {
    const [cols, setCols] = useState(columns);
    return (
      <>
        <button
          type="button"
          onClick={() => {
            setCols(columns.slice(0, 1));
          }}
        >
          컬럼 줄이기
        </button>
        <Table
          caption="표"
          columns={cols}
          rows={[]}
          rowKey={(row: Person) => row.id}
          empty={<span>비었음</span>}
        />
      </>
    );
  }
  render(<Shrinking />);

  expect(screen.getByRole("cell")).toHaveAttribute("colspan", "2");
  await user.click(screen.getByRole("button", { name: "컬럼 줄이기" }));
  expect(screen.getByRole("cell")).toHaveAttribute("colspan", "1");
});

test("정렬 기준 컬럼이 사라져도 남은 헤더가 정렬 상태를 참칭하지 않는다", () => {
  render(
    <Table
      caption="표"
      columns={columns}
      rows={people}
      rowKey={(row) => row.id}
      // 존재하지 않는 컬럼을 가리키는 정렬 상태 (가변 columns의 흔한 중간 상태)
      sort={{ key: "email", direction: "asc" } satisfies TableSort}
    />,
  );

  expect(screen.getByRole("columnheader", { name: "이름" })).toHaveAttribute("aria-sort", "none");
});

test("size가 data 속성으로 노출된다", () => {
  render(<Table caption="표" columns={columns} rows={people} rowKey={(row) => row.id} size="sm" />);
  expect(screen.getByRole("table")).toHaveAttribute("data-size", "sm");
});

test("ref가 table 요소로 전달된다", () => {
  let node: HTMLTableElement | null = null;
  render(
    <Table
      caption="표"
      columns={columns}
      rows={people}
      rowKey={(row) => row.id}
      ref={(el) => {
        node = el;
      }}
    />,
  );
  expect(node).toBeInstanceOf(HTMLTableElement);
});
