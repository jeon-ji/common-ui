import { Avatar, Button } from "@jeon-ji/common-ui";
import { useState } from "react";

const BROKEN = "/does-not-exist.png";
const PHOTO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%2316a34a'/%3E%3Ccircle cx='32' cy='25' r='12' fill='%23dcfce7'/%3E%3Cpath d='M8 64c0-13 11-23 24-23s24 10 24 23z' fill='%23dcfce7'/%3E%3C/svg%3E";

export default function FallbackDemo() {
  const [src, setSrc] = useState(BROKEN);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--ui-spacing-3)" }}>
      <Avatar src={src} alt="전지현" name="전지현" size="lg" />
      <Button
        variant="outline"
        onClick={() => {
          setSrc((current) => (current === BROKEN ? PHOTO : BROKEN));
        }}
      >
        {src === BROKEN ? "정상 이미지로 교체" : "깨진 주소로 교체"}
      </Button>
    </div>
  );
}
