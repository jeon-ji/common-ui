import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { docgenPlugin } from "./plugins/docgen";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const uiSrc = path.resolve(rootDir, "../../packages/ui/src");

export default defineConfig({
  // GitHub Pages 프로젝트 페이지 경로 (https://jeon-ji.github.io/common-ui/)
  base: "/common-ui/",
  plugins: [react(), docgenPlugin()],
  resolve: {
    // dev·docs 빌드는 dist가 아닌 ui 소스를 직접 본다 — 소스 수정이 즉시 반영된다.
    // exports 계약(디스트 해석)은 pack 스모크가 별도로 검증한다.
    alias: [
      {
        find: "@jeon-ji/common-ui/styles.css",
        replacement: path.join(uiSrc, "styles/index.css"),
      },
      { find: "@jeon-ji/common-ui/tokens", replacement: path.join(uiSrc, "tokens/index.ts") },
      { find: "@jeon-ji/common-ui", replacement: path.join(uiSrc, "index.ts") },
    ],
  },
});
