import "./TextField.css";

import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  forwardRef,
  type ReactNode,
  useRef,
  useState,
} from "react";

import { useControllableState } from "../../hooks/useControllableState.js";
import { CloseIcon, EyeIcon, EyeOffIcon, SearchIcon } from "../../icons/index.js";
import { composeRefs } from "../../internal/composeRefs.js";
import { useFieldControl } from "../Field/index.js";
import { IconButton } from "../IconButton/index.js";

export interface TextFieldProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "value" | "defaultValue" | "onChange" | "type" | "prefix" | "size" | "children"
> {
  /** 제어 값 — 이 시스템의 계약은 `value` + `onChange(value)` 하나다 */
  value?: string;
  /** 비제어 초기값 */
  defaultValue?: string;
  /** 파싱된 값만 넘긴다 — 네이티브 이벤트가 필요한 자리는 onBlur/onKeyDown 등을 그대로 쓴다 */
  onChange?: (value: string) => void;
  /**
   * password는 표시 토글, search는 검색 아이콘 + 클리어 버튼을 내장한다
   * @default "text"
   */
  type?: "text" | "password" | "search" | "email" | "tel" | "url";
  /** 입력 앞 슬롯 (아이콘·단위 등) */
  prefix?: ReactNode;
  /** 입력 뒤 슬롯 */
  suffix?: ReactNode;
  /** 값이 있을 때 지우기 버튼 표시 (search는 기본 내장) */
  clearable?: boolean;
}

/**
 * 텍스트 입력. sije-common의 InputText/InputPassword/InputSearch 3종을
 * `type` 하나로 흡수한다. Field 안에서는 label·helper·error가 자동 연결된다.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    value: valueProp,
    defaultValue = "",
    onChange,
    type = "text",
    prefix,
    suffix,
    clearable = false,
    disabled,
    id,
    required,
    className,
    ...rest
  },
  forwardedRef,
) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const field = useFieldControl(id);

  const isPassword = type === "password";
  const isSearch = type === "search";
  const showClear = (clearable || isSearch) && !disabled && value.length > 0;

  const resolvedType = isPassword && passwordVisible ? "text" : type;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={["ui-textfield", className].filter(Boolean).join(" ")}
      data-disabled={disabled ? "" : undefined}
      data-invalid={field["aria-invalid"] ? "" : undefined}
    >
      {isSearch && (
        <span className="ui-textfield-affix">
          <SearchIcon />
        </span>
      )}
      {prefix != null && <span className="ui-textfield-affix">{prefix}</span>}
      <input
        ref={composeRefs(forwardedRef, inputRef)}
        className="ui-textfield-input"
        type={resolvedType}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required ?? field.required}
        id={field.id}
        aria-describedby={field["aria-describedby"]}
        aria-invalid={field["aria-invalid"]}
        aria-errormessage={field["aria-errormessage"]}
        {...rest}
      />
      {showClear && (
        <IconButton size="sm" aria-label="입력 지우기" tabIndex={-1} onClick={handleClear}>
          <CloseIcon />
        </IconButton>
      )}
      {isPassword && (
        <IconButton
          size="sm"
          aria-label={passwordVisible ? "비밀번호 숨기기" : "비밀번호 표시"}
          aria-pressed={passwordVisible}
          disabled={disabled}
          onClick={() => setPasswordVisible((prev) => !prev)}
        >
          {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
        </IconButton>
      )}
      {suffix != null && <span className="ui-textfield-affix">{suffix}</span>}
    </div>
  );
});
