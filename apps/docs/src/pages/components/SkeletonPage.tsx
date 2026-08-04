import skeletonDocs from "../../../../../packages/ui/src/components/Skeleton/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Skeleton/basic";
import basicSource from "../../demos/Skeleton/basic.tsx?raw";

export function SkeletonPage() {
  return (
    <article>
      <h1>Skeleton</h1>
      <p>
        로딩 중 콘텐츠의 골격을 미리 보여 주는 자리 표시. 어떤 모양의 콘텐츠가 올지 알고 있을 때
        Spinner 대신 사용하면 레이아웃 이동을 줄인다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        name="basic"
        title="조합"
        description="text · rect · circle 변형 조합"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={skeletonDocs} />

      <h2 id="a11y">접근성</h2>
      <p>
        장식 요소라 <code>aria-hidden</code>으로 스크린리더에서 제외된다. 로딩 상태 자체를 알리려면
        영역에 <code>aria-busy</code>를 지정하거나 Spinner(<code>role="status"</code>)를 병용하라.
        펄스 애니메이션은 <code>prefers-reduced-motion</code>에서 꺼진다.
      </p>
    </article>
  );
}
