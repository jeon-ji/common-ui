import { Tabs } from "@jeon-ji/common-ui";

export default function BasicDemo() {
  return (
    <Tabs
      aria-label="계정 설정"
      items={[
        { value: "profile", label: "프로필", content: "이름과 사진을 관리합니다." },
        { value: "security", label: "보안", content: "비밀번호와 2단계 인증을 설정합니다." },
        { value: "notice", label: "알림", content: "메일·푸시 알림 수신을 고릅니다." },
      ]}
    />
  );
}
