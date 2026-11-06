# Build quebra com "next/font/google queries have exactly one entry"

O erro `next/font/google queries have exactly one entry` (Turbopack, Next 16.3) não é cache: aparece quando o Google Fonts devolve URLs de fonte com query string (`fonts.gstatic.com/l/font?kit=...&skey=...`), o que varia por região e horário. Quebrava o build na Vercel mesmo sem cache. Por isso as fontes do site são locais (`app/fonts/*.woff2` + `next/font/local`). Não volte para `next/font/google`; fonte nova entra baixando o WOFF2 do bloco `latin` do CSS do Google para `app/fonts/`.
