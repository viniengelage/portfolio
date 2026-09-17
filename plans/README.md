# Planos de animação

Auditoria feita com a skill `improve-animations` (bar: filosofia de animação do Emil
Kowalski). 4 auditores paralelos cobriram as 8 categorias do playbook; todos os findings
abaixo foram reconfirmados lendo o arquivo citado antes de virar plano.

## Planos

| # | Plano | Severidade | Categoria | Status |
|---|---|---|---|---|
| 001 | [Blueprint do hero reativo ao cursor](001-blueprint-interativo.md) | MEDIUM (aditivo) | 8 — oportunidade | **DONE** |
| 002 | [Mockups na viewport + reação ao hover](002-assets-reativos.md) | HIGH | 1 + 8 | **DONE** |
| 003 | [Sistema de motion: curvas e durações](003-sistema-de-motion.md) | HIGH | 2 + 7 | **DONE** |
| 004 | [Reduced-motion cirúrgico, pointer gates, `gap`→`transform`](004-reduced-motion-e-pointer.md) | HIGH | 5 + 6 | **DONE** |
| 005 | [Press feedback universal e menu mobile](005-press-feedback-e-menu.md) | HIGH | 3 + 4 + 5 | **DONE** |
| 006 | [Suavizar o spark e criar o rastro de pegadas](006-rastro-de-pegadas.md) | LOW (polimento) | 2 + 3 | **DONE** |

> Todos executados. Verificações mecânicas passaram; os **feel checks** de cada plano
> ainda não foram feitos — exigem navegador.

## Correções feitas durante a execução (erros nos próprios planos)

Dois planos continham defeitos que só apareceram na implementação:

1. **Plano 005, `.btn:active`** — o comentário dizia "o press é deliberado; o release
   snap", mas o código (`transition-duration: 60ms` dentro de `:active`) produz o
   oposto: `:active` governa a **ida**, a regra base governa a **volta**. Mantive o
   comportamento (press 60ms / release 120ms — confirmação tátil imediata é o que um
   botão quer) e corrigi o comentário.
2. **Plano 005, stagger do menu** — trocar `transitionDelay` inline por
   `open ? … : "0ms"` conserta a saída, mas inline style vence qualquer regra da
   folha, então o `:active` dos links continuava esperando o delay de entrada. A
   solução real foi mover o stagger para a custom property `--link-delay` e zerá-la
   em `:active`. O plano ficou desatualizado nesse ponto.

Ambos foram corrigidos no código; os planos ficam como registro histórico.

## Ordem recomendada

```
003 ──► 004 ──► 005 ──► 002 ──► 001
```

**003 primeiro, sempre.** Ele cria `--ease-out`, `--ease-in-out`, `--ease-hover`,
`--dur-instant` e `--dur-draw`, que os outros quatro consomem. Cada plano posterior tem um
fallback literal documentado caso seja executado fora de ordem, mas isso gera `/* TODO */`
espalhados.

Dependências:

- **004** depende de `--ease-in-out` (003)
- **005** depende de `--dur-instant` e `--ease-out` (003); também reduz `--dur-slow`, que
  003 já baixa de 700ms para 420ms — se 003 rodar antes, 005 herda o valor certo
- **002** depende de `--ease-out` e `--ease-in-out` (003)
- **001** depende de `--ease-out` (003) e é o único que adiciona JavaScript

001 e 002 são os dois que o dono do projeto pediu explicitamente ("pulse no cruzamento" e
"mais efeitos nesse sentido"). Eles ficam por último na ordem de execução porque são
aditivos — corrigir a base primeiro evita construir em cima de curvas erradas.

## Findings auditados que **não** viraram plano

Registrados para não serem redescobertos:

| Finding | Por que ficou de fora |
|---|---|
| Cards do blog levantam 4px no hover (`blog.css:433`) | O auditor sugeriu remover por frequência. Discordo: `translateY(-4px)` é afordância padrão de card clicável e o `border-color` sozinho é fraco demais no dark. O plano 003 já corrige a curva e o 004 põe atrás de gate de pointer. |
| Glow de hover em `.project`, que é `<div>` não-clicável (`home.css:154`) | Factualmente correto — não há estado nem alvo. Mas é sinal de agrupamento, não promessa de clique. A correção real seria tornar o card inteiro clicável, o que é mudança de UX, não de motion. |
| Ecos infinitos da timeline perto do texto (`home.css:330`) | Decisão de design deliberada e aprovada. O plano 003 troca a curva para `linear`, o que já reduz a chamada de atenção. |
| `/blog` sem `<Reveal>` nenhum vs. home toda revelada (`blog/page.tsx:106`) | Divergência real de personalidade entre rotas, mas de baixo retorno: a grade do blog está acima da dobra na maior parte das telas. |
| Marcador do TOC com double-expose no handoff (`blog.css:739`) | Confirmado, mas o efeito dura ~280ms e o plano 003 já encurta a transição. Reavaliar depois. |
| Troca "Copiar"→"Copiado" com layout shift (`share-links.tsx:53`) | Real, mas é largura de botão mudando — a correção é `min-width`, não motion. |

## Como executar

Cada plano é auto-contido: caminhos absolutos, código atual verbatim, valores exatos e
seção de verificação com *feel check*. Podem ser executados por qualquer agente sem
contexto desta auditoria.

Depois de executar, marque o `Status` no cabeçalho do plano e nesta tabela.
