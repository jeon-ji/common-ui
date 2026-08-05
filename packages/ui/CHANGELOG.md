# @jeon-ji/common-ui

## 0.3.0

### Minor Changes

- ee05357: `Table` 추가 — **표시만 담당하는 표**. 정렬·필터·페이징 로직은 소비 앱이 소유하고, Table은
  `rows`를 받은 순서 그대로 그린다.

  - `columns`의 `render`가 **필수**다. `row[key]`를 자동으로 그리지 않으므로 컬럼 key가 데이터
    필드에 묶이지 않고, 합계·배지·버튼 같은 파생 컬럼도 예외 없이 같은 방식으로 만든다
  - 정렬은 `sort`/`onSortChange` **제어형**이다. Table은 `aria-sort` 표시와 변경 통지만 하므로
    클라이언트 정렬을 서버 정렬로 갈아 끼워도 표 쪽은 그대로다
  - 빈 상태는 슬롯(`empty`)이라 `EmptyState`를 원하는 문구로 넣는다. 로딩(`loading`)은 Skeleton
    행을 그리고 `aria-busy`를 붙인다 — 데이터·로딩·빈 상태 중 하나만 보인다
  - 고정 헤더(`stickyHeader`)와 고정 컬럼(`column.sticky`)을 지원한다. **스크롤될 여지는 CSS
    변수로 정한다** — 고정 헤더에는 `--ui-table-max-height`, 고정 컬럼에는 `--ui-table-min-width`가
    필요하다(없으면 표가 컨테이너에 맞춰 줄어들 뿐 스크롤이 생기지 않는다)
  - 행 선택은 `useTableSelection`, 컬럼 폭은 `useColumnResize`를 `selection`·`columns`에 연결한다

  **하지 않는 것**(범위 밖으로 결정한 것이지 미구현이 아니다): `role="grid"` 방향키 셀 이동 —
  정적 데이터 표시가 범위이고 행 안의 버튼·체크박스·링크는 각자 네이티브 탭 스톱이다. 그 밖에
  가상화, 페이지네이션 내장, 컬럼 재정렬, 확장 행, 트리 테이블, 셀 편집, 다단 헤더.

- 72d35fe: `useTableSelection` 추가 — 표 행 선택 상태. 반환값을 `Table`의 `selection` prop에 그대로
  넘기면 맨 앞에 체크박스 열이 생긴다. 훅은 상태와 헬퍼만 돌려주고 체크박스는 Table이 그린다.

  가장 중요한 계약은 **`keys`의 의미**다. `keys`는 전체 데이터가 아니라 **지금 화면에 있는 행**이고,
  여기서 세 가지가 따라온다.

  - **화면을 벗어난 선택을 자동으로 지우지 않는다.** 필터·페이지 이동으로 `keys`에서 빠진 행의
    선택이 유지되므로 "3페이지에서 고른 항목이 4페이지에 다녀오면 사라지는" 일이 없다
  - **`allState`와 `toggleAll`의 범위는 언제나 현재 `keys`다.** 선택은 누적되지만 헤더 체크박스는
    지금 보이는 행만 보고 상태를 정한다. 일부만 선택되면 `aria-checked="mixed"`로 읽힌다
  - 화면 밖 선택까지 비우는 것은 `clear()` 하나뿐이다

  `disabledKeys`의 행은 `toggle`·`toggleAll`이 건드리지 않고 `allState` 계산에서도 빠진다 —
  분모에 두면 더 고를 수 없는데도 헤더가 영원히 "일부 선택"에 머문다. 제어(`value`/`onChange`)와
  비제어(`defaultValue`) 모두 지원한다.

- 059e9a8: `useColumnResize` 추가 — 표 컬럼 폭 조절. `getHandleProps(key)`가 돌려주는 props를 헤더의 핸들
  요소에 펼쳐 넣으면 드래그와 키보드 조작이 함께 붙는다. **핸들의 생김새는 소비자 몫**이고 훅은
  동작과 ARIA만 준다.

  - **터치에서 동작한다.** 포인터 이벤트를 쓰고 포인터를 캡처하므로 커서가 창 밖으로 나가도
    드래그를 놓치지 않는다
  - **키보드로도 조절된다.** 핸들은 `role="separator"` + `tabIndex=0`이고 좌우 화살표가 폭을
    바꾼다. `handleLabel`로 컬럼을 식별할 수 있는 이름을 준다
  - **`storageKey`가 없으면 localStorage에 아무것도 쓰지 않는다.** 쓸 때도
    `@jeon-ji/common-ui:table:<storageKey>`로 네임스페이스를 붙이므로 화면끼리 폭을 덮어쓰지 않고,
    저장은 폭이 바뀐 뒤에만 일어나 첫 마운트가 기존 값을 지우지 않는다
  - **SSR에서 안전하다.** 저장값을 렌더 단계가 아니라 이펙트에서 읽는다
  - 드래그 중 컴포넌트가 언마운트되거나 `columnKeys`에서 그 컬럼이 사라져도 리스너와
    `user-select: none`이 남지 않고, 포커스가 표로 돌아간다

  `storageKey`는 **폭 저장 전용**이다 — 컬럼 순서 재정렬 UI가 없으므로 순서는 저장하지 않는다.

## 0.2.0

### Minor Changes

- 9750014: Avatar 추가 — 이미지가 없거나 실패하면 이름에서 만든 이니셜로 대체한다. 접근 이름은 `alt`가 담당하고(비우면 장식) `name`은 표시용이라, 이름 텍스트가 옆에 있는 흔한 배치에서 같은 이름이 두 번 낭독되지 않는다. 이미지 로드 실패와 무관하게 접근 이름이 유지되며, `src`를 바꾸면 실패 상태가 풀린다. size 5종 × shape 2종
- bd389ac: EmptyState 추가 — 결과가 없거나(`status="empty"`) 불러오지 못한(`status="error"`) 자리의 표시. 제목·설명·아이콘·액션 슬롯을 갖고, 액션은 콜백이 아니라 버튼을 그대로 넣는다. 기본으로는 `role`·`aria-live`를 붙이지 않는다 — 검색·필터처럼 사용자 조작의 결과로 바뀌는 자리에서만 `role="status"`를 넘기면 된다
- 862fd14: Menu 추가 — Popover 조합 드롭다운 메뉴, role="menu" + aria-activedescendant 키보드 내비, 트리거 aria 자동 주입, disabled/danger 항목
- b1c478e: Pagination 추가 — 훅이 아닌 컴포넌트(리마운트로 입력 상태가 날아가던 usePagination 재설계), aria-current="page" + 버튼 기반 키보드 조작, 생략 기호 계산 유틸, NumberField 재사용 페이지 직접 입력
- 95d2241: Popover 추가 — anchorRef 기준 배치(플립·클램핑·스크롤 추적), 오버레이 스택 Escape 소유권, 바깥 클릭 닫힘, non-modal 포커스 규약
- 27c0f67: SegmentedControl 추가 — radiogroup/radio 시맨틱 + roving tabindex, 화살표 순환 이동=선택, 주입형 아이콘(도메인 아이콘 하드코딩 배제), iconOnly에서도 접근 이름 유지
- 82d3662: Tabs 추가 — tablist/tab/tabpanel 시맨틱 + roving tabindex, 좌우 화살표 순환 이동(disabled 건너뜀), 활성 패널만 마운트, 제어/비제어 지원

### Patch Changes

- da7cff9: M3 리뷰 결함 수정 — Tabs·SegmentedControl에서 활성/선택 값이 disabled 항목이면 키보드 진입이 불가했던 문제, items가 비동기로 도착하면 기본 활성 항목이 정해지지 않던 문제, Pagination의 입력 커밋이 페이지 버튼 클릭을 삼키던 문제·소수 페이지 값·양 끝 버튼 포커스 유실·목록 시맨틱·중복 낭독. 아울러 Select는 열린 목록의 항목이 줄어도 화살표 이동이 멈추지 않는다(공용 인덱스 유틸 통합의 부수 효과)
- 6a649bd: Toast를 키보드로 닫을 때 포커스가 사라지던 문제 수정 — 닫은 토스트가 언마운트되면서 포커스가 body로 떨어져 키보드 사용자가 위치를 잃었다. 이제 다음 토스트의 닫기 버튼으로, 마지막 하나였다면 알림 영역에 들어오기 전 요소로 포커스를 넘긴다. 아울러 자동 닫힘은 hover뿐 아니라 **포커스 중에도** 멈춘다(조작하려던 버튼이 발밑에서 사라지지 않게). Select의 열린 목록에는 접근 이름이 없어 "목록 상자"로만 읽혔는데, Field 안이면 그 라벨을, 단독 사용이면 트리거의 이름을 물려받는다
- 98289be: 모달 안에서 열리는 오버레이(Popover·Menu·Tooltip)를 모달 패널 서브트리로 포털해 `aria-modal="true"` 밖으로 새지 않게 수정 — 스크린리더 도달성 확보

## 0.1.0

### Minor Changes

- 98f788d: v0.1.0 — 필수 컴포넌트 16종과 훅 4종의 첫 릴리스

  - 기반: Portal, Icon 시스템(13종), Text/Heading, Spinner, Skeleton
  - 버튼: Button(variant×tone×size), IconButton(aria-label 필수)
  - 폼: Field, TextField, NumberField, Textarea, Checkbox, Radio/RadioGroup, Switch, Select(단일/다중)
  - 오버레이: Modal(+OverlayProvider), ConfirmModal, Toast(+useToast), Tooltip
  - 표시: Badge, Tag
  - 훅: useControllableState, useDisclosure, useClickOutside, useToast
  - 디자인 토큰 단일 소스(semantic CSS 변수 + 다크 테마) 및 Tailwind v4 preset

## 0.1.0-next.0

### Minor Changes

- 98f788d: v0.1.0 — 필수 컴포넌트 16종과 훅 4종의 첫 릴리스

  - 기반: Portal, Icon 시스템(13종), Text/Heading, Spinner, Skeleton
  - 버튼: Button(variant×tone×size), IconButton(aria-label 필수)
  - 폼: Field, TextField, NumberField, Textarea, Checkbox, Radio/RadioGroup, Switch, Select(단일/다중)
  - 오버레이: Modal(+OverlayProvider), ConfirmModal, Toast(+useToast), Tooltip
  - 표시: Badge, Tag
  - 훅: useControllableState, useDisclosure, useClickOutside, useToast
  - 디자인 토큰 단일 소스(semantic CSS 변수 + 다크 테마) 및 Tailwind v4 preset
