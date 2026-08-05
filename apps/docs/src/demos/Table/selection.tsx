import { Button, Table, type TableColumn, useTableSelection } from "@jeon-ji/common-ui";

interface File {
  id: string;
  name: string;
  size: string;
  locked: boolean;
}

const files: File[] = [
  { id: "f1", name: "기획서.pdf", size: "1.2 MB", locked: false },
  { id: "f2", name: "디자인.fig", size: "8.4 MB", locked: false },
  { id: "f3", name: "계약서.pdf", size: "340 KB", locked: true },
  { id: "f4", name: "회의록.md", size: "12 KB", locked: false },
];

const columns: TableColumn<File>[] = [
  { key: "name", header: "파일", render: (row) => row.name },
  { key: "size", header: "크기", align: "right", render: (row) => row.size },
  {
    key: "locked",
    header: "상태",
    render: (row) => (row.locked ? "잠김" : "-"),
  },
];

export default function SelectionDemo() {
  const selection = useTableSelection({
    keys: files.map((file) => file.id),
    // 잠긴 파일은 고를 수 없다 — 헤더의 "전체 선택"도 이 행을 건너뛴다
    disabledKeys: files.filter((file) => file.locked).map((file) => file.id),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-spacing-3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-3)" }}>
        <span>{selection.selectedKeys.length}개 선택됨</span>
        <Button
          size="sm"
          variant="outline"
          onClick={selection.clear}
          aria-disabled={selection.selectedKeys.length === 0 || undefined}
        >
          선택 해제
        </Button>
      </div>
      <Table
        caption="파일 목록"
        columns={columns}
        rows={files}
        rowKey={(row) => row.id}
        selection={selection}
        // 행을 식별할 수 있는 이름을 만든다 — "행 선택"이 넷이면 구분되지 않는다
        selectionLabel={(row) => `${row.name} 선택`}
      />
    </div>
  );
}
