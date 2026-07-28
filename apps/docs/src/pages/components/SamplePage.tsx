import sampleDocs from "../../../../../packages/ui/src/components/Sample/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Sample/basic";
import basicSource from "../../demos/Sample/basic.tsx?raw";

export function SamplePage() {
  return (
    <article>
      <h1>Sample</h1>
      <p>
        파이프라인 검증용 더미 컴포넌트 — 빌드 → pack 스모크 → 문서 렌더까지 전 파이프라인이 도는지
        확인하며, 실제 컴포넌트 작업의 템플릿을 겸한다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock title="기본" description="tone 변형" code={basicSource}>
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={sampleDocs} />

      <h2 id="a11y">접근성</h2>
      <p>
        비인터랙션 표시 컴포넌트라 별도 키보드 시나리오가 없다. 네이티브 <code>div</code> 속성을
        전부 통과시키므로 필요 시 <code>role</code>·<code>aria-*</code>를 소비 측에서 부여한다.
      </p>
    </article>
  );
}
