/**
 * 데모 블록 + 자동 API 표 머신의 내부 검증 페이지 (/dev/demo-block).
 * 사이드바에는 노출하지 않는다 — Sample 컴포넌트 문서가 생기면 삭제 대상.
 */
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/_fixture/basic";
import basicSource from "../../demos/_fixture/basic.tsx?raw";
import fixtureDocs from "../../demos/_fixture/Fixture.tsx?docgen";

export function DemoBlockDev() {
  return (
    <article>
      <h1>DemoBlock 머신 검증</h1>
      <p>?raw 소스와 라이브 렌더가 같은 파일에서 나오는지, docgen 표가 생성되는지 확인한다.</p>

      <h2 id="example">예제</h2>
      <DemoBlock title="기본" description="variant·loading 조합" code={basicSource}>
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={fixtureDocs} />
    </article>
  );
}
