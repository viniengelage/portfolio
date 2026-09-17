/**
 * Fonte de dados do blog.
 *
 * ---------------------------------------------------------------------------
 * PONTO DE TROCA (MDX / markdown)
 * ---------------------------------------------------------------------------
 * Todo o resto do blog só conhece `getAllPosts()`, `getPostBySlug()` e
 * `getFeaturedPost()`. Para trocar a fonte:
 *
 *   1. mantenha `PostMeta` como frontmatter dos arquivos `.mdx`;
 *   2. troque `sources` por um loader (`import.meta.glob`, `fs` + gray-matter,
 *      contentlayer, etc.) que devolva `PostSource[]`;
 *   3. troque `content: ContentNode[]` por o componente compilado do MDX e
 *      renderize com `mdxComponents` (`components/blog/mdx.tsx`) — o mapa de
 *      componentes já está no formato que o MDX espera;
 *   4. `derivePost()` continua calculando wordCount/readingMinutes/headings.
 *
 * O único lugar marcado como "TROCAR AQUI" abaixo é o array `sources`.
 */

export const SITE_URL = "https://www.viniengelage.com";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

/** Padrão gráfico do thumb do card. Cada um tem um desenho CSS próprio. */
export type PostPattern = "stack" | "bars" | "lines" | "dots";

/** Accent do card — sempre um token do sistema, nunca uma cor solta. */
export type PostAccent = "violet" | "teal" | "blue" | "amber";

export type PostHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

/** Trecho inline — o mínimo para cobrir o que markdown gera dentro de um `<p>`. */
export type InlineNode =
  | string
  | { type: "strong"; text: string }
  | { type: "em"; text: string }
  | { type: "code"; text: string }
  | { type: "link"; text: string; href: string };

export type CalloutTone = "note" | "tip" | "warn";

export type ContentNode =
  | { type: "heading"; level: 2 | 3 | 4; id: string; text: string }
  | { type: "paragraph"; content: InlineNode[] }
  | {
      type: "code";
      code: string;
      lang?: string;
      filename?: string;
      variant?: "default" | "diff";
      highlightLines?: number[];
    }
  | { type: "quote"; content: InlineNode[] }
  | { type: "list"; ordered?: boolean; items: InlineNode[][] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "divider" }
  | { type: "callout"; tone: CalloutTone; title: string; content: InlineNode[] };

export type PostMeta = {
  slug: string;
  title: string;
  lead: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  tags: string[];
  pattern: PostPattern;
  accent: PostAccent;
  featured?: boolean;
};

/** O que o loader precisa devolver. Tudo o mais é derivado. */
export type PostSource = PostMeta & { content: ContentNode[] };

export type Post = PostSource & {
  readingMinutes: number;
  wordCount: number;
  headings: PostHeading[];
};

export const AUTHOR = {
  name: "Vinicios Engelage",
  initials: "VE",
  role: "Full stack · app & interface",
  bio: "PLACEHOLDER — Desenvolvedor full stack focado em aplicativos e design de interface. Escrevo sobre as decisões que sobrevivem ao deploy.",
  links: [
    { label: "GitHub", href: "https://github.com/viniengelage" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/viniengelage" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Derivação                                                           */
/* ------------------------------------------------------------------ */

function inlineText(nodes: InlineNode[]): string {
  return nodes.map((node) => (typeof node === "string" ? node : node.text)).join("");
}

function nodeText(node: ContentNode): string {
  switch (node.type) {
    case "heading":
      return node.text;
    case "paragraph":
    case "quote":
    case "callout":
      return inlineText(node.content);
    case "list":
      return node.items.map(inlineText).join(" ");
    case "table":
      return [...node.head, ...node.rows.flat()].join(" ");
    case "code":
      return node.code;
    case "image":
      return node.caption ?? "";
    default:
      return "";
  }
}

function countWords(content: ContentNode[]): number {
  const text = content.map(nodeText).join(" ").trim();
  return text ? text.split(/\s+/).length : 0;
}

function collectHeadings(content: ContentNode[]): PostHeading[] {
  return content
    .filter((node): node is Extract<ContentNode, { type: "heading" }> => node.type === "heading")
    .filter((node) => node.level === 2 || node.level === 3)
    .map((node) => ({ id: node.id, text: node.text, level: node.level as 2 | 3 }));
}

/** 200 palavras/minuto, mínimo de 1. */
export function derivePost(source: PostSource): Post {
  const wordCount = countWords(source.content);
  return {
    ...source,
    wordCount,
    readingMinutes: Math.max(1, Math.round(wordCount / 200)),
    headings: collectHeadings(source.content),
  };
}

/* ------------------------------------------------------------------ */
/* Conteúdo mockado                                                    */
/* ------------------------------------------------------------------ */

/** SVG inline para não depender de asset nenhum enquanto o texto é placeholder. */
const placeholderFigure = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect width="1200" height="600" fill="#0e0d14"/><rect x="1" y="1" width="1198" height="598" fill="none" stroke="#1f1c2b" stroke-width="2"/><circle cx="600" cy="300" r="120" fill="none" stroke="#6d28d9" stroke-width="2"/><circle cx="600" cy="300" r="70" fill="none" stroke="#a855f7" stroke-width="2"/><text x="600" y="470" fill="#837c98" font-family="monospace" font-size="26" text-anchor="middle">PLACEHOLDER</text></svg>`,
)}`;

// ─── TROCAR AQUI ───────────────────────────────────────────────────────
// Substitua este array pelo loader de MDX/markdown. Nada mais muda.
const sources: PostSource[] = [
  {
    slug: "tokens-antes-de-componentes",
    title: "PLACEHOLDER — Tokens antes de componentes",
    lead: "PLACEHOLDER — Por que a primeira coisa a existir em um design system não é um botão, e sim o vocabulário que descreve o botão.",
    date: "2025-07-18",
    tags: ["Design System"],
    pattern: "stack",
    accent: "violet",
    featured: true,
    content: [
      {
        type: "paragraph",
        content: [
          "PLACEHOLDER — Todo sistema começa errado do mesmo jeito: alguém desenha um botão bonito, alguém traduz em código, e o valor ",
          { type: "code", text: "#a855f7" },
          " aparece em dezessete arquivos diferentes. O problema nunca foi o botão. Foi não existir um nome para aquela cor antes de ela ser usada.",
        ],
      },
      {
        type: "callout",
        tone: "note",
        title: "Contexto",
        content: [
          "PLACEHOLDER — Este post assume um time pequeno, um produto só e nenhuma ferramenta de design system paga. É o caso onde a disciplina importa mais.",
        ],
      },
      { type: "heading", level: 2, id: "o-vocabulario", text: "PLACEHOLDER — O vocabulário vem primeiro" },
      {
        type: "paragraph",
        content: [
          "PLACEHOLDER — Um token é um contrato entre design e código. Ele diz ",
          { type: "strong", text: "o que a cor significa" },
          ", não que cor ela é. Quando o significado está nomeado, trocar o valor vira uma linha; quando só o valor existe, trocar vira uma arqueologia.",
        ],
      },
      {
        type: "code",
        lang: "ts",
        filename: "tokens/semantic.ts",
        highlightLines: [6, 7],
        code: `import { violet, ink } from "./primitives";

export const semantic = {
  surface: { base: ink[900], raised: ink[850] },
  border: { subtle: ink[700], strong: ink[600] },
  // o primitivo nunca vaza para o componente:
  accent: { default: violet[500], bright: violet[400] },
  text: { primary: ink[100], secondary: ink[300] },
} as const;

export type SemanticToken = keyof typeof semantic;`,
      },
      {
        type: "paragraph",
        content: [
          "PLACEHOLDER — A camada semântica existe para que o componente nunca pergunte “qual violeta?”. Ele pergunta “qual é o accent?” e a resposta pode mudar sem que uma linha do componente mude. Veja ",
          { type: "link", text: "a escala completa", href: "#a-escala" },
          ".",
        ],
      },
      { type: "heading", level: 3, id: "primitivo-vs-semantico", text: "PLACEHOLDER — Primitivo vs. semântico" },
      {
        type: "table",
        head: ["Camada", "Exemplo", "Quem usa"],
        rows: [
          ["Primitivo", "violet.500", "só a camada semântica"],
          ["Semântico", "accent.default", "componentes"],
          ["Componente", "button.bg", "casos excepcionais"],
        ],
      },
      { type: "heading", level: 2, id: "a-escala", text: "PLACEHOLDER — A escala que não trai" },
      {
        type: "paragraph",
        content: [
          "PLACEHOLDER — Grade de 4px, sem exceção. Toda vez que alguém abre exceção, a exceção vira padrão em três sprints. É mais barato arredondar o design do que sustentar duas gramáticas de espaçamento.",
        ],
      },
      {
        type: "list",
        items: [
          ["PLACEHOLDER — espaçamento sempre múltiplo de 4"],
          ["PLACEHOLDER — raio vem de quatro opções nomeadas, não de números soltos"],
          [
            "PLACEHOLDER — tipografia fluida com ",
            { type: "code", text: "clamp()" },
            ", nunca breakpoint por breakpoint",
          ],
          ["PLACEHOLDER — motion com uma curva só, duas durações"],
        ],
      },
      {
        type: "quote",
        content: [
          "PLACEHOLDER — Um sistema não é um conjunto de componentes. É o conjunto de decisões que você não precisa tomar de novo.",
        ],
      },
      { type: "heading", level: 2, id: "migrando", text: "PLACEHOLDER — Migrando sem parar o produto" },
      {
        type: "paragraph",
        content: [
          "PLACEHOLDER — A migração que funciona é a chata: um arquivo por vez, sempre com o valor antigo ao lado do novo até o último call site sumir.",
        ],
      },
      {
        type: "code",
        lang: "diff",
        filename: "components/card.css",
        variant: "diff",
        code: `- background: #13111b;
- border: 1px solid #1f1c2b;
- padding: 22px;
+ background: var(--bg-surface);
+ border: 1px solid var(--border-subtle);
+ padding: var(--space-6);`,
      },
      {
        type: "callout",
        tone: "warn",
        title: "Cuidado",
        content: [
          "PLACEHOLDER — Não migre e redesenhe no mesmo commit. Se o visual mudar junto, você perde a única forma barata de saber se a migração quebrou algo.",
        ],
      },
      { type: "divider" },
      {
        type: "image",
        src: placeholderFigure,
        alt: "PLACEHOLDER — diagrama das camadas de token",
        caption: "PLACEHOLDER — as três camadas e a direção única da dependência.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Atalho",
        content: [
          "PLACEHOLDER — Rode um grep por ",
          { type: "code", text: "#[0-9a-f]{6}" },
          " no CI. Cor hardcoded vira erro de build e a discussão acaba.",
        ],
      },
    ],
  },

  {
    slug: "interface-financeira-honesta",
    title: "PLACEHOLDER — Uma interface financeira que não mente",
    lead: "PLACEHOLDER — Saldo arredondado, estado de carregamento otimista, número que muda sozinho: três formas comuns de perder a confiança do usuário em dez segundos.",
    date: "2025-06-02",
    tags: ["Fintech", "Interface"],
    pattern: "bars",
    accent: "teal",
    content: [
      {
        type: "paragraph",
        content: [
          "PLACEHOLDER — Em produto financeiro, a interface não é a camada de apresentação: ela ",
          { type: "em", text: "é" },
          " o produto para quem usa. Um número exibido antes de estar confirmado não é uma otimização, é uma afirmação falsa.",
        ],
      },
      { type: "heading", level: 2, id: "estado-pendente", text: "PLACEHOLDER — O estado pendente é um estado de verdade" },
      {
        type: "paragraph",
        content: [
          "PLACEHOLDER — Skeleton não resolve: ele só esconde que você não sabe. O que funciona é mostrar o valor conhecido e marcar explicitamente o que ainda está em trânsito.",
        ],
      },
      {
        type: "code",
        lang: "tsx",
        filename: "components/balance.tsx",
        highlightLines: [9],
        code: `type BalanceState =
  | { status: "settled"; cents: number }
  | { status: "pending"; cents: number; inflight: number };

export function Balance({ state }: { state: BalanceState }) {
  return (
    <p className="balance">
      {formatBRL(state.cents)}
      {state.status === "pending" && <PendingBadge amount={state.inflight} />}
    </p>
  );
}`,
      },
      {
        type: "callout",
        tone: "tip",
        title: "Regra",
        content: [
          "PLACEHOLDER — Se o número pode mudar em menos de um segundo, ele precisa de um rótulo dizendo isso. Silêncio é pior que espera.",
        ],
      },
      { type: "heading", level: 3, id: "arredondamento", text: "PLACEHOLDER — Arredondar é uma decisão de produto" },
      {
        type: "paragraph",
        content: [
          "PLACEHOLDER — Centavos importam porque o usuário confere. Trabalhe em inteiros e formate na borda — nunca guarde ",
          { type: "code", text: "number" },
          " de ponto flutuante representando dinheiro.",
        ],
      },
      {
        type: "list",
        ordered: true,
        items: [
          ["PLACEHOLDER — armazene em centavos, inteiro"],
          ["PLACEHOLDER — formate só na renderização"],
          ["PLACEHOLDER — nunca some valores já formatados"],
        ],
      },
      { type: "heading", level: 2, id: "erros", text: "PLACEHOLDER — Erro também é conteúdo" },
      {
        type: "quote",
        content: ["PLACEHOLDER — Um erro sem próximo passo é só um susto com tipografia melhor."],
      },
      {
        type: "paragraph",
        content: [
          "PLACEHOLDER — Todo estado de erro precisa de causa provável e ação. Se você não consegue escrever a ação, o erro está sendo tratado no lugar errado do sistema.",
        ],
      },
    ],
  },

  {
    slug: "motion-que-explica",
    title: "PLACEHOLDER — Motion que explica, não que enfeita",
    lead: "PLACEHOLDER — Animação boa responde a uma pergunta que o usuário já estava fazendo: de onde isso veio e para onde foi.",
    date: "2025-04-27",
    tags: ["Motion", "Interface"],
    pattern: "lines",
    accent: "blue",
    content: [
      {
        type: "paragraph",
        content: [
          "PLACEHOLDER — A pergunta antes de qualquer animação é curta: o que ela esclarece? Se a resposta é “fica bonito”, provavelmente é latência disfarçada de personalidade.",
        ],
      },
      { type: "heading", level: 2, id: "continuidade", text: "PLACEHOLDER — Continuidade acima de duração" },
      {
        type: "paragraph",
        content: [
          "PLACEHOLDER — O olho perdoa uma transição rápida demais; não perdoa um elemento que aparece do nada em outro canto da tela. Continuidade espacial vale mais que curva sofisticada.",
        ],
      },
      {
        type: "code",
        lang: "css",
        filename: "styles/motion.css",
        code: `.card {
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
}`,
      },
      {
        type: "callout",
        tone: "warn",
        title: "Não negociável",
        content: [
          "PLACEHOLDER — ",
          { type: "code", text: "prefers-reduced-motion" },
          " não é um extra de acessibilidade. Para parte das pessoas é a diferença entre usar e não usar o produto.",
        ],
      },
      { type: "heading", level: 3, id: "duracoes", text: "PLACEHOLDER — Duas durações bastam" },
      {
        type: "table",
        head: ["Uso", "Duração", "Curva"],
        rows: [
          ["feedback direto", "180ms", "ease padrão"],
          ["transição de estado", "280ms", "ease padrão"],
          ["entrada em cena", "700ms", "ease padrão"],
        ],
      },
      {
        type: "paragraph",
        content: [
          "PLACEHOLDER — Três valores, uma curva. Quanto menor o vocabulário de motion, mais o produto parece uma coisa só.",
        ],
      },
    ],
  },

  {
    slug: "arquitetura-de-app-que-dura",
    title: "PLACEHOLDER — Arquitetura de um app que dura três anos",
    lead: "PLACEHOLDER — O que sobrevive não é a escolha de framework. É onde você colocou as fronteiras e o que aceitou não abstrair.",
    date: "2025-03-11",
    tags: ["Arquitetura"],
    pattern: "dots",
    accent: "amber",
    content: [
      {
        type: "paragraph",
        content: [
          "PLACEHOLDER — Código que dura tem menos camadas do que a internet recomenda e fronteiras mais nítidas do que a pressa permite.",
        ],
      },
      { type: "heading", level: 2, id: "fronteiras", text: "PLACEHOLDER — Fronteiras onde a mudança acontece" },
      {
        type: "paragraph",
        content: [
          "PLACEHOLDER — Uma fronteira só se paga onde os dois lados mudam por motivos diferentes. Em qualquer outro lugar ela é indireção com nome bonito.",
        ],
      },
      {
        type: "code",
        lang: "ts",
        filename: "lib/repository.ts",
        code: `// a fronteira é o contrato, não a pasta
export interface PostRepository {
  all(): Promise<Post[]>;
  bySlug(slug: string): Promise<Post | null>;
}

// hoje: memória. amanhã: mdx, cms, banco.
export const repository: PostRepository = memoryRepository;`,
      },
      {
        type: "callout",
        tone: "note",
        title: "Regra prática",
        content: [
          "PLACEHOLDER — Se você não consegue nomear a segunda implementação possível, a interface ainda não precisa existir.",
        ],
      },
      { type: "heading", level: 2, id: "deletar", text: "PLACEHOLDER — Otimize para deletar" },
      {
        type: "quote",
        content: ["PLACEHOLDER — A métrica honesta de arquitetura é quanto tempo leva para remover uma feature inteira."],
      },
      {
        type: "list",
        items: [
          ["PLACEHOLDER — uma feature por pasta, incluindo seus testes"],
          ["PLACEHOLDER — nada de util.ts genérico compartilhado por todos"],
          ["PLACEHOLDER — dependências apontam para dentro, nunca para os lados"],
        ],
      },
    ],
  },

  {
    slug: "o-custo-de-um-componente-generico",
    title: "PLACEHOLDER — O custo escondido de um componente genérico",
    lead: "PLACEHOLDER — Toda prop booleana nova é uma dívida. Em algum momento vale mais escrever o segundo componente do que parametrizar o primeiro.",
    date: "2025-01-23",
    tags: ["Design System", "Arquitetura"],
    pattern: "stack",
    accent: "violet",
    content: [
      {
        type: "paragraph",
        content: [
          "PLACEHOLDER — O componente começa com três props. Seis meses depois tem quatorze, três delas mutuamente exclusivas, e ninguém lembra por quê.",
        ],
      },
      { type: "heading", level: 2, id: "sinais", text: "PLACEHOLDER — Os sinais de que passou do ponto" },
      {
        type: "list",
        ordered: true,
        items: [
          [
            "PLACEHOLDER — existe um ",
            { type: "code", text: "if" },
            " que muda a estrutura do JSX inteira",
          ],
          ["PLACEHOLDER — duas props nunca podem ser verdadeiras juntas"],
          ["PLACEHOLDER — o nome do componente virou um substantivo abstrato"],
        ],
      },
      {
        type: "code",
        lang: "tsx",
        filename: "components/panel.tsx",
        variant: "diff",
        code: `- <Panel compact bordered collapsible withHeader tone="danger" />
+ <AlertPanel tone="danger" />
+ <CollapsiblePanel title="Detalhes" />`,
      },
      {
        type: "paragraph",
        content: [
          "PLACEHOLDER — Duplicação local é mais barata que acoplamento global. A regra prática: ",
          { type: "strong", text: "abstraia na terceira repetição, não na segunda" },
          ".",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Teste rápido",
        content: [
          "PLACEHOLDER — Se explicar a prop leva mais tempo que reescrever o componente, a prop não devia existir.",
        ],
      },
    ],
  },
];
// ─── fim do bloco a trocar ─────────────────────────────────────────────

const posts: Post[] = sources
  .map(derivePost)
  .sort((a, b) => b.date.localeCompare(a.date));

/* ------------------------------------------------------------------ */
/* API pública                                                         */
/* ------------------------------------------------------------------ */

/** Todos os posts, do mais recente para o mais antigo. */
export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/** O post marcado como `featured`; cai no mais recente se nenhum estiver. */
export function getFeaturedPost(): Post | undefined {
  return posts.find((post) => post.featured) ?? posts[0];
}

/** Tags únicas, ordenadas por frequência e depois alfabeticamente. */
export function getAllTags(): string[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}

/** Vizinhos na ordem cronológica, para a navegação do rodapé do post. */
export function getAdjacentPosts(slug: string): { previous?: Post; next?: Post } {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};
  return { previous: posts[index + 1], next: posts[index - 1] };
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatPostDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`)).replace(".", "");
}
