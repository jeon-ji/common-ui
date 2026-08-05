---
"@jeon-ji/common-ui": minor
---

useTableSelection 추가 — 표 행 선택 상태. `Table`의 `selection` prop에 그대로 넘기면 체크박스
열이 생긴다. 훅이 체크박스 UI까지 만들던 sije-common `useCheckbox`를 흡수하면서 방향을
뒤집었다: 훅은 상태와 헬퍼만 돌려주고 렌더는 Table이 한다.

**`keys`가 바뀌어도 사라진 키를 선택에서 걷어내지 않는다.** 필터·페이지 이동으로 화면을 벗어난
행의 선택을 자동으로 지우면 "3페이지에서 고른 항목이 4페이지에 다녀오면 사라지는" 동작이 된다.
대신 `allState`와 `toggleAll`의 범위는 **언제나 현재 `keys`**라 헤더 체크박스는 지금 보이는
화면을 정확히 말하고, 화면 밖 선택까지 비우는 것은 `clear()` 하나뿐이다. `disabledKeys`는
`allState`의 분모에서도 빠진다 — 넣어 두면 더 고를 수 없는데도 헤더가 영원히 "일부 선택"에 머문다.
