# 002 — Disparar os mockups na viewport e fazê-los reagir ao hover do card

- **Status**: DONE
- **Commit**: projeto sem git no momento da auditoria
- **Severity**: HIGH
- **Category**: 1 (purpose) + 8 (missed opportunities)
- **Estimated scope**: 2 arquivos (`mockups.css`, `work.tsx`), ~60 linhas

## Problema

### a) As animações de entrada dos mockups rodam fora da tela

```css
/* app/styles/mockups.css:769-800 — atual */
@media (prefers-reduced-motion: no-preference) {
  .mk-bus__node--active::after { animation: mk-pulse 2s var(--ease) infinite alternate; }
  .mk-trix__line { animation: mk-draw 1200ms var(--ease) forwards; }
  .mk-trix__area { animation: mk-fade 1200ms var(--ease) both; }
  .mk-org__budget .mk__track-fill {
    animation: mk-grow-x 600ms var(--ease) both;
    animation-delay: calc(var(--i, 0) * 90ms + 200ms);
  }
  .mk-bus__pillar-fill {
    animation: mk-grow-y 600ms var(--ease) both;
    animation-delay: calc(var(--i, 0) * 70ms + 200ms);
  }
  .mk-trix__bar {
    animation: mk-grow-y 560ms var(--ease) both;
    animation-delay: calc(var(--i, 0) * 45ms + 160ms);
  }
}
```

São `@keyframes` sem gatilho de viewport: começam no load. A seção Work está abaixo da
dobra. O `<Reveal>` que envolve cada card (`components/sections/work.tsx:88`) esconde via
`opacity`/`filter`/`transform` — **não** via `display` ou `content-visibility` — então os
elementos continuam sendo pintados e as animações queimam.

A curva do Trix (`mk-draw`, 1200ms) e as escadas de barras terminam ~1,4s após o load,
com o usuário ainda no hero. Quando ele rola até lá, encontra o estado final. **O trabalho
está feito e não é visto** — e concorre com a hidratação do hero.

### b) O mockup não reconhece o hover do card que o contém

```css
/* app/styles/home.css:154-159 — atual */
.project:hover {
  border-color: rgb(255 255 255 / 16%);
  box-shadow:
    inset 0 1px 0 var(--glass-rim),
    0 0 48px -12px color-mix(in srgb, var(--project-accent) 30%, transparent);
}
```

O card tem estado de hover, mas só borda e sombra mudam. A peça mais elaborada da página
fica congelada.

## Target

**a)** As animações só rodam quando o card entra na viewport, via um atributo que o
`Reveal` já sabe aplicar. O gate passa a ser `[data-visible="true"]`:

```css
/* target — app/styles/mockups.css */
@media (prefers-reduced-motion: no-preference) {
  .reveal.is-visible .mk-trix__line {
    animation: mk-draw 1200ms var(--ease-out) forwards;
  }
  /* mesma troca para .mk-trix__area, .mk-org__budget .mk__track-fill,
     .mk-bus__pillar-fill, .mk-trix__bar — todos prefixados por `.reveal.is-visible ` */

  /* o pulso do nó ativo é loop e pode continuar sem prefixo */
  .mk-bus__node--active::after {
    animation: mk-pulse 2s linear infinite alternate;
  }
}
```

`.reveal.is-visible` já é adicionado por `components/reveal.tsx:38` quando o
IntersectionObserver dispara. Como as animações usam `both`/`forwards`, elas ficam no
estado inicial até a classe aparecer.

`--ease-out` vem do plano **003**. Se ainda não existir, use
`cubic-bezier(0.23, 1, 0.32, 1)` literal. O `mk-pulse` passa a `linear` porque é
movimento constante (AUDIT.md §2: *"Constant motion → linear"*).

**b)** No hover do card, o mockup ganha um realce sutil e coordenado:

```css
/* target — app/styles/mockups.css */
@media (hover: hover) and (pointer: fine) {
  .mk__stage {
    transition: transform 400ms var(--ease-in-out);
  }

  .project:hover .mk__stage {
    transform: scale(1.02);
  }

  /* o card flutuante se destaca um pouco mais que o resto */
  .mk__float {
    transition: transform 400ms var(--ease-in-out);
  }

  .project:hover .mk__float {
    transform: translateY(-6px);
  }
}
```

400ms com `--ease-in-out` (`cubic-bezier(0.77, 0, 0.175, 1)`) porque é *movimento na tela*
(AUDIT.md §2), não entrada. Escala mantida em 1.02 — o card é grande, mais que isso vira
zoom.

## Repo conventions to follow

- `mockups.css` já isola todo movimento em `@media (prefers-reduced-motion: no-preference)`
  (linha 769) — **é o arquivo exemplar do repo nesse quesito**. Mantenha essa estrutura.
- Classes raiz do mockup: `.mk`, `.mk__stage`, `.mk__rig`, `.mk__device`, `.mk__screen`,
  `.mk__float`, `.mk__badge`. Só `--project-accent` é contrato com o card pai.
- `.mk__stage` já tem `transform-origin: 50% 0` e `transform: scale(var(--mk-scale))` —
  **verifique** antes de sobrescrever `transform`; se houver conflito, componha o valor
  ou use uma custom property local em vez de substituir.

## Steps

1. Em `app/styles/mockups.css`, dentro do bloco `@media (prefers-reduced-motion:
   no-preference)` (linha 769): prefixar com `.reveal.is-visible ` os seletores
   `.mk-trix__line`, `.mk-trix__area`, `.mk-org__budget .mk__track-fill`,
   `.mk-bus__pillar-fill` e `.mk-trix__bar`. **Não** prefixar `.mk-bus__node--active::after`.
2. No mesmo bloco, trocar `var(--ease)` por `linear` **apenas** em `mk-pulse`.
3. Antes de tocar em `.mk__stage`, ler a regra existente dele no arquivo. Se já houver
   `transform`, adapte: aplique o scale de hover numa custom property
   (`--mk-hover-scale`, default `1`) e componha — ex.:
   `transform: scale(calc(var(--mk-scale, 1) * var(--mk-hover-scale, 1)))`.
4. Adicionar o bloco `@media (hover: hover) and (pointer: fine)` da seção *Target* ao
   final de `mockups.css`.
5. Nenhuma mudança em `work.tsx` é necessária se o `Reveal` já envolve o card — confirme
   lendo `components/sections/work.tsx:88` que o elemento com `.reveal` é ancestral do
   `.mk`. Se não for, **PARE e reporte**.

## Boundaries

- **NÃO** mude o markup dos três mockups (`components/mockups/*.tsx`).
- **NÃO** altere durações dos keyframes além do especificado.
- **NÃO** toque em `home.css`, `globals.css` ou `blog.css`.
- **NÃO** adicione JavaScript — tudo é CSS, o `Reveal` já existe.
- Se o código divergir do citado, **PARE e reporte**.

## Verification

- **Mecânica**: `bun run typecheck` e `bun run build` passam.
- **Feel check** (`bun run dev`, `/`):
  - Recarregar a página no topo, esperar 3s, **depois** rolar até Selected Work: a curva
    do Trix deve **desenhar na sua frente** e as barras subirem em escada. Se já estiverem
    prontas, o gate não funcionou.
  - Passar o mouse sobre um card: o mockup cresce muito de leve e o card flutuante sobe
    ~6px, ambos em 400ms. Deve parecer que a cena "respira", não que dá um zoom.
  - Em DevTools → Animations, baixar a velocidade para 10% e confirmar que a curva do
    Trix desenha da esquerda para a direita, sem saltos.
  - `prefers-reduced-motion: reduce`: rolar até Work — tudo já no estado final, nada anima,
    e o hover não move nada.
  - Em touch (DevTools device mode): hover não dispara transform nenhum.
- **Done when**: as animações de entrada só acontecem na viewport e o hover do card
  produz resposta visível no mockup, ambos desligados em reduced-motion e em touch.
