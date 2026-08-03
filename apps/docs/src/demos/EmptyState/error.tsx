import { Button, EmptyState } from "@jeon-ji/common-ui";
import { useState } from "react";

export default function ErrorDemo() {
  const [retries, setRetries] = useState(0);

  return (
    <EmptyState
      status="error"
      title="목록을 불러오지 못했습니다"
      description="잠시 후 다시 시도해 주세요."
      action={
        <Button
          variant="outline"
          onClick={() => {
            setRetries((count) => count + 1);
          }}
        >
          다시 시도{retries > 0 && ` (${String(retries)})`}
        </Button>
      }
      // 사용자 조작의 결과로 나타나는 오류라면 낭독시킨다 — 기본값은 낭독하지 않는다
      role="status"
    />
  );
}
