import { useState } from "react";
import { Outlet } from "react-router";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Toc } from "./Toc";

export function Layout() {
  const [query, setQuery] = useState("");

  return (
    <div className="docs-shell">
      <Header onSearch={setQuery} />
      <div className="docs-body">
        <Sidebar query={query} />
        <main className="docs-content">
          <Outlet />
        </main>
        <Toc />
      </div>
    </div>
  );
}
