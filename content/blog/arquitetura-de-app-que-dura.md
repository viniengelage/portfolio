---
slug: arquitetura-de-app-que-dura
title: PLACEHOLDER — Arquitetura de um app que dura três anos
lead: PLACEHOLDER — O que sobrevive não é a escolha de framework. É onde você colocou as fronteiras e o que aceitou não abstrair.
date: 2025-03-11
tags:
  - Arquitetura
pattern: dots
accent: amber
---

PLACEHOLDER — Código que dura tem menos camadas do que a internet recomenda e fronteiras mais nítidas do que a pressa permite.

## PLACEHOLDER — Fronteiras onde a mudança acontece {#fronteiras}

PLACEHOLDER — Uma fronteira só se paga onde os dois lados mudam por motivos diferentes. Em qualquer outro lugar ela é indireção com nome bonito.

```ts title="lib/repository.ts"
// a fronteira é o contrato, não a pasta
export interface PostRepository {
  all(): Promise<Post[]>;
  bySlug(slug: string): Promise<Post | null>;
}

// hoje: memória. amanhã: mdx, cms, banco.
export const repository: PostRepository = memoryRepository;
```

> [!NOTE] Regra prática
> PLACEHOLDER — Se você não consegue nomear a segunda implementação possível, a interface ainda não precisa existir.

## PLACEHOLDER — Otimize para deletar {#deletar}

> PLACEHOLDER — A métrica honesta de arquitetura é quanto tempo leva para remover uma feature inteira.

- PLACEHOLDER — uma feature por pasta, incluindo seus testes
- PLACEHOLDER — nada de util.ts genérico compartilhado por todos
- PLACEHOLDER — dependências apontam para dentro, nunca para os lados
