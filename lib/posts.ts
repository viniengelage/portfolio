/**
 * Fonte de dados do blog: arquivos markdown em `content/blog`.
 *
 * Um post = um arquivo `.md`. O nome do arquivo é o slug, o frontmatter é o
 * `PostMeta` e o corpo é traduzido para `ContentNode[]` por `lib/markdown.ts`.
 * Todo o resto do blog só conhece `getAllPosts()`, `getPostBySlug()` e
 * `getFeaturedPost()` — nada abaixo desta camada sabe que existe markdown.
 *
 * Frontmatter inteiro falha alto: campo faltando, `date` fora de YYYY-MM-DD ou
 * `pattern`/`accent` fora do enum quebram o build com o nome do arquivo na
 * mensagem. O objetivo é nunca publicar um card silenciosamente quebrado.
 *
 * Se um dia o conteúdo precisar de componentes React embutidos, o caminho é
 * MDX: `derivePost()` continua válido, mas `headings` e `wordCount` teriam de
 * ser extraídos por plugin de remark, já que um componente compilado não é
 * inspecionável como a AST atual.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type Frontmatter, parseFrontmatter, parseMarkdown } from "./markdown";

export const SITE_URL = "https://www.viniengelage.com";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

/** Padrão gráfico do thumb do card. Cada um tem um desenho CSS próprio. */
export type PostPattern = "stack" | "bars" | "lines" | "dots";

/** Accent do card — sempre um token do sistema, nunca uma cor solta. */
export type PostAccent = "violet" | "teal" | "blue" | "amber";

export type PostHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

/** Trecho inline — o mínimo para cobrir o que markdown gera dentro de um `<p>`. */
export type InlineNode =
  | string
  | { type: "strong"; text: string }
  | { type: "em"; text: string }
  | { type: "code"; text: string }
  | { type: "link"; text: string; href: string };

export type CalloutTone = "note" | "tip" | "warn";

export type ContentNode =
  | { type: "heading"; level: 2 | 3 | 4; id: string; text: string }
  | { type: "paragraph"; content: InlineNode[] }
  | {
      type: "code";
      code: string;
      lang?: string;
      filename?: string;
      variant?: "default" | "diff";
      highlightLines?: number[];
    }
  | { type: "quote"; content: InlineNode[] }
  | { type: "list"; ordered?: boolean; items: InlineNode[][] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "divider" }
  | { type: "callout"; tone: CalloutTone; title: string; content: InlineNode[] };

export type PostMeta = {
  slug: string;
  title: string;
  lead: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  tags: string[];
  pattern: PostPattern;
  accent: PostAccent;
  featured?: boolean;
  /** Fica fora do build de produção; continua visível em `next dev`. */
  draft?: boolean;
};

/** O que o loader precisa devolver. Tudo o mais é derivado. */
export type PostSource = PostMeta & { content: ContentNode[] };

export type Post = PostSource & {
  readingMinutes: number;
  wordCount: number;
  headings: PostHeading[];
};

export const AUTHOR = {
  name: "Vinicios Engelage",
  initials: "VE",
  role: "Full stack · app & interface",
  bio: "PLACEHOLDER — Desenvolvedor full stack focado em aplicativos e design de interface. Escrevo sobre as decisões que sobrevivem ao deploy.",
  links: [
    { label: "GitHub", href: "https://github.com/viniengelage" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/viniengelage" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Derivação                                                           */
/* ------------------------------------------------------------------ */

function inlineText(nodes: InlineNode[]): string {
  return nodes.map((node) => (typeof node === "string" ? node : node.text)).join("");
}

function nodeText(node: ContentNode): string {
  switch (node.type) {
    case "heading":
      return node.text;
    case "paragraph":
    case "quote":
    case "callout":
      return inlineText(node.content);
    case "list":
      return node.items.map(inlineText).join(" ");
    case "table":
      return [...node.head, ...node.rows.flat()].join(" ");
    case "code":
      return node.code;
    case "image":
      return node.caption ?? "";
    default:
      return "";
  }
}

function countWords(content: ContentNode[]): number {
  const text = content.map(nodeText).join(" ").trim();
  return text ? text.split(/\s+/).length : 0;
}

function collectHeadings(content: ContentNode[]): PostHeading[] {
  return content
    .filter((node): node is Extract<ContentNode, { type: "heading" }> => node.type === "heading")
    .filter((node) => node.level === 2 || node.level === 3)
    .map((node) => ({ id: node.id, text: node.text, level: node.level as 2 | 3 }));
}

/** 200 palavras/minuto, mínimo de 1. */
export function derivePost(source: PostSource): Post {
  const wordCount = countWords(source.content);
  return {
    ...source,
    wordCount,
    readingMinutes: Math.max(1, Math.round(wordCount / 200)),
    headings: collectHeadings(source.content),
  };
}


/* ------------------------------------------------------------------ */
/* Fonte: arquivos markdown em content/blog                            */
/* ------------------------------------------------------------------ */

const CONTENT_DIR = join(process.cwd(), "content", "blog");

const PATTERNS: PostPattern[] = ["stack", "bars", "lines", "dots"];
const ACCENTS: PostAccent[] = ["violet", "teal", "blue", "amber"];

function requireString(data: Frontmatter, key: string, file: string): string {
  const value = data[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${file}: frontmatter '${key}' é obrigatório.`);
  }
  return value.trim();
}

function requireOneOf<T extends string>(
  data: Frontmatter,
  key: string,
  allowed: T[],
  file: string,
): T {
  const value = requireString(data, key, file);
  if (!allowed.includes(value as T)) {
    throw new Error(`${file}: '${key}' deve ser um de ${allowed.join(" | ")} — recebeu '${value}'.`);
  }
  return value as T;
}

/**
 * O nome do arquivo é o slug, sem exceção: a URL fica previsível a partir da
 * árvore de arquivos. Um `slug` divergente no frontmatter falha o build em vez
 * de criar uma rota que ninguém acha.
 */
function loadPost(file: string): PostSource {
  const slug = file.replace(/\.mdx?$/, "");
  const { data, body } = parseFrontmatter(readFileSync(join(CONTENT_DIR, file), "utf8"), file);

  if (typeof data.slug === "string" && data.slug.trim() && data.slug.trim() !== slug) {
    throw new Error(`${file}: 'slug' (${data.slug}) diverge do nome do arquivo (${slug}).`);
  }

  const date = requireString(data, "date", file);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`${file}: 'date' deve estar em YYYY-MM-DD — recebeu '${date}'.`);
  }

  const tags = Array.isArray(data.tags) ? data.tags.filter(Boolean) : [];
  if (!tags.length) throw new Error(`${file}: 'tags' precisa de pelo menos uma entrada.`);

  return {
    slug,
    title: requireString(data, "title", file),
    lead: requireString(data, "lead", file),
    date,
    tags,
    pattern: requireOneOf(data, "pattern", PATTERNS, file),
    accent: requireOneOf(data, "accent", ACCENTS, file),
    ...(data.featured === true ? { featured: true as const } : {}),
    ...(data.draft === true ? { draft: true as const } : {}),
    content: parseMarkdown(body, file),
  };
}

const sources: PostSource[] = readdirSync(CONTENT_DIR)
  .filter((file) => /\.mdx?$/.test(file))
  .map(loadPost);

const posts: Post[] = sources
  .map(derivePost)
  // rascunho aparece em `next dev` e some do build — assim dá para revisar no
  // site sem que o texto inacabado vá ao ar
  .filter((post) => !post.draft || process.env.NODE_ENV !== "production")
  .sort((a, b) => b.date.localeCompare(a.date));

/* ------------------------------------------------------------------ */
/* API pública                                                         */
/* ------------------------------------------------------------------ */

/** Todos os posts, do mais recente para o mais antigo. */
export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/** O post marcado como `featured`; cai no mais recente se nenhum estiver. */
export function getFeaturedPost(): Post | undefined {
  return posts.find((post) => post.featured) ?? posts[0];
}

/** Tags únicas, ordenadas por frequência e depois alfabeticamente. */
export function getAllTags(): string[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}

/** Vizinhos na ordem cronológica, para a navegação do rodapé do post. */
export function getAdjacentPosts(slug: string): { previous?: Post; next?: Post } {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};
  return { previous: posts[index + 1], next: posts[index - 1] };
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatPostDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`)).replace(".", "");
}
