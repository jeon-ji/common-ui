/**
 * 첫 글자를 **코드포인트 단위**로 가져온다.
 *
 * `text[0]`은 서로게이트 페어(이모지·일부 한자)를 반으로 잘라 깨진 문자를 만든다.
 * ZWJ로 결합된 이모지 시퀀스까지는 다루지 않는다 — 이름에 결합 이모지를 쓰는 경우는
 * 이 컴포넌트의 요구가 아니라서 `Intl.Segmenter`를 들이지 않았다.
 */
function firstCodePoint(text: string): string {
  return Array.from(text)[0] ?? "";
}

/**
 * 표시할 이니셜을 만든다 — 계산할 수 없으면 빈 문자열이다.
 *
 * - 공백으로 나눈 토큰이 2개 이상: 첫 토큰 + 마지막 토큰의 첫 글자 (`"Ada Lovelace"` → `"AL"`)
 * - 1개: 첫 글자 하나 (`"전지현"` → `"전"`, `"ada"` → `"A"`)
 *
 * 한국어 이름을 "성+이름 두 글자"로 자르는 예외는 두지 않는다 — 복성이나 비한국어 단일
 * 토큰에서 곧바로 무너진다. 언어와 무관하게 같은 규칙을 쓰는 쪽이 예측 가능하다.
 */
export function initials(name: string): string {
  const [head, ...rest] = name.split(/\s+/).filter(Boolean);
  if (head === undefined) return "";

  const tail = rest.at(-1);
  const first = firstCodePoint(head);
  if (tail === undefined) return first.toUpperCase();

  return (first + firstCodePoint(tail)).toUpperCase();
}
