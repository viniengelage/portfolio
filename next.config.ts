import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 é para os screenshots do Asylum: texto fino de editor borra em 75.
    qualities: [75, 90],
  },
};

const withMDX = createMDX({
  options: {
    // Nomes serializáveis mantêm compatibilidade com o Turbopack.
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
