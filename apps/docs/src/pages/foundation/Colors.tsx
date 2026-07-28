/**
 * Colors — 팔레트를 토큰 소스(@jeon-ji/common-ui/tokens)에서 직접 렌더한다.
 * 별도 데이터 파일이 없으므로 소스와 어긋날 수 없다 (03 문서 M1 완료 기준).
 */
import { palette, paletteBase, semanticColor, type ThemedColor } from "@jeon-ji/common-ui/tokens";
import { useState } from "react";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="docs-swatch-copy"
      aria-label={`${label} 복사`}
      title={text}
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        });
      }}
    >
      {copied ? "✓" : text}
    </button>
  );
}

export function Colors() {
  return (
    <article>
      <h1>Colors</h1>
      <p>
        primitive → semantic 2계층. 컴포넌트는 semantic 계층만 참조하며, primitive는 CSS 변수를
        생성하지 않아 건너뛰는 참조가 구조적으로 불가능하다. 다크 테마는 semantic 변수만 재정의한다.
      </p>

      <h2 id="semantic">Semantic</h2>
      <p>
        컴포넌트가 참조하는 유일한 계층 — <code>var(--ui-color-&lt;group&gt;-&lt;name&gt;)</code>.
        아래 스와치는 현재 테마의 실제 CSS 변수 값으로 칠해진다 (다크 토글로 확인).
      </p>
      {Object.entries(semanticColor).map(([group, names]) => (
        <section key={group}>
          <h3 id={`semantic-${group}`}>{group}</h3>
          <div className="docs-swatch-grid">
            {Object.entries<ThemedColor>(names).map(([name, themed]) => {
              const cssVar = `--ui-color-${group}-${name}`;
              return (
                <div key={name} className="docs-swatch">
                  <div className="docs-swatch-chip" style={{ background: `var(${cssVar})` }} />
                  <div className="docs-swatch-info">
                    <strong>{name}</strong>
                    <CopyButton text={`var(${cssVar})`} label={`${group}.${name} CSS 변수`} />
                    <span className="docs-swatch-hex">
                      {themed.light} / {themed.dark}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <h2 id="primitive">Primitive</h2>
      <p>숫자 스케일만 갖는 원료 팔레트 — 직접 사용 금지 (semantic 매핑에서만 참조).</p>
      <div className="docs-swatch-grid">
        {Object.entries(paletteBase).map(([name, hex]) => (
          <div key={name} className="docs-swatch">
            <div className="docs-swatch-chip is-bordered" style={{ background: hex }} />
            <div className="docs-swatch-info">
              <strong>{name}</strong>
              <CopyButton text={hex} label={`${name} hex`} />
            </div>
          </div>
        ))}
      </div>
      {Object.entries(palette).map(([scale, steps]) => (
        <section key={scale}>
          <h3 id={`palette-${scale}`}>{scale}</h3>
          <div className="docs-scale-row">
            {Object.entries(steps).map(([step, hex]) => (
              <div key={step} className="docs-scale-cell">
                <div className="docs-swatch-chip" style={{ background: hex }} title={hex} />
                <span>{step}</span>
                <CopyButton text={hex} label={`${scale}.${step} hex`} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
