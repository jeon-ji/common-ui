import "./Table.css";

import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { ChevronDownIcon, ChevronUpIcon } from "../../icons/index.js";
import { Checkbox } from "../Checkbox/index.js";
import { Skeleton } from "../Skeleton/index.js";

export interface TableSort {
  /** 정렬 기준 컬럼의 `key` */
  key: string;
  direction: "asc" | "desc";
}

export interface TableColumn<T> {
  /** 컬럼 식별자 — 정렬·폭 저장의 키 */
  key: string;
  /** 헤더 내용 */
  header: ReactNode;
  /**
   * 셀 렌더러. **필수다** — `row[key]`를 자동으로 그리지 않는다.
   * 자동 렌더는 컬럼 key를 데이터 필드에 묶어 파생 컬럼(합계·배지·버튼)마다 예외를 만든다.
   */
  render: (row: T, index: number) => ReactNode;
  /**
   * 셀 정렬
   * @default "left"
   */
  align?: "left" | "center" | "right";
  /**
   * 가로 스크롤 시 고정. 고정 컬럼은 `width`를 함께 지정한다 —
   * 이웃한 고정 컬럼의 오프셋을 폭에서 계산하기 때문이다
   */
  sticky?: "left" | "right";
  /** 이 컬럼으로 정렬 가능 — 정렬 **로직**은 소비 앱이 한다 */
  sortable?: boolean;
  /** 컬럼 폭 (px) */
  width?: number;
}

/**
 * 행 선택 상태의 계약 — `useTableSelection`이 이 형태를 돌려주고 Table이 그것을 그린다.
 * 훅은 UI를 만들지 않고 컴포넌트는 상태를 만들지 않는다 (전역 규칙 13).
 */
export interface TableSelection {
  /** 선택된 행 키 */
  selectedKeys: string[];
  isSelected: (key: string) => boolean;
  /** 선택 불가 행 — 체크박스가 비활성으로 그려진다 */
  isDisabled: (key: string) => boolean;
  toggle: (key: string) => void;
  toggleAll: () => void;
  /** 헤더 체크박스 상태 — 일부만 선택이면 indeterminate */
  allState: "none" | "some" | "all";
  clear: () => void;
}

export interface TableProps<T> extends Omit<ComponentPropsWithoutRef<"table">, "children"> {
  /** 컬럼 정의 */
  columns: TableColumn<T>[];
  /** 행 데이터 — Table은 이 배열을 정렬·필터·자르지 않는다 */
  rows: T[];
  /** 행 식별자 — 선택·리렌더 정합성의 근거 */
  rowKey: (row: T) => string;
  /**
   * 표의 이름. 시각적으로 숨겨진 `<caption>`으로 그려진다.
   * 생략하면 `aria-label`을 직접 넘긴다 — 이름 없는 표는 목록에서 구분되지 않는다 (규칙 26)
   */
  caption?: ReactNode;
  /** 제어 정렬 상태 — 데이터 정렬은 소비 앱 책임 */
  sort?: TableSort;
  /** 정렬 헤더를 눌렀을 때. 같은 컬럼을 다시 누르면 방향만 뒤집힌다 */
  onSortChange?: (sort: TableSort) => void;
  /** 행이 0개일 때 그릴 내용 — `EmptyState`를 소비자가 넣는다 */
  empty?: ReactNode;
  /**
   * 로딩 중 — Skeleton 행을 그린다
   * @default false
   */
  loading?: boolean;
  /**
   * 로딩 중 그릴 Skeleton 행 수
   * @default 3
   */
  loadingRows?: number;
  /**
   * 헤더 고정. 세로 스크롤 높이는 소비자가 정한다 —
   * 조상 요소에 `--ui-table-max-height`를 주면 그 높이에서 스크롤된다
   * @default false
   */
  stickyHeader?: boolean;
  /** `useTableSelection`이 돌려준 객체 — 넘기면 맨 앞에 체크박스 열이 생긴다 */
  selection?: TableSelection;
  /**
   * 행 체크박스의 접근 이름 — **행을 식별할 수 있게** 만든다("홍길동 선택").
   * 기본값 "행 선택"은 모든 행에서 같아 목록에서 구분되지 않는다 (규칙 26)
   */
  selectionLabel?: (row: T) => string;
  /**
   * 크기
   * @default "md"
   */
  size?: "sm" | "md";
}

/** 고정 컬럼의 좌·우 오프셋 — 앞선(또는 뒤따르는) 고정 컬럼의 폭 누적이다. */
function stickyOffsets(
  columns: readonly { sticky?: "left" | "right"; width?: number }[],
): number[] {
  const offsets = Array<number>(columns.length).fill(0);

  let left = 0;
  for (const [index, column] of columns.entries()) {
    if (column.sticky !== "left") continue;
    offsets[index] = left;
    left += column.width ?? 0;
  }

  let right = 0;
  for (let index = columns.length - 1; index >= 0; index -= 1) {
    const column = columns[index];
    if (column?.sticky !== "right") continue;
    offsets[index] = right;
    right += column.width ?? 0;
  }

  return offsets;
}

function TableInner<T>(
  {
    columns,
    rows,
    rowKey,
    caption,
    sort,
    onSortChange,
    empty,
    loading = false,
    loadingRows = 3,
    stickyHeader = false,
    selection,
    selectionLabel,
    size = "md",
    className,
    ...rest
  }: TableProps<T>,
  ref: ForwardedRef<HTMLTableElement>,
) {
  const offsets = stickyOffsets(columns);
  const columnCount = columns.length + (selection ? 1 : 0);

  // 로딩과 빈 상태가 동시에 보이는 화면은 만들지 않는다 — 셋 중 하나만 그린다
  const showEmpty = !loading && rows.length === 0 && empty != null;

  /** 고정 컬럼의 오프셋은 CSS 변수로만 전달한다 — 그림자는 CSS 한 벌이 그린다 */
  const stickyStyle = (column: TableColumn<T>, index: number): CSSProperties | undefined =>
    column.sticky === undefined
      ? undefined
      : ({ "--ui-table-sticky-offset": `${String(offsets[index] ?? 0)}px` } as CSSProperties);

  const handleSort = (column: TableColumn<T>) => {
    const direction = sort?.key === column.key && sort.direction === "asc" ? "desc" : "asc";
    onSortChange?.({ key: column.key, direction });
  };

  return (
    <div className="ui-table-scroll" data-sticky-header={stickyHeader ? "" : undefined}>
      <table
        ref={ref}
        className={["ui-table", className].filter(Boolean).join(" ")}
        data-size={size}
        // 로딩 중임을 보조기술에 알린다 — Skeleton은 장식이라 스스로 말하지 않는다
        aria-busy={loading || undefined}
        {...rest}
      >
        {caption != null && <caption className="ui-table-caption">{caption}</caption>}
        <thead className="ui-table-head">
          <tr>
            {selection && (
              <th scope="col" className="ui-table-selection-cell">
                <Checkbox
                  aria-label="전체 선택"
                  checked={selection.allState === "all"}
                  indeterminate={selection.allState === "some"}
                  onChange={selection.toggleAll}
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={column.key}
                scope="col"
                // 정렬 가능한 컬럼에만 준다 — 정렬과 무관한 컬럼의 "none"은 소음이다
                aria-sort={
                  column.sortable !== true
                    ? undefined
                    : sort?.key !== column.key
                      ? "none"
                      : sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                }
                data-align={column.align}
                data-sticky={column.sticky}
                style={{
                  ...stickyStyle(column, index),
                  width: column.width == null ? undefined : `${String(column.width)}px`,
                }}
              >
                {column.sortable === true ? (
                  // 헤더 셀 자체에 onClick을 달지 않는다 — 키보드로 누를 수 없다.
                  // 버튼 이름은 헤더 텍스트뿐이다: 정렬 방향은 aria-sort가 이미 말한다 (규칙 26)
                  <button
                    type="button"
                    className="ui-table-sort"
                    onClick={() => {
                      handleSort(column);
                    }}
                  >
                    {column.header}
                    {/* 아이콘은 이름 없는 장식이다 — createIcon이 aria-hidden을 붙인다 */}
                    {sort?.key === column.key && sort.direction === "desc" ? (
                      <ChevronDownIcon className="ui-table-sort-icon" />
                    ) : (
                      <ChevronUpIcon
                        className="ui-table-sort-icon"
                        data-idle={sort?.key !== column.key ? "" : undefined}
                      />
                    )}
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading &&
            Array.from({ length: Math.max(loadingRows, 0) }, (_row, rowIndex) => (
              <tr key={`skeleton-${String(rowIndex)}`} className="ui-table-row">
                {Array.from({ length: columnCount }, (_cell, cellIndex) => (
                  <td key={`skeleton-cell-${String(cellIndex)}`}>
                    <Skeleton />
                  </td>
                ))}
              </tr>
            ))}
          {showEmpty && (
            <tr>
              <td colSpan={columnCount} className="ui-table-empty-cell">
                {empty}
              </td>
            </tr>
          )}
          {!loading &&
            rows.map((row, rowIndex) => {
              const key = rowKey(row);
              return (
                <tr
                  key={key}
                  className="ui-table-row"
                  data-selected={selection?.isSelected(key) === true ? "" : undefined}
                >
                  {selection && (
                    <td className="ui-table-selection-cell">
                      <Checkbox
                        aria-label={selectionLabel?.(row) ?? "행 선택"}
                        checked={selection.isSelected(key)}
                        disabled={selection.isDisabled(key)}
                        onChange={() => {
                          selection.toggle(key);
                        }}
                      />
                    </td>
                  )}
                  {columns.map((column, index) => (
                    <td
                      key={column.key}
                      data-align={column.align}
                      data-sticky={column.sticky}
                      style={stickyStyle(column, index)}
                    >
                      {column.render(row, rowIndex)}
                    </td>
                  ))}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * 표 — sije-common Table(528줄·prop 20개)의 분해 재설계.
 *
 * 원본은 정렬·선택·리사이즈·sticky·빈 상태·로딩이 한 파일에 얽힌 God Component였다.
 * 여기서는 **표시**만 컴포넌트가 갖고, 행 선택은 `useTableSelection`이, 컬럼 폭은
 * `useColumnResize`가 소유한다. 데이터 조작(정렬·필터·페이징)은 전부 소비 앱 몫이다.
 *
 * - **`render`는 필수다.** `row[key]` 자동 렌더는 컬럼 key와 데이터 필드를 묶어
 *   파생 컬럼마다 예외를 만든다 — 명시적 렌더가 규칙이다
 * - **정렬은 제어형**이다. `onSortChange`만 알리고 `rows`는 손대지 않는다 —
 *   서버 정렬이든 클라이언트 정렬이든 소비 앱이 정한다
 * - **`empty`는 슬롯**이다. Table은 `EmptyState`를 import 하지 않는다 —
 *   빈 상태 문구가 표 안에 얽히는 것이 원본 God Component의 한 축이었다
 * - **grid 키보드 내비게이션을 하지 않는다.** 이 표는 정적 데이터 표시이고,
 *   `role="grid"` + 방향키 셀 이동은 스프레드시트형 위젯의 패턴이다. 도입하면 포커스 관리·
 *   편집 모드·선택 범위가 전부 따라온다. 행 안의 버튼·체크박스·링크는 각자 네이티브 탭 스톱이며,
 *   이는 roving tabindex를 쓰지 않은 Pagination과 같은 판단이다
 *
 * 하지 않는 것: 가상화 · 페이징 내장 · 컬럼 재정렬 · 확장 행 · 트리 테이블 · 셀 편집 ·
 * 다단 헤더 · 정렬/필터 **로직**.
 */
export const Table = forwardRef(TableInner) as <T>(
  props: TableProps<T> & { ref?: Ref<HTMLTableElement> },
) => ReactElement;
