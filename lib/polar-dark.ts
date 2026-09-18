/**
 * POLAR DARK — tema de editor baseado na identidade visual de Vinicios Engelage.
 *
 * Fonte de verdade: github.com/viniengelage/polaris-theme
 *   Zed      `themes/polar-dark.json`
 *   VS Code  `themes/Polar Dark-color-theme.json`
 *
 * Os hex abaixo são cópia manual do repositório — os dois projetos não
 * compartilham build. Se mudar lá, mude aqui.
 *
 * Por que não reusar `lib/code-theme.ts`: aquele é o Bloom Dark, o tema de
 * código do blog. Ele nasceu do mesmo lugar, mas divergiu em três pontos
 * (tipo, parâmetro e atributo). A página do tema precisa mostrar o Polar Dark,
 * não uma aproximação — por isso a lista abaixo é independente e literal.
 */

export const POLAR_DARK = {
  name: "Polar Dark",
  version: "1.0.0",
  license: "MIT",
  /** O repositório ainda se chama `polaris-theme`; o tema, não. */
  repo: "https://github.com/viniengelage/polaris-theme",
  /** Arquivo servido cru pelo GitHub — é o que o comando de instalação baixa. */
  zedThemeUrl:
    "https://raw.githubusercontent.com/viniengelage/polaris-theme/main/themes/polar-dark.json",
  zed: { styleKeys: 150, captures: 50 },
  vscode: { extensionId: "viniengelage.polar-dark" },
} as const;

/* ------------------------------------------------------------------ */
/* Paleta                                                              */
/* ------------------------------------------------------------------ */

export type Swatch = {
  hex: string;
  name: string;
  /** O que a cor carrega no editor. */
  carries: string;
  /** Referência visual ou razão de uso da cor. */
  origin?: string;
};

export const polarDarkSyntax: Swatch[] = [
  {
    hex: "#C084FC",
    name: "Violeta",
    carries: "palavras-chave, tags JSX e HTML, código inline em markdown",
    origin: "violeta principal da identidade visual",
  },
  {
    hex: "#D8B4FE",
    name: "Violeta claro",
    carries: "tipos nativos, enums, namespaces, seletores CSS",
    origin: "variação clara do violeta principal",
  },
  {
    hex: "#60A5FA",
    name: "Azul",
    carries: "tipos, funções, métodos, texto de link",
    origin: "contraste frio para símbolos e navegação",
  },
  {
    hex: "#2DD4BF",
    name: "Teal",
    carries: "strings e URIs",
    origin: "contraste calmo para conteúdo textual",
  },
  {
    hex: "#E8B368",
    name: "Âmbar",
    carries: "números, booleanos, constantes, atributos JSX e HTML",
    origin: "calor para valores e atributos",
  },
  {
    hex: "#EDEAF5",
    name: "Branco",
    carries: "variáveis, parâmetros (itálico), títulos de markdown",
    origin: "texto principal",
  },
  {
    hex: "#C7C2D6",
    name: "Cinza claro",
    carries: "texto do editor, propriedades de objeto",
    origin: "texto de leitura",
  },
  {
    hex: "#837C98",
    name: "Cinza",
    carries: "comentários (itálico), pontuação, inlay hints",
    origin: "informação secundária",
  },
  {
    hex: "#6D28D9",
    name: "Violeta profundo",
    carries: "véu da linha ativa, foco, texto fantasma da IA",
    origin: "variação profunda do violeta principal",
  },
  {
    hex: "#BEF264",
    name: "Lima",
    carries: "linhas adicionadas no diff, arquivos criados",
  },
  {
    hex: "#FB7185",
    name: "Rosa",
    carries: "linhas removidas no diff, erros",
  },
];

export const polarDarkSurfaces: { hex: string; use: string }[] = [
  { hex: "#08070C", use: "fundo do editor e do terminal" },
  { hex: "#0E0D14", use: "painéis, abas, barra de título e de status" },
  { hex: "#13111B", use: "menus, popovers, autocomplete" },
  { hex: "#1F1C2B", use: "bordas" },
  { hex: "#322C46", use: "números de linha, guias de indentação" },
];

/* ------------------------------------------------------------------ */
/* Ponte com o <CodeBlock>                                             */
/* ------------------------------------------------------------------ */

/**
 * Sobrescreve as custom properties `--code-*` (definidas em `blog.css` com os
 * valores do Bloom Dark) pelas do Polar Dark.
 *
 * Literal de propósito: aplicado num wrapper, garante que a prévia continue
 * sendo o Polar Dark mesmo que o tema de código do blog mude amanhã.
 */
export const polarDarkCodeVars: React.CSSProperties = {
  "--code-bg": "#08070C",
  "--code-border": "#1F1C2B",
  "--code-text": "#C7C2D6",
  "--code-comment": "#837C98",
  "--code-keyword": "#C084FC",
  // aqui mora a diferença para o Bloom Dark: no Polar Dark, tipo e função
  // dividem o mesmo azul. O lavanda fica só para os tipos nativos.
  "--code-type": "#60A5FA",
  "--code-string": "#2DD4BF",
  "--code-function": "#60A5FA",
  "--code-number": "#E8B368",
  "--code-constant": "#E8B368",
  "--code-operator": "#9C96AE",
  "--code-punctuation": "#837C98",
  "--code-variable": "#EDEAF5",
  "--code-deleted": "#FB7185",
  "--code-inserted": "#BEF264",
  "--code-gutter": "#322C46",
  "--code-highlight": "#6D28D9",
} as React.CSSProperties;
