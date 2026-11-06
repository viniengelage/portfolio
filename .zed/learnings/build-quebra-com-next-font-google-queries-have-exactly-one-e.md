# Build quebra com "next/font/google queries have exactly one entry"

Depois de adicionar uma fonte nova do `next/font/google` (ex.: Geist na landing do Asylum), `bun run build` pode falhar com `Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'` / `next/font/google queries have exactly one entry`, apontando para uma fonte que já existia (JetBrains Mono). Não é rede nem código: é o cache do Turbopack. Resolve com `rm -rf .next` antes do build.
