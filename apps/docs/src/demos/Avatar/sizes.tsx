import { Avatar } from "@jeon-ji/common-ui";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export default function SizesDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-spacing-4)" }}>
      {(["circle", "square"] as const).map((shape) => (
        <div
          key={shape}
          style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-3)" }}
        >
          {SIZES.map((size) => (
            <Avatar key={size} name="Ada Lovelace" size={size} shape={shape} />
          ))}
          <span style={{ color: "var(--ui-color-text-secondary)" }}>{shape}</span>
        </div>
      ))}
    </div>
  );
}
