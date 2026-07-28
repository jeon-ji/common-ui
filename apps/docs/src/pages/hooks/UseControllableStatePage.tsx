import { DemoBlock } from "../../components/DemoBlock";
import BasicDemo from "../../demos/hooks/useControllableState/basic";
import basicSource from "../../demos/hooks/useControllableState/basic.tsx?raw";

export function UseControllableStatePage() {
  return (
    <article>
      <h1>useControllableState</h1>
      <p>
        controlled/uncontrolled 전환을 한 곳에서 처리한다 — 모든 폼 컴포넌트가 이 훅 위에서 같은{" "}
        <code>value</code>/<code>onChange(value)</code> 계약을 따른다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        title="기본"
        description="같은 컴포넌트가 value 유무에 따라 controlled/uncontrolled로 동작"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <table className="docs-props-table">
        <thead>
          <tr>
            <th scope="col">옵션</th>
            <th scope="col">타입</th>
            <th scope="col">설명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>value</code>
            </td>
            <td>
              <code>T | undefined</code>
            </td>
            <td>지정하면 controlled — 표시 값은 항상 이 값</td>
          </tr>
          <tr>
            <td>
              <code>defaultValue</code>
            </td>
            <td>
              <code>T</code>
            </td>
            <td>uncontrolled 초기값 (필수)</td>
          </tr>
          <tr>
            <td>
              <code>onChange</code>
            </td>
            <td>
              <code>(value: T) =&gt; void</code>
            </td>
            <td>값 변경 시 호출 — 양쪽 모드에서 동일하게 불린다</td>
          </tr>
        </tbody>
      </table>

      <h2 id="contract">계약</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>반환</td>
            <td>
              <code>[value, setValue]</code> — setValue는 값 또는 업데이터 함수를 받고 정체성이
              불변이다
            </td>
          </tr>
          <tr>
            <td>동일 값 set</td>
            <td>
              <code>Object.is</code> 비교로 onChange를 호출하지 않는다
            </td>
          </tr>
          <tr>
            <td>StrictMode</td>
            <td>onChange를 setState 업데이터 밖에서 호출 — 이중 실행에도 콜백은 1회</td>
          </tr>
          <tr>
            <td>모드 전환</td>
            <td>마운트 후 controlled ↔ uncontrolled 전환은 지원하지 않는다</td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
