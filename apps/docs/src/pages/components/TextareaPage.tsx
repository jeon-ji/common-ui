import textareaDocs from "../../../../../packages/ui/src/components/Textarea/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Textarea/basic";
import basicSource from "../../demos/Textarea/basic.tsx?raw";

export function TextareaPage() {
  return (
    <article>
      <h1>Textarea</h1>
      <p>
        여러 줄 텍스트 입력. TextField와 같은 <code>value</code>/<code>onChange(value)</code> 계약과
        Field 연결을 공유하고, <code>autoResize</code>·<code>maxLength</code> 카운터를 내장한다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        name="basic"
        title="기본"
        description="autoResize · maxLength 카운터 · disabled"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={textareaDocs} />

      <h2 id="a11y">접근성</h2>
      <p>
        Field 안에서 label·helper·error가 자동 연결된다. 글자 수 카운터는 시각 보조이며{" "}
        <code>aria-hidden</code> — 입력 제한 자체는 네이티브 <code>maxLength</code>가 담당하므로
        스크린리더 사용자도 같은 제약을 받는다.
      </p>
    </article>
  );
}
