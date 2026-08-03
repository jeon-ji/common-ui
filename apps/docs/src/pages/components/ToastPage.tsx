import toastDocs from "../../../../../packages/ui/src/components/Toast/index.tsx?docgen";
import { DemoBlock } from "../../components/DemoBlock";
import { PropsTable } from "../../components/PropsTable";
import BasicDemo from "../../demos/Toast/basic";
import basicSource from "../../demos/Toast/basic.tsx?raw";

export function ToastPage() {
  return (
    <article>
      <h1>Toast</h1>
      <p>
        일시적 알림. <code>ToastProvider</code>를 루트에 감싸고 <code>useToast()</code>로 발화한다.
        상태는 boolean 3개가 아닌 <code>type</code> 단일 필드(success·warning·danger· info)다 —
        시스템 어휘와 맞추기 위해 error 대신 danger를 쓴다.
      </p>

      <h2 id="examples">예제</h2>
      <DemoBlock
        title="기본"
        description="type 4종 · duration: 0은 수동 닫기 · hover 시 타이머 일시정지 · max 초과는 큐 대기"
        code={basicSource}
      >
        <BasicDemo />
      </DemoBlock>

      <h2 id="api">API</h2>
      <PropsTable docs={toastDocs} />
      <table className="docs-props-table">
        <thead>
          <tr>
            <th scope="col">useToast() 반환</th>
            <th scope="col">설명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>success/warning/danger/info(message, options?)</code>
            </td>
            <td>type별 발화 — 토스트 id를 반환한다</td>
          </tr>
          <tr>
            <td>
              <code>show(type, message, options?)</code>
            </td>
            <td>동적 type 발화</td>
          </tr>
          <tr>
            <td>
              <code>dismiss(id)</code>
            </td>
            <td>즉시 닫기 (큐 대기분 포함)</td>
          </tr>
        </tbody>
      </table>

      <h2 id="a11y">접근성</h2>
      <p>
        알림 영역은 <code>aria-live="polite"</code> — 진행 중 작업을 끊지 않고 다음 틈에 읽는다. 각
        토스트의 닫기 버튼은 <code>aria-label="알림 닫기"</code>. Provider 2개를 마운트하면 각자
        독립 스토어를 가진다 (전역 싱글턴 아님).
      </p>
      <p>
        <strong>포커스</strong>: 닫기 버튼을 누르면 그 버튼이 통째로 사라지므로, 포커스를 다음
        토스트의 닫기 버튼으로 — 마지막 하나였다면 알림 영역에 들어오기 전 요소로 넘긴다. 같은
        이유로 자동 닫힘은 hover뿐 아니라 <strong>포커스 중에도</strong> 멈춘다. 조작하려던 버튼이
        타이머 만료로 발밑에서 사라지면 안 되기 때문이다.
      </p>
    </article>
  );
}
