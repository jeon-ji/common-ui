import { Pagination } from "@jeon-ji/common-ui";
import { useState } from "react";

export default function BasicDemo() {
  const [page, setPage] = useState(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-spacing-3)" }}>
      <Pagination total={10} value={page} onChange={setPage} />
      <span>{page} 페이지 내용</span>
    </div>
  );
}
