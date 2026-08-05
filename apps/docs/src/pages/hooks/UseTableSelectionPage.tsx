import { DemoBlock } from "../../components/DemoBlock";
import BasicDemo from "../../demos/hooks/useTableSelection/basic";
import basicSource from "../../demos/hooks/useTableSelection/basic.tsx?raw";

export function UseTableSelectionPage() {
  return (
    <article>
      <h1>useTableSelection</h1>
      <p>
        표 행 선택 상태. <code>Table</code>의 <code>selection</code> prop에 그대로 넘기면 맨 앞에
        체크박스 열이 생긴다. 훅은 <strong>상태와 헬퍼만</strong> 돌려주고 체크박스는 Table이 그린다
        — 훅이 UI까지 만들던 <code>useCheckbox</code>를 뒤집은 구조다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        name="basic"
        title="페이지를 넘겨도 선택이 유지된다"
        description="keys는 지금 화면의 행이다. 페이지를 넘기면 헤더 체크박스만 다시 계산되고, 앞 페이지에서 고른 항목은 그대로 남는다"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>

      <h2 id="scope">keys의 의미 — 이 훅의 핵심 결정</h2>
      <p>
        <code>keys</code>는 <strong>지금 화면에 있는 행</strong>이지 전체 데이터가 아니다. 이 구분이
        아래 세 가지를 한꺼번에 정한다.
      </p>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>사라진 키를 걷어내지 않는다</td>
            <td>
              필터·페이지 이동으로 <code>keys</code>에서 빠진 행의 선택을{" "}
              <strong>자동으로 지우지 않는다</strong>. 지웠다면 &quot;3페이지에서 고른 항목이
              4페이지에 다녀오니 사라지는&quot; 동작이 된다. 제어 값을 몰래 고치지 않는다는
              원칙이기도 하다
            </td>
          </tr>
          <tr>
            <td>
              <code>allState</code>는 현재 화면 기준
            </td>
            <td>
              선택은 누적되지만 헤더 체크박스는 <strong>지금 보이는 행만</strong> 본다. 그래서 다른
              페이지에 선택이 남아 있어도 이 페이지에서 아무것도 안 골랐으면 <code>none</code>이다
            </td>
          </tr>
          <tr>
            <td>
              <code>toggleAll</code>의 범위도 현재 화면
            </td>
            <td>
              전체 선택/해제는 <code>keys</code> 안에서만 일어난다. 화면 밖 선택까지 비우는 것은{" "}
              <code>clear()</code> 하나뿐이다
            </td>
          </tr>
          <tr>
            <td>
              <code>disabledKeys</code>는 분모에서 빠진다
            </td>
            <td>
              비활성 행은 <code>toggle</code>·<code>toggleAll</code>이 건드리지 않고{" "}
              <code>allState</code> 계산에서도 제외된다 — 넣어 두면 더 고를 수 없는데도 헤더가
              영원히 &quot;일부 선택&quot;에 머문다
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="api">API</h2>
      <h3>옵션</h3>
      <table className="docs-props-table">
        <thead>
          <tr>
            <th scope="col">옵션</th>
            <th scope="col">타입</th>
            <th scope="col">설명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>keys</code>
            </td>
            <td>
              <code>string[]</code>
            </td>
            <td>지금 화면의 전체 행 키 (필수)</td>
          </tr>
          <tr>
            <td>
              <code>value</code>
            </td>
            <td>
              <code>string[] | undefined</code>
            </td>
            <td>지정하면 controlled</td>
          </tr>
          <tr>
            <td>
              <code>defaultValue</code>
            </td>
            <td>
              <code>string[]</code>
            </td>
            <td>
              uncontrolled 초기 선택 (기본 <code>[]</code>)
            </td>
          </tr>
          <tr>
            <td>
              <code>onChange</code>
            </td>
            <td>
              <code>(keys: string[]) =&gt; void</code>
            </td>
            <td>선택된 키 배열만 넘긴다</td>
          </tr>
          <tr>
            <td>
              <code>disabledKeys</code>
            </td>
            <td>
              <code>string[] | undefined</code>
            </td>
            <td>선택할 수 없는 행 — 체크박스가 비활성으로 그려진다</td>
          </tr>
        </tbody>
      </table>

      <h3>반환값 (= Table의 selection prop)</h3>
      <table className="docs-props-table">
        <thead>
          <tr>
            <th scope="col">이름</th>
            <th scope="col">타입</th>
            <th scope="col">설명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>selectedKeys</code>
            </td>
            <td>
              <code>string[]</code>
            </td>
            <td>선택된 키 — 화면 밖 선택도 포함한다</td>
          </tr>
          <tr>
            <td>
              <code>isSelected</code> · <code>isDisabled</code>
            </td>
            <td>
              <code>(key: string) =&gt; boolean</code>
            </td>
            <td>행 단위 조회</td>
          </tr>
          <tr>
            <td>
              <code>toggle</code>
            </td>
            <td>
              <code>(key: string) =&gt; void</code>
            </td>
            <td>한 행 선택 전환 — 비활성 행은 무시한다</td>
          </tr>
          <tr>
            <td>
              <code>toggleAll</code>
            </td>
            <td>
              <code>() =&gt; void</code>
            </td>
            <td>현재 화면 전체 선택/해제</td>
          </tr>
          <tr>
            <td>
              <code>allState</code>
            </td>
            <td>
              <code>&quot;none&quot; | &quot;some&quot; | &quot;all&quot;</code>
            </td>
            <td>
              헤더 체크박스 상태. <code>some</code>이면 Table이{" "}
              <code>aria-checked=&quot;mixed&quot;</code>로 그린다
            </td>
          </tr>
          <tr>
            <td>
              <code>clear</code>
            </td>
            <td>
              <code>() =&gt; void</code>
            </td>
            <td>화면 밖 선택까지 전부 비운다</td>
          </tr>
        </tbody>
      </table>
    </article>
  );
}
