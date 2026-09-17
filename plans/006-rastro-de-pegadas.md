# 006 — Suavizar o spark e transformar o rastro em pegadas que decaem

- **Status**: DONE (revisado — v2 abaixo)
- **Commit**: projeto sem git no momento da auditoria
- **Severity**: LOW (polimento de um efeito já aprovado)

> **Revisão v2 — o fade continuava "duro".**
> A v1 usava um `easing` cubic-bezier por keyframe. O erro: a WAAPI interpola cada
> trecho de forma independente, então no offset `0.26` a opacidade vinha desacelerando
> (`cubic-bezier(0.33, 0, 0.67, 1)` termina com derivada ~0) e o segmento seguinte
> (`cubic-bezier(0, 0, 0.58, 1)`, ease-out) **começava com derivada alta** — solavanco
> no exato instante em que o ponto deveria dissipar.
> **Correção:** 15 keyframes densos com `easing: "linear"` global, modelando a curva à
> mão. Deltas de opacidade decrescentes nas duas pontas (aceleração zero nos extremos);
> o último passo é de 0.02, abaixo do limiar perceptível. Além disso o ponto ganhou
> borda em `radial-gradient` — um disco de borda dura tem um degrau de opacidade que
> chama atenção para o instante de aparecer, mesmo com a curva temporal correta.
- **Category**: 2 (easing & duration) + 3 (physicality)
- **Estimated scope**: 1 arquivo, ~30 linhas

## Problema

O rastro do blueprint funciona, mas tem cinco defeitos de craft que impedem a sensação
de "pegadas":

```js
/* components/blueprint-grid.tsx:63-75 — atual */
        spark.animate(
          [
            { opacity: 0, transform: `${at} scale(0.3)` },
            { opacity: 1, transform: `${at} scale(1)`, offset: 0.16 },
            { opacity: 0.85, transform: `${at} scale(1)`, offset: 0.4 },
            { opacity: 0, transform: `${at} scale(0.9)` },
          ],
          {
            duration: SPARK_MS,
            easing: "cubic-bezier(0.23, 1, 0.32, 1)",
            fill: "forwards",
          },
        );
```

1. **Um `easing` único para o ciclo inteiro.** A WAAPI aplica a curva declarada em
   `options` a **cada segmento** entre keyframes. `cubic-bezier(0.23, 1, 0.32, 1)` é um
   ease-out forte — ótimo para acender, errado para apagar: o desaparecimento dispara e
   trava, em vez de dissipar. A saída é o momento que o usuário mais observa num rastro.
2. **`scale(0.3)` na entrada.** Um ponto de 5px começando em 1,5px estala. AUDIT.md §3
   pede `scale(0.9–0.97)` justamente porque *"nothing in the real world appears from
   nothing"* — 0.3 está longe demais do repouso.
3. **`scale(0.9)` na saída.** Encolher ao sumir lê como "sugado". Pegadas dissipam —
   crescem de leve enquanto perdem opacidade.
4. **Sem patamar de rastro.** A opacidade vai de `0.85` direto a `0`. Todos os pontos
   vivos ficam em faixas parecidas de brilho, então não existe gradiente entre o ponto
   recém-nascido e os anteriores — que é exatamente o que cria a leitura de "pegadas".
5. **Pool de 14 sem throttle.** `SPARK_MS` é 1100ms e não há intervalo mínimo entre
   gerações. Num movimento rápido o rodízio dá a volta antes de os pontos morrerem e
   `spark.animate()` **corta** a animação em curso — o ponto some por corte, não por fade.

## Target

Easing **por keyframe** (a WAAPI aceita `easing` dentro de cada keyframe; ele governa o
segmento que começa naquele ponto), com um patamar explícito de rastro:

```js
/* target */
        spark.animate(
          [
            {
              opacity: 0,
              transform: `${at} scale(0.5)`,
              easing: "cubic-bezier(0.23, 1, 0.32, 1)",
            },
            {
              opacity: 1,
              transform: `${at} scale(1)`,
              offset: 0.09,
              easing: "cubic-bezier(0.33, 0, 0.67, 1)",
            },
            {
              opacity: 0.5,
              transform: `${at} scale(1)`,
              offset: 0.26,
              easing: "cubic-bezier(0, 0, 0.58, 1)",
            },
            { opacity: 0, transform: `${at} scale(1.18)` },
          ],
          { duration: SPARK_MS, fill: "forwards" },
        );
```

Leitura do ciclo com `SPARK_MS = 1400`:

| Trecho | Tempo | Curva | O que acontece |
|---|---|---|---|
| 0 → 9% | 0–126ms | ease-out forte | acende de `scale(0.5)` a `1` |
| 9% → 26% | 126–364ms | suave simétrica | cai de `1` para `0.5` — o "nível de pegada" |
| 26% → 100% | 364–1400ms | ease-out gentil | arrasta de `0.5` a `0`, crescendo até `1.18` |

O patamar em `0.5` é o que produz o gradiente: o ponto sob o cursor está em `1`, os
anteriores estacionam perto de `0.5` e vão se apagando devagar. Com movimento normal
(~200ms por cruzamento) ficam ~4 pontos legíveis, cada um mais fraco que o anterior.

O ease-out gentil (`cubic-bezier(0, 0, 0.58, 1)`) no trecho longo é o ponto-chave da
suavidade: a opacidade desacelera perto de zero, então o ponto **nunca tem um instante
de corte** — ele deixa de existir sem que se perceba quando.

Constantes:

```js
const SPARKS = 24;      /* era 14 */
const SPARK_MS = 1400;  /* era 1100 */
const MIN_GAP_MS = 60;  /* novo: intervalo mínimo entre pontos */
```

`24 × 60ms = 1440ms ≥ 1400ms` — o rodízio só volta a um elemento **depois** de ele ter
morrido. Zero corte, por construção.

## Repo conventions to follow

- O componente é Client (`"use client"` em `components/blueprint-grid.tsx:1`) e todo o
  movimento vive dentro do `useEffect`, atrás dos dois `matchMedia` de guarda
  (`:31-34`). Não mexa nessa estrutura.
- Constantes em `SCREAMING_SNAKE` no topo do arquivo com comentário explicando a
  unidade — exemplar: `const CELL = 64;` em `:8`.
- Comentários em português explicando o *porquê*, não o *o quê*.

## Steps

1. `components/blueprint-grid.tsx`: trocar `SPARKS` de `14` para `24` e `SPARK_MS` de
   `1100` para `1400`, atualizando os comentários das duas constantes.
2. Adicionar `const MIN_GAP_MS = 60;` com comentário explicando que ele existe para o
   rodízio nunca alcançar um ponto ainda vivo.
3. Dentro do `useEffect`, adicionar `let lastSpawn = 0;` junto das outras variáveis de
   estado do closure (`frame`, `cursor`, `lastCell`).
4. No handler, **depois** da checagem de célula nova e **antes** de pegar o spark do
   pool: `const now = performance.now(); if (now - lastSpawn < MIN_GAP_MS) return;` e
   então `lastSpawn = now;`.
5. Substituir a chamada `spark.animate(...)` (`:63-75`) pelo bloco *Target*, removendo o
   `easing` de `options` (agora ele vive em cada keyframe).
6. Em `onLeave`, resetar `lastSpawn = 0;` junto de `lastCell = ""`.

## Boundaries

- **NÃO** mude o CSS de `.blueprint__spark` em `app/globals.css` — a aparência do ponto
  já está correta e foi aprovada.
- **NÃO** adicione `filter`/`blur` em lugar nenhum: o glow é do `box-shadow`, de
  propósito.
- **NÃO** mexa nos guards de `prefers-reduced-motion` nem de `(hover: hover)`.
- **NÃO** mude `CELL`, a lógica de snap ou os listeners.
- **NÃO** adicione dependências.

## Verification

- **Mecânica**: `bun run typecheck` e `bun run build` passam.
- **Feel check** (`bun run dev`, `/`):
  - Mover o mouse devagar pelo hero: deve haver um **gradiente visível** entre o ponto
    sob o cursor e os anteriores — o mais recente claramente mais forte.
  - Nenhum ponto deve **sumir de repente**. Observe o fim do rastro: os últimos devem
    apagar sem um instante de corte.
  - Mover o mouse **muito rápido** de um lado ao outro da dobra e parar: nenhum ponto
    deve piscar ou reaparecer. Se algum "pular" de opacidade, o rodízio está alcançando
    pontos vivos — aumente `SPARKS` ou `MIN_GAP_MS`.
  - Em DevTools → Animations, baixar a velocidade para 10% e confirmar que a entrada é
    visivelmente mais rápida que a saída (126ms vs ~1000ms).
  - `prefers-reduced-motion: reduce`: mover o mouse não gera nada.
- **Done when**: o rastro tem gradiente de brilho, nenhum ponto corta ao sumir, e
  movimento rápido não produz piscada.
