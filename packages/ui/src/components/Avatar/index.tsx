import "./Avatar.css";

import { type ComponentPropsWithoutRef, forwardRef, type ReactNode, useState } from "react";

import { initials } from "./initials.js";

export interface AvatarProps extends ComponentPropsWithoutRef<"span"> {
  /** 이미지 주소 — 없거나 로드에 실패하면 폴백을 그린다 */
  src?: string;
  /**
   * 접근 이름. **비우면 장식으로 취급**한다(보조기술에 노출하지 않음) —
   * 옆에 이름 텍스트가 이미 있으면 비워 두어 같은 이름이 두 번 낭독되는 것을 막는다.
   * 아바타만으로 사람을 식별해야 하는 자리에서는 반드시 채운다.
   * @default ""
   */
  alt?: string;
  /** 이니셜 계산에 쓸 이름 — **접근 이름이 아니다**(낭독은 `alt`가 담당한다) */
  name?: string;
  /**
   * 크기 프리셋
   * @default "md"
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * 모양
   * @default "circle"
   */
  shape?: "circle" | "square";
  /** 이니셜 대신 그릴 폴백 내용 (아이콘 등) */
  children?: ReactNode;
  /** `srcSet`·`loading`·`crossOrigin` 등 img 전용 속성 전달용 이스케이프 해치 */
  imgProps?: Omit<ComponentPropsWithoutRef<"img">, "src" | "alt" | "onError">;
}

/**
 * 사용자·엔티티를 나타내는 작은 이미지. 이미지가 없거나 실패하면 이니셜로 대체한다.
 *
 * - **폴백을 항상 깔아 두고 이미지를 그 위에 겹친다.** `onLoad`로 "로드 완료" 상태를 만들지
 *   않는다 — 캐시된 이미지는 React가 핸들러를 붙이기 전에 이미 완료돼 `onLoad`가 오지 않을 수
 *   있고, 그러면 이미지가 영영 숨겨진다. 상태는 **실패 하나**뿐이다
 * - 접근 이름은 `<img alt>`가 아니라 루트의 `role="img"`+`aria-label`에 둔다 — 이미지가
 *   실패해도 이름이 사라지지 않고, `role="img"`는 하위 트리를 하나의 이미지로 취급하므로
 *   이니셜과 이미지가 따로 읽히지도 않는다
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt = "", name, size = "md", shape = "circle", className, children, imgProps, ...rest },
  ref,
) {
  // 실패한 src 자체를 담는다 — src가 바뀌면 값이 달라지므로 실패 상태가 저절로 풀린다
  // (별도의 리셋 이펙트가 없어 폴백이 한 프레임 깜빡이는 일도 없다)
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const imageSrc = src !== undefined && src !== "" && failedSrc !== src ? src : null;
  const fallback = children ?? (name === undefined ? null : initials(name));
  const labelled = alt !== "";

  return (
    <span
      ref={ref}
      className={["ui-avatar", className].filter(Boolean).join(" ")}
      data-size={size}
      data-shape={shape}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? alt : undefined}
      {...rest}
    >
      {/* 폴백은 언제나 장식이다 — 이름은 위에서 이미 결정됐다 */}
      <span className="ui-avatar-fallback" aria-hidden="true">
        {fallback}
      </span>
      {imageSrc !== null && (
        <img
          {...imgProps}
          className={["ui-avatar-img", imgProps?.className].filter(Boolean).join(" ")}
          src={imageSrc}
          alt=""
          onError={() => {
            setFailedSrc(imageSrc);
          }}
        />
      )}
    </span>
  );
});
