import "./SegmentedControl.css";

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type KeyboardEvent,
  type ReactNode,
  useId,
} from "react";

import { useControllableState } from "../../hooks/useControllableState.js";
import { edgeEnabledIndex, nextEnabledIndex } from "../../internal/enabledIndex.js";

export interface SegmentedItem {
  /** 이 항목이 나타내는 값 */
  value: string;
  /** 표시 라벨 — iconOnly에서도 접근 이름으로 쓰이므로 생략할 수 없다 */
  label: ReactNode;
  /** 라벨 앞 아이콘 — **주입형**이다. 라이브러리는 아이콘 목록을 갖지 않는다 */
  icon?: ReactNode;
  /**
   * 선택 불가 항목 — 포커스 대상에서 빠지고 키보드 이동에서도 건너뛴다
   * @default false
   */
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange" | "role" | "defaultValue" | "value"
> {
  /** 항목 목록 */
  items: SegmentedItem[];
  /** 제어 선택 값 */
  value?: string;
  /** 비제어 초기 값 — 생략하면 첫 활성 항목 */
  defaultValue?: string;
  /** 선택된 value만 넘긴다 */
  onChange?: (value: string) => void;
  /**
   * 크기
   * @default "md"
   */
  size?: "sm" | "md";
  /**
   * 아이콘만 표시 — 라벨은 화면에서 감춰지지만 접근 이름으로 남는다
   * @default false
   */
  iconOnly?: boolean;
}

/**
 * 세그먼트 컨트롤 — 값을 고르는 컨트롤이라 `radiogroup`/`radio` 시맨틱을 쓴다.
 *
 * 탭처럼 보이지만 탭이 **아니다**: 패널을 가르면 Tabs, 값을 고르면 이 컴포넌트다.
 * 탭 시맨틱을 붙이면 스크린리더가 존재하지 않는 패널을 찾는다.
 *
 * - roving tabindex + 화살표 순환 이동(= 선택, 라디오 관례), Home/End, disabled 건너뜀
 * - 아이콘은 소비자가 주입한다 — sije-common `useSegment`가 도메인 아이콘 26개를
 *   범용 훅에 하드코딩했던 문제(리뷰 M10)를 구조적으로 막는다
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    {
      items,
      value: valueProp,
      defaultValue,
      onChange,
      size = "md",
      iconOnly = false,
      className,
      ...rest
    },
    ref,
  ) {
    // 항목이 없으면 값도 없다 — Tabs와 같은 이유로 T가 undefined를 포함한다
    const [value, setValue] = useControllableState<string | undefined>({
      value: valueProp,
      defaultValue: defaultValue ?? items[edgeEnabledIndex(items, 1)]?.value,
      onChange: onChange as (value: string | undefined) => void,
    });

    const baseId = useId();
    const itemId = (index: number) => `${baseId}-item-${index}`;

    const selectedIndex = items.findIndex((item) => item.value === value);
    // 선택 항목이 없어도 그룹에는 진입할 수 있어야 한다
    const focusIndex = selectedIndex >= 0 ? selectedIndex : edgeEnabledIndex(items, 1);

    const select = (index: number) => {
      const item = items[index];
      if (!item || item.disabled === true) return;
      setValue(item.value);
      document.getElementById(itemId(index))?.focus();
    };

    // 라디오 관례: 화살표 이동이 곧 선택이며 양 끝에서 순환한다
    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          select(nextEnabledIndex(items, index, 1, { wrap: true }));
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          select(nextEnabledIndex(items, index, -1, { wrap: true }));
          break;
        case "Home":
          event.preventDefault();
          select(edgeEnabledIndex(items, 1));
          break;
        case "End":
          event.preventDefault();
          select(edgeEnabledIndex(items, -1));
          break;
        default:
          break;
      }
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={["ui-segmented", className].filter(Boolean).join(" ")}
        data-size={size}
        {...rest}
      >
        {items.map((item, index) => (
          <button
            key={item.value}
            type="button"
            id={itemId(index)}
            role="radio"
            aria-checked={index === selectedIndex}
            tabIndex={index === focusIndex ? 0 : -1}
            disabled={item.disabled}
            className="ui-segmented-item"
            onClick={() => select(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {item.icon != null && (
              <span className="ui-segmented-icon" aria-hidden="true">
                {item.icon}
              </span>
            )}
            {/* iconOnly면 라벨을 시각적으로만 감춘다 — aria-label과 달리 ReactNode를
                그대로 쓸 수 있고 접근 이름이 사라지지 않는다 */}
            <span className="ui-segmented-label" data-hidden={iconOnly ? "" : undefined}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    );
  },
);
