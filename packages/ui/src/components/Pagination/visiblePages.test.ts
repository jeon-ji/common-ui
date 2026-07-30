import { expect, test } from "vitest";

import { visiblePages } from "./visiblePages.js";

const DEFAULTS = { siblings: 1, boundaries: 1 };

test("total이 0 이하면 빈 목록", () => {
  expect(visiblePages({ total: 0, page: 1, ...DEFAULTS })).toEqual([]);
  expect(visiblePages({ total: -3, page: 1, ...DEFAULTS })).toEqual([]);
});

test("전부 들어가면 생략 없이 나열한다", () => {
  expect(visiblePages({ total: 7, page: 4, ...DEFAULTS })).toEqual([1, 2, 3, 4, 5, 6, 7]);
});

test("현재가 앞쪽이면 뒤쪽만 생략한다 (슬롯 폭은 유지)", () => {
  // 끝에 붙어도 가운데 묶음 크기가 줄지 않아 버튼 개수가 흔들리지 않는다
  expect(visiblePages({ total: 20, page: 2, ...DEFAULTS })).toEqual([
    1,
    2,
    3,
    4,
    5,
    "ellipsis",
    20,
  ]);
});

test("현재가 뒤쪽이면 앞쪽만 생략한다 (슬롯 폭은 유지)", () => {
  expect(visiblePages({ total: 20, page: 19, ...DEFAULTS })).toEqual([
    1,
    "ellipsis",
    16,
    17,
    18,
    19,
    20,
  ]);
});

test("현재가 가운데면 양쪽을 생략한다", () => {
  expect(visiblePages({ total: 20, page: 10, ...DEFAULTS })).toEqual([
    1,
    "ellipsis",
    9,
    10,
    11,
    "ellipsis",
    20,
  ]);
});

test("생략 자리에 페이지가 하나뿐이면 생략 대신 그 페이지를 그린다", () => {
  // total 8, page 4: 왼쪽 빈칸은 2 하나뿐이라 생략 기호가 페이지 하나를 감추는 낭비다
  expect(visiblePages({ total: 8, page: 4, ...DEFAULTS })).toEqual([1, 2, 3, 4, 5, "ellipsis", 8]);
});

test("양쪽 빈칸이 두 칸 이상이면 둘 다 생략한다", () => {
  expect(visiblePages({ total: 9, page: 5, ...DEFAULTS })).toEqual([
    1,
    "ellipsis",
    4,
    5,
    6,
    "ellipsis",
    9,
  ]);
});

test("범위를 벗어난 page는 클램프해서 계산한다", () => {
  expect(visiblePages({ total: 20, page: 0, ...DEFAULTS })).toEqual(
    visiblePages({ total: 20, page: 1, ...DEFAULTS }),
  );
  expect(visiblePages({ total: 20, page: 99, ...DEFAULTS })).toEqual(
    visiblePages({ total: 20, page: 20, ...DEFAULTS }),
  );
});

test("siblings=0이면 현재 페이지만 가운데 남는다", () => {
  expect(visiblePages({ total: 20, page: 10, siblings: 0, boundaries: 1 })).toEqual([
    1,
    "ellipsis",
    10,
    "ellipsis",
    20,
  ]);
});

test("boundaries=0이면 첫·끝 페이지를 안 보여주므로 생략 기호도 없다", () => {
  // 가릴 대상이 없는데 생략 기호를 넣으면 허공을 가리킨다
  expect(visiblePages({ total: 10, page: 5, siblings: 1, boundaries: 0 })).toEqual([4, 5, 6]);
  expect(visiblePages({ total: 10, page: 1, siblings: 1, boundaries: 0 })).not.toContain(
    "ellipsis",
  );
});

test("boundaries를 늘리면 양 끝이 넓어진다", () => {
  expect(visiblePages({ total: 30, page: 15, siblings: 1, boundaries: 2 })).toEqual([
    1,
    2,
    "ellipsis",
    14,
    15,
    16,
    "ellipsis",
    29,
    30,
  ]);
});

test("생략 기호는 최대 2개, 페이지 번호는 중복되지 않고 오름차순이다", () => {
  for (const page of [1, 2, 5, 12, 19, 20]) {
    const slots = visiblePages({ total: 20, page, ...DEFAULTS });
    const numbers = slots.filter((slot): slot is number => typeof slot === "number");
    expect(slots.filter((slot) => slot === "ellipsis").length).toBeLessThanOrEqual(2);
    expect(new Set(numbers).size).toBe(numbers.length);
    expect([...numbers].sort((a, b) => a - b)).toEqual(numbers);
    expect(numbers).toContain(page); // 현재 페이지는 항상 보인다
  }
});
