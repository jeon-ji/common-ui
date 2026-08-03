import tagDocs from "../../../../../packages/ui/src/components/Tag/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Tag/basic";
import basicSource from "../../demos/Tag/basic.tsx?raw";

export function TagPage() {
  return (
    <article>
      <h1>Tag</h1>
      <p>분류·상태 라벨 전용 — tone × variant 조합과 closable을 지원한다.</p>

      <h2 id="when">언제 Badge, 언제 Tag</h2>
      <table className="docs-props-table">
        <thead>
          <tr>
            <th scope="col">쓰임</th>
            <th scope="col">컴포넌트</th>
            <th scope="col">예</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>개수·&quot;새 항목 있음&quot; 알림</td>
            <td>Badge</td>
            <td>알림 5건, 읽지 않음 점</td>
          </tr>
          <tr>
            <td>분류·상태를 나타내는 텍스트 라벨</td>
            <td>Tag</td>
            <td>카테고리, &quot;진행 중&quot;, 필터 칩</td>
          </tr>
        </tbody>
      </table>

      <h2 id="examples">예제</h2>
      <DemoBlock title="기본" description="tone 6종 × subtle/outline · closable" code={basicSource}>
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={tagDocs} />

      <h2 id="a11y">접근성</h2>
      <p>
        닫기는 <code>aria-label="제거"</code>가 있는 실제 <code>button</code>이다 — svg에 onClick을
        다는 방식은 키보드로 접근할 수 없다. <code>:focus-visible</code> 링 포함.
      </p>
      <p>
        <strong>제거 후 포커스는 소비 앱 책임이다.</strong> <code>onClose</code>를 받아 태그를
        목록에서 지우는 주체가 소비 앱이므로, Tag는 자기가 언제 사라지는지 알지 못한다. 그대로 두면
        방금 누른 버튼이 사라지며 포커스가 <code>body</code>로 떨어져 키보드 사용자가 위치를 잃는다
        — 지운 뒤 다음 태그의 닫기 버튼이나 목록 컨테이너로 포커스를 옮겨 준다.
      </p>
    </article>
  );
}
