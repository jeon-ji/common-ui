import * as icons from "@jeon-ji/common-ui/icons";

/** 배럴의 모든 아이콘을 열거 — 새 아이콘을 등록하면 자동으로 이 갤러리에 나타난다 */
export default function GalleryDemo() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: "var(--ui-spacing-4)",
      }}
    >
      {Object.entries(icons).map(([name, Icon]) => (
        <figure
          key={name}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--ui-spacing-2)",
            margin: 0,
            padding: "var(--ui-spacing-3)",
            border: "1px solid var(--ui-color-border-default)",
            borderRadius: "var(--ui-radius-md)",
          }}
        >
          <Icon size={24} />
          <figcaption
            style={{
              fontSize: "var(--ui-text-caption-size)",
              color: "var(--ui-color-text-secondary)",
            }}
          >
            {name}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
