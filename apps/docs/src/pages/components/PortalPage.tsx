import portalDocs from "../../../../../packages/ui/src/components/Portal/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Portal/basic";
import basicSource from "../../demos/Portal/basic.tsx?raw";

export function PortalPage() {
  return (
    <article>
      <h1>Portal</h1>
      <p>
        children을 DOM 트리 밖(body 아래 전용 컨테이너)으로 렌더한다. 포털 타겟 해석의 유일 창구로,
        Modal·Toast·Tooltip이 전부 이 컴포넌트를 사용한다. 언제 사용하나 — 부모의{" "}
        <code>overflow</code>·<code>z-index</code> 맥락을 벗어나야 하는 오버레이를 만들 때.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        title="기본"
        description="overflow: hidden 부모 안에서도 포털 내용은 잘리지 않는다"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={portalDocs} />

      <h2 id="a11y">접근성</h2>
      <p>
        Portal 자체는 DOM 위치만 옮길 뿐 역할이 없다. 포털로 옮겨진 오버레이의 포커스 관리·역할은
        사용하는 컴포넌트(Modal 등)가 책임진다 — React 이벤트는 포털을 넘어 렌더 트리를 따라
        버블되므로 키보드 이벤트 처리도 그대로 동작한다.
      </p>

      <h2 id="ssr">SSR</h2>
      <p>
        <code>document</code> 접근은 이펙트에서만 한다 — 서버와 첫 클라이언트 렌더에서는 아무것도
        렌더하지 않고, 마운트 후에 포털이 열린다.
      </p>
    </article>
  );
}
