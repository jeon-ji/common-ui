import { Fixture } from "./Fixture";

/** 화면 렌더와 코드 표시가 같은 파일 — 이 소스가 그대로 데모 블록의 코드가 된다 */
export default function BasicDemo() {
  return (
    <div style={{ display: "flex", gap: "var(--ui-spacing-3)" }}>
      <Fixture>기본</Fixture>
      <Fixture variant="outline">아웃라인</Fixture>
      <Fixture loading>로딩</Fixture>
    </div>
  );
}
