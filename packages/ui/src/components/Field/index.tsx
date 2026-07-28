import "./Field.css";

import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  type ReactNode,
  use,
  useId,
} from "react";

interface FieldContextValue {
  /** 컨트롤이 사용할 id — label의 htmlFor와 짝 */
  id: string;
  /** helper/error를 가리키는 aria-describedby 값 */
  describedBy?: string;
  /** errorText가 있을 때 그 요소의 id */
  errorId?: string;
  invalid: boolean;
  required: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * Field 안의 폼 컨트롤이 label·helper·error와 스스로 연결되도록 하는 내부 훅.
 * Field 밖에서 쓰이면 빈 객체를 돌려줘 컨트롤 단독 사용도 성립한다.
 */
export function useFieldControl(ownId?: string): {
  id: string | undefined;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
  "aria-errormessage": string | undefined;
  required: boolean | undefined;
} {
  const context = use(FieldContext);
  return {
    id: ownId ?? context?.id,
    "aria-describedby": context?.describedBy,
    "aria-invalid": context?.invalid ? true : undefined,
    "aria-errormessage": context?.invalid ? context.errorId : undefined,
    required: context?.required ? true : undefined,
  };
}

export interface FieldProps extends ComponentPropsWithoutRef<"div"> {
  /** 컨트롤 위에 표시할 라벨 — htmlFor/id가 자동 연결된다 */
  label?: ReactNode;
  /** 필수 표시(*) + 컨트롤에 required 전파 */
  required?: boolean;
  /** 보조 설명 — aria-describedby로 컨트롤과 연결된다 */
  helperText?: ReactNode;
  /** 오류 메시지 — 있으면 invalid 상태가 되고 helperText를 대체한다 */
  errorText?: ReactNode;
}

/**
 * label/required/helper/error를 공통화하는 폼 래퍼 (05 문서 §3.0).
 * 자식 컨트롤(TextField 등)은 컨텍스트로 id·aria 속성을 받아 스스로 연결한다 —
 * 소비자가 id를 수동으로 만들 필요가 없다.
 */
export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, required = false, helperText, errorText, className, children, ...rest },
  ref,
) {
  const id = useId();
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const invalid = errorText != null;

  const describedBy = invalid ? errorId : helperText != null ? helperId : undefined;

  return (
    <div
      ref={ref}
      data-invalid={invalid ? "" : undefined}
      className={["ui-field", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {label != null && (
        <label className="ui-field-label" htmlFor={id}>
          {label}
          {required && (
            <span className="ui-field-required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <FieldContext value={{ id, describedBy, errorId, invalid, required }}>
        {children}
      </FieldContext>
      {helperText != null && !invalid && (
        <p className="ui-field-helper" id={helperId}>
          {helperText}
        </p>
      )}
      {invalid && (
        <p className="ui-field-error" id={errorId}>
          {errorText}
        </p>
      )}
    </div>
  );
});
