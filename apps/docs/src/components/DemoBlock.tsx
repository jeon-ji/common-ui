import { type ReactNode, useId, useState } from "react";

interface DemoBlockProps {
  /**
   * 시각 회귀 촬영 단위의 식별자 — 렌더하는 **데모 파일명과 같게** 둔다(`basic`·`states`…).
   * 페이지 slug와 합쳐 기준 이미지 파일명이 되므로(`<slug>-<name>-<theme>.png`),
   * 바꾸면 그 기준 이미지가 무효가 된다 (16 문서 §1.2).
   */
  name: string;
  title: string;
  description?: ReactNode;
  /** 데모 파일의 소스 문자열 — 같은 파일을 `?raw`로 import 해서 넘긴다 (화면과 코드가 항상 일치) */
  code: string;
  children: ReactNode;
}

/** antd code box 형태의 데모 블록 — 라이브 미리보기 + 코드 펼치기 + 복사 */
export function DemoBlock({ name, title, description, code, children }: DemoBlockProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const codeId = useId();

  return (
    <section className="docs-demo">
      {/* 시각 회귀는 이 미리보기 영역만 찍는다 — tests/visual/demos.spec.ts */}
      <div className="docs-demo-preview" data-visual-target={name}>
        {children}
      </div>
      <div className="docs-demo-meta">
        <strong>{title}</strong>
        {description && <span className="docs-demo-description">{description}</span>}
      </div>
      <div className="docs-demo-actions">
        <button
          type="button"
          className="docs-icon-button"
          aria-expanded={open}
          aria-controls={codeId}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "코드 접기" : "코드 보기"}
        </button>
        <button
          type="button"
          className="docs-icon-button"
          onClick={() => {
            void navigator.clipboard.writeText(code).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
        >
          {copied ? "복사됨 ✓" : "복사"}
        </button>
      </div>
      {open && (
        <pre className="docs-demo-code" id={codeId}>
          <code>{code}</code>
        </pre>
      )}
    </section>
  );
}
