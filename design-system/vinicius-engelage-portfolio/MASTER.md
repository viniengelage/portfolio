# Design System — Vinicios Engelage

> Fonte de verdade do portfólio. Espelha os tokens do arquivo Penpot
> (`penpot.library.local.tokens`, sets `primitives` + `semantic`) e o CSS em
> `app/globals.css`. Ao mudar um valor, mude nos dois.

**Direção:** *Engineering Journal* — rigor de grid e tipografia com uma assinatura própria: o
**purple bloom**. Dark-only.

---

## A regra que governa tudo

**O glow tem hierarquia.** No máximo **um foco luminoso por dobra**. O bloom marca a seção; o
glow marca o elemento ativo. Se tudo brilha, nada brilha — foi exatamente o erro da versão
anterior do site (glow em ~15 seletores).

---

## Cores

### Primitivos

| Token | Hex | |
|---|---|---|
| `--violet-300/400/500/600/700/800` | `#d8b4fe` `#c084fc` `#a855f7` `#9333ea` `#7e22ce` `#6d28d9` | assinatura |
| `--ink-900/850/800/700/600/400/300/200/100` | `#08070c` `#0e0d14` `#13111b` `#1f1c2b` `#322c46` `#837c98` `#9c96ae` `#c7c2d6` `#edeaf5` | neutro com viés violeta |
| `--teal-400` `--blue-400` `--amber-400` | `#2dd4bf` `#60a5fa` `#e8b368` | accents de projeto |
| `--rose-400` `--lime-300` | `#fb7185` `#bef264` | só para diff de código |

### Semânticos — **é a estes que os componentes se ligam**

| Token | Referência |
|---|---|
| `--bg-base` / `--bg-raised` / `--bg-surface` | ink 900 / 850 / 800 |
| `--border-subtle` / `--border-strong` / `--border-glow` | ink 700 / ink 600 / violet 800 |
| `--text-primary` / `--text-secondary` / `--text-muted` | ink 100 / 300 / 400 |
| `--accent` / `--accent-bright` / `--accent-deep` | violet 500 / 400 / 800 |
| `--accent-organizadin` / `--accent-bussola` / `--accent-trix` | teal / blue / amber |
| `--status-available` | teal 400 |

> `#08070c` e não `#000`: preto puro causa smear em OLED.

### Accents de projeto

Cada projeto tem o seu, e eles **nunca aparecem lado a lado** — cada um vive isolado no seu card
(tint de 6% no fundo + marca + detalhes). Teal (174°) e azul (213°) são frios; o âmbar (38°) do
Trix abre distância máxima e é quase-complementar do violeta. Semanticamente casa com
renda/dividendos.

### Contraste — verificado, não estimado

Os 24 pares (8 cores de texto × 3 superfícies) passam **WCAG AA**, pior caso **4.72:1**.
`--ink-400` precisou de dois ajustes: `#6b6580` (3.63:1, reprovava) → `#7d7691` (passava só em
`bg-base`) → **`#837c98`** (passa nas três superfícies).

---

## Linguagem glass

Fill translúcido + borda branca baixa + **rim light**: `inset 0 1px 0 rgb(255 255 255 / 14%)`.
É o rim que faz ler como vidro — sem ele vira um retângulo cinza.

| | Fill | Borda |
|---|---|---|
| `.btn--primary` | violeta 16% | `--accent-bright` 42% |
| `.btn--ghost` / `.pill` / `.chip` | branco 4–5% | branco 9–12% |
| `.glass` (nav, painel, card) | `--bg-surface` 72% + `backdrop-filter: blur(20px)` | branco 9% |

**Única exceção sólida:** o monograma `VE`. É a âncora de marca — o único ponto saturado.

---

## Tipografia

| Papel | Fonte | Uso |
|---|---|---|
| Display | **Inter Tight** 500/600/700 | títulos |
| Corpo | **Inter** 400/500/600 | leitura, 17px / 1.65 |
| Mono | **JetBrains Mono** 400/500/700 | labels, dados, código |
| Editorial | **Instrument Serif** italic 400 | 1–2 palavras de acento |

O acento editorial é o gesto de marca: *respira* no hero, *respire* no contato, *constrói* no blog.
Usar com parcimônia — é um tempero, não um tipo de corpo.

Escala fluida (sem breakpoint): `--fs-display` `clamp(34px, 6.2vw, 68px)` · `--fs-h2`
`clamp(30px, 4.4vw, 52px)` · `--fs-lead` `clamp(16px, 1.6vw, 19px)`.

> ⚠️ O Penpot **não aceita `letter-spacing` negativo**. No design o tracking apertado vem da
> escolha da Inter Tight; no CSS use `-0.03em`/`-0.04em` normalmente.

---

## Espaçamento e raio

**Grade de 4px, sem exceção.** `--space-1` a `--space-32` (4 → 128px). Qualquer valor fora da
grade é falha de governança — a auditoria do Penpot pegou 50+ violações ao longo do projeto.

Raio: `--radius-control: 10px` · `--radius-card: 16px` · `--radius-panel: 24px` · `--radius-pill`.

Layout: `--shell: 1200px` · `--measure: 760px` (≈75 caracteres/linha) · `--gutter: 24px` (20 no mobile).

---

## Assets de fundo

Cada seção tem o seu, **derivado do próprio conteúdo** — não é textura decorativa. Assets do site
usam violeta; assets dos cards usam o accent do projeto.

| Seção | Asset | Por quê |
|---|---|---|
| Hero | **Blueprint** — grade 64px + nós | o h1 diz "código que sustenta"; a grade é a estrutura |
| Organizadin | calendário 7×5 com heatmap | o produto organiza *o mês* |
| Bússola | anel dos 7 passos + rosa dos ventos | é literalmente o método |
| Trix | curva de patrimônio + grade de preço | crescimento acumulado |
| Timeline | régua de tempo + ecos no "agora" | o tempo entre os marcos |
| Writing | pilcrow ¶ + parágrafo fantasma | a escrita antes de existir |
| Contact | ondas concêntricas | o sinal sendo emitido |

Opacidade de 4% a 26%. Em código, padrões repetitivos viram **um elemento com
`repeating-linear-gradient`/`background-size`**, nunca N divs.

---

## Tema de código — "Bloom Dark"

Reaproveita os accents do sistema; é isso que faz o código parecer parte do site.

| Token | Cor | Origem |
|---|---|---|
| `--code-keyword` | `#c084fc` | violeta da marca |
| `--code-type` | `#d8b4fe` | violeta claro |
| `--code-string` | `#2dd4bf` | accent Organizadin |
| `--code-function` | `#60a5fa` | accent Bússola |
| `--code-number` | `#e8b368` | accent Trix |
| `--code-comment` | `#837c98` | itálico |
| `--code-deleted` / `--code-inserted` | `#fb7185` / `#bef264` | diff |

Todas ≥ **5.07:1** sobre `--code-bg`. `lib/code-theme.ts` exporta também o formato Shiki.

> ⚠️ O gutter e o código **precisam do mesmo `font-size` e `line-height`** — 1px de diferença
> acumula desalinhamento a cada linha.

---

## Motion

`--ease: cubic-bezier(0.16, 1, 0.3, 1)` · `--dur-fast: 180ms` · `--dur: 280ms` · `--dur-slow: 700ms`

- Só `transform`, `opacity`, `filter` e `stroke-dashoffset`. **Nunca `width`/`height`.**
- Loops dessincronizados (nós do blueprint: 2.4s–4s) para não virar pisca-pisca.
- Animação **informa**: o glow do CTA responde ao hover, os ecos marcam o "agora", a conversa da
  Bússola se monta em sequência porque é o que o produto faz.
- `prefers-reduced-motion` desliga todos os assets; o conteúdo permanece.

---

## Anti-padrões

- ❌ Emoji como ícone — use Phosphor
- ❌ Cor crua onde existe token semântico
- ❌ Spacing fora da grade de 4px
- ❌ Mais de um foco luminoso por dobra
- ❌ Texto < 12px ou abaixo de 4.5:1
- ❌ Foco invisível, hover que desloca layout, transição instantânea
- ❌ Instrument Serif em texto corrido

---

## Checklist de entrega

- [ ] Contraste ≥ 4.5:1 (verificar, não estimar)
- [ ] Todo spacing múltiplo de 4
- [ ] Nenhuma cor fora dos tokens
- [ ] Foco visível em tudo que é focável
- [ ] Alvos de toque ≥ 44×44px
- [ ] `prefers-reduced-motion` respeitado
- [ ] Testado em 390 / 768 / 1024 / 1440
- [ ] Sem scroll horizontal no mobile
- [ ] Um `<h1>` por página, hierarquia sem pulos
