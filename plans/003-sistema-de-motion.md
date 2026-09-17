# 003 — Substituir o `--ease` único por curvas nomeadas e tokenizar durações

- **Status**: DONE
- **Commit**: projeto sem git no momento da auditoria
- **Severity**: HIGH
- **Category**: 2 (easing & duration) + 7 (cohesion & tokens)
- **Estimated scope**: 4 arquivos CSS, ~40 pontos de substituição

## Problema

Existe **um único token de curva** governando quatro tipos de movimento distintos:

```css
/* app/globals.css:109-113 — atual */
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --dur-fast: 180ms;
  --dur: 280ms;
  --dur-slow: 700ms;
```

`--ease` é um ease-out muito forte (quase easeOutExpo) aplicado indistintamente a:

- **entrada** — `.reveal` (`globals.css:530-533`), `.nav__overlay a` (`:664-666`)
- **hover/cor** — `.nav__links a` (`:588`), `.contact__socials a` (`home.css:567`),
  `.prose-a` (`blog.css:823`), `.toc__link` (`blog.css:736`), `.post-back` (`blog.css:626`)
- **movimento em tela** — `.writing__title` (`home.css:461`), `.post-card` (`blog.css:428`)
- **loop infinito** — `breathe` (`globals.css:437`), `node-pulse` (`:478`),
  `signal-pulse` (`:503`), `echo` (`home.css:335`), `mk-pulse` (`mockups.css:772`)

AUDIT.md §2 define a ordem de decisão: entrada → `ease-out`; movimento na tela →
`ease-in-out`; hover/cor → `ease`; movimento constante → `linear`.

Consequências concretas: em hover a cor "salta e pendura"; nos três loops com `alternate`
a inversão acontece no ponto de menor velocidade, produzindo *throb* em vez de respiração.

Problemas adjacentes confirmados:

- **`--ease-spring` é token morto** — `grep -rn "ease-spring"` retorna 1 ocorrência: a
  própria declaração. Pior, o overshoot `1.56` é curva de *bounce*, oposta à personalidade
  "crisp, não playful" do portfólio. É uma armadilha carregada para o próximo contribuidor.
- **Durações hardcoded** em `mockups.css:769-800`: `2s`, `1200ms`, `1200ms`, `600ms`,
  `600ms`, `560ms` — seis valores, nenhum token, com `600` e `560` sendo a mesma intenção.
- **Hover de cor a 280ms** (`--dur`) em 5 pontos, quando `--dur-fast: 180ms` já existe e
  já é usado em `.copy-button` (`blog.css:98-101`).

## Target

```css
/* target — app/globals.css, substituindo as linhas 109-113 */
  /* curvas por tipo de movimento (AUDIT.md §2) */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* entradas e saídas */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* movimento na tela */
  --ease-hover: ease;                               /* cor e hover */
  /* movimento constante usa `linear` direto, sem token */

  --dur-instant: 120ms;  /* press feedback */
  --dur-fast: 180ms;     /* hover, cor */
  --dur: 280ms;          /* transições de UI */
  --dur-slow: 420ms;     /* overlays, drawers */
  --dur-draw: 1200ms;    /* desenho ilustrativo dos mockups */

  --stagger: 60ms;       /* passo padrão de escalonamento */
```

Mapa de substituição (aplicar em `globals.css`, `home.css`, `blog.css`, `mockups.css`):

| Contexto | De | Para |
|---|---|---|
| `.reveal`, `.nav__overlay a`, entradas | `var(--ease)` | `var(--ease-out)` |
| hover de cor (5 pontos listados acima) | `var(--dur) var(--ease)` | `var(--dur-fast) var(--ease-hover)` |
| `transform` em hover (`.writing__title`, `.post-card`, `.post-nav__card`, `.feature`) | `var(--ease)` | `var(--ease-in-out)` |
| `breathe`, `node-pulse`, `signal-pulse`, `echo`, `mk-pulse` | `var(--ease)` | `linear` |
| `.btn` `transform` | `var(--dur-fast)` | `var(--dur-instant)` |
| `mk-draw`, `mk-fade` | `1200ms` | `var(--dur-draw)` |
| `mk-grow-x`, `mk-grow-y` (600/600/560ms) | literais | `var(--dur-slow)` (420ms) |

`--dur-slow` cai de 700ms para **420ms** porque AUDIT.md §2 dá o teto de 500ms para
modais/drawers, e 700ms estourava em 40%. Isso corrige de uma vez o overlay do menu
mobile e a duração do `.reveal`.

Remover `--ease-spring` inteiramente.

## Repo conventions to follow

- Todos os tokens vivem no `:root` de `app/globals.css` (linhas 14-140), agrupados por
  comentário de seção. Mantenha o agrupamento e o estilo de comentário em português.
- `mockups.css` já tokeniza easing (`var(--ease)` em toda animação) — a inconsistência é
  só nas durações. Siga o padrão que o arquivo já demonstra.
- O `.copy-button` (`blog.css:96-101`) é o exemplar de hover correto no repo: usa
  `--dur-fast`. Imite-o.

## Steps

1. `app/globals.css`: substituir o bloco de tokens de motion (linhas 109-113) pelo bloco
   *Target*. Remover `--ease-spring`.
2. `app/globals.css`: aplicar o mapa de substituição em todas as ocorrências de
   `var(--ease)`. Ler cada uma e classificar pelo contexto (entrada / hover / movimento /
   loop) antes de trocar. **Não faça find-and-replace cego.**
3. `app/styles/home.css`: mesma operação.
4. `app/styles/blog.css`: mesma operação.
5. `app/styles/mockups.css`: mesma operação + trocar as 6 durações literais pelos tokens
   da tabela.
6. Buscar `grep -rn "var(--ease)" app/` e confirmar **zero** ocorrências restantes.
7. Buscar `grep -rn "ease-spring" app/ components/` e confirmar **zero**.

## Boundaries

- **NÃO** mude valores de `transform`, `opacity`, cores ou geometria — só curvas e durações.
- **NÃO** adicione nem remova regras CSS; apenas altere valores de timing.
- **NÃO** toque em arquivos `.tsx` (os delays inline do hero/contact são do plano 005).
- **NÃO** adicione dependências.
- Se encontrar `var(--ease)` num contexto que não se encaixa em nenhuma linha da tabela,
  **PARE e reporte** em vez de escolher por conta própria.

## Verification

- **Mecânica**:
  - `bun run typecheck` e `bun run build` passam.
  - `grep -rn "var(--ease)" app/` → 0 resultados.
  - `grep -rn "ease-spring" app/ components/` → 0 resultados.
- **Feel check** (`bun run dev`):
  - Hover num link da nav: a cor muda em ~180ms, de forma linear e sem "pendurar".
  - Hero: o bloom agora respira de forma contínua — sem o throb de parada no fim de cada
    meio-ciclo. Observe por 20s.
  - Menu mobile (viewport ≤720px): abre e fecha visivelmente mais rápido que antes
    (420ms vs 700ms), sem parecer abrupto.
  - Em DevTools → Animations a 10%, comparar `breathe` antes/depois: a nova curva não deve
    ter ponto de parada perceptível na inversão.
- **Done when**: nenhum `var(--ease)` resta, o bloom respira sem throb, e hover de cor
  responde em 180ms.
