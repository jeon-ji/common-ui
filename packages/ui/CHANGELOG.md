# @jeon-ji/common-ui

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
