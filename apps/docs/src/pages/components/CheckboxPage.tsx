import checkboxDocs from "../../../../../packages/ui/src/components/Checkbox/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Checkbox/basic";
import basicSource from "../../demos/Checkbox/basic.tsx?raw";
import IndeterminateDemo from "../../demos/Checkbox/indeterminate";
import indeterminateSource from "../../demos/Checkbox/indeterminate.tsx?raw";

export function CheckboxPage() {
  return (
    <article>
      <h1>Checkbox</h1>
      <p>
        체크박스. 라벨(<code>children</code>)이 <code>label</code> 요소로 내장되어 클릭 영역이 넓고,
        체크 표시는 CSS로만 그려 외부 파일 참조가 없다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        name="basic"
        title="기본"
        description="기본 · 초기 선택 · 비활성"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>
      <DemoBlock
        name="indeterminate"
        title="부분 선택 (전체 선택 패턴)"
        description="indeterminate는 시각·DOM 프로퍼티·aria-checked=mixed 세 곳 모두 반영된다"
        code={indeterminateSource}
      >
        <IndeterminateDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={checkboxDocs} />

      <h2 id="a11y">접근성</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>키보드</td>
            <td>Tab 포커스 · Space 토글 — 네이티브 input이라 별도 처리 불필요</td>
          </tr>
          <tr>
            <td>indeterminate</td>
            <td>
              <code>el.indeterminate</code>(DOM) + <code>aria-checked="mixed"</code>(SR) + 시각
              표시가 항상 함께 움직인다 — 시각만 바꾸면 스크린리더가 틀리게 읽는다
            </td>
          </tr>
          <tr>
            <td>포커스 링</td>
            <td>
              <code>:focus-visible</code>일 때만 커스텀 박스에 링 표시
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
