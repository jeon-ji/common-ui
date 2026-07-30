import { Button, Popover, type PopoverProps } from "@jeon-ji/common-ui";
import { useRef, useState } from "react";

const SIDES = ["top", "bottom", "left", "right"] as const;
const ALIGNS = ["start", "center", "end"] as const;

function PlacementPopover({
  side,
  align,
  label,
}: {
  side: NonNullable<PopoverProps["side"]>;
  align: NonNullable<PopoverProps["align"]>;
  label: string;
}) {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        ref={anchorRef}
        variant="outline"
        tone="neutral"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {label}
      </Button>
      <Popover anchorRef={anchorRef} open={open} onOpenChange={setOpen} side={side} align={align}>
        side=&quot;{side}&quot; align=&quot;{align}&quot; — 공간이 없으면 반대편으로 플립되고(양쪽
        다 부족하면 남은 공간이 큰 쪽), 교차축은 뷰포트 안으로 클램핑된다.
      </Popover>
    </>
  );
}

export default function PlacementDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ui-spacing-4)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ui-spacing-4)" }}>
        {SIDES.map((side) => (
          <PlacementPopover key={side} side={side} align="center" label={side} />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ui-spacing-4)" }}>
        {ALIGNS.map((align) => (
          <PlacementPopover key={align} side="bottom" align={align} label={`bottom · ${align}`} />
        ))}
      </div>
    </div>
  );
}
