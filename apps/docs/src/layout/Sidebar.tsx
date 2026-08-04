import { NavLink } from "react-router";

import { docGroups } from "../registry";

export function Sidebar({ query }: { query: string }) {
  const normalized = query.trim().toLowerCase();

  return (
    <nav className="docs-sidebar" aria-label="문서 목차">
      {docGroups.map((group) => {
        const entries = normalized
          ? group.entries.filter(
              (entry) =>
                entry.title.toLowerCase().includes(normalized) || entry.slug.includes(normalized),
            )
          : group.entries;
        if (entries.length === 0) return null;

        return (
          <section key={group.title}>
            <h2 className="docs-sidebar-group">{group.title}</h2>
            <ul>
              {entries.map((entry) => (
                <li key={entry.slug}>
                  <NavLink
                    to={`${group.base}/${entry.slug}`}
                    className={({ isActive }) => `docs-sidebar-link${isActive ? " is-active" : ""}`}
                  >
                    {entry.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}
