import { Children, isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react";
import type { CalloutTone } from "../../lib/posts";
import { CodeBlock } from "./code-block";

/**
 * Mapa de componentes do corpo do post.
 *
 * ---------------------------------------------------------------------------
 * PONTO DE TROCA (MDX)
 * ---------------------------------------------------------------------------
 * Este objeto já está no formato que `MDXProvider` / `<MDXRemote components>`
 * espera. Quando o MDX entrar, o único passo é:
 *
 *   <MDXRemote source={post.body} components={mdxComponents} />
 *
 * e apagar `components/blog/render-content.tsx`. Nenhum CSS muda.
 */

/* ------------------------------------------------------------------ */
/* Callout                                                             */
/* ------------------------------------------------------------------ */

const calloutLabel: Record<CalloutTone, string> = {
  note: "Nota",
  tip: "Dica",
  warn: "Atenção",
};

export function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: CalloutTone;
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className="callout" data-tone={tone}>
      <p className="callout__label">{title ?? calloutLabel[tone]}</p>
      <div className="callout__body">{children}</div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Bloco de código vindo de markdown                                   */
/* ------------------------------------------------------------------ */

type CodeChildProps = {
  className?: string;
  children?: ReactNode;
  "data-filename"?: string;
  "data-highlight"?: string;
};

/** Converte ```lang de markdown em `<CodeBlock>` sem mudar o call site. */
function Pre(props: ComponentPropsWithoutRef<"pre">) {
  const child = Children.toArray(props.children)[0];

  if (isValidElement<CodeChildProps>(child)) {
    const lang = /language-([\w-]+)/.exec(child.props.className ?? "")?.[1] ?? "txt";
    const code = typeof child.props.children === "string" ? child.props.children : "";
    const highlightLines = (child.props["data-highlight"] ?? "")
      .split(",")
      .map((value) => Number.parseInt(value, 10))
      .filter((value) => Number.isFinite(value));

    return (
      <CodeBlock
        code={code}
        lang={lang === "diff" ? "diff" : lang}
        variant={lang === "diff" ? "diff" : "default"}
        filename={child.props["data-filename"]}
        highlightLines={highlightLines}
      />
    );
  }

  return <pre {...props} />;
}

function Anchor({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      className="prose-a"
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : null)}
      {...props}
    />
  );
}

function Figure({ src, alt = "", title, ...props }: ComponentPropsWithoutRef<"img">) {
  return (
    <figure className="prose-figure">
      {/* eslint-disable-next-line @next/next/no-img-element -- fonte do post é externa/arbitrária */}
      <img src={typeof src === "string" ? src : ""} alt={alt} loading="lazy" {...props} />
      {title ? <figcaption>{title}</figcaption> : null}
    </figure>
  );
}

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="prose-table-scroll">
      <table className="prose-table" {...props} />
    </div>
  );
}

export const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => <h2 className="prose-h2" {...props} />,
  h3: (props: ComponentPropsWithoutRef<"h3">) => <h3 className="prose-h3" {...props} />,
  h4: (props: ComponentPropsWithoutRef<"h4">) => <h4 className="prose-h4" {...props} />,
  p: (props: ComponentPropsWithoutRef<"p">) => <p className="prose-p" {...props} />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => <strong className="prose-strong" {...props} />,
  em: (props: ComponentPropsWithoutRef<"em">) => <em className="prose-em" {...props} />,
  code: (props: ComponentPropsWithoutRef<"code">) => <code className="prose-code" {...props} />,
  a: Anchor,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="prose-quote" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => <ul className="prose-ul" {...props} />,
  ol: (props: ComponentPropsWithoutRef<"ol">) => <ol className="prose-ol" {...props} />,
  li: (props: ComponentPropsWithoutRef<"li">) => <li className="prose-li" {...props} />,
  pre: Pre,
  table: Table,
  thead: (props: ComponentPropsWithoutRef<"thead">) => <thead {...props} />,
  tbody: (props: ComponentPropsWithoutRef<"tbody">) => <tbody {...props} />,
  tr: (props: ComponentPropsWithoutRef<"tr">) => <tr {...props} />,
  th: (props: ComponentPropsWithoutRef<"th">) => <th {...props} />,
  td: (props: ComponentPropsWithoutRef<"td">) => <td {...props} />,
  img: Figure,
  hr: (props: ComponentPropsWithoutRef<"hr">) => <hr className="prose-hr" {...props} />,
  // componentes próprios, disponíveis dentro do MDX
  Callout,
  CodeBlock,
};

export type MdxComponents = typeof mdxComponents;
