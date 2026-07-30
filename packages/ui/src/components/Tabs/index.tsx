import "./Tabs.css";

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type KeyboardEvent,
  type ReactNode,
  useId,
} from "react";

import { useControllableState } from "../../hooks/useControllableState.js";
import { edgeEnabledIndex, nextEnabledIndex } from "../../internal/enabledIndex.js";

export interface TabItem {
  /** 탭 식별자 — value/onChange가 주고받는 값 */
  value: string;
  /** 탭 버튼 내용 */
  label: ReactNode;
  /** 패널 내용 — 활성 탭만 마운트된다 */
  content: ReactNode;
  /**
   * 선택 불가 탭 — 포커스 대상에서 빠지고 키보드 이동에서도 건너뛴다
   * @default false
   */
  disabled?: boolean;
}

export interface TabsProps extends Omit<ComponentPropsWithoutRef<"div">, "children" | "onChange"> {
  /** 탭 목록 */
  items: TabItem[];
  /** 제어 활성 탭 값 */
  value?: string;
  /** 비제어 초기 활성 값 — 생략하면 첫 활성 탭 */
  defaultValue?: string;
  /** 활성 탭 변경 — 선택된 value만 넘긴다 */
  onChange?: (value: string) => void;
  /**
   * 시각 변형
   * @default "line"
   */
  variant?: "line" | "solid";
  /**
   * 크기
   * @default "md"
   */
  size?: "sm" | "md";
}

/**
 * 탭 — `tablist`/`tab`/`tabpanel` 시맨틱과 roving tabindex를 갖춘 패널 전환 컨트롤.
 *
 * - 활성 탭만 `tabIndex=0`이라 Tab 키로 탭 목록에 **한 번만** 진입하고, 좌우 화살표로
 *   탭 사이를 순환 이동한다. 이동이 곧 활성화다(automatic activation).
 *   순환은 WAI-ARIA 탭 관례를 따른 것으로, 끝에서 멈추는 Select·Menu와 의도적으로 다르다 —
 *   그쪽은 목록에서 값을 찾는 콤보박스/메뉴라 경계가 정보를 주지만, 탭은 개수가 적고
 *   순회가 자연스럽다
 * - 활성 패널만 렌더한다 — 비활성 패널의 DOM·상태를 만들지 않는다
 * - 라우터와 결합하지 않는다: 주소와 묶으려면 `value`/`onChange`로 소비 앱이 연결한다
 * - 값을 고르는 컨트롤(패널 없음)이라면 SegmentedControl을 쓴다
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    items,
    value: valueProp,
    defaultValue,
    onChange,
    variant = "line",
    size = "md",
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  },
  ref,
) {
  // 항목이 없으면 활성 값도 없으므로 T가 undefined를 포함한다. 캐스트가 안전한 이유:
  // setActiveValue에 넘기는 값은 항상 존재하는 항목의 value(문자열)다 (RadioGroup 선례)
  const [activeValue, setActiveValue] = useControllableState<string | undefined>({
    value: valueProp,
    defaultValue: defaultValue ?? items[edgeEnabledIndex(items, 1)]?.value,
    onChange: onChange as (value: string | undefined) => void,
  });

  const baseId = useId();
  const tabId = (index: number) => `${baseId}-tab-${index}`;
  const panelId = (index: number) => `${baseId}-panel-${index}`;

  // 목록에 없는 값은 캐스팅으로 덮지 않는다 — 활성 탭 없음으로 두어 오작동이 드러나게 한다(리뷰 M12)
  const activeIndex = items.findIndex((item) => item.value === activeValue);
  // 활성 탭이 없어도 탭 목록에는 진입할 수 있어야 한다(포커스 가능한 탭이 하나는 필요)
  const focusIndex = activeIndex >= 0 ? activeIndex : edgeEnabledIndex(items, 1);

  const activate = (index: number) => {
    const item = items[index];
    if (!item || item.disabled === true) return;
    setActiveValue(item.value);
    document.getElementById(tabId(index))?.focus();
  };

  // 키 처리는 각 탭 버튼에 달린다 — 포커스가 실제로 그 버튼에 있으므로 이동 기준도 그 인덱스다
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        activate(nextEnabledIndex(items, index, 1, { wrap: true }));
        break;
      case "ArrowLeft":
        event.preventDefault();
        activate(nextEnabledIndex(items, index, -1, { wrap: true }));
        break;
      case "Home":
        event.preventDefault();
        activate(edgeEnabledIndex(items, 1));
        break;
      case "End":
        event.preventDefault();
        activate(edgeEnabledIndex(items, -1));
        break;
      default:
        break;
    }
  };

  const activeItem = activeIndex >= 0 ? items[activeIndex] : undefined;

  return (
    <div
      ref={ref}
      className={["ui-tabs", className].filter(Boolean).join(" ")}
      data-variant={variant}
      data-size={size}
      {...rest}
    >
      {/* aria-label은 루트가 아니라 tablist에 붙인다 — 이름이 필요한 위젯은 탭 목록이다 */}
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className="ui-tabs-list"
      >
        {items.map((item, index) => (
          <button
            key={item.value}
            type="button"
            id={tabId(index)}
            role="tab"
            aria-selected={index === activeIndex}
            // 렌더되지 않는 패널은 참조하지 않는다 (없는 id 참조 금지 컨벤션)
            aria-controls={index === activeIndex ? panelId(index) : undefined}
            tabIndex={index === focusIndex ? 0 : -1}
            disabled={item.disabled}
            className="ui-tab"
            onClick={() => activate(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {activeItem && (
        <div
          role="tabpanel"
          id={panelId(activeIndex)}
          aria-labelledby={tabId(activeIndex)}
          /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- WAI-ARIA APG:
             패널에 포커서블 요소가 없을 수 있으므로 패널 자체가 탭 순서에 들어가야
             키보드 사용자가 내용을 읽을 수 있다 */
          tabIndex={0}
          className="ui-tabs-panel"
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
});
