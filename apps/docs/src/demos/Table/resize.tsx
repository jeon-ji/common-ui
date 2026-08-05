import {
  type ColumnResizeHandleProps,
  Table,
  type TableColumn,
  useColumnResize,
} from "@jeon-ji/common-ui";
import type { CSSProperties } from "react";

interface Row {
  id: string;
  name: string;
  team: string;
  memo: string;
}

const rows: Row[] = [
  { id: "r1", name: "김하나", team: "플랫폼", memo: "온보딩 진행 중" },
  { id: "r2", name: "이두리", team: "프로덕트", memo: "디자인 시스템 담당" },
  { id: "r3", name: "박세찬", team: "플랫폼", memo: "-" },
];

const FIELDS = [
  { key: "name", label: "이름", render: (row: Row) => row.name },
  { key: "team", label: "팀", render: (row: Row) => row.team },
  { key: "memo", label: "메모", render: (row: Row) => row.memo },
];

// 핸들의 생김새는 소비자 몫이다 — 훅은 동작과 ARIA만 준다
const HANDLE_STYLE: CSSProperties = {
  display: "inline-block",
  width: "5px",
  height: "1em",
  marginLeft: "var(--ui-spacing-2)",
  verticalAlign: "middle",
  background: "var(--ui-color-border-strong)",
  borderRadius: "var(--ui-radius-sm)",
  cursor: "col-resize",
};

function ResizeHandle({ style, ...rest }: ColumnResizeHandleProps) {
  return <span {...rest} style={{ ...style, ...HANDLE_STYLE }} />;
}

export default function ResizeDemo() {
  const { widths, getHandleProps } = useColumnResize({
    columnKeys: FIELDS.map((field) => field.key),
    defaultWidths: { name: 120, team: 120, memo: 200 },
    // 핸들 이름은 컬럼을 식별할 수 있게 만든다 — "열 너비 조절"이 셋이면 구분되지 않는다
    handleLabel: (key) => `${FIELDS.find((f) => f.key === key)?.label ?? key} 열 너비 조절`,
  });

  const columns: TableColumn<Row>[] = FIELDS.map((field) => ({
    key: field.key,
    header: (
      <>
        {field.label}
        <ResizeHandle {...getHandleProps(field.key)} />
      </>
    ),
    render: field.render,
    width: widths[field.key],
  }));

  return <Table caption="구성원 목록" columns={columns} rows={rows} rowKey={(row) => row.id} />;
}
