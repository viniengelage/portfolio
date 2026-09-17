import Link from "next/link";

/**
 * Filtro por tag em links reais (`/blog?tag=`) em vez de estado client:
 * é compartilhável, funciona sem JS e o estado ativo vira `aria-current`.
 */
export function TagFilter({ tags, active }: { tags: string[]; active?: string }) {
  const options = [{ label: "Tudo", value: undefined }, ...tags.map((tag) => ({ label: tag, value: tag }))];

  return (
    <nav className="tag-filter" aria-label="Filtrar posts por tag">
      <ul className="tag-filter__list">
        {options.map((option) => {
          const isActive = option.value === active;
          return (
            <li key={option.label}>
              <Link
                href={option.value ? `/blog?tag=${encodeURIComponent(option.value)}` : "/blog"}
                className="tag-filter__pill"
                data-active={isActive || undefined}
                aria-current={isActive ? "page" : undefined}
                scroll={false}
              >
                {option.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
