import "./styles/index.css";

// 상대 import는 항상 `.js` 확장자를 명시한다.
// 확장자를 생략하면 emit 된 d.ts도 확장자 없이 나가고, `moduleResolution: node16`을 쓰는
// 소비자에서 해석에 실패한다 (attw가 잡는 유형).
//
// hooks 배럴은 첫 실제 export(useControllableState)가 들어올 때 활성화한다 —
// 빈 모듈에 대한 `export *`는 import-x/export 에러다.
export * from "./components/index.js";
// export * from "./hooks/index.js";
export * from "./icons/index.js";
export * from "./tokens/index.js";
