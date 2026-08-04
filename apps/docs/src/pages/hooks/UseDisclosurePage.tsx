import { DemoBlock } from "../../components/DemoBlock";
import BasicDemo from "../../demos/hooks/useDisclosure/basic";
import basicSource from "../../demos/hooks/useDisclosure/basic.tsx?raw";

export function UseDisclosurePage() {
  return (
    <article>
      <h1>useDisclosure</h1>
      <p>
        열림/닫힘 상태의 표준 반환형(<code>open · onOpen · onClose · onToggle</code>) —
        Modal·Popover류의 배선을 통일한다. controlled/uncontrolled 모두 지원.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock name="basic" title="기본" description="비제어 패널 열림/닫힘" code={basicSource}>
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
              <code>open</code>
            </td>
            <td>
              <code>boolean | undefined</code>
            </td>
            <td>지정하면 controlled</td>
          </tr>
          <tr>
            <td>
              <code>defaultOpen</code>
            </td>
            <td>
              <code>boolean = false</code>
            </td>
            <td>uncontrolled 초기값</td>
          </tr>
          <tr>
            <td>
              <code>onOpenChange</code>
            </td>
            <td>
              <code>(open: boolean) =&gt; void</code>
            </td>
            <td>상태 변경 콜백</td>
          </tr>
        </tbody>
      </table>
      <p>반환된 콜백 3종은 정체성이 불변이라 effect deps·memo에 안전하다.</p>
    </article>
  );
}
