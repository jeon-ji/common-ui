import { Button, EmptyState, SegmentedControl, Table, type TableColumn } from "@jeon-ji/common-ui";
import { useState } from "react";

interface Ticket {
  id: string;
  title: string;
  assignee: string;
}

const tickets: Ticket[] = [
  { id: "t1", title: "로그인 실패 리포트", assignee: "김하나" },
  { id: "t2", title: "결제 화면 정렬 깨짐", assignee: "이두리" },
];

const columns: TableColumn<Ticket>[] = [
  { key: "title", header: "제목", render: (row) => row.title },
  { key: "assignee", header: "담당자", render: (row) => row.assignee },
];

type State = "data" | "loading" | "empty";

export default function StatesDemo() {
  const [state, setState] = useState<State>("data");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-spacing-3)" }}>
      <SegmentedControl
        aria-label="표시 상태"
        size="sm"
        items={[
          { value: "data", label: "데이터" },
          { value: "loading", label: "로딩" },
          { value: "empty", label: "빈 상태" },
        ]}
        value={state}
        onChange={(value) => {
          setState(value as State);
        }}
      />
      <Table
        caption="티켓 목록"
        columns={columns}
        rows={state === "data" ? tickets : []}
        rowKey={(row) => row.id}
        loading={state === "loading"}
        // empty는 슬롯이다 — Table은 EmptyState를 import 하지 않는다
        empty={
          <EmptyState
            size="sm"
            title="티켓이 없습니다"
            description="필터를 바꾸거나 새 티켓을 만들어 보세요"
            action={<Button size="sm">새 티켓</Button>}
          />
        }
      />
    </div>
  );
}
