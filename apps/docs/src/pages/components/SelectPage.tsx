import selectDocs from "../../../../../packages/ui/src/components/Select/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Select/basic";
import basicSource from "../../demos/Select/basic.tsx?raw";
import MultipleDemo from "../../demos/Select/multiple";
import multipleSource from "../../demos/Select/multiple.tsx?raw";

export function SelectPage() {
  return (
    <article>
      <h1>Select</h1>
      <p>
        단일 선택 셀렉트. 열려 있는 동안 포커스는 트리거에 남고 활성 옵션은{" "}
        <code>aria-activedescendant</code>로 가리킨다(combobox 표준 패턴). 목록에 없는{" "}
        <code>value</code>는 캐스팅으로 덮지 않고 placeholder로 처리한다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        name="basic"
        title="기본"
        description="제어/비제어 · disabled 옵션 · 비활성 — 키보드로도 조작해 보세요"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>
      <DemoBlock
        name="multiple"
        title="다중 선택"
        description="multiple — 판별 유니온이라 value/onChange 타입이 배열로 바뀐다"
        code={multipleSource}
      >
        <MultipleDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={selectDocs} />

      <h2 id="a11y">접근성</h2>
      <table className="docs-props-table">
        <thead>
          <tr>
            <th scope="col">키</th>
            <th scope="col">동작</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ArrowDown / ArrowUp / Enter / Space (닫힘)</td>
            <td>목록 열기 — 선택된 옵션(없으면 첫 활성 옵션)이 활성화</td>
          </tr>
          <tr>
            <td>ArrowDown / ArrowUp (열림)</td>
            <td>활성 옵션 이동 — disabled 옵션은 건너뛴다</td>
          </tr>
          <tr>
            <td>Home / End</td>
            <td>첫/마지막 활성 옵션</td>
          </tr>
          <tr>
            <td>Enter / Space</td>
            <td>활성 옵션 선택 후 닫기 (포커스는 트리거 유지)</td>
          </tr>
          <tr>
            <td>Escape</td>
            <td>
              닫기 — <strong>열려 있을 때만</strong> 이 컴포넌트가 소유하고 전파를 멈춘다. 닫혀
              있으면 바깥(Modal 등)으로 그대로 전파된다
            </td>
          </tr>
          <tr>
            <td>Tab</td>
            <td>닫고 다음 요소로 포커스 이동</td>
          </tr>
        </tbody>
      </table>
      <p>
        열린 목록(<code>role=&quot;listbox&quot;</code>)에도 접근 이름이 붙는다 — <code>Field</code>{" "}
        안이면 그 라벨을, 단독 사용이면 트리거의 이름을 물려받는다. 이름 없는 컨테이너는
        보조기술에서 &quot;목록 상자&quot;로만 읽혀 무엇을 고르는 목록인지 알 수 없다.
      </p>
      <p>
        뷰포트 가장자리에서의 위치 플립은 Popover 위치 엔진(M3+)에서 다룬다 — 현재 목록은 항상
        아래로 열린다.
      </p>
    </article>
  );
}
