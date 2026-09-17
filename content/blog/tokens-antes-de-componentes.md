---
slug: tokens-antes-de-componentes
title: PLACEHOLDER — Tokens antes de componentes
lead: PLACEHOLDER — Por que a primeira coisa a existir em um design system não é um botão, e sim o vocabulário que descreve o botão.
date: 2025-07-18
tags:
  - Design System
pattern: stack
accent: violet
featured: true
---

PLACEHOLDER — Todo sistema começa errado do mesmo jeito: alguém desenha um botão bonito, alguém traduz em código, e o valor `#a855f7` aparece em dezessete arquivos diferentes. O problema nunca foi o botão. Foi não existir um nome para aquela cor antes de ela ser usada.

> [!NOTE] Contexto
> PLACEHOLDER — Este post assume um time pequeno, um produto só e nenhuma ferramenta de design system paga. É o caso onde a disciplina importa mais.

## PLACEHOLDER — O vocabulário vem primeiro {#o-vocabulario}

PLACEHOLDER — Um token é um contrato entre design e código. Ele diz **o que a cor significa**, não que cor ela é. Quando o significado está nomeado, trocar o valor vira uma linha; quando só o valor existe, trocar vira uma arqueologia.

```ts title="tokens/semantic.ts" {6,7}
import { violet, ink } from "./primitives";

export const semantic = {
  surface: { base: ink[900], raised: ink[850] },
  border: { subtle: ink[700], strong: ink[600] },
  // o primitivo nunca vaza para o componente:
  accent: { default: violet[500], bright: violet[400] },
  text: { primary: ink[100], secondary: ink[300] },
} as const;

export type SemanticToken = keyof typeof semantic;
```

PLACEHOLDER — A camada semântica existe para que o componente nunca pergunte “qual violeta?”. Ele pergunta “qual é o accent?” e a resposta pode mudar sem que uma linha do componente mude. Veja [a escala completa](#a-escala).

### PLACEHOLDER — Primitivo vs. semântico {#primitivo-vs-semantico}

| Camada | Exemplo | Quem usa |
| --- | --- | --- |
| Primitivo | violet.500 | só a camada semântica |
| Semântico | accent.default | componentes |
| Componente | button.bg | casos excepcionais |

## PLACEHOLDER — A escala que não trai {#a-escala}

PLACEHOLDER — Grade de 4px, sem exceção. Toda vez que alguém abre exceção, a exceção vira padrão em três sprints. É mais barato arredondar o design do que sustentar duas gramáticas de espaçamento.

- PLACEHOLDER — espaçamento sempre múltiplo de 4
- PLACEHOLDER — raio vem de quatro opções nomeadas, não de números soltos
- PLACEHOLDER — tipografia fluida com `clamp()`, nunca breakpoint por breakpoint
- PLACEHOLDER — motion com uma curva só, duas durações

> PLACEHOLDER — Um sistema não é um conjunto de componentes. É o conjunto de decisões que você não precisa tomar de novo.

## PLACEHOLDER — Migrando sem parar o produto {#migrando}

PLACEHOLDER — A migração que funciona é a chata: um arquivo por vez, sempre com o valor antigo ao lado do novo até o último call site sumir.

```diff title="components/card.css"
- background: #13111b;
- border: 1px solid #1f1c2b;
- padding: 22px;
+ background: var(--bg-surface);
+ border: 1px solid var(--border-subtle);
+ padding: var(--space-6);
```

> [!WARNING] Cuidado
> PLACEHOLDER — Não migre e redesenhe no mesmo commit. Se o visual mudar junto, você perde a única forma barata de saber se a migração quebrou algo.

---

![PLACEHOLDER — diagrama das camadas de token](data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201200%20600%22%3E%3Crect%20width%3D%221200%22%20height%3D%22600%22%20fill%3D%22%230e0d14%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%221198%22%20height%3D%22598%22%20fill%3D%22none%22%20stroke%3D%22%231f1c2b%22%20stroke-width%3D%222%22%2F%3E%3Ccircle%20cx%3D%22600%22%20cy%3D%22300%22%20r%3D%22120%22%20fill%3D%22none%22%20stroke%3D%22%236d28d9%22%20stroke-width%3D%222%22%2F%3E%3Ccircle%20cx%3D%22600%22%20cy%3D%22300%22%20r%3D%2270%22%20fill%3D%22none%22%20stroke%3D%22%23a855f7%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%22600%22%20y%3D%22470%22%20fill%3D%22%23837c98%22%20font-family%3D%22monospace%22%20font-size%3D%2226%22%20text-anchor%3D%22middle%22%3EPLACEHOLDER%3C%2Ftext%3E%3C%2Fsvg%3E "PLACEHOLDER — as três camadas e a direção única da dependência.")

> [!TIP] Atalho
> PLACEHOLDER — Rode um grep por `#[0-9a-f]{6}` no CI. Cor hardcoded vira erro de build e a discussão acaba.
