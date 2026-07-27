import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import svgr from "vite-plugin-svgr";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(rootDir, "src");

/** 빌드에서 제외할 파일 — 테스트는 컴포넌트 폴더에 co-locate 하되 배포물에는 넣지 않는다. */
const EXCLUDED = /\.(test|spec)\.[cm]?[jt]sx?$/;

/**
 * `src` 전체를 파일 단위 엔트리로 수집한다. `preserveModules`와 함께 쓰여
 * 소비자가 import 한 모듈만 번들에 들어가도록(트리셰이킹) 보장한다.
 */
function collectEntries(dir: string, entries: Record<string, string> = {}) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);

    if (statSync(full).isDirectory()) {
      collectEntries(full, entries);
      continue;
    }
    if (!/\.[jt]sx?$/.test(name) || name.endsWith(".d.ts") || EXCLUDED.test(name)) continue;

    // 경로 구분자 정규화 — 이게 없으면 Windows에서 엔트리명이 `components\Button`이 된다 (리뷰 M9)
    const entryName = path
      .relative(srcDir, full)
      .replace(/\.[jt]sx?$/, "")
      .split(path.sep)
      .join("/");

    entries[entryName] = full;
  }

  return entries;
}

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    dts({
      tsconfigPath: path.join(rootDir, "tsconfig.lib.json"),
      entryRoot: srcDir,
      include: ["src"],
      exclude: ["src/**/*.test.*", "src/**/*.spec.*"],
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // 모든 CSS를 dist/style.css 하나로 — 소비자는 `@jeon-ji/common-ui/styles.css` 한 줄만 import 한다
    cssCodeSplit: false,
    minify: false,
    // 소스맵 파일은 남기되 참조 주석은 제거한다. 주석이 있으면 소비자 번들러가
    // 원본 소스를 찾지 못해 경고를 쏟고, inline 으로 두면 패키지가 2배가 된다 (리뷰 M20)
    sourcemap: "hidden",
    lib: {
      entry: collectEntries(srcDir),
      formats: ["es"],
      // exports 계약의 `./styles.css` → `./dist/style.css` 와 파일명을 일치시킨다.
      // 기본값은 패키지명(common-ui.css)이라 계약이 조용히 깨진다.
      cssFileName: "style",
    },
    rollupOptions: {
      // bare specifier는 전부 external — 런타임 의존성 0 원칙(전역 규칙 4)의 빌드측 강제
      external: (id) => !id.startsWith(".") && !id.startsWith("\0") && !path.isAbsolute(id),
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});
