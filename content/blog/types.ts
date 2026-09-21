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
  /**
   * Thumbnail de compartilhamento 1200×630, caminho a partir de `public/`.
   * Sem ela o post cai no Open Graph do site (`app/opengraph-image.tsx`).
   * As peças são desenhadas no Penpot e rasterizadas por `bun run brand:og`.
   */
  image?: string;
  featured?: boolean;
  draft?: boolean;
};
