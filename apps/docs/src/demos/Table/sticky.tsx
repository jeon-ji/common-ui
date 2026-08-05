import { Button, Table, type TableColumn } from "@jeon-ji/common-ui";
import type { CSSProperties } from "react";

interface Row {
  id: string;
  name: string;
  team: string;
  email: string;
  phone: string;
  joined: string;
  role: string;
}

const rows: Row[] = Array.from({ length: 8 }, (_item, index) => ({
  id: `u${String(index)}`,
  name: `사용자 ${String(index + 1)}`,
  team: index % 2 === 0 ? "플랫폼" : "프로덕트",
  email: `user${String(index + 1)}@example.com`,
  phone: `010-0000-${String(1000 + index)}`,
  joined: `2026-0${String((index % 9) + 1)}-15`,
  role: index === 0 ? "관리자" : "구성원",
}));

// 고정 컬럼은 width를 함께 준다 — 이웃한 고정 컬럼의 오프셋을 폭에서 계산한다
const columns: TableColumn<Row>[] = [
  { key: "name", header: "이름", sticky: "left", width: 120, render: (row) => row.name },
  { key: "team", header: "팀", render: (row) => row.team },
  { key: "email", header: "이메일", width: 220, render: (row) => row.email },
  { key: "phone", header: "연락처", width: 160, render: (row) => row.phone },
  { key: "joined", header: "입사일", width: 140, render: (row) => row.joined },
  { key: "role", header: "역할", render: (row) => row.role },
  {
    key: "actions",
    header: "관리",
    sticky: "right",
    width: 100,
    align: "center",
    render: (row) => (
      <Button size="sm" variant="ghost" aria-label={`${row.name} 편집`}>
        편집
      </Button>
    ),
  },
];

export default function StickyDemo() {
  return (
    // 스크롤될 여지를 소비자가 정한다 — 고정 헤더는 넘칠 높이가, 고정 컬럼은 넘칠 폭이 있어야
    // 의미가 있다. min-width가 없으면 표가 컨테이너에 맞춰 줄어들 뿐 가로 스크롤이 생기지 않는다
    <div
      style={
        { "--ui-table-max-height": "240px", "--ui-table-min-width": "1000px" } as CSSProperties
      }
    >
      <Table
        caption="구성원 목록"
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        stickyHeader
      />
    </div>
  );
}
