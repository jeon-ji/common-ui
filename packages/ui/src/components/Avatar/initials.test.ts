import { expect, test } from "vitest";

import { initials } from "./initials.js";

test("빈 이름·공백만 있으면 빈 문자열", () => {
  expect(initials("")).toBe("");
  expect(initials("   ")).toBe("");
  expect(initials("\t\n")).toBe("");
});

test("토큰 1개는 첫 글자 하나", () => {
  expect(initials("전지현")).toBe("전");
  expect(initials("ada")).toBe("A");
});

test("토큰 2개 이상은 첫 토큰 + 마지막 토큰의 첫 글자", () => {
  expect(initials("Ada Lovelace")).toBe("AL");
  expect(initials("Grace Brewster Murray Hopper")).toBe("GH");
});

test("앞뒤·중간 공백과 탭·개행을 구분자로 처리한다", () => {
  expect(initials("  Ada   Lovelace  ")).toBe("AL");
  expect(initials("Ada\tLovelace")).toBe("AL");
  expect(initials("Ada\nLovelace")).toBe("AL");
});

test("서로게이트 페어를 반으로 자르지 않는다", () => {
  // text[0]으로 자르면 페어의 앞쪽 절반만 남아 깨진 문자가 나온다
  expect(initials("🙂 Lee")).toBe("🙂L");
  expect(initials("𠮷田")).toBe("𠮷");
});

test("대문자화는 라틴 문자에만 영향을 준다", () => {
  expect(initials("ada lovelace")).toBe("AL");
  expect(initials("김하늘")).toBe("김");
});
