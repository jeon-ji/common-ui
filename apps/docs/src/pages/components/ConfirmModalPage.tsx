import confirmModalDocs from "../../../../../packages/ui/src/components/ConfirmModal/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/ConfirmModal/basic";
import basicSource from "../../demos/ConfirmModal/basic.tsx?raw";

export function ConfirmModalPage() {
  return (
    <article>
      <h1>ConfirmModal</h1>
      <p>
        확인/취소 2버튼 모달. 삭제·수정·초기화용 모달을 각각 만들지 않는다 — <code>tone</code>{" "}
        하나로 통합한다 (복붙 파생 모달은 문구 하나 고칠 때마다 드리프트를 낳는다).
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        title="기본"
        description="danger · primary — 확인 후 자동으로 닫힌다"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={confirmModalDocs} />

      <h2 id="a11y">접근성</h2>
      <p>
        Modal의 접근성(다이얼로그 시맨틱·포커스 트랩·Escape 스택)을 그대로 상속한다. initial focus는{" "}
        <strong>danger면 취소 버튼</strong>(파괴 동작 오입력 방지), primary면 확인 버튼이다.
      </p>
    </article>
  );
}
