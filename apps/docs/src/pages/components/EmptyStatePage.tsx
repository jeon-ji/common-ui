import emptyStateDocs from "../../../../../packages/ui/src/components/EmptyState/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/EmptyState/basic";
import basicSource from "../../demos/EmptyState/basic.tsx?raw";
import CompactDemo from "../../demos/EmptyState/compact";
import compactSource from "../../demos/EmptyState/compact.tsx?raw";
import ErrorDemo from "../../demos/EmptyState/error";
import errorSource from "../../demos/EmptyState/error.tsx?raw";

export function EmptyStatePage() {
  return (
    <article>
      <h1>EmptyState</h1>
      <p>
        결과가 없거나 불러오지 못했을 때의 자리 표시. 백로그의 &quot;ErrorState&quot;는 별도
        컴포넌트가 아니라 <code>status=&quot;error&quot;</code>다 — 레이아웃과 슬롯이 같고 의미만
        다르기 때문에, 확인 모달 4형제를 <code>tone</code> 하나로 합친 ConfirmModal과 같은 판단을
        했다.
      </p>

      <h2 id="when">언제 무엇을 쓰나</h2>
      <table className="docs-props-table">
        <thead>
          <tr>
            <th scope="col">상황</th>
            <th scope="col">컴포넌트</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>데이터를 기다리는 중</td>
            <td>
              <code>Skeleton</code> (또는 <code>Spinner</code>)
            </td>
          </tr>
          <tr>
            <td>요청 성공, 결과 0건</td>
            <td>
              <code>EmptyState</code>
            </td>
          </tr>
          <tr>
            <td>요청 실패</td>
            <td>
              <code>EmptyState status=&quot;error&quot;</code>
            </td>
          </tr>
          <tr>
            <td>작업 결과 알림(저장됨·삭제됨)</td>
            <td>
              <code>Toast</code>
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="examples">예제</h2>
      <DemoBlock title="기본" description="아이콘 없이 제목·설명·액션" code={basicSource}>
        <BasicDemo />
      </DemoBlock>
      <DemoBlock
        title="오류"
        description="status='error'는 경고 아이콘을 기본으로 쓴다. 이 데모는 낭독이 필요한 경우라 role='status'를 직접 넘겼다"
        code={errorSource}
      >
        <ErrorDemo />
      </DemoBlock>
      <DemoBlock title="좁은 자리" description="size='sm' — 카드·테이블 내부" code={compactSource}>
        <CompactDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={emptyStateDocs} />

      <h2 id="a11y">접근성</h2>
      <h3 id="announce">언제 낭독시키나</h3>
      <p>
        이 컴포넌트는 <strong>기본적으로 아무 role도, aria-live도 붙이지 않는다.</strong> 알림
        낭독은 <code>Toast</code>의 책임이고, 마운트와 동시에 존재하는{" "}
        <code>role=&quot;alert&quot;</code>는 낭독 여부가 환경마다 갈린다. 무엇보다 &quot;목록이
        비었다&quot;를 즉시 가로채 읽어야 하는지는 화면 맥락이 정한다.
      </p>
      <table className="docs-props-table">
        <thead>
          <tr>
            <th scope="col">상황</th>
            <th scope="col">처리</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>첫 진입 화면이 비어 있다</td>
            <td>그대로 둔다. 사용자는 콘텐츠를 읽으며 자연스럽게 도달한다</td>
          </tr>
          <tr>
            <td>검색·필터 등 사용자 조작의 결과로 바뀌었다</td>
            <td>
              <code>role=&quot;status&quot;</code>(또는 <code>aria-live=&quot;polite&quot;</code>)를
              넘긴다 — 화면을 보지 않는 사용자에게 결과가 바뀌었음을 알려야 한다
            </td>
          </tr>
        </tbody>
      </table>

      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>제목 태그</td>
            <td>
              제목은 <code>&lt;p&gt;</code>다 — 이 컴포넌트는 자기가 놓인 페이지의 heading 레벨을 알
              수 없다. 문서 구조상 heading이어야 하면 <code>title</code>에{" "}
              <code>&lt;Heading&gt;</code>을 넣는다
            </td>
          </tr>
          <tr>
            <td>아이콘</td>
            <td>
              장식이라 <code>aria-hidden</code>이다. 의미는 <code>title</code>이 전달하며,{" "}
              <code>title</code>을 필수로 둔 이유도 이것이다 — 아이콘만 있는 빈 화면은 보조기술에서
              아무것도 아니게 되고 시각적으로도 &quot;로딩 중&quot;과 구분되지 않는다
            </td>
          </tr>
          <tr>
            <td>
              <code>action</code>은 슬롯이다
            </td>
            <td>
              <code>onRetry</code> 같은 콜백이 아니라 버튼 자체를 넣는다. 문구·톤·로딩 상태가
              화면마다 다르기 때문에, 콜백만 받으면 문구 prop → 아이콘 prop으로 번져간다
            </td>
          </tr>
          <tr>
            <td>Table·리스트 연동</td>
            <td>
              Table은 이 컴포넌트를 내부에서 import 하지 않고 <code>empty</code> 슬롯으로 받는다. 빈
              상태 문구·조건이 Table 안에 얽히면 그것이 곧 God Component의 시작이다
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
