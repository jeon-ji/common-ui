export function Usage() {
  return (
    <article>
      <h1>사용법</h1>

      <h2 id="styles">스타일 로드</h2>
      <p>
        앱 진입점에서 <code>styles.css</code>를 한 번 import 한다 — 토큰 CSS 변수·리셋이 여기에 담겨
        있다.
      </p>
      <pre className="docs-demo-code">
        <code>{`import "@jeon-ji/common-ui/styles.css";`}</code>
      </pre>

      <h2 id="theme">테마</h2>
      <p>
        다크 테마는 루트 요소에 <code>data-theme="dark"</code>를 붙이는 것으로 끝난다 — semantic
        변수만 재정의된다.
      </p>
      <pre className="docs-demo-code">
        <code>{`document.documentElement.dataset.theme = "dark";`}</code>
      </pre>

      <h2 id="tailwind">Tailwind v4 연동 (선택)</h2>
      <p>preset 없이도 컴포넌트는 완전 동작한다. 유틸리티로 토큰을 쓰고 싶을 때만 연동한다.</p>
      <pre className="docs-demo-code">
        <code>{`@import "@jeon-ji/common-ui/styles.css";
@import "@jeon-ji/common-ui/tailwind-preset.css";`}</code>
      </pre>
      <p>
        preset은 semantic 네임만 노출한다 — <code>bg-red-500</code> 같은 Tailwind 기본 팔레트는 덮지
        않는다.
      </p>
    </article>
  );
}
