import "./Sample.css";

import { type ComponentPropsWithoutRef, forwardRef } from "react";

export interface SampleProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * 강조 톤
   * @default "neutral"
   */
  tone?: "neutral" | "primary";
}

/**
 * 파이프라인 검증용 더미 컴포넌트.
 * 빌드 → pack 스모크 → 문서 사이트 렌더까지 전 파이프라인이 도는지 확인하며,
 * 이후 실제 컴포넌트 작업의 템플릿을 겸한다 — forwardRef + ComponentPropsWithoutRef 확장(전역 규칙 7),
 * 토큰만 참조하는 CSS(규칙 12), Props 타입 배럴 export(규칙 8).
 */
export const Sample = forwardRef<HTMLDivElement, SampleProps>(function Sample(
  { tone = "neutral", className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-tone={tone}
      className={["ui-sample", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
});
