import paginationDocs from "../../../../../packages/ui/src/components/Pagination/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Pagination/basic";
import basicSource from "../../demos/Pagination/basic.tsx?raw";
import BoundariesDemo from "../../demos/Pagination/boundaries";
import boundariesSource from "../../demos/Pagination/boundaries.tsx?raw";
import PageInputDemo from "../../demos/Pagination/pageInput";
import pageInputSource from "../../demos/Pagination/pageInput.tsx?raw";

export function PaginationPage() {
  return (
    <article>
      <h1>Pagination</h1>
      <p>
        페이지 이동 컨트롤. <code>total</code>은 <strong>페이지 수</strong>이지 항목 수가 아니다 —
        항목 수를 페이지 수로 나누는 계산은 소비 앱이 한다. <code>value</code>는 1부터 시작하는 현재
        페이지이며, 라우터·쿼리스트링 연동은 <code>value</code>/<code>onChange</code>로 연결한다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock name="basic" title="기본" description="제어형 value / onChange" code={basicSource}>
        <BasicDemo />
      </DemoBlock>
      <DemoBlock
        name="boundaries"
        title="생략 기호 · siblings · boundaries"
        description="현재 페이지가 끝에 붙어도 버튼 개수가 흔들리지 않는다. 생략 자리에 페이지가 하나뿐이면 생략 대신 그 페이지를 그린다"
        code={boundariesSource}
      >
        <BoundariesDemo />
      </DemoBlock>
      <DemoBlock
        name="pageInput"
        title="페이지 직접 입력"
        description="Enter 또는 포커스 이동에서 커밋 — 타이핑 중에는 페이지가 움직이지 않는다"
        code={pageInputSource}
      >
        <PageInputDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={paginationDocs} />

      <h2 id="a11y">접근성</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>
              <code>nav</code> + <code>aria-current=&quot;page&quot;</code>
            </td>
            <td>
              전체를 이름 있는 <code>nav</code>로 감싸고, 현재 페이지 버튼에만{" "}
              <code>aria-current</code>를 준다. 버튼 이름은 &quot;3 페이지&quot;처럼 번호만 담는다 —
              보조기술이 <code>aria-current</code>를 자기 문구로 읽어 주므로 이름에 &quot;현재
              페이지&quot;를 넣으면 두 번 안내된다
            </td>
          </tr>
          <tr>
            <td>버튼 · 키보드</td>
            <td>
              페이지 이동은 전부 <code>&lt;button&gt;</code>이다 — 키보드 조작이 불가능했던{" "}
              <code>&lt;li onClick&gt;</code> 구조를 바로잡았다. 각 버튼이 독립 탭 스톱이며{" "}
              <strong>roving tabindex를 쓰지 않는다</strong>(Tabs·SegmentedControl과 다른 선택 —
              페이지네이션은 링크 목록 성격이다)
            </td>
          </tr>
          <tr>
            <td>양 끝 버튼</td>
            <td>
              첫·마지막 페이지에서 <code>disabled</code> 속성이 아니라 <code>aria-disabled</code>를
              쓴다 — 방금 누른 버튼이 비활성화되면 브라우저가 포커스를 body로 되돌려 키보드 사용자가
              위치를 잃기 때문이다. 동작만 막고 포커스는 유지한다
            </td>
          </tr>
          <tr>
            <td>생략 기호</td>
            <td>
              <code>aria-hidden</code>이다 — 페이지 정보는 버튼이 담당하므로 보조기술이
              &quot;…&quot;를 읽을 이유가 없다
            </td>
          </tr>
          <tr>
            <td>직접 입력</td>
            <td>
              내부적으로 NumberField를 재사용하며 <code>aria-label=&quot;페이지 번호&quot;</code>가
              붙는다. 범위를 벗어난 값은 <code>1..total</code>로 클램프되고 소수는 정수로
              반올림된다. 커밋은 Enter 또는 <strong>포커스가 컴포넌트 밖으로 나갈 때</strong>만
              일어난다 — 페이지 버튼을 클릭하면 그 클릭이 이기고, 입력 커밋이 클릭을 삼키지 않는다
            </td>
          </tr>
          <tr>
            <td>
              <code>total</code> 변경
            </td>
            <td>
              현재 페이지가 범위를 넘으면 표시만 클램프하고 <code>onChange</code>를 자동 호출하지
              않는다 — 제어 컴포넌트의 값을 몰래 바꾸지 않는다는 원칙이라, 값 보정은 소비 앱이 한다
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
