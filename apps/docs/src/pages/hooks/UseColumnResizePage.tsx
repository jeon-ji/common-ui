import { DemoBlock } from "../../components/DemoBlock";
import BasicDemo from "../../demos/hooks/useColumnResize/basic";
import basicSource from "../../demos/hooks/useColumnResize/basic.tsx?raw";

export function UseColumnResizePage() {
  return (
    <article>
      <h1>useColumnResize</h1>
      <p>
        표 컬럼 폭 조절. <code>getHandleProps(key)</code>가 돌려주는 props를 헤더의 핸들 요소에 펼쳐
        넣으면 드래그와 키보드 조작이 모두 붙는다. <strong>핸들의 생김새는 소비자 몫</strong>이다 —
        훅은 동작과 ARIA만 준다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        name="basic"
        title="드래그 · 키보드 · 저장"
        description="핸들을 끌거나, 포커스를 두고 ←/→ 를 누른다. storageKey를 주면 새로고침해도 폭이 남는다"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>

      <h2 id="fixes">원본에서 고친 것</h2>
      <p>
        sije-common Table에 얽혀 있던 리사이즈 로직의 분리다. 아래는 &quot;주의해서 쓰라&quot;가
        아니라 <strong>구조로 막아 둔 것</strong>이다.
      </p>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>리스너 재등록</td>
            <td>
              원본은 <code>mousemove</code> 리스너를 매 프레임 붙였다 뗐다 했다. 여기서는{" "}
              <code>pointerdown</code>에서 <strong>한 번 등록하고 끝날 때 한 번 해제</strong>한다 —
              최신 폭은 함수형 업데이트로 읽으므로 핸들러를 다시 만들 이유가 없다
            </td>
          </tr>
          <tr>
            <td>터치 · 창 밖 드래그</td>
            <td>
              mouse가 아니라 <strong>포인터 이벤트</strong>를 쓴다. <code>setPointerCapture</code>로
              포인터를 잡아 커서가 창 밖으로 나가도 놓치지 않고, 이동은 <code>window</code>에서
              들으므로 핸들이 도중에 사라져도 <code>pointerup</code>을 놓치지 않는다
            </td>
          </tr>
          <tr>
            <td>
              <code>user-select</code> 복원
            </td>
            <td>
              드래그 중 <code>user-select: none</code>을 걸고{" "}
              <strong>종료·언마운트 양쪽에서</strong> 되돌린다. 적용과 복원은 쌍이다
            </td>
          </tr>
          <tr>
            <td>전역 키 충돌</td>
            <td>
              <code>storageKey</code>가 <strong>없으면 localStorage에 아무것도 쓰지 않는다</strong>.
              쓸 때도 <code>@jeon-ji/common-ui:table:&lt;storageKey&gt;</code>로 네임스페이스를
              붙인다 — 앱 전역 키에 저장해 화면끼리 폭을 덮어쓰던 결함의 차단이다
            </td>
          </tr>
          <tr>
            <td>SSR</td>
            <td>
              <code>localStorage</code>를 렌더 단계에서 읽지 않는다. 초기값은{" "}
              <code>defaultWidths</code>이고 저장값은 이펙트에서 얹힌다. 저장은{" "}
              <strong>바뀐 뒤에만</strong> 일어나므로 첫 마운트가 기존 값을 덮지 않는다
            </td>
          </tr>
          <tr>
            <td>드래그 중 컬럼 소멸</td>
            <td>
              <code>columnKeys</code>에서 조절 중인 키가 사라지면 드래그를 안전하게 끝내고 포커스를
              표로 되돌린다 — 핸들이 언마운트되며 포커스가 body로 떨어지는 것을 막는다
            </td>
          </tr>
        </tbody>
      </table>

      <h2 id="a11y">접근성</h2>
      <p>
        <code>getHandleProps</code>는 <code>role=&quot;separator&quot;</code>가 요구하는 값을 전부
        채워서 돌려준다: <code>aria-orientation</code>, <code>aria-valuenow</code>,{" "}
        <code>aria-valuemin</code>, <code>aria-valuemax</code>, <code>tabIndex=0</code>. 포커스를
        받는 separator는 값의 범위를 요구하므로 <code>max</code>를 비워 둘 수 없다 — 기본값{" "}
        <code>640</code>이며 더 넓은 컬럼이 필요하면 올린다.
      </p>
      <p>
        <code>handleLabel</code>로 <strong>컬럼을 식별할 수 있는 이름</strong>을 만든다(&quot;이름
        열 너비 조절&quot;). 기본값 &quot;열 너비 조절&quot;은 모든 핸들에서 같아 보조기술의
        목록에서 구분되지 않는다.
      </p>

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
              <code>columnKeys</code>
            </td>
            <td>
              <code>string[]</code>
            </td>
            <td>폭을 조절할 컬럼 키 (필수)</td>
          </tr>
          <tr>
            <td>
              <code>defaultWidths</code>
            </td>
            <td>
              <code>Record&lt;string, number&gt;</code>
            </td>
            <td>초기 폭(px). 없는 컬럼은 첫 드래그에서 실제 렌더 폭을 재서 이어간다</td>
          </tr>
          <tr>
            <td>
              <code>min</code> · <code>max</code>
            </td>
            <td>
              <code>number</code>
            </td>
            <td>
              폭 범위 (기본 <code>48</code> · <code>640</code>)
            </td>
          </tr>
          <tr>
            <td>
              <code>storageKey</code>
            </td>
            <td>
              <code>string | undefined</code>
            </td>
            <td>있으면 저장, 없으면 아무것도 쓰지 않는다</td>
          </tr>
          <tr>
            <td>
              <code>handleLabel</code>
            </td>
            <td>
              <code>(key: string) =&gt; string</code>
            </td>
            <td>핸들의 접근 이름</td>
          </tr>
          <tr>
            <td>
              <code>onChange</code>
            </td>
            <td>
              <code>(widths: Record&lt;string, number&gt;) =&gt; void</code>
            </td>
            <td>폭이 바뀔 때</td>
          </tr>
        </tbody>
      </table>

      <h3>반환값</h3>
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
              <code>widths</code>
            </td>
            <td>
              <code>Record&lt;string, number&gt;</code>
            </td>
            <td>
              현재 폭. <code>defaultWidths</code>에도 없고 조절하지 않은 컬럼은 키가 없으므로{" "}
              <code>widths[key] ?? column.width</code>로 읽는다
            </td>
          </tr>
          <tr>
            <td>
              <code>getHandleProps</code>
            </td>
            <td>
              <code>(key: string) =&gt; ColumnResizeHandleProps</code>
            </td>
            <td>핸들 요소에 펼쳐 넣는다</td>
          </tr>
          <tr>
            <td>
              <code>reset</code>
            </td>
            <td>
              <code>() =&gt; void</code>
            </td>
            <td>초기 폭으로 되돌린다</td>
          </tr>
        </tbody>
      </table>

      <h2 id="scope">범위 밖</h2>
      <p>
        <strong>컬럼 순서 저장은 하지 않는다.</strong> 드래그로 컬럼을 재정렬하는 UI가 없는데 순서만
        저장할 이유가 없으므로 <code>storageKey</code>는 <strong>폭 저장 전용</strong>이다.
      </p>
    </article>
  );
}
