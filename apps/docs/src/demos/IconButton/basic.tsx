import { ChevronLeftIcon, CloseIcon, IconButton, SearchIcon } from "@jeon-ji/common-ui";

export default function BasicDemo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-3)" }}>
      <IconButton aria-label="닫기">
        <CloseIcon />
      </IconButton>
      <IconButton aria-label="뒤로" variant="outline">
        <ChevronLeftIcon />
      </IconButton>
      <IconButton aria-label="검색" variant="solid" tone="primary">
        <SearchIcon />
      </IconButton>
      <IconButton aria-label="삭제" variant="solid" tone="danger" size="lg">
        <CloseIcon />
      </IconButton>
      <IconButton aria-label="닫기 (비활성)" disabled>
        <CloseIcon />
      </IconButton>
    </div>
  );
}
