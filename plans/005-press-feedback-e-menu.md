# 005 — Press feedback universal e conserto do menu mobile

- **Status**: DONE
- **Commit**: projeto sem git no momento da auditoria
- **Severity**: HIGH
- **Category**: 3 (physicality) + 4 (interruptibility) + 5 (performance)
- **Estimated scope**: 4 arquivos, ~60 linhas

## Problema

### a) Só existe um `:active` no projeto inteiro

`grep -rn ":active" app/ components/` retorna **uma** ocorrência: `globals.css:362`.

Todo o resto responde apenas a `:hover`, **que não existe em touch**. No mobile, tocar
qualquer coisa não produz resposta visual até a navegação acontecer.

Inventário dos pressionáveis sem `:active` (todos confirmados):

| Arquivo:linha | Seletor |
|---|---|
| `app/globals.css:404` | `.link-arrow` |
| `app/globals.css:601` | `.nav__menu` (hamburger — **mobile-only**) |
| `app/globals.css:657` | `.nav__overlay a` |
| `app/styles/home.css:221` | `.project__link` |
| `app/styles/home.css:430` | `.writing__post` |
| `app/styles/home.css:521` | `.contact__email` (**CTA primário da página**) |
| `app/styles/blog.css:87` | `.copy-button` |
| `app/styles/blog.css:277` | `.tag-filter__pill` |
| `app/styles/blog.css:419` | `.post-card` |
| `app/styles/blog.css:618` | `.post-back` |
| `app/styles/blog.css:727` | `.toc__link` |
| `app/styles/blog.css:1014` | `.share__item` |
| `app/styles/blog.css:1094` | `.post-nav__card` |

O `.contact__email` sequer tem `transform` na lista de `transition`
(`home.css:538-541`).

### b) O stagger do menu mobile não inverte e é cortado no meio

```tsx
/* components/site-nav.tsx:83 — atual */
              style={{ transitionDelay: `${80 + index * 70}ms` }}
```

O `transitionDelay` é estilo inline permanente — **não é condicionado a `open`**. Aplica-se
igual à entrada e à saída. Três consequências:

1. **O stagger não inverte**: ao fechar, o primeiro link sai primeiro; o correto seria o
   inverso.
2. **A resposta ao toque fica presa 80–290ms**: o usuário toca no X e nada se move.
   AUDIT.md §4: *"deliberate phases animate slower; the system's response snaps. Symmetric
   timing on press-and-release is a finding."*
3. **A saída é cortada**: o container some em 700ms (`globals.css:641-643`), mas o último
   link só terminaria em 990ms — os 290ms finais acontecem atrás de um overlay já
   invisível.

### c) `backdrop-filter: blur(40px)` num overlay mobile-only

```css
/* app/globals.css:631-644 — atual */
.nav__overlay {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(40px);
  transition:
    opacity var(--dur-slow) var(--ease),
    visibility var(--dur-slow) var(--ease);
}
```

AUDIT.md §5: *"Keep transition-time `filter: blur()` under 20px."* São **40px — o dobro do
teto** — e `backdrop-filter` é mais caro que `filter` porque reamostra tudo pintado abaixo
de um elemento `inset: 0`. E roda **só no mobile**: `.nav__menu` só vira `display: flex`
dentro de `@media (max-width: 720px)` (`globals.css:758-760`).

### d) Press do `.btn` é simétrico

```css
/* app/globals.css:328-333 e :362-364 — atual */
    transform var(--dur-fast) var(--ease);
```
```css
.btn:active {
  transform: scale(0.98);
}
```

180ms para afundar e 180ms para voltar. AUDIT.md §2 dá 100–160ms para press feedback, e
§4 pede assimetria: o press é deliberado, o release deve *snap*.

## Target

```css
/* target — app/globals.css, classe utilitária nova, perto de .btn */
/* press feedback: existe em touch, onde :hover não existe */
.btn,
.link-arrow,
.nav__menu,
.nav__overlay a,
.project__link,
.writing__post,
.contact__email,
.copy-button,
.tag-filter__pill,
.post-card,
.post-back,
.toc__link,
.share__item,
.post-nav__card {
  transition-property: transform;
  transition-duration: var(--dur-instant);
  transition-timing-function: var(--ease-out);
}

.btn:active,
.link-arrow:active,
.nav__menu:active,
.nav__overlay a:active,
.project__link:active,
.writing__post:active,
.contact__email:active,
.copy-button:active,
.tag-filter__pill:active,
.post-card:active,
.post-back:active,
.toc__link:active,
.share__item:active,
.post-nav__card:active {
  transform: scale(0.97);
}
```

⚠️ **Cuidado**: essa lista de seletores **sobrescreve** `transition-property` das regras
existentes de cada elemento. Não use o bloco acima literalmente se isso quebrar as
transições de cor já declaradas. **Prefira adicionar `transform` à lista de `transition`
de cada regra existente** e só então criar o `:active`. Veja Steps.

`scale(0.97)` e `--dur-instant` (120ms) vêm de AUDIT.md §3/§2. Assimetria:

```css
/* target — app/globals.css, .btn */
.btn {
  transition:
    background var(--dur-fast) var(--ease-hover),
    border-color var(--dur-fast) var(--ease-hover),
    box-shadow var(--dur-fast) var(--ease-hover),
    transform var(--dur-instant) var(--ease-out);
}

.btn:active {
  transform: scale(0.97);
  /* o press é deliberado; o release snap */
  transition-duration: 60ms;
}
```

```tsx
/* target — components/site-nav.tsx: delay só na entrada */
style={{ transitionDelay: open ? `${80 + index * 70}ms` : "0ms" }}
```

```css
/* target — app/globals.css, .nav__overlay */
  backdrop-filter: blur(16px);
```

16px fica sob o teto de 20px e visualmente é indistinguível a 92% de opacidade de fundo.

## Repo conventions to follow

- `.btn` (`globals.css:317-364`) é o **único** exemplar correto de press no repo:
  `transform: scale(0.98)` em `:active` com transição própria. Imite a estrutura dele.
- Tokens do plano **003**: `--dur-instant: 120ms`, `--ease-out`, `--ease-hover`. Se ainda
  não existirem, use `120ms` e `cubic-bezier(0.23, 1, 0.32, 1)` com `/* TODO */`.
- Componentes client usam estilo inline só para valores dinâmicos — exemplar:
  `components/reveal.tsx:45`.

## Steps

1. `app/globals.css`: atualizar `.btn` conforme *Target* (curvas novas + `scale(0.97)` +
   `transition-duration: 60ms` no `:active`).
2. Para **cada** seletor do inventário em (a): localizar a regra existente, **adicionar**
   `transform var(--dur-instant) var(--ease-out)` à lista de `transition` já declarada
   (sem remover o que existe), e criar a regra `:active { transform: scale(0.97); }`.
   - Para `.contact__email` (`home.css:538-541`), `transform` ainda não está na lista —
     adicione.
   - Para `.post-card` e `.post-nav__card`, que já usam `transform` no hover: o `:active`
     deve **compor**, não conflitar. Use `transform: translateY(-4px) scale(0.97)` no
     `:active` do `.post-card` e o equivalente com `-2px` no `.post-nav__card`.
3. `components/site-nav.tsx:83`: trocar o `transitionDelay` inline por
   `open ? \`${80 + index * 70}ms\` : "0ms"`.
4. `components/site-nav.tsx:91`: mesma troca para o link "Contato".
5. `app/globals.css:640`: `backdrop-filter: blur(40px)` → `blur(16px)`.

## Boundaries

- **NÃO** remova nenhuma transição de cor existente ao adicionar `transform`.
- **NÃO** mude a estrutura do `site-nav.tsx` além dos dois `style={{}}`.
- **NÃO** altere `--dur-slow` (isso é do plano 003).
- **NÃO** adicione dependências.
- Se um seletor do inventário não existir mais onde indicado, **PARE e reporte**.

## Verification

- **Mecânica**:
  - `bun run typecheck` e `bun run build` passam.
  - `grep -rc ":active" app/styles/*.css app/globals.css` → soma ≥ 13.
- **Feel check** (`bun run dev`):
  - DevTools → device mode com touch: tocar e **segurar** em cada um dos elementos do
    inventário → todos afundam levemente. Soltar → voltam rápido (mais rápido que o
    afundar).
  - O CTA `.contact__email` afunda ao pressionar. Esse é o teste mais importante.
  - Menu mobile (≤720px): abrir → os links entram em escada. **Fechar → eles somem
    imediatamente**, sem esperar. Abrir/fechar rápido 5x seguidas não deixa nenhum link
    preso a meio caminho.
  - Em DevTools → Animations a 10%, abrir o menu e confirmar que nenhum link ainda está se
    movendo depois que o overlay ficou invisível.
  - Em DevTools → Performance, gravar a abertura do menu num throttle de CPU 4x: o blur
    de 16px não deve produzir frames longos visíveis.
- **Done when**: todo pressionável responde ao toque, o menu fecha instantaneamente, e o
  release do press é mais rápido que o press.
