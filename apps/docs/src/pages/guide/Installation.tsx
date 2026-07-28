export function Installation() {
  return (
    <article>
      <h1>설치</h1>
      <p>
        GitHub Packages에서 배포된다. <strong>public 패키지라도 설치에 토큰이 필요하다</strong> —
        소비 환경마다 <code>read:packages</code> 권한의 PAT를 준비한다.
      </p>

      <h2 id="npmrc">.npmrc</h2>
      <pre className="docs-demo-code">
        <code>{`@jeon-ji:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${NODE_AUTH_TOKEN}`}</code>
      </pre>

      <h2 id="install">설치</h2>
      <pre className="docs-demo-code">
        <code>{`pnpm add @jeon-ji/common-ui`}</code>
      </pre>

      <h2 id="requirements">소비 앱 요구사항</h2>
      <table className="docs-props-table">
        <tbody>
          <tr>
            <td>React</td>
            <td>
              <code>^19</code> (peer)
            </td>
          </tr>
          <tr>
            <td>모듈 형식</td>
            <td>ESM only — Jest/CJS 소비 불가</td>
          </tr>
          <tr>
            <td>TypeScript</td>
            <td>
              <code>moduleResolution: "bundler"</code> 이상
            </td>
          </tr>
        </tbody>
      </table>
      <p>v0.1.0 발행 후 실제 소비 검증에서 발견되는 항목이 이 페이지의 트러블슈팅 표로 쌓인다.</p>
    </article>
  );
}
