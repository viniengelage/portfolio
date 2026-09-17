"use client";

import { useEffect, useState } from "react";
import type { PostHeading } from "../../lib/posts";

/**
 * TOC sticky. Client só por causa do heading ativo — a lista em si é estática
 * e continua navegável com JS desligado.
 */
export function TableOfContents({ headings }: { headings: PostHeading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const targets = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((node): node is HTMLElement => node !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      // banda estreita no topo: o heading "ativo" é o que acabou de passar do nav
      { rootMargin: "-120px 0px -70% 0px", threshold: 0 },
    );

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="toc" aria-label="Sumário do post">
      <p className="label label--muted toc__title">Neste post</p>
      <ul className="toc__list">
        {headings.map((heading) => (
          <li key={heading.id} data-level={heading.level}>
            <a
              href={`#${heading.id}`}
              className="toc__link"
              data-active={heading.id === activeId || undefined}
              aria-current={heading.id === activeId ? "true" : undefined}
            >
              <span className="toc__marker" aria-hidden="true" />
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
