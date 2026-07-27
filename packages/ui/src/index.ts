import "./styles/index.css";

// 상대 import는 항상 `.js` 확장자를 명시한다.
// 확장자를 생략하면 emit 된 d.ts도 확장자 없이 나가고, `moduleResolution: node16`을 쓰는
// 소비자에서 해석에 실패한다 (attw가 잡는 유형).
export * from "./components/index.js";
export * from "./hooks/index.js";
export * from "./tokens/index.js";
