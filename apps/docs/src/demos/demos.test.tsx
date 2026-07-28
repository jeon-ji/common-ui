/**
 * 데모 렌더 스모크 (04 문서 §4) — 모든 데모 파일이 크래시 없이 렌더되는지 확인한다.
 * 데모 파일 규약: demos/<Component>/<소문자로 시작하는 이름>.tsx, default export 컴포넌트.
 */
import { render } from "@testing-library/react";
import type { ComponentType } from "react";
import { describe, expect, test } from "vitest";

const demoModules = import.meta.glob<{ default: ComponentType }>("./**/[a-z]*.tsx", {
  eager: true,
});

const demos = Object.entries(demoModules).filter(([file]) => !file.includes(".test."));

describe("데모 렌더 스모크", () => {
  test("데모가 1개 이상 수집된다", () => {
    expect(demos.length).toBeGreaterThan(0);
  });

  test.each(demos.map(([file, mod]) => [file, mod] as const))(
    "%s 가 크래시 없이 렌더된다",
    (file, mod) => {
      expect(mod.default, `${file}는 default export 컴포넌트여야 한다`).toBeTypeOf("function");
      const Demo = mod.default;
      const { container } = render(<Demo />);
      expect(container.firstChild).not.toBeNull();
    },
  );
});
