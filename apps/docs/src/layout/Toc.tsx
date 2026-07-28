import { useEffect, useState } from "react";
import { useLocation } from "react-router";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

/** 본문(h2·h3) anchor 자동 수집 + 스크롤 스파이 */
export function Toc() {
  const location = useLocation();
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    let observer: IntersectionObserver | undefined;

    // 라우트 전환 직후 본문이 그려진 다음 프레임에 수집한다
    // (effect 본문에서의 동기 setState는 연쇄 렌더를 유발한다 — react-hooks 규칙)
    const raf = requestAnimationFrame(() => {
      const headings = Array.from(
        document.querySelectorAll<HTMLHeadingElement>(".docs-content h2[id], .docs-content h3[id]"),
      );
      setItems(
        headings.map((h) => ({
          id: h.id,
          text: h.textContent ?? "",
          level: h.tagName === "H2" ? 2 : 3,
        })),
      );

      observer = new IntersectionObserver(
        (observed) => {
          for (const entry of observed) {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
              break;
            }
          }
        },
        { rootMargin: "0px 0px -70% 0px" },
      );
      for (const h of headings) observer.observe(h);
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [location.pathname]);

  if (items.length === 0) return <aside className="docs-toc" aria-hidden="true" />;

  return (
    <aside className="docs-toc">
      <nav aria-label="이 페이지 목차">
        <ul>
          {items.map((item) => (
            <li key={item.id} className={item.level === 3 ? "is-nested" : undefined}>
              <a href={`#${item.id}`} className={item.id === activeId ? "is-active" : undefined}>
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
