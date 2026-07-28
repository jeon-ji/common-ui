import { Button, IconButton, InfoCircleIcon, Tooltip } from "@jeon-ji/common-ui";

export default function BasicDemo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-4)" }}>
      <Tooltip content="hover 또는 키보드 포커스로 표시됩니다">
        <Button variant="outline" tone="neutral">
          hover / focus
        </Button>
      </Tooltip>
      <Tooltip content="아이콘 버튼의 의미를 보조 설명" placement="bottom">
        <IconButton aria-label="정보">
          <InfoCircleIcon />
        </IconButton>
      </Tooltip>
      <Tooltip content="Escape로 닫을 수 있고, Modal 안에서도 모달을 같이 닫지 않습니다" delay={0}>
        <Button variant="ghost" tone="neutral">
          지연 없음
        </Button>
      </Tooltip>
    </div>
  );
}
