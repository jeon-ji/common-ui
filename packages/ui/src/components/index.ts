/**
 * 컴포넌트 배럴 — 컴포넌트와 **Props 타입을 함께** export 한다 (전역 규칙 8).
 * 내부 모듈은 이 배럴을 역참조하지 않는다. 항상 직접 경로로 import 한다 (전역 규칙 17).
 */

export { Sample, type SampleProps } from "./Sample/index.js";
