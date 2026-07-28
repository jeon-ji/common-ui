import { Text } from "@jeon-ji/common-ui";

const LONG =
  "말줄임이 발생할 만큼 충분히 긴 텍스트입니다. 잘렸을 때만 title 속성이 붙어 " +
  "마우스를 올리면 전체 내용을 확인할 수 있습니다. 컨테이너 너비를 줄여 보세요.";

export default function TruncateDemo() {
  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-3)", maxWidth: 360 }}>
      <Text ellipsis>{LONG}</Text>
      <Text lineClamp={2}>{LONG}</Text>
    </div>
  );
}
