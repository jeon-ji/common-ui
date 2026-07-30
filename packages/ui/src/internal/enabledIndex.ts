/**
 * 목록형 위젯(Select·Menu·Tabs)의 "비활성 건너뛰며 다음 인덱스" 계산 — 내부 전용.
 *
 * 같은 로직이 컴포넌트마다 조금씩 다르게 복제되던 것을 하나로 모았다(리뷰의 병렬 구현형 중복).
 * 순환(wrap)만 옵션으로 갈린다 — 콤보박스·메뉴는 끝에서 멈추고, WAI-ARIA 탭은 순환한다.
 */

export interface DisableableItem {
  disabled?: boolean;
}

/** direction 쪽 끝에서 첫 활성 인덱스 — 전부 비활성이거나 빈 목록이면 -1 */
export function edgeEnabledIndex<T extends DisableableItem>(items: T[], direction: 1 | -1): number {
  for (let i = direction === 1 ? 0 : items.length - 1; i >= 0 && i < items.length; i += direction) {
    if (items[i]?.disabled !== true) return i;
  }
  return -1;
}

export function nextEnabledIndex<T extends DisableableItem>(
  items: T[],
  from: number,
  direction: 1 | -1,
  options: { wrap?: boolean } = {},
): number {
  if (items.length === 0) return -1;
  // 범위 밖 시작점(목록이 줄어든 뒤 등)은 끝에서 다시 잡는다 — 그러지 않으면 이동이 멈춘다
  if (from < 0 || from >= items.length) return edgeEnabledIndex(items, direction);

  for (let i = from + direction; i >= 0 && i < items.length; i += direction) {
    if (items[i]?.disabled !== true) return i;
  }

  if (options.wrap === true) {
    // 끝에 닿았으니 반대쪽 끝에서 같은 방향으로 다시 — 활성이 자기뿐이면 제자리
    const wrapped = edgeEnabledIndex(items, direction);
    return wrapped >= 0 ? wrapped : from;
  }
  return from; // 비순환: 끝에서 현재 유지
}
