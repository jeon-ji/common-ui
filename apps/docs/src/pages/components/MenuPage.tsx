import menuDocs from "../../../../../packages/ui/src/components/Menu/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Menu/basic";
import basicSource from "../../demos/Menu/basic.tsx?raw";
import ControlledDemo from "../../demos/Menu/controlled";
import controlledSource from "../../demos/Menu/controlled.tsx?raw";
import StatesDemo from "../../demos/Menu/states";
import statesSource from "../../demos/Menu/states.tsx?raw";

export function MenuPage() {
  return (
    <article>
      <h1>Menu</h1>
      <p>
        <strong>동작 실행</strong>용 드롭다운 메뉴 — Popover 위에 <code>role=&quot;menu&quot;</code>{" "}
        키보드 내비게이션을 얹었다. 트리거에 ref·핸들러·aria가 자동 주입되고, 위치 플립·Escape 스택
        소유권·바깥 클릭 닫힘은 Popover가 담당한다. <strong>값 선택에는 Select를 쓴다</strong> —
        선택 상태가 남으면 Select, 누르면 실행되고 끝나면 Menu.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        title="기본"
        description="onSelect(key) 하나로 항목 선택을 받는다 — 선택하면 닫히고 포커스는 트리거로"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>
      <DemoBlock
        title="disabled · danger"
        description="disabled는 키보드 이동에서 건너뛰고, danger는 파괴적 동작 색으로 표시된다"
        code={statesSource}
      >
        <StatesDemo />
      </DemoBlock>
      <DemoBlock
        title="제어형 열림"
        description="open / onOpenChange로 외부 제어"
        code={controlledSource}
      >
        <ControlledDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={menuDocs} />

      <h2 id="a11y">접근성</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>
              <code>role=&quot;menu&quot;</code> / <code>menuitem</code>
            </td>
            <td>
              열리면 포커스가 메뉴 컨테이너로 이동하고 <code>aria-activedescendant</code>가 활성
              항목을 가리킨다 — 항목은 개별 포커스를 받지 않는다 (Select와 같은 설계)
            </td>
          </tr>
          <tr>
            <td>트리거</td>
            <td>
              <code>aria-haspopup=&quot;menu&quot;</code> + <code>aria-expanded</code> +{" "}
              <code>aria-controls</code>(열렸을 때만) 자동 주입. 메뉴의 접근 가능한 이름은 트리거가
              주므로(<code>aria-labelledby</code>) 트리거에 id가 없으면 자동으로 부여된다
            </td>
          </tr>
          <tr>
            <td>키보드</td>
            <td>
              닫힘: <kbd>↓</kbd>/<kbd>Enter</kbd>/<kbd>Space</kbd> 첫 항목으로 열기 · <kbd>↑</kbd>{" "}
              마지막 항목으로 열기 — 열림: <kbd>↓</kbd>/<kbd>↑</kbd> 이동(disabled 건너뜀·랩 없음) ·{" "}
              <kbd>Home</kbd>/<kbd>End</kbd> · <kbd>Enter</kbd>/<kbd>Space</kbd> 선택 ·{" "}
              <kbd>Escape</kbd> 닫기 · <kbd>Tab</kbd> 닫고 다음 요소로
            </td>
          </tr>
          <tr>
            <td>포커스 복원</td>
            <td>선택·Escape·Tab으로 닫히면 포커스가 트리거로 돌아간다</td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
