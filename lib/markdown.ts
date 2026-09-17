/**
 * Markdown -> ContentNode[]
 *
 * Por que um parser próprio em vez de MDX: o blog inteiro já é construído em
 * cima de `ContentNode[]` — o sumário sai de `headings`, o tempo de leitura sai
 * de `wordCount`, e `RenderContent` desenha cada nó com o tema Bloom Dark. Um
 * pipeline MDX devolve um componente compilado, e aí sumário e contagem de
 * palavras precisariam ser reimplementados por fora. Traduzir markdown para a
 * AST que já existe preserva tudo isso e não adiciona dependência.
 *
 * O dialeto suportado é exatamente o que `ContentNode` sabe representar:
 * headings 2-4 (com id opcional), parágrafos, code fences com filename/destaque,
 * callouts no padrão de alerta do GitHub, citações, listas, tabelas, imagens e
 * divisores. O que não couber na AST falha alto, em vez de sumir calado.
 */
import type { CalloutTone, ContentNode, InlineNode } from "./posts";

/* ------------------------------------------------------------------ */
/* Frontmatter                                                         */
/* ------------------------------------------------------------------ */

export type Frontmatter = Record<string, string | string[] | boolean>;

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Subconjunto de YAML suficiente para `PostMeta`: escalares e listas simples. */
export function parseFrontmatter(raw: string, file: string): { data: Frontmatter; body: string } {
  const match = raw.match(FRONTMATTER);
  if (!match) throw new Error(`${file}: frontmatter ausente (bloco --- no topo do arquivo).`);

  const data: Frontmatter = {};
  let listKey: string | null = null;

  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) {
      (data[listKey] as string[]).push(unquote(item[1]));
      continue;
    }

    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) throw new Error(`${file}: linha de frontmatter inválida — ${line.trim()}`);

    const [, key, rawValue] = pair;
    const value = rawValue.trim();

    if (value === "") {
      data[key] = [];
      listKey = key;
      continue;
    }

    listKey = null;
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((entry) => unquote(entry.trim()))
        .filter(Boolean);
    } else if (value === "true" || value === "false") {
      data[key] = value === "true";
    } else {
      data[key] = unquote(value);
    }
  }

  return { data, body: raw.slice(match[0].length) };
}

const unquote = (value: string) => value.replace(/^['"]|['"]$/g, "");

/* ------------------------------------------------------------------ */
/* Inline                                                             */
/* ------------------------------------------------------------------ */

/* A ordem importa: código primeiro, para que `**x**` dentro de crase continue
   sendo literal; e `**` antes de `*`, senão negrito vira dois itálicos. */
const INLINE =
  /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)|(_[^_\s][^_]*_)|(\[[^\]]+\]\([^)\s]+\))/g;

export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(INLINE)) {
    const token = match[0];
    const start = match.index;
    if (start > cursor) nodes.push(text.slice(cursor, start));
    cursor = start + token.length;

    if (token.startsWith("`")) {
      nodes.push({ type: "code", text: token.slice(1, -1) });
    } else if (token.startsWith("**")) {
      nodes.push({ type: "strong", text: token.slice(2, -2) });
    } else if (token.startsWith("*") || token.startsWith("_")) {
      nodes.push({ type: "em", text: token.slice(1, -1) });
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      if (link) nodes.push({ type: "link", text: link[1], href: link[2] });
      else nodes.push(token);
    }
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes.length ? nodes : [text];
}

/** Células de tabela são `string` puro na AST — aqui a marcação vira texto. */
const stripInline = (text: string) =>
  parseInline(text)
    .map((node) => (typeof node === "string" ? node : node.text))
    .join("");

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ------------------------------------------------------------------ */
/* Bloco                                                              */
/* ------------------------------------------------------------------ */

const ALERT_TONES: Record<string, CalloutTone> = {
  NOTE: "note",
  TIP: "tip",
  IMPORTANT: "warn",
  WARNING: "warn",
  CAUTION: "warn",
};

const DEFAULT_TITLES: Record<CalloutTone, string> = {
  note: "Nota",
  tip: "Dica",
  warn: "Atenção",
};

export function parseMarkdown(body: string, file: string): ContentNode[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const nodes: ContentNode[] = [];
  let index = 0;

  const isBlank = (line: string) => line.trim() === "";

  while (index < lines.length) {
    const line = lines[index];

    if (isBlank(line)) {
      index += 1;
      continue;
    }

    /* --- code fence ------------------------------------------------ */
    if (line.startsWith("```")) {
      const meta = line.slice(3).trim();
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      if (index >= lines.length) throw new Error(`${file}: code fence aberto sem fechamento.`);
      index += 1;
      nodes.push({ type: "code", code: code.join("\n"), ...parseFenceMeta(meta) });
      continue;
    }

    /* --- heading --------------------------------------------------- */
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      if (level === 1) {
        throw new Error(
          `${file}: use ## ou menor no corpo — o H1 do post vem do 'title' no frontmatter.`,
        );
      }
      if (level > 4) throw new Error(`${file}: heading nível ${level} não é suportado (máximo ####).`);
      // `## Título {#id-custom}` — id explícito, para o sumário e links internos
      const withId = heading[2].match(/^(.*?)\s*\{#([a-z0-9-]+)\}$/i);
      const text = (withId ? withId[1] : heading[2]).trim();
      nodes.push({
        type: "heading",
        level: level as 2 | 3 | 4,
        id: withId ? withId[2] : slugify(text),
        text,
      });
      index += 1;
      continue;
    }

    /* --- divisor --------------------------------------------------- */
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      nodes.push({ type: "divider" });
      index += 1;
      continue;
    }

    /* --- citação e callout ----------------------------------------- */
    if (line.startsWith(">")) {
      const quoted: string[] = [];
      while (index < lines.length && lines[index].startsWith(">")) {
        quoted.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      const alert = quoted[0]?.match(/^\[!([A-Z]+)\]\s*(.*)$/);
      if (alert && ALERT_TONES[alert[1]]) {
        const tone = ALERT_TONES[alert[1]];
        nodes.push({
          type: "callout",
          tone,
          title: alert[2].trim() || DEFAULT_TITLES[tone],
          content: parseInline(quoted.slice(1).join(" ").trim()),
        });
      } else {
        nodes.push({ type: "quote", content: parseInline(quoted.join(" ").trim()) });
      }
      continue;
    }

    /* --- tabela ---------------------------------------------------- */
    if (line.trimStart().startsWith("|") && /^\s*\|[\s:|-]+\|\s*$/.test(lines[index + 1] ?? "")) {
      const head = splitRow(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].trimStart().startsWith("|")) {
        rows.push(splitRow(lines[index]));
        index += 1;
      }
      nodes.push({ type: "table", head, rows });
      continue;
    }

    /* --- listas ----------------------------------------------------- */
    const bullet = line.match(/^\s*([-*+])\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const ordered = Boolean(numbered);
      const items: InlineNode[][] = [];
      while (index < lines.length) {
        const current = lines[index];
        const match = ordered
          ? current.match(/^\s*\d+[.)]\s+(.*)$/)
          : current.match(/^\s*[-*+]\s+(.*)$/);
        if (!match) break;
        items.push(parseInline(match[match.length - 1].trim()));
        index += 1;
      }
      nodes.push({ type: "list", ...(ordered ? { ordered: true } : {}), items });
      continue;
    }

    /* --- parágrafo (ou imagem sozinha) ------------------------------ */
    const paragraph: string[] = [];
    while (index < lines.length && !isBlank(lines[index]) && !isBlockStart(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    const text = paragraph.join(" ");
    const image = text.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/);
    if (image) {
      nodes.push({
        type: "image",
        src: image[2],
        alt: image[1],
        ...(image[3] ? { caption: image[3] } : {}),
      });
    } else {
      nodes.push({ type: "paragraph", content: parseInline(text) });
    }
  }

  return nodes;
}

/** Um parágrafo termina quando a próxima linha abre outro tipo de bloco. */
function isBlockStart(line: string): boolean {
  return (
    line.startsWith("```") ||
    line.startsWith(">") ||
    /^#{1,6}\s/.test(line) ||
    /^\s*([-*+])\s/.test(line) ||
    /^\s*\d+[.)]\s/.test(line) ||
    line.trimStart().startsWith("|") ||
    /^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())
  );
}

const splitRow = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => stripInline(cell.trim()));

/** ```ts title="a/b.ts" {3,5-7} diff */
function parseFenceMeta(meta: string): {
  lang?: string;
  filename?: string;
  variant?: "default" | "diff";
  highlightLines?: number[];
} {
  if (!meta) return {};

  const result: ReturnType<typeof parseFenceMeta> = {};

  const title = meta.match(/title="([^"]+)"/);
  if (title) result.filename = title[1];

  const highlight = meta.match(/\{([\d,\s-]+)\}/);
  if (highlight) {
    const lines = new Set<number>();
    for (const part of highlight[1].split(",")) {
      const range = part.trim().match(/^(\d+)-(\d+)$/);
      if (range) {
        for (let n = Number(range[1]); n <= Number(range[2]); n += 1) lines.add(n);
      } else if (part.trim()) {
        lines.add(Number(part.trim()));
      }
    }
    result.highlightLines = [...lines].sort((a, b) => a - b);
  }

  const rest = meta
    .replace(/title="[^"]+"/, "")
    .replace(/\{[\d,\s-]+\}/, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const lang = rest[0];
  if (lang) result.lang = lang;
  // ```diff já diz as duas coisas: a linguagem e o tratamento visual de +/-
  if (rest.includes("diff")) result.variant = "diff";

  return result;
}
