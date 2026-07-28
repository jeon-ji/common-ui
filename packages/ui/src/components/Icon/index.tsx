import {
  type ComponentPropsWithoutRef,
  type ComponentType,
  forwardRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type SVGProps,
} from "react";

export interface IconProps extends ComponentPropsWithoutRef<"svg"> {
  /**
   * 아이콘 한 변의 크기 (숫자는 px). 기본값 `1em` — 주변 폰트 크기를 따라간다.
   * @default "1em"
   */
  size?: number | string;
}

export type IconComponent = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

/**
 * SVG 모듈(`*.svg?react`)을 디자인 시스템 아이콘으로 감싸는 팩토리.
 *
 * - 색은 `currentColor` 상속 — 부모의 `color`가 곧 아이콘 색이다
 * - `aria-label`이 없으면 장식용으로 간주해 `aria-hidden`을 붙인다
 * - 배럴(src/icons)이 이 팩토리로 감싸 export 하므로 **배포 d.ts에 `?react`
 *   specifier가 노출되지 않는다** (리뷰 M14)
 */
export function createIcon(
  SvgComponent: ComponentType<SVGProps<SVGSVGElement> & RefAttributes<SVGSVGElement>>,
  displayName: string,
): IconComponent {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function IconImpl(
    { size = "1em", "aria-label": ariaLabel, ...rest },
    ref,
  ) {
    return (
      <SvgComponent
        ref={ref}
        width={size}
        height={size}
        role={ariaLabel ? "img" : undefined}
        aria-label={ariaLabel}
        aria-hidden={ariaLabel ? undefined : true}
        focusable={false}
        {...rest}
      />
    );
  });
  Icon.displayName = displayName;
  return Icon;
}
