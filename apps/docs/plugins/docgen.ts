/**
 * `?docgen` import를 react-docgen-typescript 파싱 결과(JSON)로 바꿔 주는 Vite 플러그인.
 *
 *   import docgen from "../../packages/ui/src/components/Sample/index.tsx?docgen";
 *
 * 소스의 Props 타입·JSDoc·@default가 곧 API 문서다 — 수동 표 관리 금지 (04 문서 §1).
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as docgen from "react-docgen-typescript";
import type { Plugin } from "vite";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const parser = docgen.withCustomConfig(path.join(rootDir, "packages", "ui", "tsconfig.lib.json"), {
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  // DOM 상속 prop 수천 개를 표에서 제외 — 소스에 선언된 Props만 문서화한다
  propFilter: (prop) =>
    !(prop.parent && prop.parent.fileName.includes("node_modules/@types/react")),
});

const SUFFIX = "?docgen";

export function docgenPlugin(): Plugin {
  return {
    name: "docs:docgen",
    enforce: "pre",
    async resolveId(source, importer) {
      if (!source.endsWith(SUFFIX)) return null;
      const resolved = await this.resolve(source.slice(0, -SUFFIX.length), importer, {
        skipSelf: true,
      });
      return resolved ? resolved.id + SUFFIX : null;
    },
    load(id) {
      if (!id.endsWith(SUFFIX)) return null;
      const file = id.slice(0, -SUFFIX.length);
      const docs = parser.parse(file).map((entry) => ({
        displayName: entry.displayName,
        description: entry.description,
        props: Object.values(entry.props)
          .map((prop) => ({
            name: prop.name,
            type: prop.type.name,
            required: prop.required,
            defaultValue: (prop.defaultValue as { value?: string } | null)?.value ?? null,
            description: prop.description,
          }))
          .sort((a, b) => Number(b.required) - Number(a.required) || (a.name < b.name ? -1 : 1)),
      }));
      return `export default ${JSON.stringify(docs)};`;
    },
  };
}
