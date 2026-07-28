import { copyFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

import { docgenPlugin } from "./plugins/docgen";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const uiSrc = path.resolve(rootDir, "../../packages/ui/src");

export default defineConfig({
  // GitHub Pages 프로젝트 페이지 경로 (https://jeon-ji.github.io/common-ui/)
  base: "/common-ui/",
  plugins: [
    react(),
    // ui 소스를 alias로 직접 보므로 svg?react 처리도 ui와 동일하게 필요하다
    svgr({ svgrOptions: { ref: true } }),
    docgenPlugin(),
    {
      // GitHub Pages는 SPA 딥링크에 404를 반환한다 — index.html을 404.html로 복제해
      // 새로고침/직접 진입에서도 라우터가 이어받게 한다
      name: "docs:spa-404-fallback",
      apply: "build",
      closeBundle() {
        copyFileSync(
          path.join(rootDir, "dist", "index.html"),
          path.join(rootDir, "dist", "404.html"),
        );
      },
    },
  ],
  resolve: {
    // dev·docs 빌드는 dist가 아닌 ui 소스를 직접 본다 — 소스 수정이 즉시 반영된다.
    // exports 계약(디스트 해석)은 pack 스모크가 별도로 검증한다.
    alias: [
      {
        find: "@jeon-ji/common-ui/styles.css",
        replacement: path.join(uiSrc, "styles/index.css"),
      },
      { find: "@jeon-ji/common-ui/hooks", replacement: path.join(uiSrc, "hooks/index.ts") },
      { find: "@jeon-ji/common-ui/icons", replacement: path.join(uiSrc, "icons/index.ts") },
      { find: "@jeon-ji/common-ui/tokens", replacement: path.join(uiSrc, "tokens/index.ts") },
      { find: "@jeon-ji/common-ui", replacement: path.join(uiSrc, "index.ts") },
    ],
  },
});
