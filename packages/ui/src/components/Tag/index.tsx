import "./Tag.css";

import { type ComponentPropsWithoutRef, forwardRef } from "react";

import { CloseIcon } from "../../icons/index.js";

export interface TagProps extends ComponentPropsWithoutRef<"span"> {
  /**
   * 색 톤
   * @default "neutral"
   */
  tone?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";
  /**
   * 시각 변형
   * @default "subtle"
   */
  variant?: "subtle" | "outline";
  /** 닫기(제거) 버튼 표시 */
  closable?: boolean;
  /** 닫기 버튼 클릭 시 호출 */
  onClose?: () => void;
}

/**
 * 분류·상태 라벨 전용. **카운트/점 표시에는 Badge를 쓴다** —
 * sije-common의 Badge/Chip 어휘 겹침을 역할로 분리했다.
 * 닫기는 aria-label 있는 button이다 — svg onClick 금지 (전역 규칙 11·A8).
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { tone = "neutral", variant = "subtle", closable = false, onClose, className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      data-tone={tone}
      data-variant={variant}
      className={["ui-tag", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
      {closable && (
        <button type="button" className="ui-tag-close" aria-label="제거" onClick={onClose}>
          <CloseIcon size={12} />
        </button>
      )}
    </span>
  );
});
