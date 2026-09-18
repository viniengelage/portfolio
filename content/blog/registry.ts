import type { ComponentType } from "react";
import ReactBulletproofPost from "./react-bulletproof-arquitetura/post.mdx";
import { metadata as reactBulletproofMetadata } from "./react-bulletproof-arquitetura/meta";
import type { BlogPostMeta } from "./types";

export type BlogPostModule = {
  metadata: BlogPostMeta;
  /** Caminho do MDX no disco, usado apenas para derivar sumário e tempo de leitura no servidor. */
  sourcePath: string;
  Content: ComponentType;
};

/**
 * Catálogo explícito: adicionar um post exige somente importar seu `post.mdx`
 * e `metadata` aqui. Isso mantém imports estáticos, compatíveis com o build.
 */
export const blogPostModules: readonly BlogPostModule[] = [
  {
    metadata: reactBulletproofMetadata,
    sourcePath: "react-bulletproof-arquitetura/post.mdx",
    Content: ReactBulletproofPost,
  },
];
