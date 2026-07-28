import modalDocs from "../../../../../packages/ui/src/components/Modal/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Modal/basic";
import basicSource from "../../demos/Modal/basic.tsx?raw";
import NestedDemo from "../../demos/Modal/nested";
import nestedSource from "../../demos/Modal/nested.tsx?raw";

export function ModalPage() {
  return (
    <article>
      <h1>Modal</h1>
      <p>
        모달 다이얼로그. <code>open</code>/<code>onClose</code> 제어형 단일 API — 열림 상태의 진실은
        항상 소비자에게 있다 (<code>defaultOpen</code> 같은 반쪽 옵션 없음).
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        title="기본"
        description="title·footer 슬롯 · data-autofocus로 initial focus 지정"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>
      <DemoBlock
        title="중첩 모달"
        description="OverlayProvider 안에서 Escape는 스택 최상단만 닫는다"
        code={nestedSource}
      >
        <NestedDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={modalDocs} />

      <h2 id="overlay-provider">OverlayProvider</h2>
      <p>
        중첩 오버레이의 Escape 소유권을 판정하는 스택의 경계. 인스턴스마다 팩토리로 스토어를
        만들므로 전역 싱글턴이 없다 — 모달을 하나만 쓸 때는 없어도 되고, 중첩해서 쓸 때만 공통
        조상에 한 번 감싸면 된다.
      </p>

      <h2 id="a11y">접근성</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>
              <code>role="dialog"</code> + <code>aria-modal</code>
            </td>
            <td>
              제목은 <code>aria-labelledby</code>로 자동 연결
            </td>
          </tr>
          <tr>
            <td>포커스</td>
            <td>
              열릴 때 <code>data-autofocus</code> &gt; 첫 포커서블 순으로 진입, Tab은 안에서 순환,
              닫힐 때 트리거로 복원
            </td>
          </tr>
          <tr>
            <td>Escape</td>
            <td>스택 최상단 모달만 닫는다 — 하위 위젯(Select 등)이 이미 소비한 Escape는 무시</td>
          </tr>
          <tr>
            <td>스크롤</td>
            <td>열려 있는 동안 body 잠금 (참조 카운팅 — 중첩에도 안전, 원래 값 복원)</td>
          </tr>
          <tr>
            <td>닫기 버튼</td>
            <td>
              <code>aria-label="닫기"</code>가 있는 IconButton — svg에 onClick을 다는 방식 금지
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
