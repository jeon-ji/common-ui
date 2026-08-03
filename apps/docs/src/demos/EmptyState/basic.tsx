import { Button, EmptyState } from "@jeon-ji/common-ui";

export default function BasicDemo() {
  return (
    <EmptyState
      title="등록된 프로젝트가 없습니다"
      description="첫 프로젝트를 만들면 여기에 표시됩니다."
      action={<Button tone="primary">프로젝트 만들기</Button>}
    />
  );
}
