import avatarDocs from "../../../../../packages/ui/src/components/Avatar/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Avatar/basic";
import basicSource from "../../demos/Avatar/basic.tsx?raw";
import FallbackDemo from "../../demos/Avatar/fallback";
import fallbackSource from "../../demos/Avatar/fallback.tsx?raw";
import SizesDemo from "../../demos/Avatar/sizes";
import sizesSource from "../../demos/Avatar/sizes.tsx?raw";

export function AvatarPage() {
  return (
    <article>
      <h1>Avatar</h1>
      <p>
        사용자·엔티티를 나타내는 작은 이미지. 이미지가 없거나 로드에 실패하면 <code>name</code>에서
        만든 이니셜로 대체한다. <code>name</code>은 <strong>표시용</strong>이고 <code>alt</code>는{" "}
        <strong>낭독용</strong>이다 — 역할이 다르므로 자동으로 서로를 대신하지 않는다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        name="basic"
        title="기본"
        description="이미지 · 이니셜 · 직접 넣은 폴백. 아래 줄은 이름 텍스트가 옆에 있어 alt를 비운 경우다"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>
      <DemoBlock
        name="sizes"
        title="크기와 모양"
        description="size 5종 × shape 2종"
        code={sizesSource}
      >
        <SizesDemo />
      </DemoBlock>
      <DemoBlock
        name="fallback"
        title="이미지 폴백"
        description="깨진 주소는 이니셜로 대체되고, src를 바꾸면 다시 시도한다"
        code={fallbackSource}
      >
        <FallbackDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={avatarDocs} />

      <h2 id="a11y">접근성</h2>
      <h3 id="when-alt">언제 alt를 주는가</h3>
      <table className="docs-props-table">
        <thead>
          <tr>
            <th scope="col">상황</th>
            <th scope="col">처리</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>아바타 옆에 이름 텍스트가 이미 있다 (목록·댓글·프로필 줄)</td>
            <td>
              <code>alt</code>를 비운다(기본값). 아바타는 장식이 되어 같은 이름이 두 번 낭독되지
              않는다
            </td>
          </tr>
          <tr>
            <td>아바타가 그 사람을 가리키는 유일한 수단이다 (표의 담당자 열, 겹친 목록)</td>
            <td>
              <code>alt=&quot;전지현&quot;</code>처럼 채운다. 이때만 접근 이름이 생긴다
            </td>
          </tr>
        </tbody>
      </table>

      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>접근 이름의 위치</td>
            <td>
              이름은 <code>&lt;img alt&gt;</code>가 아니라 루트의 <code>role=&quot;img&quot;</code>{" "}
              + <code>aria-label</code>에 둔다.{" "}
              <strong>이미지 로드에 실패해도 이름이 사라지지 않고</strong>,{" "}
              <code>role=&quot;img&quot;</code>는 하위 트리를 하나의 이미지로 취급하므로 이니셜과
              이미지가 따로 읽히지도 않는다
            </td>
          </tr>
          <tr>
            <td>
              <code>name</code>은 낭독되지 않는다
            </td>
            <td>
              이니셜은 시각 표현이라 <code>aria-hidden</code>이다. 이름을 읽혀야 하면{" "}
              <code>alt</code>를 함께 준다
            </td>
          </tr>
          <tr>
            <td>이니셜 규칙</td>
            <td>
              공백으로 나눈 토큰이 2개 이상이면 첫 토큰 + 마지막 토큰의 첫 글자(
              <code>Ada Lovelace</code> → <code>AL</code>), 1개면 첫 글자 하나(
              <code>전지현</code> → <code>전</code>). 언어별 예외를 두지 않는다 — 복성이나 비한국어
              단일 토큰에서 곧바로 무너지기 때문이다. 글자는 코드포인트 단위로 잘라 이모지·일부
              한자가 깨지지 않는다
            </td>
          </tr>
          <tr>
            <td>로드 상태</td>
            <td>
              폴백을 항상 깔아 두고 이미지를 그 위에 겹친다 — 로딩 중에는 이니셜이 보이고 로드되면
              이미지가 덮는다. <code>onLoad</code>로 &quot;성공&quot; 상태를 만들지 않는 이유는
              캐시된 이미지에서 그 이벤트가 오지 않을 수 있어서다. 상태는 <strong>실패 하나</strong>
              뿐이고, <code>src</code>가 바뀌면 저절로 풀린다
            </td>
          </tr>
          <tr>
            <td>조합</td>
            <td>
              접속 상태 점은 <code>Badge</code>의 래핑 모드로 조합한다(
              <code>&lt;Badge dot&gt;&lt;Avatar /&gt;&lt;/Badge&gt;</code>). 클릭 가능한 아바타가
              필요하면 <code>IconButton</code>으로 감싼다
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
