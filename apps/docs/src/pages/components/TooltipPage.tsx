import tooltipDocs from "../../../../../packages/ui/src/components/Tooltip/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Tooltip/basic";
import basicSource from "../../demos/Tooltip/basic.tsx?raw";

export function TooltipPage() {
  return (
    <article>
      <h1>Tooltip</h1>
      <p>
        자체 구현 툴팁 — 외부 라이브러리가 없다. <strong>hover + 키보드 포커스</strong> 양쪽에서
        표시되고, 트리거의 <code>aria-describedby</code>로 연결되어 포커스 시 스크린리더가 내용을
        읽는다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        title="기본"
        description="hover 지연(모션 토큰) · focus는 즉시 · placement 플립"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={tooltipDocs} />

      <h2 id="a11y">접근성</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>
              <code>role="tooltip"</code> + <code>aria-describedby</code>
            </td>
            <td>트리거 포커스 시 내용이 보조 설명으로 낭독된다</td>
          </tr>
          <tr>
            <td>focus 트리거</td>
            <td>키보드 사용자는 지연 없이 즉시 표시 — hover 전용 툴팁 금지</td>
          </tr>
          <tr>
            <td>Escape</td>
            <td>툴팁만 닫고 이벤트를 소비한다 — Modal 안에서도 모달이 같이 닫히지 않는다</td>
          </tr>
          <tr>
            <td>플립</td>
            <td>
              뷰포트 상/하단과 충돌하면 반대편으로 배치 (좌우 플립·상세 위치 엔진은 Popover, M3+)
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        트리거는 ref를 전달하는 단일 요소여야 한다 — 이 시스템의 모든 컴포넌트는 forwardRef라 그대로
        쓸 수 있다. Text의 말줄임과 연동한 &quot;잘렸을 때만 툴팁&quot;은 Text의 title 노출로 이미
        동작하며, 리치 툴팁이 필요하면 <code>useTruncationOverflow</code> 승격(백로그)과 함께
        다룬다.
      </p>
    </article>
  );
}
