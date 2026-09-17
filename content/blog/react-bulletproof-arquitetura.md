---
slug: react-bulletproof-arquitetura
title: Construindo aplicativos escaláveis com React Bulletproof
lead: RASCUNHO — O que quebra um app grande não é a escolha de framework. É não conseguir responder duas perguntas — onde este arquivo mora e quem pode importá-lo.
date: 2026-09-16
tags:
  - Arquitetura
  - React
pattern: dots
accent: blue
---

Todo app React começa organizado. `components/`, `hooks/`, `utils/`, `services/` — limpo, previsível, fácil de explicar em uma reunião de kickoff. O problema aparece uns seis meses depois, quando `components/` tem cento e quarenta arquivos e ninguém consegue dizer quais podem ser apagados.

O [Bulletproof React](https://github.com/alan2207/bulletproof-react) não é um framework nem uma biblioteca. É um conjunto de decisões sobre **onde o código mora** e **quem tem permissão de importar quem**. A maior parte do valor está nessa segunda parte.

## O problema: pastas por tipo de arquivo

Organizar por tipo parece neutro, mas esconde uma coisa: ela espalha uma única funcionalidade por cinco pastas distantes.

```txt
src/
├── components/
│   ├── InvoiceList.tsx
│   ├── InvoiceRow.tsx
│   ├── ProfileForm.tsx
│   └── ... mais 137 arquivos
├── hooks/
│   ├── useInvoices.ts
│   └── useProfile.ts
├── services/
│   ├── invoices.ts
│   └── profile.ts
└── utils/
    └── formatMoney.ts
```

Para mexer em cobrança você abre quatro pastas. Para deletar cobrança você não abre nenhuma com segurança, porque `formatMoney` pode estar sendo usado pelo perfil. **A pasta não te diz mais nada sobre o domínio** — ela só te diz o que o arquivo *é*, não sobre o que ele *fala*.

## A virada: organize por domínio

A mesma coisa, agrupada por funcionalidade:

```txt
src/
├── app/                    # rotas: só composição e orquestração
├── components/             # UI compartilhada, sem domínio
│   └── ui/                 # primitivos do design system
├── features/               # onde a maior parte do produto vive
│   ├── invoices/
│   │   ├── api/            # acesso a dados desta feature
│   │   ├── components/     # UI que só faz sentido aqui
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── utils/
│   └── profile/
├── hooks/                  # hooks compartilhados
├── lib/                    # clientes configurados (http, auth, db)
├── config/                 # env validado, constantes
└── utils/                  # funções puras compartilhadas
```

Duas propriedades aparecem de graça:

- **Deletar uma feature é deletar uma pasta.** Se não dá, você descobriu um acoplamento que não sabia que tinha.
- **A estrutura vira documentação.** Alguém que entra no time abre `src/features/` e vê o produto.

> [!NOTE]
> Só crie a subpasta quando ela tiver conteúdo. Uma feature com `api/` e `components/` é uma feature honesta. Uma feature com sete pastas vazias é cerimônia.

## A regra que faz tudo se sustentar

Essa é a parte que realmente importa, e a que mais se perde na implementação. Feature-based sem regra de dependência vira a mesma bagunça de antes, só com nomes melhores.

São três regras, e a direção é sempre a mesma:

1. **`app/` pode importar de `features/` e de compartilhado.** A rota compõe.
2. **`features/a` não importa de `features/b`.** Nunca, direto.
3. **Compartilhado não importa de `features/` nem de `app/`.** `components/`, `lib/` e `utils/` não conhecem domínio.

```txt
app/  ──▶  features/  ──▶  shared (components, hooks, lib, utils)
```

A seta anda só para a direita. Quando duas features precisam conversar, quem faz a ponte é a camada de cima:

```tsx title="src/app/invoices/page.tsx"
// ❌ dentro de features/invoices: a cobrança sabe como o perfil guarda o usuário
import { useProfileStore } from "@/features/profile/stores/profile-store";

// ✅ quem conhece as duas features é a rota que compõe as duas
import { getCurrentUser } from "@/features/profile/api/get-current-user";
import { getInvoices } from "@/features/invoices/api/get-invoices";
import { InvoiceList } from "@/features/invoices/components/invoice-list";

export default async function InvoicesPage() {
  const user = await getCurrentUser();
  const invoices = await getInvoices(user.id);

  return <InvoiceList invoices={invoices} />;
}
```

E isso não é convenção de code review — dá para deixar o lint reprovar:

```js title="eslint.config.js"
"import/no-restricted-paths": [
  "error",
  {
    zones: [
      // features não conversam entre si
      {
        target: "./src/features/invoices",
        from: "./src/features",
        except: ["./invoices"],
      },
      // o compartilhado não pode conhecer domínio
      { target: "./src/components", from: "./src/features" },
      // nada importa da camada de rotas
      { target: "./src/features", from: "./src/app" },
    ],
  },
],
```

> [!TIP]
> Essa regra é a única coisa aqui que não dá para adotar "aos poucos sem ferramenta". Ou o lint reprova, ou em três sprints alguém importa direto e ninguém percebe no diff.

## Dentro de uma feature

Uma feature pequena, inteira. Primeiro o acesso a dados, com validação na fronteira:

```ts title="src/features/invoices/api/get-invoices.ts"
import { z } from "zod";
import { apiClient } from "@/lib/api-client";

const invoiceSchema = z.object({
  id: z.string(),
  number: z.string(),
  // dinheiro em centavos, inteiro: float aqui é bug garantido
  amountInCents: z.number().int(),
  status: z.enum(["draft", "open", "paid"]),
});

export type Invoice = z.infer<typeof invoiceSchema>;

export async function getInvoices(userId: string): Promise<Invoice[]> {
  const data = await apiClient.get(`/users/${userId}/invoices`);
  return z.array(invoiceSchema).parse(data);
}
```

O ponto do `parse` não é ser defensivo por esporte. É que **o `type` do TypeScript some em runtime**: tudo que atravessa uma fronteira — API, formulário, `searchParams`, variável de ambiente, storage — é `unknown` disfarçado até alguém validar. O schema é o único lugar onde o tipo vira verdade.

E o componente, que importa da própria feature com caminho relativo:

```tsx title="src/features/invoices/components/invoice-list.tsx"
import { EmptyState } from "@/components/ui/empty-state";
import type { Invoice } from "../api/get-invoices";
import { formatMoney } from "../utils/format-money";

type InvoiceListProps = {
  invoices: Invoice[];
};

export function InvoiceList({ invoices }: InvoiceListProps) {
  if (invoices.length === 0) {
    return <EmptyState>Nenhuma cobrança por aqui ainda.</EmptyState>;
  }

  return (
    <ul>
      {invoices.map((invoice) => (
        <li key={invoice.id}>
          <span>{invoice.number}</span>
          <span>{formatMoney(invoice.amountInCents)}</span>
        </li>
      ))}
    </ul>
  );
}
```

Relativo dentro da feature (`../api/...`) e absoluto para fora (`@/lib/...`) é uma convenção pequena com um efeito grande: **o import começa a denunciar a fronteira**. Um `@/features/` dentro de outra feature pula na revisão sem precisar de ferramenta.

## Quando promover para compartilhado

A pergunta que mais trava time é essa: isso é da feature ou é compartilhado?

| Situação | Onde vai |
| --- | --- |
| Usado por um domínio só | fica na feature |
| Usado por dois domínios não relacionados | promove para compartilhado |
| Usado por dois, mas só porque copiei | fica duplicado, por enquanto |
| Fala de regra de negócio | nunca vai para `components/ui` |

O viés certo é **começar dentro da feature e promover depois**. Duplicação é barata e visível; a abstração errada é cara e invisível — ela se disfarça de reuso e cobra em prop booleana pelos próximos dois anos.

## O que isso te dá

- **Onboarding**: a estrutura conta o que o produto faz.
- **Deleção**: dá para remover uma feature inteira com confiança.
- **Revisão**: import fora do lugar vira erro de lint, não discussão de opinião.
- **Teste**: a feature tem fronteira, então tem superfície testável.

---

Nada disso é sobre pasta bonita. É sobre conseguir responder, em qualquer arquivo do projeto: *de quem eu dependo, e quem depende de mim?* Um app que responde isso cresce. Um que não responde acumula.

> [!WARNING]
> Adotar tudo de uma vez num projeto que já existe costuma virar um PR de trezentos arquivos que ninguém revisa. O caminho que funciona é migrar uma feature por vez, ligando a regra de lint só para o escopo já migrado.
