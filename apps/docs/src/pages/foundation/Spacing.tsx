import { radius, shadow, spacing } from "@jeon-ji/common-ui/tokens";

/** CSS 변수 세그먼트 규칙 — 생성기(scripts/build-tokens.ts)의 seg()와 동일 */
const seg = (key: string) => key.replace(/\./g, "_");

export function Spacing() {
  return (
    <article>
      <h1>Spacing</h1>
      <p>4px 그리드. 컴포넌트 CSS는 px 리터럴 대신 이 변수만 참조한다.</p>

      <h2 id="spacing">간격</h2>
      <table className="docs-props-table">
        <thead>
          <tr>
            <th scope="col">토큰</th>
            <th scope="col">값</th>
            <th scope="col">시각</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(spacing).map(([key, value]) => (
            <tr key={key}>
              <td>
                <code>--ui-spacing-{seg(key)}</code>
              </td>
              <td>
                <code>{value}</code>
              </td>
              <td>
                <div className="docs-spacing-bar" style={{ width: value }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="radius">Radius</h2>
      <div className="docs-swatch-grid">
        {Object.entries(radius).map(([key, value]) => (
          <div key={key} className="docs-swatch">
            <div className="docs-radius-chip" style={{ borderRadius: value }} />
            <div className="docs-swatch-info">
              <strong>{key}</strong>
              <code>{value}</code>
            </div>
          </div>
        ))}
      </div>

      <h2 id="shadow">Shadow</h2>
      <div className="docs-swatch-grid">
        {Object.entries(shadow).map(([key, value]) => (
          <div key={key} className="docs-swatch">
            <div className="docs-shadow-chip" style={{ boxShadow: value }} />
            <div className="docs-swatch-info">
              <strong>{key}</strong>
              <code>--ui-shadow-{key}</code>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
