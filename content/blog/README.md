# Posts do blog

Cada post fica em sua própria pasta:

```txt
content/blog/
└── meu-post/
    ├── meta.ts    # catálogo, SEO e cards
    └── post.mdx   # conteúdo renderizado
```

## Criar um post

1. Crie `content/blog/<slug>/meta.ts` com `metadata` compatível com `BlogPostMeta`.
2. Escreva o conteúdo em `content/blog/<slug>/post.mdx`.
3. Registre os dois módulos em `content/blog/registry.ts`.

O registro é propositalmente estático: o Next consegue compilar todos os MDX no build e gerar as rotas sem imports dinâmicos.

## Componentes MDX

Todos os componentes em `components/blog/mdx.tsx` estão disponíveis nos arquivos MDX. Os mais usados são:

```mdx
<Callout tone="tip" title="Dica">
  Conteúdo complementar do post.
</Callout>

<CodeBlock
  lang="ts"
  filename="src/lib/example.ts"
  code={`export const answer = 42;`}
/>
```

Markdown/GFM comum também funciona: títulos, listas, links, tabelas e fences de código. O build (`bun run build`) compila e valida todos os arquivos `*.mdx`.
