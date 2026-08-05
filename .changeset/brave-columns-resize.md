---
"@jeon-ji/common-ui": minor
---

useColumnResize 추가 — 표 컬럼 폭 조절. `getHandleProps(key)`를 헤더의 핸들에 펼쳐 넣으면
드래그와 키보드 조작이 함께 붙는다. 핸들의 생김새는 소비자 몫이고 훅은 동작과 ARIA만 준다.

sije-common Table에 얽혀 있던 리사이즈 로직을 떼어내면서 원본의 결함을 구조로 배제했다:
`pointermove` 리스너를 **드래그당 한 번만** 등록하고(원본은 매 프레임 재등록) 종료·언마운트
양쪽에서 해제하며, `user-select: none`도 같은 자리에서 되돌린다. mouse가 아니라 포인터
이벤트를 써서 터치에서 동작하고, 이동은 `window`에서 들으므로 핸들이 도중에 사라져도
`pointerup`을 놓치지 않는다. `storageKey`가 **없으면 localStorage에 아무것도 쓰지 않고**,
쓸 때도 `@jeon-ji/common-ui:table:<storageKey>`로 네임스페이스를 붙여 화면끼리 폭을 덮어쓰지
않는다. 저장값은 렌더가 아니라 이펙트에서 읽어 SSR에서 안전하다. 핸들은
`role="separator"` + `tabIndex=0`이라 좌우 화살표로도 조절된다.
