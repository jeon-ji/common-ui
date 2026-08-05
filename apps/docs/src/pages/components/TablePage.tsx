import tableDocs from "../../../../../packages/ui/src/components/Table/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Table/basic";
import basicSource from "../../demos/Table/basic.tsx?raw";
import ResizeDemo from "../../demos/Table/resize";
import resizeSource from "../../demos/Table/resize.tsx?raw";
import SelectionDemo from "../../demos/Table/selection";
import selectionSource from "../../demos/Table/selection.tsx?raw";
import SortingDemo from "../../demos/Table/sorting";
import sortingSource from "../../demos/Table/sorting.tsx?raw";
import StatesDemo from "../../demos/Table/states";
import statesSource from "../../demos/Table/states.tsx?raw";
import StickyDemo from "../../demos/Table/sticky";
import stickySource from "../../demos/Table/sticky.tsx?raw";

export function TablePage() {
  return (
    <article>
      <h1>Table</h1>
      <p>
        표. <strong>표시만</strong> 담당하고 데이터 조작은 하지 않는다 — 정렬·필터·페이징은 소비
        앱이 소유하고 Table은 <code>rows</code>를 받은 순서 그대로 그린다. 행 선택은{" "}
        <code>useTableSelection</code>, 컬럼 폭은 <code>useColumnResize</code>가 담당한다.
      </p>
      <p>
        <code>render</code>는 <strong>필수</strong>다. <code>row[key]</code>를 자동으로 그리면 컬럼
        key가 데이터 필드에 묶여 합계·배지·버튼 같은 파생 컬럼마다 예외가 생긴다 — 명시적 렌더가
        규칙이다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        name="basic"
        title="기본"
        description="columns · rows · rowKey 세 개가 최소 구성이다"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>
      <DemoBlock
        name="sorting"
        title="정렬 (제어형)"
        description="Table은 aria-sort 표시와 onSortChange 통지만 한다. 실제로 줄을 세우는 것은 소비 앱이며, 그래서 서버 정렬로 갈아 끼울 수 있다"
        code={sortingSource}
      >
        <SortingDemo />
      </DemoBlock>
      <DemoBlock
        name="selection"
        title="행 선택"
        description="useTableSelection이 상태를 갖고 Table이 체크박스 열을 그린다. 일부만 고르면 헤더가 mixed로 읽히고, 잠긴 행은 전체 선택에서도 빠진다"
        code={selectionSource}
      >
        <SelectionDemo />
      </DemoBlock>
      <DemoBlock
        name="sticky"
        title="헤더 · 컬럼 고정"
        description="고정 컬럼은 width를 함께 준다 — 이웃한 고정 컬럼의 오프셋을 폭에서 계산한다. 세로 스크롤 높이는 --ui-table-max-height로 소비자가 정한다"
        code={stickySource}
      >
        <StickyDemo />
      </DemoBlock>
      <DemoBlock
        name="resize"
        title="컬럼 폭 조절"
        description="useColumnResize가 폭을 갖고 헤더의 핸들에 props를 펼쳐 넣는다. 핸들의 생김새는 소비자 몫이라 이 데모의 스타일도 데모 안에 있다"
        code={resizeSource}
      >
        <ResizeDemo />
      </DemoBlock>
      <DemoBlock
        name="states"
        title="로딩 · 빈 상태"
        description="셋 중 하나만 보인다. empty는 슬롯이라 EmptyState를 소비자가 넣는다 — Table은 EmptyState를 import 하지 않는다"
        code={statesSource}
      >
        <StatesDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={tableDocs} />

      <h2 id="non-goals">이 Table이 하지 않는 것</h2>
      <p>
        기대를 잘못 잡는 것이 가장 비싼 오해다. 아래는 &quot;아직 안 만든 것&quot;이 아니라{" "}
        <strong>범위 밖으로 결정한 것</strong>이다.
      </p>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>정렬 · 필터 로직</td>
            <td>
              <code>onSortChange</code>로 알리기만 한다. 클라이언트 정렬이든 서버 정렬이든 소비 앱이
              정하고, Table은 <code>rows</code>를 손대지 않는다
            </td>
          </tr>
          <tr>
            <td>페이지네이션</td>
            <td>
              내장하지 않는다 — <code>Pagination</code>을 표 아래에 조합한다. 표가 페이징까지
              소유하면 서버/클라이언트 페이징 분기가 표 안으로 들어온다
            </td>
          </tr>
          <tr>
            <td>가상화 (대량 행)</td>
            <td>
              하지 않는다. 수만 행을 다뤄야 하면 전용 라이브러리가 맞고, 그 요구가 생기면 별도
              컴포넌트로 만든다
            </td>
          </tr>
          <tr>
            <td>
              <code>role=&quot;grid&quot;</code> 키보드 내비게이션
            </td>
            <td>
              방향키 셀 이동을 하지 않는다. 이 표는 <strong>정적 데이터 표시</strong>이고, grid
              패턴을 들이면 포커스 관리·편집 모드·선택 범위가 전부 따라온다. 행 안의 버튼·체크박스·
              링크는 각자 네이티브 탭 스톱이다 — roving tabindex를 쓰지 않은 Pagination과 같은
              판단이다
            </td>
          </tr>
          <tr>
            <td>컬럼 재정렬 · 순서 저장</td>
            <td>
              드래그로 컬럼 순서를 바꾸지 않는다. 재정렬 UI 없이 순서만 저장할 이유가 없으므로{" "}
              <code>useColumnResize</code>의 <code>storageKey</code>는 <strong>폭 저장 전용</strong>
              이다
            </td>
          </tr>
          <tr>
            <td>확장 행 · 트리 · 셀 편집 · 다단 헤더</td>
            <td>전부 범위 밖이다. 원본이 prop 20개짜리 God Component가 된 경로가 이 방향이었다</td>
          </tr>
        </tbody>
      </table>

      <h2 id="a11y">접근성</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>표의 이름</td>
            <td>
              <code>caption</code>은 시각적으로 숨겨진 <code>&lt;caption&gt;</code>으로 그려져 표의
              접근 이름이 된다. <code>aria-label</code>을 대신 넘겨도 된다 — 다만{" "}
              <strong>둘 중 하나는 반드시 준다</strong>. 이름 없는 표는 보조기술의 표 목록에서 서로
              구분되지 않는다
            </td>
          </tr>
          <tr>
            <td>
              <code>aria-sort</code>
            </td>
            <td>
              <strong>정렬 가능한 컬럼에만</strong> 붙는다 — 정렬과 무관한 컬럼의 <code>none</code>
              은 소음이다. 정렬 버튼의 이름은 헤더 텍스트뿐이며 &quot;오름차순&quot; 같은 말을 넣지
              않는다. <code>aria-sort</code>가 이미 말하는 것을 이름에 또 넣으면 두 번 낭독된다
            </td>
          </tr>
          <tr>
            <td>정렬 헤더는 버튼</td>
            <td>
              <code>&lt;th&gt;</code> 자체에 <code>onClick</code>을 달지 않고 안에{" "}
              <code>&lt;button&gt;</code>을 둔다 — 헤더 셀은 포커스를 받지 못해 키보드로 정렬할 수
              없기 때문이다
            </td>
          </tr>
          <tr>
            <td>행 체크박스의 이름</td>
            <td>
              <code>selectionLabel</code>로 <strong>행을 식별할 수 있는</strong> 이름을 만든다
              (&quot;홍길동 선택&quot;). 기본값 &quot;행 선택&quot;은 모든 행에서 같아 보조기술의 폼
              요소 목록에서 구분되지 않는다. 헤더 체크박스는 &quot;전체 선택&quot;이며 일부만 선택된
              상태는 <code>aria-checked=&quot;mixed&quot;</code>로 읽힌다
            </td>
          </tr>
          <tr>
            <td>로딩</td>
            <td>
              <code>loading</code>이면 표에 <code>aria-busy=&quot;true&quot;</code>가 붙는다.
              Skeleton은 장식이라 <code>aria-hidden</code>이고 스스로 아무 말도 하지 않으므로,
              이것이 없으면 &quot;내용이 비었다&quot;로 전달된다
            </td>
          </tr>
          <tr>
            <td>포커스 유실 (규칙 23)</td>
            <td>
              정렬 헤더 버튼은 정렬해도 같은 자리에 남아 포커스를 잃지 않는다. 다만{" "}
              <strong>행을 삭제·필터하면 그 행 안의 포커스가 사라진다</strong> — 행을 없애는 것은
              소비 앱의 동작이므로, 삭제 버튼을 행에 두었다면 삭제 후 포커스 행방을 소비 앱이 정해야
              한다
            </td>
          </tr>
          <tr>
            <td>roving tabindex (규칙 24)</td>
            <td>
              <strong>해당 없음</strong> — 이 표는 grid 키보드 내비게이션을 하지 않으므로 관리할 탭
              스톱 집합이 없다. 행 안의 인터랙티브 요소는 각자 네이티브 탭 스톱이다
            </td>
          </tr>
          <tr>
            <td>가변 데이터 (규칙 25)</td>
            <td>
              <code>columns</code>가 줄면 빈 상태 셀의 <code>colSpan</code>이 따라 줄고,{" "}
              <code>sort.key</code>가 존재하지 않는 컬럼을 가리켜도 남은 헤더가 정렬 상태를 참칭하지
              않는다(전부 <code>none</code>). 제어 값을 몰래 고치지 않는다 — 표시만 보정하고{" "}
              <code>onSortChange</code>를 자동 호출하지 않는다
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
