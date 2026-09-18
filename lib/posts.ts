import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ComponentType } from "react";
import { blogPostModules } from "../content/blog/registry";
import type { BlogPostAccent, BlogPostMeta, BlogPostPattern } from "../content/blog/types";

export const SITE_URL = "https://www.viniengelage.com";

export type PostPattern = BlogPostPattern;
export type PostAccent = BlogPostAccent;
export type CalloutTone = "note" | "tip" | "warn";

export type PostHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type CodePreview = {
  code: string;
  lang?: string;
  filename?: string;
  variant?: "default" | "diff";
  highlightLines?: number[];
};

export type Post = BlogPostMeta & {
  Content: ComponentType;
  readingMinutes: number;
  wordCount: number;
  headings: PostHeading[];
  previewCode?: CodePreview;
};

export const AUTHOR = {
  name: "Vinicios Engelage",
  initials: "VE",
  role: "Full stack · app & interface",
  bio: "Desenvolvedor full stack focado em aplicativos e design de interface. Escrevo sobre produto, código e o que aprendo ao colocar os dois em produção.",
  links: [
    { label: "GitHub", href: "https://github.com/viniengelage" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/viniengelage" },
  ],
} as const;

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFenceMeta(meta: string): Omit<CodePreview, "code"> {
  const title = meta.match(/title="([^"]+)"/);
  const highlight = meta.match(/\{([\d,\s-]+)\}/);
  const highlightLines = highlight
    ? [...new Set(
        highlight[1]
          .split(",")
          .flatMap((part) => {
            const range = part.trim().match(/^(\d+)-(\d+)$/);
            if (range) {
              const [start, end] = range.slice(1).map(Number);
              return Array.from({ length: end - start + 1 }, (_, index) => start + index);
            }
            const line = Number(part.trim());
            return Number.isFinite(line) ? [line] : [];
          }),
      )].sort((a, b) => a - b)
    : undefined;
  const rest = meta
    .replace(/title="[^"]+"/, "")
    .replace(/\{[\d,\s-]+\}/, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const lang = rest[0];

  return {
    ...(lang ? { lang } : {}),
    ...(title ? { filename: title[1] } : {}),
    ...(rest.includes("diff") ? { variant: "diff" as const } : {}),
    ...(highlightLines?.length ? { highlightLines } : {}),
  };
}

/** Deriva dados editoriais sem avaliar conteúdo MDX como HTML. */
function analyzeSource(source: string): Pick<Post, "wordCount" | "headings" | "previewCode"> {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const headings: PostHeading[] = [];
  let previewCode: CodePreview | undefined;
  let isInFence = false;
  let currentFence: { marker: string; meta: string; code: string[] } | undefined;
  const words: string[] = [];

  for (const line of lines) {
    const fence = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (!isInFence) {
        isInFence = true;
        currentFence = { marker: fence[1], meta: fence[2].trim(), code: [] };
      } else if (line.trimStart().startsWith(currentFence?.marker ?? "")) {
        if (!previewCode && currentFence) {
          previewCode = { code: currentFence.code.join("\n"), ...parseFenceMeta(currentFence.meta) };
        }
        isInFence = false;
        currentFence = undefined;
      }
      continue;
    }

    if (isInFence) {
      currentFence?.code.push(line);
      words.push(...line.split(/\s+/));
      continue;
    }

    const heading = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (heading) {
      const text = heading[2].replace(/\s*\{#[a-z0-9-]+\}$/i, "");
      headings.push({ id: slugify(text), text, level: heading[1].length as 2 | 3 });
    }

    const text = line
      .replace(/^#{1,6}\s+/, "")
      .replace(/<[^>]+>/g, "")
      .replace(/[`*_>[\]()!|]/g, " ");
    words.push(...text.split(/\s+/));
  }

  const wordCount = words.filter(Boolean).length;
  return { wordCount, headings, ...(previewCode ? { previewCode } : {}) };
}

const posts: readonly Post[] = blogPostModules
  .map(({ Content, metadata, sourcePath }) => {
    const analysis = analyzeSource(
      readFileSync(join(process.cwd(), "content", "blog", sourcePath), "utf8"),
    );
    return {
      ...metadata,
      Content,
      ...analysis,
      readingMinutes: Math.max(1, Math.round(analysis.wordCount / 200)),
    };
  })
  .filter((post) => !post.draft || process.env.NODE_ENV !== "production")
  .sort((a, b) => b.date.localeCompare(a.date));

export function getAllPosts(): readonly Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getFeaturedPost(): Post | undefined {
  return posts.find((post) => post.featured) ?? posts[0];
}

export function getAllTags(): string[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}

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
