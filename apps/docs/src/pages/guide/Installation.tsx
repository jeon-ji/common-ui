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
      <h2 id="troubleshooting">트러블슈팅</h2>
      <p>v0.1.0 소비 검증에서 실제로 재현·확인한 항목만 기록한다.</p>
      <table className="docs-props-table">
        <thead>
          <tr>
            <th scope="col">증상</th>
            <th scope="col">원인 · 해결</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              설치 시 <code>401 Unauthorized</code>
            </td>
            <td>
              GitHub Packages는 <strong>public 패키지도 토큰이 필요하다</strong>.{" "}
              <code>read:packages</code> PAT를 <code>NODE_AUTH_TOKEN</code>으로 주입하라 — CI라면
              시크릿 등록이 소비 환경마다 따라온다
            </td>
          </tr>
          <tr>
            <td>
              로컬에서 pnpm 명령마다 <code>Failed to replace env in config</code> 경고
            </td>
            <td>
              프로젝트 <code>.npmrc</code>에 <code>${"{NODE_AUTH_TOKEN}"}</code>을 적어 두면 변수가
              없는 환경에서 매번 경고가 뜬다 — 인증 줄은 <code>~/.npmrc</code>(사용자 설정)에 두라
            </td>
          </tr>
          <tr>
            <td>
              서브패스 import가 <code>Cannot find module</code>
            </td>
            <td>
              exports는 명시 선언만 있다 —{" "}
              <code>
                @jeon-ji/common-ui/components·hooks·icons·tokens· styles.css·tailwind-preset.css
              </code>{" "}
              외의 딥 임포트는 의도적으로 막혀 있다
            </td>
          </tr>
          <tr>
            <td>tsc가 타입을 못 찾음</td>
            <td>
              <code>moduleResolution: "bundler"</code>(또는 node16) 필요 — 소비 검증은 bundler
              모드로 통과 확인됨
            </td>
          </tr>
          <tr>
            <td>
              Jest/CJS에서 <code>require()</code> 실패
            </td>
            <td>ESM 전용 패키지다 — CJS 빌드는 제공하지 않는다 (명시적 비목표)</td>
          </tr>
        </tbody>
      </table>
      <p>
        시각 확인 항목(다크 토글, 모달 위 오버레이 계층)은 이 문서 사이트가 곧 검증 환경이다 — 우측
        상단 다크 토글과 Modal·Tooltip 데모에서 직접 확인할 수 있다.
      </p>
    </article>
  );
}
