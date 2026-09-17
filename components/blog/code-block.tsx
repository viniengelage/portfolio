import { highlightCode, lineToText, type CodeLine } from "../../lib/highlight";
import { CopyButton } from "./copy-button";

export type CodeBlockProps = {
  /** Código cru. Em `variant="diff"`, cada linha começa com `-`, `+` ou espaço. */
  code: string;
  /** Rótulo exibido à direita da barra de título. Também alimenta o highlighter. */
  lang?: string;
  /** Nome do arquivo, à esquerda da barra de título. */
  filename?: string;
  /** `diff` troca a numeração por `-`/`+` e colore a linha inteira. */
  variant?: "default" | "diff";
  /** Linhas destacadas, 1-based. */
  highlightLines?: number[];
  /** Desliga a numeração (ignorado em `diff`). */
  showLineNumbers?: boolean;
  /** Desliga o botão copiar. */
  copyable?: boolean;
  className?: string;
};

type RenderLine = {
  tokens: CodeLine;
  gutter: string;
  diff?: "added" | "removed";
  highlighted: boolean;
};

/** Em diff, o marcador vive na coluna do gutter — não dentro do código. */
function stripDiffMarker(text: string): { marker: "added" | "removed" | undefined; body: string } {
  if (text.startsWith("+")) return { marker: "added", body: text.slice(1).replace(/^ /, "") };
  if (text.startsWith("-")) return { marker: "removed", body: text.slice(1).replace(/^ /, "") };
  return { marker: undefined, body: text.replace(/^ /, "") };
}

export function CodeBlock({
  code,
  lang = "txt",
  filename,
  variant = "default",
  highlightLines = [],
  showLineNumbers = true,
  copyable = true,
  className = "",
}: CodeBlockProps) {
  const isDiff = variant === "diff";
  const rawLines = code.replace(/\n$/, "").split("\n");

  const prepared = isDiff
    ? rawLines.map(stripDiffMarker)
    : rawLines.map((text) => ({ marker: undefined as undefined, body: text }));

  const source = prepared.map((line) => line.body).join("\n");
  const highlighted = highlightCode(source, lang);

  const lines: RenderLine[] = prepared.map((line, index) => ({
    tokens: highlighted[index] ?? [],
    gutter: isDiff
      ? line.marker === "added" ? "+" : line.marker === "removed" ? "-" : " "
      : String(index + 1).padStart(2, "0"),
    diff: line.marker,
    highlighted: highlightLines.includes(index + 1),
  }));

  const plainText = lines.map((line) => lineToText(line.tokens)).join("\n");
  const gutterWidth = Math.max(2, String(lines.length).length);

  return (
    <div className={`code-block ${className}`.trim()} data-variant={variant}>
      <div className="code-block__bar">
        <span className="code-block__filename">{filename ?? `${lang}.snippet`}</span>
        <span className="code-block__meta">
          <span className="code-block__lang">{lang}</span>
          {copyable ? <CopyButton value={plainText} /> : null}
        </span>
      </div>

      <div className="code-block__scroll">
        <pre className="code-block__pre" tabIndex={0}>
          <code>
            {lines.map((line, index) => (
              <span
                key={index}
                className="code-block__line"
                data-diff={line.diff}
                data-highlight={line.highlighted || undefined}
              >
                <span
                  className="code-block__gutter"
                  aria-hidden="true"
                  style={{ "--gutter-ch": gutterWidth } as React.CSSProperties}
                >
                  {showLineNumbers || isDiff ? line.gutter : ""}
                </span>
                <span className="code-block__text">
                  {line.tokens.length === 0 ? (
                    "\u00a0"
                  ) : (
                    line.tokens.map((token, tokenIndex) => (
                      <span key={tokenIndex} className={`tok tok--${token.kind}`}>
                        {token.value}
                      </span>
                    ))
                  )}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
