import { expect, test } from "vitest";

import { edgeEnabledIndex, nextEnabledIndex } from "./enabledIndex.js";

const ITEMS = [{}, { disabled: true }, {}, {}];

test("edge: 방향별 첫 활성 인덱스", () => {
  expect(edgeEnabledIndex(ITEMS, 1)).toBe(0);
  expect(edgeEnabledIndex(ITEMS, -1)).toBe(3);
  expect(edgeEnabledIndex([{ disabled: true }, {}], 1)).toBe(1);
});

test("edge: 전부 비활성이거나 빈 목록이면 -1", () => {
  expect(edgeEnabledIndex([{ disabled: true }, { disabled: true }], 1)).toBe(-1);
  expect(edgeEnabledIndex([], 1)).toBe(-1);
  expect(edgeEnabledIndex([], -1)).toBe(-1);
});

test("next: disabled를 건너뛴다", () => {
  expect(nextEnabledIndex(ITEMS, 0, 1)).toBe(2); // 1은 비활성
  expect(nextEnabledIndex(ITEMS, 2, -1)).toBe(0);
});

test("next: 비순환은 끝에서 현재를 유지한다", () => {
  expect(nextEnabledIndex(ITEMS, 3, 1)).toBe(3);
  expect(nextEnabledIndex(ITEMS, 0, -1)).toBe(0);
});

test("next: wrap이면 반대쪽 끝으로 순환한다", () => {
  expect(nextEnabledIndex(ITEMS, 3, 1, { wrap: true })).toBe(0);
  expect(nextEnabledIndex(ITEMS, 0, -1, { wrap: true })).toBe(3);
  // 순환 중에도 비활성은 건너뛴다
  expect(nextEnabledIndex([{}, { disabled: true }], 0, 1, { wrap: true })).toBe(0);
});

test("next: 활성이 하나뿐이면 wrap이어도 제자리", () => {
  const single = [{ disabled: true }, {}, { disabled: true }];
  expect(nextEnabledIndex(single, 1, 1, { wrap: true })).toBe(1);
  expect(nextEnabledIndex(single, 1, -1, { wrap: true })).toBe(1);
});

test("next: 음수 시작점은 끝에서 다시 잡는다 (Select의 미선택 상태)", () => {
  expect(nextEnabledIndex(ITEMS, -1, 1)).toBe(0);
  expect(nextEnabledIndex(ITEMS, -1, -1)).toBe(3);
});

test("next: 범위를 넘은 시작점도 복구한다 (목록이 줄어든 뒤 이동 정지 방지)", () => {
  const shrunk = [{}];
  expect(nextEnabledIndex(shrunk, 5, 1)).toBe(0);
  expect(nextEnabledIndex(shrunk, 5, -1)).toBe(0);
});

test("next: 빈 목록은 -1", () => {
  expect(nextEnabledIndex([], 0, 1)).toBe(-1);
});
