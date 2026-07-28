import { DemoBlock } from "../../components/DemoBlock";
import BasicDemo from "../../demos/hooks/useClickOutside/basic";
import basicSource from "../../demos/hooks/useClickOutside/basic.tsx?raw";

export function UseClickOutsidePage() {
  return (
    <article>
      <h1>useClickOutside</h1>
      <p>
        ref 요소 바깥의 <code>pointerdown</code>을 감지한다. Escape 처리는 하지 않는다 — 키보드는 각
        오버레이의 소유권 문제라 관심사를 분리했다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        title="기본"
        description="열려 있을 때만 document 리스너가 붙는다"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <table className="docs-props-table">
        <thead>
          <tr>
            <th scope="col">인자</th>
            <th scope="col">타입</th>
            <th scope="col">설명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>ref</code>
            </td>
            <td>
              <code>RefObject&lt;T | null&gt;</code>
            </td>
            <td>기준 요소 — React 19 useRef 시그니처 그대로</td>
          </tr>
          <tr>
            <td>
              <code>handler</code>
            </td>
            <td>
              <code>(event: PointerEvent) =&gt; void</code>
            </td>
            <td>바깥 클릭 시 호출 (항상 최신 함수가 불린다)</td>
          </tr>
          <tr>
            <td>
              <code>enabled</code>
            </td>
            <td>
              <code>boolean = true</code>
            </td>
            <td>false면 리스너를 달지 않는다 — 닫힌 동안 비용 0</td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
