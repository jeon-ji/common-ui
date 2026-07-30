import { Pagination } from "@jeon-ji/common-ui";
import { useState } from "react";

export default function PageInputDemo() {
  const [page, setPage] = useState(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-spacing-3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-2)" }}>
        {/* 시각 라벨은 소비 앱이 제공한다 — 컴포넌트는 aria-label만 붙인다 */}
        <span id="page-jump-label">페이지 이동</span>
        {/* 숫자를 입력하고 Enter(또는 포커스 이동)로 이동한다 — 타이핑 중에는 움직이지 않는다 */}
        <Pagination
          aria-labelledby="page-jump-label"
          total={50}
          value={page}
          onChange={setPage}
          pageInput
        />
      </div>
      <span>현재 {page} / 50</span>
    </div>
  );
}
