import { Avatar } from "@jeon-ji/common-ui";

// 에셋은 모듈 그래프 안에 둔다 — 데모용 이미지는 data URI로 인라인한다 (전역 규칙 2)
const PHOTO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%234f46e5'/%3E%3Ccircle cx='32' cy='25' r='12' fill='%23c7d2fe'/%3E%3Cpath d='M8 64c0-13 11-23 24-23s24 10 24 23z' fill='%23c7d2fe'/%3E%3C/svg%3E";

export default function BasicDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-spacing-4)" }}>
      {/* 아바타가 유일한 식별 수단이다 → alt를 채운다 */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-3)" }}>
        <Avatar src={PHOTO} alt="전지현" />
        <Avatar alt="Ada Lovelace" name="Ada Lovelace" />
        <Avatar alt="알 수 없는 사용자">?</Avatar>
      </div>

      {/* 이름이 옆에 이미 있다 → alt를 비워 중복 낭독을 막는다 */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-2)" }}>
        <Avatar name="전지현" size="sm" />
        <span>전지현</span>
      </div>
    </div>
  );
}
