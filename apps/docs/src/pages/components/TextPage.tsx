import textDocs from "../../../../../packages/ui/src/components/Text/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Text/basic";
import basicSource from "../../demos/Text/basic.tsx?raw";
import TruncateDemo from "../../demos/Text/truncate";
import truncateSource from "../../demos/Text/truncate.tsx?raw";

export function TextPage() {
  return (
    <article>
      <h1>Text · Heading</h1>
      <p>
        타이포 토큰 스케일을 <code>variant</code>로만 소비하는 텍스트 컴포넌트. 전역{" "}
        <code>* {"{ font-size }"}</code> 강제 없이 스타일은 컴포넌트가 소유한다. Heading은 시각
        스케일(<code>variant</code>)과 문서 레벨(<code>as</code>)을 분리해 다룬다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        name="basic"
        title="스케일"
        description="display·h1~h3 / body·caption·code"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>
      <DemoBlock
        name="truncate"
        title="말줄임"
        description="ellipsis(1줄) · lineClamp(n줄) — 잘렸을 때만 title이 붙는다"
        code={truncateSource}
      >
        <TruncateDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={textDocs} />

      <h2 id="a11y">접근성</h2>
      <p>
        Heading의 <code>as</code>는 문서 아웃라인(h1~h6 레벨)을 시각 크기와 독립적으로 유지하기 위한
        장치다 — 페이지 구조상 올바른 레벨을 지정하라. 말줄임 텍스트는 잘린 경우에만{" "}
        <code>title</code>로 전체 내용을 제공한다(감지는 싱글턴 ResizeObserver).
      </p>
    </article>
  );
}
