import { Button } from "@jeon-ji/common-ui";

const variants = ["solid", "outline", "ghost"] as const;
const tones = ["primary", "neutral", "danger"] as const;

export default function BasicDemo() {
  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-3)" }}>
      {variants.map((variant) => (
        <div key={variant} style={{ display: "flex", gap: "var(--ui-spacing-3)" }}>
          {tones.map((tone) => (
            <Button key={tone} variant={variant} tone={tone}>
              {variant} · {tone}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}
