/**
 * 개발 전용 앰비언트 선언 — **배포 d.ts에 절대 포함되지 않는다**.
 *
 * `src/` 밖에 두는 이유(리뷰 M14): vite-plugin-dts는 `src`만 emit 대상으로 삼기 때문에,
 * 여기 선언한 `*.svg?react` 같은 번들러 전용 specifier가 소비자 d.ts로 새어 나가지 않는다.
 * 아이콘은 배럴에서 반드시 createIcon(React 컴포넌트 타입)으로 감싸 export 한다 — 배포 d.ts가
 * `?react` specifier를 직접 참조하는 순간 소비자 tsc가 해석에 실패한다.
 */

declare module "*.svg?react" {
  import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

  const ReactComponent: ForwardRefExoticComponent<
    SVGProps<SVGSVGElement> & RefAttributes<SVGSVGElement>
  >;
  export default ReactComponent;
}
