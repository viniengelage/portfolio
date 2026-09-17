/**
 * Tokenizador provisório.
 *
 * É deliberadamente pequeno: cobre comment/string/keyword/type/number/function/
 * punctuation/operator o suficiente para TS, TSX, JSON, CSS e shell nos posts
 * atuais. Não pretende ser correto para todas as linguagens.
 *
 * ---------------------------------------------------------------------------
 * PONTO DE TROCA (Shiki)
 * ---------------------------------------------------------------------------
 * `<CodeBlock>` só depende da assinatura `highlightCode(code, lang): CodeLine[]`.
 * Para migrar, reescreva SOMENTE o corpo de `highlightCode` mapeando os tokens
 * do Shiki para `TokenKind` (o tema já existe em `lib/code-theme.ts`):
 *
 *   const hl = await createHighlighter({ themes: [bloomDarkShikiTheme], langs });
 *   const { tokens } = hl.codeToTokens(code, { lang, theme: "bloom-dark" });
 *
 * Nenhum call site muda.
 */

export type TokenKind =
  | "comment"
  | "string"
  | "keyword"
  | "type"
  | "number"
  | "function"
  | "punctuation"
  | "operator"
  | "variable"
  | "plain";

export type CodeToken = {
  kind: TokenKind;
  value: string;
};

/** Uma linha de código já tokenizada. */
export type CodeLine = CodeToken[];

const KEYWORDS = new Set([
  "abstract", "as", "async", "await", "break", "case", "catch", "class", "const",
  "continue", "declare", "default", "delete", "do", "else", "enum", "export",
  "extends", "finally", "for", "from", "function", "get", "if", "implements",
  "import", "in", "instanceof", "interface", "is", "keyof", "let", "namespace",
  "new", "of", "private", "protected", "public", "readonly", "return",
  "satisfies", "set", "static", "super", "switch", "this", "throw", "try",
  "type", "typeof", "var", "void", "while", "yield",
  // shell / css / outros que aparecem nos posts
  "bun", "npm", "use", "with",
]);

const CONSTANTS = new Set([
  "true", "false", "null", "undefined", "NaN", "Infinity",
]);

/**
 * Ordem importa: comentário antes de operador (por causa de `//`), string antes
 * de tudo que pudesse comer aspas, palavra antes de operador.
 */
const PATTERN = new RegExp(
  [
    // `#` só vale como comentário no começo da linha (shell), nunca no meio —
    // senão `color: #08070c` em CSS viraria comentário.
    String.raw`(?<comment>\/\*[\s\S]*?\*\/|\/\/[^\n]*|(?<=^|\n)[ \t]*#[^\n]*)`,
    String.raw`(?<string>"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|` + "`(?:\\\\.|[^`\\\\])*`" + `)`,
    String.raw`(?<number>\b0[xXbBoO][0-9a-fA-F_]+\b|\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b)`,
    String.raw`(?<word>[A-Za-z_$@][\w$-]*)`,
    String.raw`(?<operator>=>|[+\-*/%=<>!&|^~?]+)`,
    String.raw`(?<punctuation>[{}()[\];:,.]|#)`,
    String.raw`(?<space>\s+)`,
  ].join("|"),
  "g",
);

function classifyWord(word: string, rest: string): TokenKind {
  if (KEYWORDS.has(word)) return "keyword";
  if (CONSTANTS.has(word)) return "number";
  // `foo(` e `foo <T>(` contam como chamada/definição de função.
  if (/^\s*[(<]/.test(rest) && !KEYWORDS.has(word)) {
    return /^[A-Z]/.test(word) && /^\s*</.test(rest) ? "type" : "function";
  }
  if (/^[A-Z]/.test(word)) return "type";
  return "variable";
}

function tokenize(code: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let cursor = 0;

  PATTERN.lastIndex = 0;
  for (const match of code.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    if (index > cursor) {
      tokens.push({ kind: "plain", value: code.slice(cursor, index) });
    }
    cursor = index + match[0].length;

    const groups = match.groups ?? {};
    if (groups.comment) tokens.push({ kind: "comment", value: groups.comment });
    else if (groups.string) tokens.push({ kind: "string", value: groups.string });
    else if (groups.number) tokens.push({ kind: "number", value: groups.number });
    else if (groups.word) {
      tokens.push({ kind: classifyWord(groups.word, code.slice(cursor, cursor + 8)), value: groups.word });
    } else if (groups.operator) tokens.push({ kind: "operator", value: groups.operator });
    else if (groups.punctuation) tokens.push({ kind: "punctuation", value: groups.punctuation });
    else if (groups.space) tokens.push({ kind: "plain", value: groups.space });
  }

  if (cursor < code.length) {
    tokens.push({ kind: "plain", value: code.slice(cursor) });
  }
  return tokens;
}

/** Quebra tokens multi-linha (comentários de bloco, template strings) por linha. */
function splitIntoLines(tokens: CodeToken[]): CodeLine[] {
  const lines: CodeLine[] = [[]];
  for (const token of tokens) {
    const chunks = token.value.split("\n");
    for (let index = 0; index < chunks.length; index += 1) {
      if (index > 0) lines.push([]);
      const chunk = chunks[index];
      if (!chunk) continue;
      const line = lines[lines.length - 1];
      if (!line) continue;
      // funde tokens vizinhos do mesmo tipo para não gerar um <span> por espaço
      const last = line[line.length - 1];
      if (last && last.kind === token.kind) last.value += chunk;
      else line.push({ kind: token.kind, value: chunk });
    }
  }
  return lines;
}

/**
 * Assinatura estável consumida por `<CodeBlock>`.
 * `lang` é aceito hoje só para logging/futuro — o tokenizador atual é genérico.
 */
export function highlightCode(code: string, _lang = "txt"): CodeLine[] {
  return splitIntoLines(tokenize(code.replace(/\n$/, "")));
}

/** Texto plano de uma linha — usado pelo botão copiar. */
export function lineToText(line: CodeLine): string {
  return line.map((token) => token.value).join("");
}
