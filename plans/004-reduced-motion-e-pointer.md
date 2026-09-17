# 004 — Reduced-motion cirúrgico, gates de pointer e `gap` → `transform`

- **Status**: DONE
- **Commit**: projeto sem git no momento da auditoria
- **Severity**: HIGH
- **Category**: 5 (performance) + 6 (accessibility)
- **Estimated scope**: 3 arquivos CSS, ~50 linhas

## Problema

### a) Reduced-motion é um interruptor geral, não intenção por elemento

```css
/* app/globals.css:780-786 — atual */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
```

AUDIT.md §6: *"Reduced motion means fewer and gentler animations, **not zero** — keep
transitions that aid comprehension, remove position changes."*

O seletor universal com `!important` colapsa **toda** `transition-duration` dos 4
stylesheets, incluindo as puramente cromáticas que não carregam movimento nenhum e
existem só para tornar o estado legível: cor da nav (`globals.css:588`), background do
`.btn` (`:328-330`), `.prose-a` (`blog.css:823`), `.toc__link` (`blog.css:736`). Hover e
foco viram cortes binários.

### b) O mesmo erro repetido no blog, com mais precisão cirúrgica errada

```css
/* app/styles/blog.css:1234-1245 — atual */
  .post-card,
  .post-nav__card,
  .feature,
  .tag-filter__pill,
  .share__item,
  .copy-button,
  .toc__link,
  .toc__marker,
  .prose-a,
  .post-back {
    transition: none;
  }
```

O bloco anterior (`blog.css:1225-1232`) já zera `transform` nos três que se movem — e isso
é suficiente. Este bloco vai além e tira a transição de **seis seletores que nunca se
movem** e só mudam cor. `.toc__marker` é o indicador de posição de leitura: ele passa a
piscar em vez de resolver.

### c) Movimento em hover sem gate de pointer

`grep -c "hover: hover"` retorna **0** nos 4 arquivos CSS. Três regras transladam no hover:

```css
/* app/styles/home.css:464-467 */
.writing__post:hover .writing__title {
  color: var(--text-primary);
  transform: translateX(var(--space-2));
}
```
```css
/* app/styles/blog.css:433-438 */
.post-card:hover {
  border-color: var(--border-strong);
  box-shadow: 0 16px 40px -24px rgb(0 0 0 / 90%);
  transform: translateY(-4px);
}
```
```css
/* app/styles/blog.css:1107-1110 */
.post-nav__card:hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
}
```

Em touch isso dispara no tap e **fica grudado** até outro elemento ser tocado. Os três
estão no caminho principal de navegação, num projeto onde mobile é alvo declarado.

Consequência extra confirmada: sob `prefers-reduced-motion`, o bloco universal só zera a
*duração* — o `translateX` de `.writing__title` continua declarado, então ele
**teleporta** em vez de deslizar. É o único movimento do projeto do qual o usuário de
reduced-motion não escapa.

### d) `gap` animado é propriedade de layout

```css
/* app/globals.css:404-415 — atual */
.link-arrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  transition: gap var(--dur) var(--ease);
}

.link-arrow:hover {
  gap: var(--space-3);
}
```

AUDIT.md §5: *"Animate `transform` and `opacity` only."* `gap` força layout a cada frame
dos 280ms, re-posicionando o glifo e todos os irmãos seguintes.

### e) `will-change` órfão em reduced-motion

`.bloom` (`globals.css:436`) declara `will-change: transform`. Em `:794-798` a animação é
cancelada, mas nada reseta o `will-change` — restam duas camadas promovidas segurando
uma textura `blur(180px)` pela sessão inteira, no caminho de quem pediu *menos* trabalho.

## Target

```css
/* target — app/globals.css, substituindo :775-799 */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  /* movimento sai; cor e opacidade continuam comunicando estado */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-property: opacity, color, background-color, border-color, box-shadow !important;
    transition-duration: 180ms !important;
  }

  .reveal {
    opacity: 1;
    filter: none;
    transform: none;
  }

  .bloom,
  .blueprint__node,
  .blueprint__cursor,
  .signal {
    animation: none;
    /* sem animação, a camada promovida não se paga */
    will-change: auto;
  }

  /* o único movimento que sobrevivia ao interruptor geral */
  .writing__post:hover .writing__title {
    transform: none;
  }
}
```

Trocar `transition-property` em vez de zerar a duração é o ponto: propriedades de
movimento deixam de transicionar (saltam direto), enquanto cor e opacidade continuam
resolvendo em 180ms.

```css
/* target — app/globals.css, substituindo :404-415 */
.link-arrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--accent-bright);
  font-weight: 600;
}

.link-arrow svg {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  /* transform em vez de gap: compositor, não layout */
  transition: transform var(--dur) var(--ease-in-out);
}

@media (hover: hover) and (pointer: fine) {
  .link-arrow:hover svg {
    transform: translateX(var(--space-1));
  }
}
```

```css
/* target — app/styles/blog.css, substituindo :1234-1245 */
  /* só os que realmente se movem perdem a transição de transform;
     os de cor continuam com feedback (AUDIT §6: "fewer and gentler, not zero") */
  .post-card,
  .post-nav__card,
  .feature {
    transition-property: border-color, box-shadow;
  }
```

## Repo conventions to follow

- `app/styles/mockups.css:769` usa `@media (prefers-reduced-motion: no-preference)` —
  a abordagem *opt-in*, que é a mais segura. **É o arquivo exemplar do repo.** Onde fizer
  sentido, prefira esse padrão a desfazer no `reduce`.
- Comentários em português explicando o porquê — exemplar: `app/globals.css:772-774`.
- Tokens vêm do plano **003** (`--ease-in-out`, `--dur-fast`). Se ainda não existirem, use
  os literais `cubic-bezier(0.77, 0, 0.175, 1)` e `180ms` com um `/* TODO */`.

## Steps

1. `app/globals.css`: substituir o bloco `@media (prefers-reduced-motion: reduce)`
   (linhas 775-799) pelo bloco *Target*.
2. `app/globals.css`: substituir `.link-arrow` / `.link-arrow:hover` / `.link-arrow svg`
   (linhas 404-421) pelo bloco *Target*.
3. `app/styles/home.css`: envolver a regra `.writing__post:hover .writing__title`
   (linhas 464-467) em `@media (hover: hover) and (pointer: fine) { … }`. Manter a regra
   de `color` fora do gate — cor pode mudar em touch sem prejuízo; só o `transform` entra.
4. `app/styles/blog.css`: envolver `.post-card:hover` (:433-438) e `.post-nav__card:hover`
   (:1107-1110) em `@media (hover: hover) and (pointer: fine) { … }`. Se houver um
   `.feature:hover` com transform, mesmo tratamento.
5. `app/styles/blog.css`: substituir o segundo bloco de reduced-motion (:1234-1245) pelo
   bloco *Target*, mantendo o primeiro (:1225-1232) intacto.

## Boundaries

- **NÃO** remova as transições de cor em lugar nenhum.
- **NÃO** mude os valores de `transform` (distâncias, escalas) — só onde eles rodam.
- **NÃO** toque em `mockups.css` (já está correto).
- **NÃO** adicione dependências.
- Se o código divergir do citado, **PARE e reporte**.

## Verification

- **Mecânica**:
  - `bun run typecheck` e `bun run build` passam.
  - `grep -rn "transition: gap" app/` → 0 resultados.
  - `grep -rc "hover: hover" app/styles/home.css app/styles/blog.css app/globals.css` →
    cada um ≥ 1.
- **Feel check** (`bun run dev`):
  - Hover em "Ver todos os posts": **a seta desliza**, o texto não se move e nada ao lado
    é empurrado. Em DevTools → Performance, gravar o hover: não deve aparecer *Layout*.
  - DevTools → Rendering → `prefers-reduced-motion: reduce`:
    - Hover num link da nav → a cor ainda **transiciona** (não corta).
    - Hover numa linha da lista de posts → o título **não se desloca**, nem devagar nem
      instantaneamente.
    - O TOC no post ainda acende/apaga com transição de cor.
    - O bloom está parado.
  - DevTools → device mode (touch), tocar num card do blog: ele **não** levanta e não fica
    com aparência de hover depois que o dedo sai.
- **Done when**: nenhuma propriedade de layout é animada, todo transform de hover está
  atrás de gate de pointer, e reduced-motion preserva feedback de cor.
