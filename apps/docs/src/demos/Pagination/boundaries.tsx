import { Pagination } from "@jeon-ji/common-ui";

export default function BoundariesDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-spacing-5)" }}>
      {/* 기본: 양 끝 1개 + 현재 좌우 1개 */}
      <Pagination aria-label="기본" total={20} defaultValue={10} />
      {/* 현재 페이지 주변을 더 넓게 */}
      <Pagination aria-label="siblings 2" total={20} defaultValue={10} siblings={2} />
      {/* 양 끝을 더 넓게 */}
      <Pagination aria-label="boundaries 2" total={30} defaultValue={15} boundaries={2} />
      {/* 작은 크기 */}
      <Pagination aria-label="작은 크기" total={20} defaultValue={10} size="sm" />
    </div>
  );
}
