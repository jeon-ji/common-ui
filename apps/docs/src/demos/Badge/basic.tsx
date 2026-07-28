import { Badge, IconButton, SearchIcon } from "@jeon-ji/common-ui";

export default function BasicDemo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-8)" }}>
      <Badge count={5}>
        <IconButton aria-label="알림 5건" variant="outline">
          <SearchIcon />
        </IconButton>
      </Badge>
      <Badge count={120}>
        <IconButton aria-label="메시지 120건" variant="outline">
          <SearchIcon />
        </IconButton>
      </Badge>
      <Badge dot>
        <IconButton aria-label="새 소식 있음" variant="outline">
          <SearchIcon />
        </IconButton>
      </Badge>
      <Badge count={0}>
        <IconButton aria-label="알림 없음" variant="outline">
          <SearchIcon />
        </IconButton>
      </Badge>
      <Badge count={42} />
    </div>
  );
}
