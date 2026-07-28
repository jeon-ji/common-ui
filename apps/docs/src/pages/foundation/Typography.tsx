import { fontFamily, typography } from "@jeon-ji/common-ui/tokens";

export function Typography() {
  return (
    <article>
      <h1>Typography</h1>
      <p>
        타이포 스케일은 컴포넌트(Text/Heading)의 <code>variant</code>로만 소비한다. 전역{" "}
        <code>* {"{ font-size }"}</code> 강제는 하지 않는다.
      </p>

      <h2 id="scale">스케일</h2>
      <table className="docs-props-table">
        <thead>
          <tr>
            <th scope="col">variant</th>
            <th scope="col">size / line-height / weight</th>
            <th scope="col">미리보기</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(typography).map(([variant, style]) => (
            <tr key={variant}>
              <td>
                <code>{variant}</code>
              </td>
              <td>
                <code>
                  {style.fontSize} / {style.lineHeight} / {style.fontWeight}
                </code>
              </td>
              <td>
                <span
                  style={{
                    fontSize: `var(--ui-text-${variant}-size)`,
                    lineHeight: `var(--ui-text-${variant}-line-height)`,
                    fontWeight: `var(--ui-text-${variant}-weight)`,
                    fontFamily: variant === "code" ? "var(--ui-font-mono)" : undefined,
                  }}
                >
                  다람쥐 헌 쳇바퀴 Sphinx 0123
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="font-family">글꼴</h2>
      <table className="docs-props-table">
        <tbody>
          {Object.entries(fontFamily).map(([name, stack]) => (
            <tr key={name}>
              <td>
                <code>--ui-font-{name}</code>
              </td>
              <td style={{ fontFamily: `var(--ui-font-${name})` }}>{stack}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}
