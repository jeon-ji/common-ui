import badgeDocs from "../../../../../packages/ui/src/components/Badge/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Badge/basic";
import basicSource from "../../demos/Badge/basic.tsx?raw";

export function BadgePage() {
  return (
    <article>
      <h1>Badge</h1>
      <p>
        카운트/상태 점 표시 전용. <strong>언제 Badge, 언제 Tag?</strong> — 개수나 &quot;새 항목
        있음&quot;을 알리면 Badge, 분류·상태 라벨 텍스트면 Tag다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        name="basic"
        title="기본"
        description="count · max(99+) · dot · count 0 숨김 · 단독 사용"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={badgeDocs} />

      <h2 id="a11y">접근성</h2>
      <p>
        숫자는 텍스트로 그대로 읽힌다. 점(dot)은 장식이라 <code>aria-hidden</code> — 의미는 감싸는
        대상의 라벨이 제공하라 (예: <code>aria-label="새 소식 있음"</code>).
      </p>
    </article>
  );
}
