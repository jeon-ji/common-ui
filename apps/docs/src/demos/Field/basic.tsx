import { Field } from "@jeon-ji/common-ui";

/**
 * Field는 label·helper·error의 배치와 aria 연결만 담당한다.
 * 실전에서는 TextField 등 폼 컨트롤을 자식으로 넣는다 — 여기서는 네이티브 input으로 시연.
 */
export default function BasicDemo() {
  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-6)", maxWidth: 320 }}>
      <Field label="이름" helperText="실명을 입력하세요">
        <input className="demo-native-input" placeholder="홍길동" />
      </Field>
      <Field label="이메일" required errorText="이메일 형식이 아닙니다">
        <input className="demo-native-input" defaultValue="not-an-email" />
      </Field>
    </div>
  );
}
