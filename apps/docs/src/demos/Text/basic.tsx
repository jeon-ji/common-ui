import { Heading, Text } from "@jeon-ji/common-ui";

export default function BasicDemo() {
  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-3)" }}>
      <Heading variant="display">Display 제목</Heading>
      <Heading variant="h1">H1 제목</Heading>
      <Heading variant="h2">H2 제목</Heading>
      <Heading variant="h3">H3 제목</Heading>
      <Text>body1 — 기본 본문 텍스트</Text>
      <Text variant="body2">body2 — 보조 본문 텍스트</Text>
      <Text variant="caption">caption — 캡션 텍스트</Text>
      <Text variant="code">const code = &quot;code variant&quot;;</Text>
    </div>
  );
}
