import { Button, ToastProvider, useToast } from "@jeon-ji/common-ui";

function Buttons() {
  const toast = useToast();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ui-spacing-2)" }}>
      <Button size="sm" onClick={() => toast.success("저장되었습니다")}>
        success
      </Button>
      <Button
        size="sm"
        tone="neutral"
        variant="outline"
        onClick={() => toast.info("배포가 시작되었습니다")}
      >
        info
      </Button>
      <Button
        size="sm"
        tone="neutral"
        variant="outline"
        onClick={() => toast.warning("용량이 얼마 남지 않았습니다")}
      >
        warning
      </Button>
      <Button
        size="sm"
        tone="danger"
        variant="outline"
        onClick={() => toast.danger("저장에 실패했습니다", { duration: 0 })}
      >
        danger (수동 닫기)
      </Button>
    </div>
  );
}

/** 실제 앱에서는 ToastProvider를 앱 루트에 한 번만 감싼다 */
export default function BasicDemo() {
  return (
    <ToastProvider max={3}>
      <Buttons />
    </ToastProvider>
  );
}
