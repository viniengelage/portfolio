import { Fragment, type ReactNode } from "react";
import type { ContentNode, InlineNode } from "../../lib/posts";
import { Callout, mdxComponents } from "./mdx";
import { CodeBlock } from "./code-block";

/**
 * Desenha a AST do post. O markdown de `content/blog` é traduzido para
 * `ContentNode[]` por `lib/markdown.ts`, e cada nó cai num elemento de
 * `mdxComponents` — o mesmo mapa que um pipeline MDX consumiria, caso um dia
 * o conteúdo precise de componentes React embutidos.
 */

const { p: P, h2: H2, h3: H3, h4: H4, strong: Strong, em: Em, code: InlineCode, a: A, blockquote: Quote, ul: Ul, ol: Ol, li: Li, img: Img, hr: Hr, table: Table, thead: Thead, tbody: Tbody, tr: Tr, th: Th, td: Td } = mdxComponents;

function renderInline(nodes: InlineNode[]): ReactNode {
  return nodes.map((node, index) => {
    if (typeof node === "string") return <Fragment key={index}>{node}</Fragment>;
    switch (node.type) {
      case "strong":
        return <Strong key={index}>{node.text}</Strong>;
      case "em":
        return <Em key={index}>{node.text}</Em>;
      case "code":
        return <InlineCode key={index}>{node.text}</InlineCode>;
      case "link":
        return (
          <A key={index} href={node.href}>
            {node.text}
          </A>
        );
    }
  });
}

function renderNode(node: ContentNode, key: number): ReactNode {
  switch (node.type) {
    case "heading": {
      const Heading = node.level === 2 ? H2 : node.level === 3 ? H3 : H4;
      return (
        <Heading key={key} id={node.id}>
          {node.text}
        </Heading>
      );
    }
    case "paragraph":
      return <P key={key}>{renderInline(node.content)}</P>;
    case "quote":
      return <Quote key={key}>{renderInline(node.content)}</Quote>;
    case "code":
      return (
        <CodeBlock
          key={key}
          code={node.code}
          lang={node.lang}
          filename={node.filename}
          variant={node.variant}
          highlightLines={node.highlightLines}
        />
      );
    case "list": {
      const List = node.ordered ? Ol : Ul;
      return (
        <List key={key}>
          {node.items.map((item, index) => (
            <Li key={index}>{renderInline(item)}</Li>
          ))}
        </List>
      );
    }
    case "table":
      return (
        <Table key={key}>
          <Thead>
            <Tr>
              {node.head.map((cell) => (
                <Th key={cell} scope="col">
                  {cell}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {node.rows.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <Td key={cellIndex}>{cell}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      );
    case "image":
      return <Img key={key} src={node.src} alt={node.alt} title={node.caption} />;
    case "divider":
      return <Hr key={key} />;
    case "callout":
      return (
        <Callout key={key} tone={node.tone} title={node.title}>
          <P>{renderInline(node.content)}</P>
        </Callout>
      );
  }
}

export function RenderContent({ content }: { content: ContentNode[] }) {
  return <>{content.map(renderNode)}</>;
}
