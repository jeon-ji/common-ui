/**
 * 컴포넌트 배럴 — 컴포넌트와 **Props 타입을 함께** export 한다 (전역 규칙 8).
 * 내부 모듈은 이 배럴을 역참조하지 않는다. 항상 직접 경로로 import 한다 (전역 규칙 17).
 */

export { Button, type ButtonProps } from "./Button/index.js";
export { Field, type FieldProps } from "./Field/index.js";
export { createIcon, type IconComponent, type IconProps } from "./Icon/index.js";
export { IconButton, type IconButtonProps } from "./IconButton/index.js";
export { Portal, type PortalProps } from "./Portal/index.js";
export { Sample, type SampleProps } from "./Sample/index.js";
export { Skeleton, type SkeletonProps } from "./Skeleton/index.js";
export { Spinner, type SpinnerProps } from "./Spinner/index.js";
export { Heading, type HeadingProps, Text, type TextProps } from "./Text/index.js";
export { TextField, type TextFieldProps } from "./TextField/index.js";
