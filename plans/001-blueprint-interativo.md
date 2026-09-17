# 001 — Tornar o blueprint do hero reativo ao cursor

- **Status**: DONE (revisado após feel check do dono)
- **Commit**: projeto sem git no momento da auditoria
- **Severity**: MEDIUM (aditivo — categoria 8)
- **Category**: 8 — Missed opportunities
- **Estimated scope**: 3 arquivos, ~140 linhas

> **Revisão pós-implementação.** A primeira versão usava um quadrado de 64px que
> percorria a grade — chamava atenção demais e competia com o h1. Substituído por um
> **rastro de pontos**: ao atravessar um cruzamento nasce um ponto idêntico aos
> `.blueprint__node` fixos (5px, `box-shadow: 0 0 14px`), que acende e some sozinho em
> 1100ms. Pool de 14 elementos em rodízio, sem criar/destruir DOM. A classe
> `.blueprint__cursor` foi removida; a atual é `.blueprint__spark`. O restante do plano
> (snap de 64px, listener no pai, transform direto no elemento, gates de pointer e
> reduced-motion) permanece válido.

## Problema

O blueprint é o primeiro elemento visual da página e ocupa a dobra inteira, mas é
completamente inerte: roda igual com a página aberta e abandonada.

Dois bloqueadores estruturais impedem qualquer reação ao cursor hoje:

```css
/* app/globals.css:452-456 — atual */
.blueprint {
  position: absolute;
  z-index: -2;
  inset: 0;
  pointer-events: none;
```

`pointer-events: none` tira a camada do hit-testing e `z-index: -2` a coloca atrás do
conteúdo. Nenhum `:hover` em CSS puro alcança esse elemento.

Além disso, **a grade é `background-image`, não elementos** — não existem "cruzamentos"
no DOM:

```css
/* app/globals.css:457-470 — atual */
  background-image:
    linear-gradient(to right, rgb(168 85 247 / 4.5%) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(168 85 247 / 4.5%) 1px, transparent 1px),
    linear-gradient(to right, rgb(168 85 247 / 9%) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(168 85 247 / 9%) 1px, transparent 1px);
  background-size:
    64px 64px,
    64px 64px,
    256px 256px,
    256px 256px;
```

Os 4 `.blueprint__node` existentes estão em percentuais arbitrários
(`components/sections/hero.tsx:4-9`) que **não coincidem** com as interseções de 64px.

## Target

Um único elemento que "gruda" (snap) no cruzamento de 64px mais próximo do cursor e
pulsa ali. Mantém a grade como `background-image` (1 elemento, não 40 divs) e o
`pointer-events: none` do blueprint — o listener vai no `.hero`, não na camada.

```css
/* target — app/globals.css */
.blueprint__cursor {
  position: absolute;
  top: 0;
  left: 0;
  width: 64px;
  height: 64px;
  margin: -32px 0 0 -32px;
  border: 1px solid var(--accent);
  border-radius: var(--space-1);
  background: rgb(168 85 247 / 7%);
  box-shadow: 0 0 24px -4px rgb(168 85 247 / 45%);
  opacity: 0;
  pointer-events: none;
  /* opacity só; o transform é setado direto no elemento pelo JS */
  transition: opacity 200ms var(--ease-out);
  will-change: transform;
}

.blueprint__cursor[data-active="true"] {
  opacity: 1;
}
```

Regra de performance a respeitar (AUDIT.md §5): *"Don't drive child transforms via a CSS
variable on the parent — it recalcs styles for all children. Set `transform` directly on
the element."* → o JS escreve `el.style.transform`, **nunca** `--x`/`--y` no pai.

Duração de 200ms e curva `--ease-out` vêm do orçamento de "tooltips, small popovers"
(AUDIT.md §2: 125–200ms), porque é exatamente essa a natureza do elemento.

## Repo conventions to follow

- Tokens de motion vivem em `app/globals.css:109-113`. O plano **003** introduz
  `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`. Se `--ease-out` ainda não existir quando
  você executar, **use o literal `cubic-bezier(0.23, 1, 0.32, 1)`** e deixe um comentário
  `/* TODO: trocar por var(--ease-out) após o plano 003 */`.
- Componentes client levam `"use client"` na primeira linha — exemplar:
  `components/reveal.tsx:1`.
- Assets decorativos recebem `aria-hidden="true"` — exemplar:
  `components/sections/hero.tsx:30`.
- CSS é comentado em português explicando a intenção — exemplar: `app/globals.css:450-451`.

## Steps

1. **Criar `components/blueprint-grid.tsx`** (Client Component):
   - `"use client"` no topo.
   - Props: `nodes: { left: string; top: string; dur: string }[]`.
   - Renderiza o mesmo markup que hoje está em `hero.tsx:29-37` (div `.blueprint` +
     os `span.blueprint__node`), **mais** um `<span className="blueprint__cursor" />`.
   - `useRef` no wrapper `.blueprint` e no cursor.
   - `useEffect` que:
     - Sai cedo (sem registrar listener) se
       `window.matchMedia("(prefers-reduced-motion: reduce)").matches` **ou**
       `!window.matchMedia("(hover: hover) and (pointer: fine)").matches`.
     - Registra `pointermove` no **elemento pai do blueprint** (use
       `blueprintRef.current.parentElement`, que é a `<section className="band hero">`).
     - No handler: calcula `x = event.clientX - rect.left`, `y = event.clientY - rect.top`
       relativo ao `getBoundingClientRect()` do blueprint; faz snap com
       `Math.round(x / 64) * 64` e o mesmo para `y`.
     - Agenda a escrita num `requestAnimationFrame` (guarde o id e cancele o anterior)
       e escreve **direto**: `cursorRef.current.style.transform = \`translate3d(${sx}px, ${sy}px, 0)\``.
     - `setAttribute("data-active", "true")` no cursor; em `pointerleave` do pai,
       `"false"`.
     - Cleanup: `removeEventListener` dos dois eventos e `cancelAnimationFrame`.
2. **`app/globals.css`**: adicionar as regras `.blueprint__cursor` e
   `.blueprint__cursor[data-active="true"]` exatamente como na seção *Target*, logo
   depois do bloco `.blueprint__node` (hoje em `globals.css:472-489`).
3. **`app/globals.css`**, bloco de reduced motion (`:775-799`): adicionar
   `.blueprint__cursor` à lista de seletores que recebem `animation: none` — e garantir
   que ele também fique `opacity: 0`, já que o JS nem chega a ativá-lo.
4. **`components/sections/hero.tsx`**: substituir o bloco JSX de `:29-38`
   (a div `.blueprint` com os nodes) por `<BlueprintGrid nodes={nodes} />`. Manter o
   `<div className="bloom hero__bloom" aria-hidden="true" />` como está. Manter o array
   `nodes` onde está (linhas 4-9) e passá-lo como prop.

## Boundaries

- **NÃO** transforme a grade em elementos DOM. Ela continua sendo `background-image`.
- **NÃO** remova `pointer-events: none` de `.blueprint` nem mude seu `z-index`.
- **NÃO** use CSS custom properties no pai para mover o cursor (regra de §5 citada acima).
- **NÃO** toque em `.bloom`, `.signal`, `.reveal` ou qualquer coisa fora do blueprint.
- **NÃO** adicione dependências.
- Se o código encontrado divergir do citado aqui, **PARE e reporte** em vez de improvisar.

## Verification

- **Mecânica**: `bun run typecheck` e `bun run build` passam sem erro novo.
- **Feel check** (`bun run dev`, abrir `/`):
  - Mover o mouse pelo hero: o quadrado violeta **salta de cruzamento em cruzamento**,
    nunca segue o cursor continuamente. Se ele desliza suavemente, o snap está errado.
  - O quadrado está **alinhado com as linhas da grade** — as bordas dele coincidem com
    linhas do blueprint, não ficam 10px fora.
  - Ao tirar o mouse da seção, o quadrado some por fade (200ms), não corta.
  - Em DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce": mover o mouse
    **não** faz nada aparecer.
  - Em DevTools → dispositivo móvel (touch): nenhum listener é registrado; verifique que
    `pointermove` não aparece em Event Listeners do `<section class="band hero">`.
  - Em DevTools → Performance, gravar 5s movendo o mouse pelo hero: não deve haver
    *Recalculate Style* recorrente com contagem alta de elementos afetados. Se houver,
    o transform está sendo escrito no pai em vez do próprio cursor.
- **Done when**: o pulse acompanha a grade em snap, some em reduced-motion e em touch,
  e o Performance não mostra recalc em cascata.
