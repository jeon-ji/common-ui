import { Pagination, Table, type TableColumn, useTableSelection } from "@jeon-ji/common-ui";
import { useState } from "react";

interface Item {
  id: string;
  name: string;
}

const all: Item[] = Array.from({ length: 8 }, (_item, index) => ({
  id: `i${String(index + 1)}`,
  name: `항목 ${String(index + 1)}`,
}));

const PAGE_SIZE = 4;

const columns: TableColumn<Item>[] = [{ key: "name", header: "이름", render: (row) => row.name }];

export default function BasicDemo() {
  const [page, setPage] = useState(1);
  const rows = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // keys는 "지금 화면"의 행이다 — 페이지를 넘기면 이 배열만 바뀐다
  const selection = useTableSelection({ keys: rows.map((row) => row.id) });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-spacing-3)" }}>
      <Table
        caption="항목 목록"
        size="sm"
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        selection={selection}
        selectionLabel={(row) => `${row.name} 선택`}
      />
      <Pagination total={2} value={page} onChange={setPage} size="sm" />
      {/* 페이지를 넘겨도 선택은 남는다. 헤더 체크박스만 지금 화면 기준으로 다시 계산된다 */}
      <span>선택: {selection.selectedKeys.join(", ") || "없음"}</span>
    </div>
  );
}
