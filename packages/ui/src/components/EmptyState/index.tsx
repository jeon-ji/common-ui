import "./EmptyState.css";

import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from "react";

import { AlertTriangleIcon } from "../../icons/index.js";

/**
 * status별 기본 아이콘.
 *
 * `empty`에 기본 그림을 두지 않는 이유: "결과 없음"을 나타내는 그림은 대개 도메인 표현이고,
 * 아이콘 세트에도 해당 아이콘이 없다. 필요하면 소비자가 `icon`으로 넣는다.
 */
const DEFAULT_ICON: Record<"empty" | "error", ReactNode> = {
  empty: null,
  error: <AlertTriangleIcon />,
};

// `title`은 네이티브 div 속성(문자열 툴팁)과 이름이 겹친다. 여기서는 ReactNode를 받는
// 제목 슬롯이므로 네이티브 쪽을 덜어낸다 — 호버 툴팁이 필요하면 Tooltip을 쓴다.
export interface EmptyStateProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  /**
   * 결과가 없음(empty) / 불러오지 못함(error)
   * @default "empty"
   */
  status?: "empty" | "error";
  /**
   * 상단 아이콘. 미지정이면 status 기본값(empty=없음, error=경고 아이콘)이고,
   * `null`을 넘기면 아이콘을 그리지 않는다
   */
  icon?: ReactNode;
  /** 한 줄 요약 — 필수다. 이것이 없으면 "로딩 중"과 구분되지 않는다 */
  title: ReactNode;
  /** 보조 설명 */
  description?: ReactNode;
  /** 액션 슬롯 — 재시도·새로 만들기 버튼을 소비자가 넣는다 */
  action?: ReactNode;
  /**
   * @default "md" (sm = 카드·테이블 내부처럼 높이가 좁은 자리)
   */
  size?: "sm" | "md";
}

/**
 * 결과가 없거나 불러오지 못했을 때의 자리 표시.
 *
 * - **`role`/`aria-live`를 기본으로 부여하지 않는다.** 알림 낭독은 Toast의 책임이고,
 *   마운트와 동시에 존재하는 `role="alert"`는 낭독 여부가 환경마다 갈린다. 무엇보다
 *   "목록이 비었다"를 즉시 가로채 읽어야 하는지는 화면 맥락이 정한다 — 필요하면 소비자가
 *   `role="status"`나 `aria-live`를 그대로 내려보낸다
 * - `action`은 콜백이 아니라 슬롯이다. 버튼 문구·톤·로딩 상태가 화면마다 달라서,
 *   콜백만 받으면 문구 prop → 아이콘 prop으로 번져간다
 * - Empty와 Error를 두 컴포넌트로 쪼개지 않는다(ConfirmModal이 확인 모달 4형제를 `tone`
 *   하나로 합친 것과 같은 판단) — 레이아웃이 같고 의미만 다르다
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { status = "empty", icon, title, description, action, size = "md", className, ...rest },
  ref,
) {
  // 미지정(undefined)이면 status 기본값, null이면 아이콘 없음 —
  // ReactNode가 null을 포함하므로 타입이 거짓말하지 않는다(전역 규칙 9)
  const resolvedIcon = icon === undefined ? DEFAULT_ICON[status] : icon;

  return (
    <div
      ref={ref}
      className={["ui-empty-state", className].filter(Boolean).join(" ")}
      data-status={status}
      data-size={size}
      {...rest}
    >
      {resolvedIcon != null && (
        // 아이콘은 장식이다 — 의미는 title이 전달한다
        <span className="ui-empty-state-icon" aria-hidden="true">
          {resolvedIcon}
        </span>
      )}
      {/* 제목을 heading 태그로 고정하지 않는다 — 이 컴포넌트는 자기가 놓인 페이지의
          heading 레벨을 알 수 없다. 필요하면 title에 <Heading>을 넣는다 */}
      <p className="ui-empty-state-title">{title}</p>
      {description != null && <p className="ui-empty-state-description">{description}</p>}
      {action != null && <div className="ui-empty-state-action">{action}</div>}
    </div>
  );
});
