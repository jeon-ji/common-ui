import { useState } from "react";
import { Link } from "react-router";

// 배포 버전과 문서의 불일치를 인지할 수 있도록 헤더에 패키지 버전을 표기한다 (06 문서 §3)
import uiPackage from "../../../../packages/ui/package.json";
import { useTheme } from "../theme";

export function Header({ onSearch }: { onSearch: (query: string) => void }) {
  const [theme, setTheme] = useTheme();
  const [query, setQuery] = useState("");

  return (
    <header className="docs-header">
      <Link to="/" className="docs-logo">
        @jeon-ji/common-ui <span className="docs-version">v{uiPackage.version}</span>
      </Link>

      <input
        type="search"
        className="docs-search"
        placeholder="컴포넌트·토큰 검색"
        aria-label="문서 검색"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          onSearch(event.target.value);
        }}
      />

      <div className="docs-header-actions">
        <button
          type="button"
          className="docs-icon-button"
          aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
          aria-pressed={theme === "dark"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
        <a
          className="docs-icon-button"
          href="https://github.com/jeon-ji/common-ui"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub 저장소"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
