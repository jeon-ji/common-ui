import { Skeleton } from "@jeon-ji/common-ui";

export default function BasicDemo() {
  return (
    <div style={{ display: "flex", gap: "var(--ui-spacing-4)", alignItems: "flex-start" }}>
      <Skeleton variant="circle" width={48} height={48} />
      <div style={{ flex: 1, display: "grid", gap: "var(--ui-spacing-2)" }}>
        <Skeleton width="40%" />
        <Skeleton />
        <Skeleton variant="rect" height={96} />
      </div>
    </div>
  );
}
