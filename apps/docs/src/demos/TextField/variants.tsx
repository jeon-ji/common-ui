import { TextField } from "@jeon-ji/common-ui";

export default function VariantsDemo() {
  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-4)", maxWidth: 320 }}>
      <TextField type="password" defaultValue="secret" aria-label="비밀번호" />
      <TextField type="search" placeholder="검색어 입력 후 지우기" aria-label="검색" />
      <TextField
        prefix={<span>₩</span>}
        suffix={<span>KRW</span>}
        placeholder="0"
        aria-label="금액"
      />
      <TextField clearable defaultValue="지울 수 있는 값" aria-label="메모" />
      <TextField disabled defaultValue="비활성" aria-label="비활성" />
    </div>
  );
}
