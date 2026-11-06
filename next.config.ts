import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

const withMDX = createMDX({
  options: {
    // Nomes serializáveis mantêm compatibilidade com o Turbopack.
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
