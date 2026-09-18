export type BlogPostPattern = "stack" | "bars" | "lines" | "dots";
export type BlogPostAccent = "violet" | "teal" | "blue" | "amber";

/** Metadados estáticos usados pelo catálogo, SEO e rotas do blog. */
export type BlogPostMeta = {
  slug: string;
  title: string;
  lead: string;
  /** Data ISO no formato YYYY-MM-DD. */
  date: string;
  tags: string[];
  pattern: BlogPostPattern;
  accent: BlogPostAccent;
  featured?: boolean;
  draft?: boolean;
};
