import { zIndex } from "@jeon-ji/common-ui/tokens";

export function ZIndex() {
  const entries = Object.entries(zIndex);

  return (
    <article>
      <h1>z-index</h1>
      <p>
        계층 간 간격은 100 단위, 같은 계층 안의 중첩은 +1씩. 어떤 파일에도 z-index 숫자 리터럴을
        쓰지 않는다 — 항상 <code>var(--ui-z-*)</code>를 참조한다 (린트·validate-tokens가 차단).
      </p>

      <h2 id="scale">계층</h2>
      <table className="docs-props-table">
        <thead>
          <tr>
            <th scope="col">토큰</th>
            <th scope="col">값</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key}>
              <td>
                <code>--ui-z-{key}</code>
              </td>
              <td>
                <code>{value}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="diagram">다이어그램</h2>
      <div className="docs-z-diagram" aria-hidden="true">
        {entries.map(([key], index) => (
          <div
            key={key}
            className="docs-z-layer"
            style={{
              marginLeft: `calc(${String(index)} * var(--ui-spacing-6))`,
              marginTop: index === 0 ? undefined : "calc(-1 * var(--ui-spacing-8))",
            }}
          >
            {key}
          </div>
        ))}
      </div>
    </article>
  );
}
