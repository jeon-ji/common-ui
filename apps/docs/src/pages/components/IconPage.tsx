import iconDocs from "../../../../../packages/ui/src/components/Icon/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Icon/basic";
import basicSource from "../../demos/Icon/basic.tsx?raw";
import GalleryDemo from "../../demos/Icon/gallery";
import gallerySource from "../../demos/Icon/gallery.tsx?raw";

export function IconPage() {
  return (
    <article>
      <h1>Icon</h1>
      <p>
        <code>@jeon-ji/common-ui/icons</code> 배럴에서 개별 아이콘을 import 한다. 색은{" "}
        <code>currentColor</code> 상속, 크기는 기본 <code>1em</code>으로 주변 텍스트를 따라간다.
        직접 만든 SVG는 <code>createIcon</code>으로 감싸 같은 계약을 얻을 수 있다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        name="basic"
        title="크기와 색"
        description="1em 기본값 · size prop · currentColor 상속"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>
      <DemoBlock
        name="gallery"
        title="전체 아이콘"
        description="배럴 등록분 자동 열거"
        code={gallerySource}
      >
        <GalleryDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={iconDocs} />

      <h2 id="a11y">접근성</h2>
      <p>
        <code>aria-label</code>이 없으면 장식용으로 간주해 <code>aria-hidden</code>이 붙는다. 의미를
        전달하는 아이콘에는 <code>aria-label</code>을 부여하라 — <code>role="img"</code>로 노출된다.
        아이콘만 있는 버튼은 IconButton(예정)이 라벨을 강제한다.
      </p>

      <h2 id="registration">아이콘 추가 절차</h2>
      <p>
        ① <code>src/icons/svg/</code>에 kebab-case 파일 추가 (24×24 viewBox,{" "}
        <code>currentColor</code>) ② <code>src/icons/index.ts</code>에서 <code>createIcon</code>
        으로 감싸 export. <code>pnpm check:icons</code>가 md5 중복·네이밍·배럴 누락을 검사한다.
      </p>
    </article>
  );
}
