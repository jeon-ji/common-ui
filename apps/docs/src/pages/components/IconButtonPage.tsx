import iconButtonDocs from "../../../../../packages/ui/src/components/IconButton/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/IconButton/basic";
import basicSource from "../../demos/IconButton/basic.tsx?raw";

export function IconButtonPage() {
  return (
    <article>
      <h1>IconButton</h1>
      <p>
        아이콘 전용 정사각 버튼. 텍스트가 없으므로 <code>aria-label</code>이{" "}
        <strong>타입 레벨에서 필수</strong>다 — 라벨 없는 아이콘 버튼은 컴파일되지 않는다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        title="기본"
        description="기본 ghost·neutral — variant/tone/size는 Button과 동일"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={iconButtonDocs} />

      <h2 id="a11y">접근성</h2>
      <p>
        <code>aria-label</code>이 접근 가능한 이름이 된다 — 동작을 서술하라(&quot;닫기&quot;,
        &quot;검색&quot;). 내부 아이콘은 자동으로 <code>aria-hidden</code> 처리되므로 라벨이
        중복되지 않는다.
      </p>
    </article>
  );
}
