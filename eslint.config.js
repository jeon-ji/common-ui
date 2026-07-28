import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import { flatConfigs as importX } from "eslint-plugin-import-x";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import { config as defineConfig, configs as tseslint } from "typescript-eslint";

/**
 * 게이트는 처음부터 전부 켠다.
 * 나중에 켜면 위반이 수백 건 쌓여 영영 못 켠다 — sije-common의 exhaustive-deps 40건 방치가 그 결과다.
 */
export default defineConfig(
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/.tmp/**", "**/coverage/**"],
  },

  js.configs.recommended,
  // type-aware 규칙 — recommended만 켜면 타입을 아는 검사(floating promise 등)를 전부 놓친다 (리뷰 M10)
  tseslint.recommendedTypeChecked,
  importX.recommended,
  importX.typescript,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.browser,
    },
    settings: {
      "import-x/resolver-next": [
        createTypeScriptImportResolver({
          project: ["packages/*/tsconfig.*.json", "apps/*/tsconfig.json"],
        }),
      ],
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "no-console": "error",

      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // 배럴 역참조 구조 차단 (전역 규칙 17 / 리뷰 A1)
      "import-x/no-cycle": ["error", { maxDepth: Infinity, ignoreExternal: true }],

      // TS가 이미 export 형태를 검증한다 — 이 규칙은 vite 쿼리 import(?raw/?docgen/?react)를
      // 실파일로 해석해 오탐만 낸다
      "import-x/default": "off",
    },
  },

  // 데모 페이지는 같은 파일을 렌더용 + ?raw 소스용으로 두 번 import 하는 것이 표준 패턴
  {
    files: ["apps/docs/**/*.{ts,tsx}"],
    rules: {
      "import-x/no-duplicates": "off",
    },
  },

  // 배럴·자기 패키지 역참조 금지는 packages/ui 내부에만 적용한다 —
  // 문서 앱(apps/docs)은 소비자이므로 @jeon-ji/common-ui import가 정상이다.
  {
    files: ["packages/ui/src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "../**/index",
                "../**/index.js",
                "@jeon-ji/common-ui",
                "@jeon-ji/common-ui/*",
              ],
              message: "배럴 역참조 금지 — 내부 참조는 항상 직접 경로로 한다 (전역 규칙 17).",
            },
          ],
        },
      ],
    },
  },

  // 스타일 값은 토큰만 참조 — hex·z-index 리터럴 금지 (전역 규칙 12 / 03 문서 §5).
  // 예외는 tokens/ 디렉터리뿐. CSS 파일 쪽은 validate-tokens가 같은 규칙을 강제한다.
  {
    files: ["packages/ui/src/**/*.{ts,tsx}"],
    ignores: ["packages/ui/src/tokens/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
          message: "hex 리터럴 금지 — 토큰(var(--ui-color-*))만 참조한다 (전역 규칙 12).",
        },
        {
          selector: "TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b/]",
          message: "hex 리터럴 금지 — 토큰(var(--ui-color-*))만 참조한다 (전역 규칙 12).",
        },
        {
          selector: "Property[key.name='zIndex']",
          message: "z-index 리터럴 금지 — var(--ui-z-*) 토큰만 참조한다.",
        },
      ],
    },
  },

  // React — a11y는 strict, exhaustive-deps는 error. 경고로 두면 방치된다.
  {
    files: ["**/*.{jsx,tsx}"],
    extends: [jsxA11y.flatConfigs.strict, reactHooks.configs.flat["recommended-latest"]],
    rules: {
      "react-hooks/exhaustive-deps": "error",
    },
  },

  // 설정 파일·스크립트는 Node 환경이고 타입 정보가 필요 없다
  {
    files: ["**/*.config.{js,ts}", "eslint.config.js", "scripts/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },
  // CLI 스크립트는 콘솔 출력이 목적이다 — no-console은 컴포넌트 소스를 겨냥한 규칙
  {
    files: ["scripts/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["**/*.js"],
    extends: [tseslint.disableTypeChecked],
  },

  // 포맷 관련 규칙은 prettier에 위임 (항상 마지막)
  prettierConfig,
);
