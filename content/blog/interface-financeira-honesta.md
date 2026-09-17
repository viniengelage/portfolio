---
slug: interface-financeira-honesta
title: PLACEHOLDER — Uma interface financeira que não mente
lead: PLACEHOLDER — Saldo arredondado, estado de carregamento otimista, número que muda sozinho: três formas comuns de perder a confiança do usuário em dez segundos.
date: 2025-06-02
tags:
  - Fintech
  - Interface
pattern: bars
accent: teal
---

PLACEHOLDER — Em produto financeiro, a interface não é a camada de apresentação: ela *é* o produto para quem usa. Um número exibido antes de estar confirmado não é uma otimização, é uma afirmação falsa.

## PLACEHOLDER — O estado pendente é um estado de verdade {#estado-pendente}

PLACEHOLDER — Skeleton não resolve: ele só esconde que você não sabe. O que funciona é mostrar o valor conhecido e marcar explicitamente o que ainda está em trânsito.

```tsx title="components/balance.tsx" {9}
type BalanceState =
  | { status: "settled"; cents: number }
  | { status: "pending"; cents: number; inflight: number };

export function Balance({ state }: { state: BalanceState }) {
  return (
    <p className="balance">
      {formatBRL(state.cents)}
      {state.status === "pending" && <PendingBadge amount={state.inflight} />}
    </p>
  );
}
```

> [!TIP] Regra
> PLACEHOLDER — Se o número pode mudar em menos de um segundo, ele precisa de um rótulo dizendo isso. Silêncio é pior que espera.

### PLACEHOLDER — Arredondar é uma decisão de produto {#arredondamento}

PLACEHOLDER — Centavos importam porque o usuário confere. Trabalhe em inteiros e formate na borda — nunca guarde `number` de ponto flutuante representando dinheiro.

1. PLACEHOLDER — armazene em centavos, inteiro
2. PLACEHOLDER — formate só na renderização
3. PLACEHOLDER — nunca some valores já formatados

## PLACEHOLDER — Erro também é conteúdo {#erros}

> PLACEHOLDER — Um erro sem próximo passo é só um susto com tipografia melhor.

PLACEHOLDER — Todo estado de erro precisa de causa provável e ação. Se você não consegue escrever a ação, o erro está sendo tratado no lugar errado do sistema.
