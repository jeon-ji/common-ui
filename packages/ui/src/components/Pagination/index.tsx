import "./Pagination.css";

import {
  type ComponentPropsWithoutRef,
  type FocusEvent,
  forwardRef,
  type KeyboardEvent,
  useRef,
  useState,
} from "react";

import { useControllableState } from "../../hooks/useControllableState.js";
import { ChevronLeftIcon, ChevronRightIcon } from "../../icons/index.js";
import { composeRefs } from "../../internal/composeRefs.js";
import { NumberField } from "../NumberField/index.js";
import { visiblePages } from "./visiblePages.js";

export interface PaginationProps extends Omit<
  ComponentPropsWithoutRef<"nav">,
  "children" | "onChange"
> {
  /** 전체 **페이지 수** — 항목 수가 아니다(항목 수→페이지 수 계산은 소비 앱 몫) */
  total: number;
  /** 제어 현재 페이지 (1부터) */
  value?: number;
  /**
   * 비제어 초기 페이지
   * @default 1
   */
  defaultValue?: number;
  /** 페이지 변경 — 이동한 페이지 번호만 넘긴다 */
  onChange?: (page: number) => void;
  /**
   * 현재 페이지 좌우로 보여줄 개수
   * @default 1
   */
  siblings?: number;
  /**
   * 양 끝에 항상 보여줄 개수
   * @default 1
   */
  boundaries?: number;
  /**
   * 페이지 번호를 직접 입력하는 필드 표시
   * @default false
   */
  pageInput?: boolean;
  /**
   * 크기
   * @default "md"
   */
  size?: "sm" | "md";
}

/**
 * 페이지네이션 — sije-common `usePagination`(JSX 반환 훅)의 컴포넌트 재설계.
 *
 * 훅이 반환 객체 안에서 컴포넌트를 매 렌더 새로 정의해 서브트리가 리마운트되고, 그 결과
 * **입력 중이던 페이지 번호와 포커스가 부모 리렌더마다 사라졌다**(리뷰 A3). 렌더는 컴포넌트가
 * 소유하고 훅은 상태만 다룬다는 규칙(전역 규칙 13)의 사례다.
 *
 * - 페이지 이동은 `<button>`이고 현재 페이지에 `aria-current="page"` — `<li onClick>`으로
 *   키보드 조작이 불가능했던 구조를 바로잡았다(리뷰 A8)
 * - 각 버튼이 독립 탭 스톱이다. Tabs·SegmentedControl과 달리 roving tabindex를 쓰지 않는다 —
 *   페이지네이션은 링크 목록 성격이고 APG도 roving을 요구하지 않는다
 * - `total <= 1`이면 아무것도 렌더하지 않는다
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    total,
    value: valueProp,
    defaultValue = 1,
    onChange,
    siblings = 1,
    boundaries = 1,
    pageInput = false,
    size = "md",
    className,
    "aria-label": ariaLabel,
    ...rest
  },
  ref,
) {
  const [page, setPage] = useControllableState<number>({
    value: valueProp,
    defaultValue,
    onChange,
  });
  const navRef = useRef<HTMLElement | null>(null);
  // 직접 입력 값은 이 컴포넌트가 소유한다 — 타이핑 중에는 페이지를 옮기지 않는다.
  // 비어 있는 상태(null)가 기본이라 낡은 숫자가 남지 않는다
  const [draft, setDraft] = useState<number | null>(null);

  // total이 줄어 현재 페이지가 범위를 넘으면 표시만 클램프한다 —
  // 제어 컴포넌트의 값을 몰래 바꾸지 않는다(보정은 소비 앱 책임, 문서에 명시)
  const current = Math.min(Math.max(page, 1), Math.max(total, 1));
  const slots = visiblePages({ total, page: current, siblings, boundaries });

  const goTo = (next: number) => {
    // 페이지는 정수다 — 입력 필드가 소수를 허용하므로 여기서 반올림해 2.5페이지 같은 값이
    // onChange로 새지 않게 한다
    const clamped = Math.min(Math.max(Math.round(next), 1), total);
    setPage(clamped); // 같은 값이면 useControllableState가 onChange를 부르지 않는다
  };

  const commitDraft = () => {
    if (draft === null) return; // 빈 값은 무시
    goTo(draft);
    setDraft(null); // 커밋 후 비워 두어 낡은 숫자가 남지 않게 한다
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault(); // 폼 안에서 제출로 새지 않게
    commitDraft();
  };

  // blur 커밋은 포커스가 이 컴포넌트 **밖으로** 나갈 때만 한다.
  // 페이지 버튼을 마우스로 누르면 mousedown → blur가 click보다 먼저 오는데, 그때 커밋해
  // 목록을 재계산하면 눌린 버튼이 언마운트돼 click이 사라진다(엉뚱한 페이지로 이동)
  const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && navRef.current?.contains(next) === true) return;
    commitDraft();
  };

  if (total <= 1) return null;

  return (
    <nav
      ref={composeRefs(ref, navRef)}
      aria-label={ariaLabel ?? "페이지네이션"}
      className={["ui-pagination", className].filter(Boolean).join(" ")}
      data-size={size}
      {...rest}
    >
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles -- 규칙 말대로 보통은 중복이지만,
          WebKit(Safari/VoiceOver)은 list-style: none이 적용된 목록에서 list 시맨틱을 제거한다.
          이 명시가 없으면 nav → ul → li 구조가 보조기술에 전달되지 않는다 */}
      <ul role="list" className="ui-pagination-list">
        <li>
          {/* 양 끝에서 disabled 속성을 쓰지 않는다: 방금 조작한 버튼이 비활성화되면 브라우저가
              포커스를 body로 되돌려 키보드 사용자가 위치를 잃는다. aria-disabled로 알리고
              동작만 막아 포커스를 유지한다 */}
          <button
            type="button"
            className="ui-pagination-nav"
            aria-label="이전 페이지"
            aria-disabled={current <= 1 || undefined}
            onClick={() => {
              if (current > 1) goTo(current - 1);
            }}
          >
            <ChevronLeftIcon />
          </button>
        </li>
        {slots.map((slot, index) =>
          slot === "ellipsis" ? (
            // 생략 기호는 정보가 아니라 표시다 — 페이지 정보는 버튼들이 담당한다
            <li key={`ellipsis-${String(index)}`} aria-hidden="true">
              <span className="ui-pagination-ellipsis">…</span>
            </li>
          ) : (
            <li key={slot}>
              <button
                type="button"
                className="ui-pagination-page"
                aria-current={slot === current ? "page" : undefined}
                // 이름에 "현재 페이지"를 넣지 않는다 — aria-current를 보조기술이 자기 문구로
                // 읽어 주므로 이름에 또 넣으면 두 번 안내된다
                aria-label={`${String(slot)} 페이지`}
                onClick={() => goTo(slot)}
              >
                {slot}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            className="ui-pagination-nav"
            aria-label="다음 페이지"
            aria-disabled={current >= total || undefined}
            onClick={() => {
              if (current < total) goTo(current + 1);
            }}
          >
            <ChevronRightIcon />
          </button>
        </li>
      </ul>
      {pageInput && (
        <NumberField
          className="ui-pagination-input"
          aria-label="페이지 번호"
          placeholder={String(current)}
          min={1}
          max={total}
          value={draft}
          // 비어 있어도 spinbutton은 값을 알려야 한다(ARIA 1.2) — 그때의 값은 현재 페이지이며
          // placeholder가 화면에 보여 주는 것과 같다
          aria-valuenow={draft ?? current}
          onChange={setDraft}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
        />
      )}
    </nav>
  );
});
