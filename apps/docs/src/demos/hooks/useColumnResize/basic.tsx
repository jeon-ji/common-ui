import {
  Button,
  type ColumnResizeHandleProps,
  Table,
  type TableColumn,
  useColumnResize,
} from "@jeon-ji/common-ui";
import type { CSSProperties } from "react";

interface Row {
  id: string;
  product: string;
  price: string;
}

const rows: Row[] = [
  { id: "p1", product: "무선 키보드", price: "89,000원" },
  { id: "p2", product: "27인치 모니터", price: "329,000원" },
];

const FIELDS = [
  { key: "product", label: "상품", render: (row: Row) => row.product },
  { key: "price", label: "가격", render: (row: Row) => row.price },
];

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

export default function BasicDemo() {
  const { widths, getHandleProps, reset } = useColumnResize({
    columnKeys: FIELDS.map((field) => field.key),
    defaultWidths: { product: 200, price: 120 },
    // 저장 키를 주면 이 화면의 폭만 기억한다 — 실제 키는 `@jeon-ji/common-ui:table:<storageKey>`다
    storageKey: "docs-demo",
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-spacing-3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-3)" }}>
        <Button size="sm" variant="outline" onClick={reset}>
          폭 초기화
        </Button>
        <span>핸들에 포커스를 두고 ←/→ 를 눌러도 조절된다</span>
      </div>
      <Table caption="상품 목록" columns={columns} rows={rows} rowKey={(row) => row.id} />
    </div>
  );
}
