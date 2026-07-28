import { Field, TextField } from "@jeon-ji/common-ui";
import { useState } from "react";

export default function BasicDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("not-an-email");
  const emailInvalid = email !== "" && !email.includes("@");

  return (
    <div style={{ display: "grid", gap: "var(--ui-spacing-6)", maxWidth: 320 }}>
      <Field label="이름" helperText={`입력값: "${name}"`}>
        <TextField value={name} onChange={setName} placeholder="홍길동" />
      </Field>
      <Field
        label="이메일"
        required
        errorText={emailInvalid ? "이메일 형식이 아닙니다" : undefined}
      >
        <TextField type="email" value={email} onChange={setEmail} />
      </Field>
    </div>
  );
}
