import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "./components/blog/mdx";

/** Componentes globais disponíveis para todo arquivo `*.mdx`. */
export function useMDXComponents(): MDXComponents {
  return mdxComponents;
}
