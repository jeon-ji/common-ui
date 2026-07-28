import "./Badge.css";

import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from "react";

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  /** 표시할 숫자 — 0이면 숨긴다 (dot가 아닌 한) */
  count?: number;
  /**
   * count가 이 값을 넘으면 "N+"로 표시
   * @default 99
   */
  max?: number;
  /** 숫자 대신 점만 표시 (새 항목 존재 알림) */
  dot?: boolean;
  /** 있으면 래핑형 — 자식의 우상단에 뱃지가 붙는다 */
  children?: ReactNode;
}

/**
 * 카운트/상태 점 표시 전용. **라벨 텍스트에는 Tag를 쓴다** —
 * sije-common의 Badge/Chip 어휘 겹침을 역할로 분리했다.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { count, max = 99, dot = false, className, children, ...rest },
  ref,
) {
  const show = dot || (count !== undefined && count > 0);
  const label = count !== undefined && count > max ? `${String(max)}+` : String(count ?? "");

  const badge = show ? (
    <span
      className="ui-badge"
      data-dot={dot ? "" : undefined}
      // 점은 장식(문맥이 의미를 제공) — 숫자는 텍스트로 그대로 읽힌다
      aria-hidden={dot || undefined}
    >
      {!dot && label}
    </span>
  ) : null;

  if (children == null) {
    return (
      <span ref={ref} className={["ui-badge-host", className].filter(Boolean).join(" ")} {...rest}>
        {badge}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={["ui-badge-host", "ui-badge-wrapper", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
      {badge}
    </span>
  );
});
