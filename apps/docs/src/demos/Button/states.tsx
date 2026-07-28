import { Button, SearchIcon } from "@jeon-ji/common-ui";
import { useState } from "react";

export default function StatesDemo() {
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-3)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-3)" }}>
        <Button size="sm">작게</Button>
        <Button>보통</Button>
        <Button size="lg">크게</Button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-3)" }}>
        <Button icon={<SearchIcon />}>검색</Button>
        <Button iconRight={<SearchIcon />} variant="outline">
          검색
        </Button>
        <Button disabled>비활성</Button>
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
          }}
        >
          {loading ? "저장 중" : "저장 (클릭)"}
        </Button>
      </div>
      <Button fullWidth variant="outline" tone="neutral">
        fullWidth
      </Button>
    </div>
  );
}
