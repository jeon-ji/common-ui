import { Link } from "react-router";

import segmentedDocs from "../../../../../packages/ui/src/components/SegmentedControl/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/SegmentedControl/basic";
import basicSource from "../../demos/SegmentedControl/basic.tsx?raw";
import IconsDemo from "../../demos/SegmentedControl/icons";
import iconsSource from "../../demos/SegmentedControl/icons.tsx?raw";
import StatesDemo from "../../demos/SegmentedControl/states";
import statesSource from "../../demos/SegmentedControl/states.tsx?raw";

export function SegmentedControlPage() {
  return (
    <article>
      <h1>SegmentedControl</h1>
      <p>
        붙어 있는 버튼들 중 하나를 고르는 컨트롤. 탭처럼 보이지만 <strong>탭이 아니다</strong> —
        패널을 가르면 <Link to="/components/tabs">Tabs</Link>, 값을 고르면 이 컴포넌트다. 그래서
        시맨틱도 <code>tablist</code>가 아니라 <code>radiogroup</code>/<code>radio</code>다 (탭
        시맨틱을 붙이면 스크린리더가 존재하지 않는 패널을 찾는다).
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        name="basic"
        title="기본"
        description="value / onChange — 화살표 이동이 곧 선택이다"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>
      <DemoBlock
        name="icons"
        title="아이콘 주입 · iconOnly"
        description="아이콘은 소비자가 넣는다 — 라이브러리는 도메인 아이콘 목록을 갖지 않는다"
        code={iconsSource}
      >
        <IconsDemo />
      </DemoBlock>
      <DemoBlock
        name="states"
        title="disabled"
        description="비활성 항목은 이동에서 건너뛴다"
        code={statesSource}
      >
        <StatesDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={segmentedDocs} />
      <p>
        <code>items</code>의 각 항목은 <code>{"{ value, label, icon?, disabled? }"}</code> 형태다.
        <code>label</code>은 <code>iconOnly</code>에서도 접근 이름으로 쓰이므로 생략할 수 없다.
      </p>

      <h2 id="a11y">접근성</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>
              <code>radiogroup</code> / <code>radio</code>
            </td>
            <td>
              선택 상태는 <code>aria-checked</code>로 노출된다 — 값 선택 컨트롤의 올바른 시맨틱이다
            </td>
          </tr>
          <tr>
            <td>roving tabindex</td>
            <td>선택된 항목만 탭 순서에 들어간다 — Tab 키로 그룹에 한 번만 진입한다</td>
          </tr>
          <tr>
            <td>키보드</td>
            <td>
              <kbd>←</kbd>/<kbd>→</kbd>·<kbd>↑</kbd>/<kbd>↓</kbd> 이동(양 끝 순환, disabled 건너뜀)
              · <kbd>Home</kbd>/<kbd>End</kbd>. 이동이 곧 선택이다(라디오 관례)
            </td>
          </tr>
          <tr>
            <td>iconOnly</td>
            <td>
              라벨을 <code>aria-label</code>로 바꾸지 않고 시각적으로만 감춘다 — ReactNode 라벨을
              그대로 쓸 수 있고 접근 이름이 사라지지 않는다. 아이콘은 <code>aria-hidden</code>{" "}
              장식이다
            </td>
          </tr>
          <tr>
            <td>이름</td>
            <td>
              그룹에 <code>aria-label</code>을 주는 것을 권장한다 — 무엇을 고르는 그룹인지 알려준다
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
