import { Checkbox } from "@jeon-ji/common-ui";

export default function BasicDemo() {
  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-3)" }}>
      <Checkbox>기본</Checkbox>
      <Checkbox defaultChecked>초기 선택</Checkbox>
      <Checkbox disabled>비활성</Checkbox>
      <Checkbox disabled defaultChecked>
        비활성 + 선택
      </Checkbox>
    </div>
  );
}
