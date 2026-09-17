---
slug: motion-que-explica
title: PLACEHOLDER — Motion que explica, não que enfeita
lead: PLACEHOLDER — Animação boa responde a uma pergunta que o usuário já estava fazendo: de onde isso veio e para onde foi.
date: 2025-04-27
tags:
  - Motion
  - Interface
pattern: lines
accent: blue
---

PLACEHOLDER — A pergunta antes de qualquer animação é curta: o que ela esclarece? Se a resposta é “fica bonito”, provavelmente é latência disfarçada de personalidade.

## PLACEHOLDER — Continuidade acima de duração {#continuidade}

PLACEHOLDER — O olho perdoa uma transição rápida demais; não perdoa um elemento que aparece do nada em outro canto da tela. Continuidade espacial vale mais que curva sofisticada.

```css title="styles/motion.css"
.card {
  /* nunca anime width/height: layout thrash garantido */
  transition:
    transform var(--dur) var(--ease),
    border-color var(--dur) var(--ease),
    box-shadow var(--dur) var(--ease);
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--border-strong);
}

@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
}
```

> [!WARNING] Não negociável
> PLACEHOLDER — `prefers-reduced-motion` não é um extra de acessibilidade. Para parte das pessoas é a diferença entre usar e não usar o produto.

### PLACEHOLDER — Duas durações bastam {#duracoes}

| Uso | Duração | Curva |
| --- | --- | --- |
| feedback direto | 180ms | ease padrão |
| transição de estado | 280ms | ease padrão |
| entrada em cena | 700ms | ease padrão |

PLACEHOLDER — Três valores, uma curva. Quanto menor o vocabulário de motion, mais o produto parece uma coisa só.
