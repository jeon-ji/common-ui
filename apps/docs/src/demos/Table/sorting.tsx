import { Table, type TableColumn, type TableSort } from "@jeon-ji/common-ui";
import { useMemo, useState } from "react";

interface Member {
  id: string;
  name: string;
  score: number;
}

const members: Member[] = [
  { id: "m1", name: "김하나", score: 82 },
  { id: "m2", name: "이두리", score: 95 },
  { id: "m3", name: "박세찬", score: 74 },
];

const columns: TableColumn<Member>[] = [
  { key: "name", header: "이름", sortable: true, render: (row) => row.name },
  { key: "score", header: "점수", sortable: true, align: "right", render: (row) => row.score },
];

export default function SortingDemo() {
  const [sort, setSort] = useState<TableSort>({ key: "score", direction: "desc" });

  // 정렬 **로직은 소비 앱이 소유한다** — Table은 상태를 표시하고 변경을 알릴 뿐이다.
  // 서버 정렬로 바꾸고 싶으면 이 자리를 요청으로 갈아 끼우면 된다
  const sorted = useMemo(() => {
    const factor = sort.direction === "asc" ? 1 : -1;
    return [...members].sort((a, b) =>
      sort.key === "name" ? a.name.localeCompare(b.name) * factor : (a.score - b.score) * factor,
    );
  }, [sort]);

  return (
    <Table
      caption="점수 순위"
      columns={columns}
      rows={sorted}
      rowKey={(row) => row.id}
      sort={sort}
      onSortChange={setSort}
    />
  );
}
