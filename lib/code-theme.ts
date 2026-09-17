/**
 * BLOOM DARK — tema de código do portfólio.
 *
 * Não é um tema genérico. Ele reaproveita os accents do próprio design system
 * (violeta da marca + accents de projeto), o que faz um bloco de código parecer
 * parte do site e não um widget colado por cima.
 *
 * Origem de cada cor:
 *   keyword   violeta da marca        (--accent-bright / violet-400)
 *   type      violeta claro           (violet-300)
 *   string    accent do Organizadin   (teal-400)
 *   function  accent da Bússola       (blue-400)
 *   number    accent do Trix          (amber-400)
 *
 * Contraste: todas as cores de token foram verificadas >= 5.07:1 sobre
 * `--code-bg` (#08070c). A menor é `--code-punctuation`/`--code-comment`
 * (#837c98 -> 5.07:1), usada só para ruído sintático e comentários.
 */

export const bloomDarkColors = {
  bg: "#08070c",
  border: "#1f1c2b",
  text: "#c7c2d6",
  comment: "#837c98",
  keyword: "#c084fc",
  type: "#d8b4fe",
  string: "#2dd4bf",
  function: "#60a5fa",
  number: "#e8b368",
  constant: "#e8b368",
  operator: "#9c96ae",
  punctuation: "#837c98",
  variable: "#edeaf5",
  deleted: "#fb7185",
  inserted: "#bef264",
  gutter: "#322c46",
  highlight: "#6d28d9",
} as const;

export type BloomDarkColorName = keyof typeof bloomDarkColors;

/**
 * Nome da custom property CSS de cada cor. As definições vivem em
 * `app/styles/blog.css` (`:root`) — este mapa existe para que TS e CSS não
 * possam divergir sem que alguém perceba.
 */
export const bloomDarkCssVars: Record<BloomDarkColorName, string> = {
  bg: "--code-bg",
  border: "--code-border",
  text: "--code-text",
  comment: "--code-comment",
  keyword: "--code-keyword",
  type: "--code-type",
  string: "--code-string",
  function: "--code-function",
  number: "--code-number",
  constant: "--code-constant",
  operator: "--code-operator",
  punctuation: "--code-punctuation",
  variable: "--code-variable",
  deleted: "--code-deleted",
  inserted: "--code-inserted",
  gutter: "--code-gutter",
  highlight: "--code-highlight",
};

/* ------------------------------------------------------------------ */
/* Formato Shiki                                                       */
/* ------------------------------------------------------------------ */

/**
 * Subconjunto de `ThemeRegistration` do Shiki, replicado aqui para não
 * precisar instalar o pacote antes da hora. Quando o Shiki entrar:
 *
 *   import { createHighlighter } from "shiki";
 *   import { bloomDarkShikiTheme } from "@/lib/code-theme";
 *   const hl = await createHighlighter({ themes: [bloomDarkShikiTheme], langs: [...] });
 *
 * `ThemeRegistration` é estruturalmente compatível com este tipo.
 */
export type ShikiThemeSettings = {
  foreground?: string;
  background?: string;
  fontStyle?: "italic" | "bold" | "underline" | "";
};

export type ShikiTokenColor = {
  name?: string;
  scope: string | string[];
  settings: ShikiThemeSettings;
};

export type ShikiThemeRegistrationLike = {
  name: string;
  displayName: string;
  type: "dark";
  semanticHighlighting: boolean;
  colors: Record<string, string>;
  semanticTokenColors: Record<string, string>;
  tokenColors: ShikiTokenColor[];
};

export const bloomDarkShikiTheme: ShikiThemeRegistrationLike = {
  name: "bloom-dark",
  displayName: "Bloom Dark",
  type: "dark",
  semanticHighlighting: true,
  colors: {
    "editor.background": bloomDarkColors.bg,
    "editor.foreground": bloomDarkColors.text,
    "editorLineNumber.foreground": bloomDarkColors.gutter,
    "editorLineNumber.activeForeground": bloomDarkColors.comment,
    "editor.lineHighlightBackground": bloomDarkColors.highlight,
    "editorIndentGuide.background1": bloomDarkColors.border,
    "editorWidget.border": bloomDarkColors.border,
    "diffEditor.removedTextBackground": bloomDarkColors.deleted,
    "diffEditor.insertedTextBackground": bloomDarkColors.inserted,
  },
  semanticTokenColors: {
    class: bloomDarkColors.type,
    interface: bloomDarkColors.type,
    enum: bloomDarkColors.type,
    typeParameter: bloomDarkColors.type,
    function: bloomDarkColors.function,
    method: bloomDarkColors.function,
    variable: bloomDarkColors.variable,
    parameter: bloomDarkColors.variable,
    property: bloomDarkColors.variable,
  },
  tokenColors: [
    {
      name: "Comment",
      scope: ["comment", "punctuation.definition.comment", "string.comment"],
      settings: { foreground: bloomDarkColors.comment, fontStyle: "italic" },
    },
    {
      name: "Keyword",
      scope: [
        "keyword",
        "keyword.control",
        "keyword.operator.new",
        "keyword.operator.expression",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.other.important",
      ],
      settings: { foreground: bloomDarkColors.keyword },
    },
    {
      name: "Type",
      scope: [
        "entity.name.type",
        "entity.name.class",
        "entity.name.namespace",
        "entity.other.inherited-class",
        "support.type",
        "support.class",
        "meta.type.annotation entity.name.type",
      ],
      settings: { foreground: bloomDarkColors.type },
    },
    {
      name: "String",
      scope: [
        "string",
        "string.quoted",
        "string.template",
        "punctuation.definition.string",
        "meta.embedded.assembly",
      ],
      settings: { foreground: bloomDarkColors.string },
    },
    {
      name: "Function",
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call.generic",
        "variable.function",
        "entity.name.method",
      ],
      settings: { foreground: bloomDarkColors.function },
    },
    {
      name: "Number & constant",
      scope: [
        "constant.numeric",
        "constant.language",
        "constant.character",
        "constant.other",
        "support.constant",
        "keyword.other.unit",
      ],
      settings: { foreground: bloomDarkColors.number },
    },
    {
      name: "Operator",
      scope: ["keyword.operator", "storage.type.function.arrow"],
      settings: { foreground: bloomDarkColors.operator },
    },
    {
      name: "Punctuation",
      scope: [
        "punctuation",
        "punctuation.separator",
        "punctuation.terminator",
        "punctuation.accessor",
        "meta.brace",
      ],
      settings: { foreground: bloomDarkColors.punctuation },
    },
    {
      name: "Variable",
      scope: [
        "variable",
        "variable.other",
        "variable.parameter",
        "meta.definition.variable entity.name.function",
        "support.variable",
      ],
      settings: { foreground: bloomDarkColors.variable },
    },
    {
      name: "Property / attribute",
      scope: [
        "variable.other.property",
        "meta.object-literal.key",
        "entity.other.attribute-name",
        "support.type.property-name",
      ],
      settings: { foreground: bloomDarkColors.text },
    },
    {
      name: "Tag",
      scope: ["entity.name.tag", "punctuation.definition.tag"],
      settings: { foreground: bloomDarkColors.keyword },
    },
    {
      name: "Diff removed",
      scope: ["markup.deleted", "meta.diff.header.from-file"],
      settings: { foreground: bloomDarkColors.deleted },
    },
    {
      name: "Diff added",
      scope: ["markup.inserted", "meta.diff.header.to-file"],
      settings: { foreground: bloomDarkColors.inserted },
    },
    {
      name: "Invalid",
      scope: ["invalid", "invalid.illegal"],
      settings: { foreground: bloomDarkColors.deleted },
    },
    {
      name: "Markup emphasis",
      scope: ["markup.italic"],
      settings: { fontStyle: "italic" },
    },
    {
      name: "Markup strong",
      scope: ["markup.bold"],
      settings: { fontStyle: "bold" },
    },
  ],
};
