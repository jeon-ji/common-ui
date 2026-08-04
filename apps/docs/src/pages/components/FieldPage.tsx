import fieldDocs from "../../../../../packages/ui/src/components/Field/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Field/basic";
import basicSource from "../../demos/Field/basic.tsx?raw";

export function FieldPage() {
  return (
    <article>
      <h1>Field</h1>
      <p>
        label/required/helper/error를 공통화하는 폼 래퍼. 자식 컨트롤은 컨텍스트로 <code>id</code>·
        <code>aria-describedby</code>·<code>aria-invalid</code>·<code>required</code>를 자동으로
        받는다 — 소비자가 id를 수동 연결할 필요가 없다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        name="basic"
        title="기본"
        description="helper · required · error (error는 helper를 대체)"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={fieldDocs} />

      <h2 id="a11y">접근성</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>label</td>
            <td>
              <code>htmlFor</code>/<code>id</code> 자동 연결 — 라벨 클릭 시 컨트롤 포커스
            </td>
          </tr>
          <tr>
            <td>helperText</td>
            <td>
              <code>aria-describedby</code>로 연결 — 포커스 시 스크린리더가 읽는다
            </td>
          </tr>
          <tr>
            <td>errorText</td>
            <td>
              <code>aria-invalid</code> + <code>aria-errormessage</code> + describedby 대체
            </td>
          </tr>
          <tr>
            <td>required</td>
            <td>
              시각 표시(*)는 <code>aria-hidden</code> — 실제 필수 여부는 컨트롤의{" "}
              <code>required</code> 속성이 전달한다
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
