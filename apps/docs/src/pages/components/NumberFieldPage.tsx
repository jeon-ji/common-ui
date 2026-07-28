import numberFieldDocs from "../../../../../packages/ui/src/components/NumberField/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/NumberField/basic";
import basicSource from "../../demos/NumberField/basic.tsx?raw";

export function NumberFieldPage() {
  return (
    <article>
      <h1>NumberField</h1>
      <p>
        숫자 입력 — 천단위 포맷·파싱을 외부 라이브러리 없이 내장한다. 값 계약은{" "}
        <code>value: number | null</code> + <code>onChange(value)</code>. 입력 중에는 재그룹핑하지
        않아 커서가 튀지 않고, blur 시점에 clamp + 포맷한다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        title="기본"
        description="천단위 포맷 · min/max clamp · step 증감 · 붙여넣기 정제"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={numberFieldDocs} />

      <h2 id="a11y">접근성</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>
              <code>role="spinbutton"</code>
            </td>
            <td>
              <code>aria-valuenow/min/max</code>와 함께 숫자 입력 시맨틱 노출
            </td>
          </tr>
          <tr>
            <td>키보드</td>
            <td>ArrowUp/ArrowDown — step 단위 증감 (min/max로 clamp)</td>
          </tr>
          <tr>
            <td>
              <code>inputMode="decimal"</code>
            </td>
            <td>모바일에서 숫자 키패드 표시</td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
