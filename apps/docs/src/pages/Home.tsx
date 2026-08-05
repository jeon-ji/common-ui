import uiPackage from "../../../../packages/ui/package.json";
import { docGroups } from "../registry";

/** 개수는 레지스트리에서 센다 — 손으로 적은 숫자는 반드시 낡는다(M1이라고 적힌 채 v0.2.0까지 갔다). */
const countOf = (base: string) =>
  docGroups.find((group) => group.base === base)?.entries.length ?? 0;

export function Home() {
  return (
    <article>
      <h1>@jeon-ji/common-ui</h1>
      <p>
        React 19 디자인 시스템 — CSS 변수 토큰 기반, ESM only, 런타임 의존성 0. 좌측에서 문서를
        선택하거나 우측 상단에서 다크 모드를 전환해 보세요.
      </p>
      <h2 id="contents">담긴 것</h2>
      <p>
        현재 <strong>v{uiPackage.version}</strong> 기준 컴포넌트{" "}
        <strong>{countOf("/components")}종</strong> · 훅 <strong>{countOf("/hooks")}종</strong>.
        모든 항목은 문서 페이지와 라이브 데모를 함께 갖는다 — 데모 없는 컴포넌트는 CI가 막는다.
      </p>
      <h2 id="scope">범위</h2>
      <p>
        표시와 상호작용을 담당하고 <strong>데이터 조작은 하지 않는다</strong>. 정렬·필터·페이징 같은
        결정은 소비 앱이 소유하며, 이 라이브러리는 상태를 표시하고 변경을 알린다. 이 경계가 각
        컴포넌트 문서의 &quot;하지 않는 것&quot; 절에 적혀 있다.
      </p>
    </article>
  );
}
