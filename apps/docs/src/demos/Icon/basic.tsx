import { CheckIcon, ChevronDownIcon, SearchIcon } from "@jeon-ji/common-ui";

export default function BasicDemo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-4)" }}>
      {/* 기본 1em — 주변 폰트 크기를 따라간다 */}
      <span style={{ fontSize: "var(--ui-text-body2-size)" }}>
        본문 <CheckIcon /> 크기
      </span>
      <span style={{ fontSize: "var(--ui-text-h2-size)" }}>
        제목 <CheckIcon /> 크기
      </span>
      {/* size 지정 */}
      <SearchIcon size={28} />
      {/* 색은 currentColor 상속 */}
      <span style={{ color: "var(--ui-color-danger-default)" }}>
        <ChevronDownIcon size={28} />
      </span>
    </div>
  );
}
