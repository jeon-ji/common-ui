import buttonDocs from "../../../../../packages/ui/src/components/Button/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Button/basic";
import basicSource from "../../demos/Button/basic.tsx?raw";
import StatesDemo from "../../demos/Button/states";
import statesSource from "../../demos/Button/states.tsx?raw";

export function ButtonPage() {
  return (
    <article>
      <h1>Button</h1>
      <p>
        기본 버튼. 파생 버튼(삭제 버튼·업로드 버튼…)을 따로 만들지 않는다 —{" "}
        <code>variant × tone × size</code> 조합과 아이콘 슬롯으로 표현한다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        name="basic"
        title="변형 × 톤"
        description="solid/outline/ghost × primary/neutral/danger"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>
      <DemoBlock
        name="states"
        title="크기·상태"
        description="sm/md/lg · 아이콘 슬롯 · disabled · loading · fullWidth"
        code={statesSource}
      >
        <StatesDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={buttonDocs} />

      <h2 id="a11y">접근성</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>
              <code>type="button"</code> 기본
            </td>
            <td>form 안에서 의도치 않은 submit을 막는다. submit 버튼은 명시적으로 지정</td>
          </tr>
          <tr>
            <td>
              <code>:focus-visible</code>
            </td>
            <td>키보드 포커스에만 링 표시 — 마우스 클릭에는 없음</td>
          </tr>
          <tr>
            <td>
              <code>loading</code>
            </td>
            <td>
              native disabled 대신 <code>aria-busy</code> + 클릭 차단 — 포커스를 잃지 않아
              스크린리더가 진행 상태를 추적할 수 있다
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
