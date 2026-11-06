---
name: open-pencil-design
description: Lê o design do portfólio no Open Pencil (arquivo Portifolio.fig) e traduz telas, frames e tokens para código, ou compara o código implementado com o design. Use quando o usuário falar em "pencil", "Open Pencil", "o design", "a tela nova", em uma página do arquivo (Home, Blog, Theme, Brand, Asylum) ou pedir para implementar ou revisar algo "conforme o design". Substitui o fluxo antigo do Penpot, que não é mais usado.
---

# Open Pencil → código

O design do portfólio vive no **Open Pencil**, no arquivo
`~/Projects/portifolio-design/Portifolio.fig`, acessado pelo MCP do Open Pencil.

**Não use o Penpot.** As ferramentas do Penpot MCP (`execute_code`, `penpot_api_info`,
`export_shape`, `penpotUtils`) podem aparecer na sessão, mas o arquivo de lá está abandonado.
Se o MCP do Open Pencil não responder, peça ao usuário para abrir o arquivo e conectar. Não
caia no Penpot.

## Mapa do arquivo

| Página | Conteúdo |
|---|---|
| `00 — Foundations` | tokens, tipografia, componentes base |
| `01 — Home / Desktop` · `02 — Home / Mobile 390` | home |
| `03 — Blog / Index` · `04 — Blog / Post` | blog |
| `05 — Theme / Polaris` | página do tema Polar Dark |
| `06 — Brand / Polaris` · `07 — Brand / Social` | peças de marca (OG, LinkedIn) |
| `08 — Asylum / Lançamento` | landing do Asylum + posts de LinkedIn |

As variáveis ficam em duas coleções: `Primitives` (`color/violet/500`, `color/ink/100`…) e
`Semantic` (`color/text/primary`, `code/bg`…), que apontam para os primitivos. Elas espelham
`app/globals.css` e `design-system/vinicius-engelage-portfolio/MASTER.md`.

## Fluxo de leitura

Leia do geral para o detalhe. Não puxe a página inteira em profundidade máxima.

1. `list_documents`: confirme o documento e o id da página.
2. `get_page_tree` com `depth: 3`: veja as seções (`section-*`) e os frames de topo.
3. Para cada seção: `query_nodes` com `//*[@id='<id>']//TEXT` para pegar a cópia, e
   `describe` ou `get_node` (com `depth` baixo) para layout, gaps e paddings.
4. `node_bindings` / `boundVariables` em `get_node`: descubra qual variável cada cor usa.
   Traduza para o token CSS (`color/text/primary` → `--text-primary`). Hex cru no código
   só se o design também estiver sem variável, e nesse caso avise.
5. `export_image` em `maxEdge` baixo (≤ 1280) para conferir visualmente a seção antes e
   depois de implementar.

## Regras de tradução

- **Tokens primeiro.** Toda cor, espaço e raio vira token de `app/globals.css`. Valor fora da
  grade de 4px no design é erro do design: arredonde para a grade e avise.
- **Tracking:** os títulos do arquivo têm `letter-spacing` 0. No CSS siga o `MASTER.md`
  (`-0.03em` / `-0.04em` nos displays).
- **Estrutura, não coordenadas.** Frames com auto-layout viram flex/grid. Posicionamento
  absoluto só nas peças de `brand/`, que precisam bater pixel a pixel com o frame (o HTML
  documenta qual frame traduz).
- **Fundos repetitivos** (`blueprint-v`/`blueprint-h`, anéis) viram um elemento com
  `background-image`/`repeating-*-gradient`, nunca N divs.
- **Screenshots** (`shot/*`, retângulos com image fill) viram imagens em `public/`. Use o
  arquivo original, não `export_image`: o `.fig` é um zip e cada image fill está em
  `images/<imageHash>` (o hash aparece no `get_jsx` do nó). `unzip` + `cwebp -lossless`.
  O `export_image` reamostra e perde nitidez, e em WEBP falha com "No visible nodes".
- A cópia do design é a fonte. Não reescreva texto por conta própria. Se algo parecer errado,
  pergunte.

## Revisão design ↔ código

Para conferir uma implementação: exporte a seção do Open Pencil e abra a rota local no
navegador (`browser_open` + `browser_screenshot`), compare seção a seção e liste as diferenças
com o id do nó e o arquivo/linha do código. Não altere o arquivo de design sem pedido explícito.
