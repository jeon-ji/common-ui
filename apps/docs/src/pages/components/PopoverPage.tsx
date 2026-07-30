import popoverDocs from "../../../../../packages/ui/src/components/Popover/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Popover/basic";
import basicSource from "../../demos/Popover/basic.tsx?raw";
import NestedDemo from "../../demos/Popover/nested";
import nestedSource from "../../demos/Popover/nested.tsx?raw";
import PlacementDemo from "../../demos/Popover/placement";
import placementSource from "../../demos/Popover/placement.tsx?raw";

export function PopoverPage() {
  return (
    <article>
      <h1>Popover</h1>
      <p>
        앵커 요소 기준으로 배치되는 <strong>논모달</strong> 오버레이. <code>anchorRef</code>가 공식
        위치 기준이라 트리거 내부 구조에 ref를 뚫고 들어갈 필요가 없다. 뷰포트 충돌 시 반대편으로
        플립되고, 열려 있는 동안 스크롤/리사이즈를 추적한다 — Tooltip과 같은 위치 엔진을 쓴다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        title="기본"
        description="제어형 열림 — 트리거의 aria-expanded/aria-controls 배선은 소비자 책임이다"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>
      <DemoBlock
        title="배치"
        description="side 4방향 × align — 공간이 없으면 플립, 교차축은 뷰포트 클램핑"
        code={placementSource}
      >
        <PlacementDemo />
      </DemoBlock>
      <DemoBlock
        title="Modal 중첩"
        description="Escape는 오버레이 스택 최상단만 닫는다 — 공통 조상에 OverlayProvider 필요"
        code={nestedSource}
      >
        <NestedDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={popoverDocs} />

      <h2 id="a11y">접근성</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>non-modal</td>
            <td>
              FocusTrap·ScrollLock이 없다 — 포커스를 가두지 않고, 닫힐 때 패널 안에 있던 포커스만
              앵커로 복원한다 (Escape·바깥 클릭 모두)
            </td>
          </tr>
          <tr>
            <td>Escape · 바깥 클릭</td>
            <td>
              둘 다 오버레이 스택 소유권을 따라 <strong>최상단 한 겹만</strong> 닫는다 — 팝오버 안의
              메뉴를 클릭해도 상위 팝오버가 닫히지 않고, 바깥을 클릭하면 위에서부터 차례로 닫힌다
            </td>
          </tr>
          <tr>
            <td>패널의 Tab 순서</td>
            <td>
              패널은 포털(문서 끝)에 렌더되므로 트리거 다음 Tab 대상이 아니다. 인터랙티브 내용을
              담을 때는 소비자가 포커스를 관리하거나(전달한 ref로 열릴 때 포커스 이동), 역할이
              분명한 Menu·Modal을 쓴다 — 포커스 순환은 이 버전의 범위가 아니다
            </td>
          </tr>
          <tr>
            <td>role 없음</td>
            <td>
              패널에 role을 강제하지 않는다 — 다이얼로그성 내용이면{" "}
              <code>role=&quot;dialog&quot;</code>를 넘기고, 메뉴처럼 역할 있는 위젯은 전용
              컴포넌트(Menu)를 쓴다
            </td>
          </tr>
          <tr>
            <td>트리거 배선</td>
            <td>
              <code>aria-expanded</code> + <code>aria-controls</code>(열렸을 때만)는 소비자가
              트리거에 직접 단다 — 기본 예제 참조
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
