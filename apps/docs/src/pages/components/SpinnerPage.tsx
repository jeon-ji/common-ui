import spinnerDocs from "../../../../../packages/ui/src/components/Spinner/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Spinner/basic";
import basicSource from "../../demos/Spinner/basic.tsx?raw";

export function SpinnerPage() {
  return (
    <article>
      <h1>Spinner</h1>
      <p>
        진행 상태 표시. Button의 <code>loading</code>·Table 로딩의 기반이 된다. 완료 시점을 알 수
        없는 짧은 대기에 사용하고, 콘텐츠 골격을 예고할 수 있으면 Skeleton을 쓴다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock name="basic" title="크기" description="sm · md(기본) · lg" code={basicSource}>
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={spinnerDocs} />

      <h2 id="a11y">접근성</h2>
      <p>
        <code>role="status"</code> + 기본 라벨 &quot;로딩 중&quot;으로 노출된다. 무엇을 기다리는지
        문맥이 있으면 <code>aria-label</code>로 구체화하라. 회전 애니메이션은{" "}
        <code>prefers-reduced-motion</code>에서 느려진다.
      </p>
    </article>
  );
}
