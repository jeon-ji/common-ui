import switchDocs from "../../../../../packages/ui/src/components/Switch/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Switch/basic";
import basicSource from "../../demos/Switch/basic.tsx?raw";

export function SwitchPage() {
  return (
    <article>
      <h1>Switch</h1>
      <p>
        온/오프 토글. <code>button role="switch"</code> + <code>aria-checked</code> 기반이라
        Space/Enter 토글과 포커스가 네이티브로 동작한다. 즉시 적용되는 설정에 쓰고, 폼 제출로 모이는
        다중 선택에는 Checkbox를 쓴다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        title="기본"
        description="제어 · size 2단 · disabled · Field 연동"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={switchDocs} />

      <h2 id="a11y">접근성</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>
              <code>role="switch"</code> + <code>aria-checked</code>
            </td>
            <td>스크린리더가 "켜짐/꺼짐"으로 읽는다 — 시각 전용 토글 금지</td>
          </tr>
          <tr>
            <td>키보드</td>
            <td>Space·Enter 토글 — 네이티브 button이라 별도 처리 불필요</td>
          </tr>
          <tr>
            <td>라벨</td>
            <td>
              단독 사용 시 <code>aria-label</code>, Field 안에서는 label 자동 연결
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
