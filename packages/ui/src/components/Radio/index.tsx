import "./Radio.css";

import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  type ReactNode,
  use,
  useId,
} from "react";

import { useControllableState } from "../../hooks/useControllableState.js";

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  setValue: (value: string) => void;
  disabled: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "onChange" | "defaultValue"
> {
  /** 제어 선택 값 */
  value?: string;
  /** 비제어 초기 선택 값 */
  defaultValue?: string;
  /** 선택된 Radio의 value만 넘긴다 */
  onChange?: (value: string) => void;
  /** 폼 제출용 name — 생략하면 자동 생성 (같은 그룹임을 보장) */
  name?: string;
  /** 그룹 전체 비활성 */
  disabled?: boolean;
  children: ReactNode;
}

/**
 * 라디오 그룹 — name/value를 컨텍스트로 관리한다 (개별 name 수동 관리 금지).
 * 화살표 키 이동·roving tabindex는 같은 name의 네이티브 라디오가 브라우저
 * 표준 동작으로 제공한다 — 자체 키보드 코드가 없어서 깨질 일도 없다.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { value: valueProp, defaultValue, onChange, name, disabled = false, children, ...rest },
  ref,
) {
  const autoName = useId();
  const [value, setValue] = useControllableState<string | undefined>({
    value: valueProp,
    defaultValue,
    onChange: onChange as (value: string | undefined) => void,
  });

  return (
    <div ref={ref} role="radiogroup" {...rest}>
      <RadioGroupContext value={{ name: name ?? autoName, value, setValue, disabled }}>
        {children}
      </RadioGroupContext>
    </div>
  );
});

export interface RadioProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "value" | "checked" | "defaultChecked" | "onChange" | "size" | "children" | "name"
> {
  /** 이 항목이 나타내는 값 */
  value: string;
  /** 라벨 슬롯 */
  children?: ReactNode;
}

/** 라디오 단일 항목 — 반드시 RadioGroup 안에서 사용한다. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, disabled, className, children, ...rest },
  ref,
) {
  const group = use(RadioGroupContext);
  if (group === null) {
    throw new Error("<Radio>는 <RadioGroup> 안에서만 사용할 수 있다");
  }

  const isDisabled = disabled ?? group.disabled;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) group.setValue(value);
  };

  return (
    <label
      className={["ui-radio", className].filter(Boolean).join(" ")}
      data-disabled={isDisabled ? "" : undefined}
    >
      <input
        ref={ref}
        className="ui-radio-input"
        type="radio"
        name={group.name}
        value={value}
        checked={group.value === value}
        onChange={handleChange}
        disabled={isDisabled}
        {...rest}
      />
      <span className="ui-radio-circle" />
      {children != null && <span className="ui-radio-label">{children}</span>}
    </label>
  );
});
