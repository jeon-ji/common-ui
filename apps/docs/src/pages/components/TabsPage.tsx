import tabsDocs from "../../../../../packages/ui/src/components/Tabs/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Tabs/basic";
import basicSource from "../../demos/Tabs/basic.tsx?raw";
import ControlledDemo from "../../demos/Tabs/controlled";
import controlledSource from "../../demos/Tabs/controlled.tsx?raw";
import StatesDemo from "../../demos/Tabs/states";
import statesSource from "../../demos/Tabs/states.tsx?raw";

export function TabsPage() {
  return (
    <article>
      <h1>Tabs</h1>
      <p>
        패널을 전환하는 탭. 항목은 <code>items</code> 배열로 주고, 각 항목의 <code>content</code>가
        패널 내용이 된다 — <strong>활성 패널만 마운트</strong>되므로 비활성 패널의 상태는 보존되지
        않는다(보존이 필요하면 상태를 소비 앱이 들고 있어야 한다). 라우터와 결합하지 않는다: 주소와
        묶으려면 <code>value</code>/<code>onChange</code>로 연결한다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        title="기본"
        description="좌우 화살표로 이동하면 곧 활성화된다 — 탭 목록에는 Tab 키로 한 번만 진입한다"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>
      <DemoBlock
        title="variant · size · disabled"
        description="line(기본)·solid 변형, sm·md 크기, disabled 탭은 이동에서 건너뛴다"
        code={statesSource}
      >
        <StatesDemo />
      </DemoBlock>
      <DemoBlock
        title="제어형"
        description="value / onChange로 외부 상태와 연결 — 라우팅 연동도 이 방식이다"
        code={controlledSource}
      >
        <ControlledDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={tabsDocs} />
      <p>
        <code>items</code>의 각 항목은 <code>{"{ value, label, content, disabled? }"}</code> 형태다
        — <code>value</code>가 식별자이자 <code>onChange</code>로 전달되는 값이다.
      </p>

      <h2 id="a11y">접근성</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>
              <code>tablist</code> / <code>tab</code> / <code>tabpanel</code>
            </td>
            <td>
              탭↔패널을 <code>aria-controls</code>·<code>aria-labelledby</code>로 양방향 연결한다.
              렌더되지 않는 패널은 참조하지 않는다
            </td>
          </tr>
          <tr>
            <td>roving tabindex</td>
            <td>
              활성 탭만 <code>tabIndex=0</code> — Tab 키로 탭 목록에 한 번 진입하고, 다시 Tab을
              누르면 패널로 넘어간다. 패널 자체도 탭 순서에 들어가 포커서블 요소가 없는 패널의
              내용도 키보드로 읽을 수 있다(WAI-ARIA APG)
            </td>
          </tr>
          <tr>
            <td>키보드</td>
            <td>
              <kbd>←</kbd>/<kbd>→</kbd> 이동(<strong>양 끝에서 순환</strong>, disabled 건너뜀) ·{" "}
              <kbd>Home</kbd>/<kbd>End</kbd> 양 끝. 이동이 곧 활성화다(automatic activation)
            </td>
          </tr>
          <tr>
            <td>순환에 대한 메모</td>
            <td>
              Select·Menu는 끝에서 멈추지만 Tabs는 순환한다 — WAI-ARIA 탭 관례를 따른 의도적 차이다
              (목록에서 값을 찾는 위젯은 경계가 정보를 주고, 탭은 개수가 적어 순회가 자연스럽다)
            </td>
          </tr>
          <tr>
            <td>이름</td>
            <td>
              <code>aria-label</code>은 루트가 아니라 탭 목록에 붙는다 — 한 화면에 탭이 둘 이상이면
              지정할 것
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
