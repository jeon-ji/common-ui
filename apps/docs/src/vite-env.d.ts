/// <reference types="vite/client" />

/** plugins/docgen.ts — Props 자동 API 표 데이터 */
declare module "*?docgen" {
  import type { DocgenEntry } from "./components/PropsTable";

  const docs: DocgenEntry[];
  export default docs;
}
