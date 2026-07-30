import { expect, test } from "vitest";

import { computePosition, type RectLike } from "./computePosition.js";

/** 가짜 rect 생성 — jsdom rect=0에 의존하지 않고 픽셀 단위로 검증한다 */
function rect(left: number, top: number, width: number, height: number): RectLike {
  return { left, top, width, height, right: left + width, bottom: top + height };
}

const viewport = { width: 1000, height: 800 };

test("top 배치: 공간이 있으면 앵커 위 offset 간격, center 정렬", () => {
  const result = computePosition(rect(400, 300, 200, 40), rect(0, 0, 100, 50), {
    side: "top",
    align: "center",
    offset: 6,
    viewport,
  });
  expect(result).toEqual({ top: 244, left: 450, side: "top" }); // 300-50-6, 400+100-50
});

test("bottom 배치: 앵커 아래 offset 간격", () => {
  const result = computePosition(rect(400, 300, 200, 40), rect(0, 0, 100, 50), {
    side: "bottom",
    align: "center",
    offset: 6,
    viewport,
  });
  expect(result).toEqual({ top: 346, left: 450, side: "bottom" }); // 340+6
});

test("left/right 배치: 주축이 가로, 교차축 정렬은 세로", () => {
  const anchor = rect(400, 300, 200, 40);
  const floating = rect(0, 0, 100, 50);
  expect(
    computePosition(anchor, floating, { side: "left", align: "center", offset: 6, viewport }),
  ).toEqual(
    { top: 295, left: 294, side: "left" }, // top: 300+20-25, left: 400-100-6
  );
  expect(
    computePosition(anchor, floating, { side: "right", align: "center", offset: 6, viewport }),
  ).toEqual(
    { top: 295, left: 606, side: "right" }, // left: 600+6
  );
});

test("align start/end: 교차축이 앵커 시작/끝 모서리에 맞는다", () => {
  const anchor = rect(400, 300, 200, 40);
  const floating = rect(0, 0, 100, 50);
  expect(
    computePosition(anchor, floating, { side: "bottom", align: "start", offset: 6, viewport }),
  ).toMatchObject({ left: 400 });
  expect(
    computePosition(anchor, floating, { side: "bottom", align: "end", offset: 6, viewport }),
  ).toMatchObject({ left: 500 }); // 400+200-100
});

test("플립: 선호 방향이 안 들어가고 반대편이 들어가면 반대편으로", () => {
  // 앵커가 상단에 붙어 있어 top(30-50-6<0)은 불가 — bottom으로 플립
  const result = computePosition(rect(400, 30, 200, 40), rect(0, 0, 100, 50), {
    side: "top",
    align: "center",
    offset: 6,
    viewport,
  });
  expect(result.side).toBe("bottom");
  expect(result.top).toBe(76); // 70+6
});

test("폴백: 위아래 다 안 들어가고 공간이 같으면 선호 방향을 유지한다", () => {
  const small = { width: 1000, height: 100 };
  const anchor = rect(400, 40, 200, 20); // top 공간 40, bottom 공간 40 — 둘 다 56 필요
  const floating = rect(0, 0, 100, 50);
  expect(
    computePosition(anchor, floating, { side: "top", align: "center", offset: 6, viewport: small })
      .side,
  ).toBe("top");
  expect(
    computePosition(anchor, floating, {
      side: "bottom",
      align: "center",
      offset: 6,
      viewport: small,
    }).side,
  ).toBe("bottom");
});

test("폴백: 위아래 다 안 들어가면 남은 공간이 더 큰 쪽을 고른다", () => {
  const short = { width: 1000, height: 300 };
  const anchor = rect(400, 250, 120, 20); // 위 공간 250, 아래 공간 30
  const tall = rect(0, 0, 200, 330); // 어느 쪽에도 안 들어가는 높이
  // bottom 선호였어도 거의 다 잘리는 아래 대신 위를 고른다
  const result = computePosition(anchor, tall, {
    side: "bottom",
    align: "start",
    offset: 6,
    viewport: short,
  });
  expect(result.side).toBe("top");
  expect(result.top).toBe(-86); // 250-330-6 — 위쪽이 잘리지만 보이는 면적이 훨씬 크다
});

test("폴백: 좌우 다 안 들어가면 남은 공간이 더 큰 쪽", () => {
  const narrow = { width: 200, height: 800 };
  const anchor = rect(150, 300, 20, 40); // 왼쪽 공간 150, 오른쪽 공간 30
  const wide = rect(0, 0, 180, 50);
  expect(
    computePosition(anchor, wide, { side: "right", align: "center", offset: 6, viewport: narrow })
      .side,
  ).toBe("left");
});

test("clamp: 교차축이 뷰포트를 벗어나면 안쪽으로 클램핑된다", () => {
  const floating = rect(0, 0, 100, 50);
  // 앵커가 왼쪽 끝 — center 정렬이면 left가 음수로 튀는 자리
  const atLeft = computePosition(rect(0, 300, 20, 40), floating, {
    side: "bottom",
    align: "center",
    offset: 6,
    viewport,
    clamp: true,
  });
  expect(atLeft.left).toBe(0); // -40 → 0
  // 앵커가 오른쪽 끝
  const atRight = computePosition(rect(980, 300, 20, 40), floating, {
    side: "bottom",
    align: "center",
    offset: 6,
    viewport,
    clamp: true,
  });
  expect(atRight.left).toBe(900); // 950 → 1000-100
});

test("clamp 없으면 교차축 이탈을 그대로 둔다 (Tooltip 현행 동작)", () => {
  const result = computePosition(rect(0, 300, 20, 40), rect(0, 0, 100, 50), {
    side: "bottom",
    align: "center",
    offset: 6,
    viewport,
  });
  expect(result.left).toBe(-40);
});
