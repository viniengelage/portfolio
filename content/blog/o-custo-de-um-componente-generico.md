---
slug: o-custo-de-um-componente-generico
title: PLACEHOLDER — O custo escondido de um componente genérico
lead: PLACEHOLDER — Toda prop booleana nova é uma dívida. Em algum momento vale mais escrever o segundo componente do que parametrizar o primeiro.
date: 2025-01-23
tags:
  - Design System
  - Arquitetura
pattern: stack
accent: violet
---

PLACEHOLDER — O componente começa com três props. Seis meses depois tem quatorze, três delas mutuamente exclusivas, e ninguém lembra por quê.

## PLACEHOLDER — Os sinais de que passou do ponto {#sinais}

1. PLACEHOLDER — existe um `if` que muda a estrutura do JSX inteira
2. PLACEHOLDER — duas props nunca podem ser verdadeiras juntas
3. PLACEHOLDER — o nome do componente virou um substantivo abstrato

```tsx title="components/panel.tsx" diff
- <Panel compact bordered collapsible withHeader tone="danger" />
+ <AlertPanel tone="danger" />
+ <CollapsiblePanel title="Detalhes" />
```

PLACEHOLDER — Duplicação local é mais barata que acoplamento global. A regra prática: **abstraia na terceira repetição, não na segunda**.

> [!TIP] Teste rápido
> PLACEHOLDER — Se explicar a prop leva mais tempo que reescrever o componente, a prop não devia existir.
