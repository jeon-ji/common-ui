import radioDocs from "../../../../../packages/ui/src/components/Radio/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Radio/basic";
import basicSource from "../../demos/Radio/basic.tsx?raw";

export function RadioPage() {
  return (
    <article>
      <h1>Radio · RadioGroup</h1>
      <p>
        단일 선택. <code>name</code>/<code>value</code>는 RadioGroup 컨텍스트가 관리한다 — 개별
        name을 수동으로 맞출 필요가 없다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        name="basic"
        title="기본"
        description="제어 그룹 · 개별 disabled — 화살표 키로 그룹 내 이동"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={radioDocs} />

      <h2 id="a11y">접근성</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>
              <code>role="radiogroup"</code>
            </td>
            <td>
              그룹 컨테이너에 노출 — 그룹 이름은 <code>aria-label</code>로 지정하라
            </td>
          </tr>
          <tr>
            <td>키보드</td>
            <td>
              화살표 키 이동·선택과 roving tabindex는 같은 name의 네이티브 라디오가 브라우저 표준
              동작으로 제공한다 — 자체 키보드 코드가 없어 깨질 일도 없다
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
