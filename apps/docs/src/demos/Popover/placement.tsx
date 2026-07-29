import { Button, Popover, type PopoverProps } from "@jeon-ji/common-ui";
import { useRef, useState } from "react";

const SIDES = ["top", "bottom", "left", "right"] as const;

function SidePopover({ side }: { side: NonNullable<PopoverProps["side"]> }) {
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
        {side}
      </Button>
      <Popover anchorRef={anchorRef} open={open} onOpenChange={setOpen} side={side}>
        side=&quot;{side}&quot; — 공간이 없으면 반대편으로 플립되고, 교차축은 뷰포트 안으로
        클램핑된다.
      </Popover>
    </>
  );
}

export default function PlacementDemo() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ui-spacing-4)" }}>
      {SIDES.map((side) => (
        <SidePopover key={side} side={side} />
      ))}
    </div>
  );
}
