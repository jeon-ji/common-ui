import { Field, Textarea } from "@jeon-ji/common-ui";

export default function BasicDemo() {
  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-6)", maxWidth: 400 }}>
      <Field label="소개" helperText="autoResize — 내용에 맞춰 늘어난다">
        <Textarea autoResize placeholder="여러 줄을 입력해 보세요" />
      </Field>
      <Field label="한줄평">
        <Textarea maxLength={50} rows={2} placeholder="50자 제한 + 카운터" />
      </Field>
      <Field label="비활성">
        <Textarea disabled defaultValue="수정 불가" />
      </Field>
    </div>
  );
}
