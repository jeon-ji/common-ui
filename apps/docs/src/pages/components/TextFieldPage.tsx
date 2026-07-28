import textFieldDocs from "../../../../../packages/ui/src/components/TextField/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/TextField/basic";
import basicSource from "../../demos/TextField/basic.tsx?raw";
import VariantsDemo from "../../demos/TextField/variants";
import variantsSource from "../../demos/TextField/variants.tsx?raw";

export function TextFieldPage() {
  return (
    <article>
      <h1>TextField</h1>
      <p>
        텍스트 입력. 이 시스템의 계약은 <code>value</code> + <code>onChange(value)</code> 하나다 —
        네이티브 이벤트 객체를 넘기지 않는다. password 표시 토글과 search 클리어 버튼을{" "}
        <code>type</code>으로 흡수한다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        title="기본 · Field 통합"
        description="제어 입력 + label/helper/error 자동 연결"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>
      <DemoBlock
        title="변형"
        description="password 토글 · search 클리어 · prefix/suffix · clearable · disabled"
        code={variantsSource}
      >
        <VariantsDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={textFieldDocs} />

      <h2 id="a11y">접근성</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>라벨</td>
            <td>
              Field 안에서 자동 연결. 단독 사용 시 <code>aria-label</code>을 지정하라
            </td>
          </tr>
          <tr>
            <td>password 토글</td>
            <td>
              <code>aria-pressed</code>로 상태 노출, 라벨이 &quot;표시/숨기기&quot;로 전환
            </td>
          </tr>
          <tr>
            <td>클리어 버튼</td>
            <td>
              <code>tabIndex=-1</code> — Tab 순서를 늘리지 않고, 클릭 후 포커스는 입력으로 복원
            </td>
          </tr>
          <tr>
            <td>오류</td>
            <td>
              Field의 errorText가 <code>aria-invalid</code> + <code>aria-errormessage</code>로 전달
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
