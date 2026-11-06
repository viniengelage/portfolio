import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";

/**
 * Fontes servidas do próprio repositório (`app/fonts/`, subconjunto latino),
 * e não do `next/font/google`: no build da Vercel o Google às vezes devolve
 * URLs de fonte com query string, e o Turbopack do Next 16.3 quebra com
 * "next/font/google queries have exactly one entry". Sem rede no build, sem
 * esse risco. Os arquivos são os WOFF2 do bloco `latin` do CSS do Google Fonts
 * (todos com licença OFL); para atualizar, baixe de novo de lá.
 *
 * As variáveis do next/font usam namespace próprio (`--ff-*`).
 * Elas são injetadas no <html>, que é o mesmo elemento de `:root` —
 * se reusassem os nomes semânticos (`--font-display`), o mapeamento em
 * globals.css viraria auto-referência e a fonte nunca resolveria.
 */
const body = localFont({
  src: "./fonts/inter.woff2",
  weight: "100 900",
  variable: "--ff-inter",
  display: "swap",
});

const display = localFont({
  src: "./fonts/inter-tight.woff2",
  weight: "500 700",
  variable: "--ff-inter-tight",
  display: "swap",
});

const mono = localFont({
  src: "./fonts/jetbrains-mono.woff2",
  weight: "400 700",
  variable: "--ff-jetbrains-mono",
  display: "swap",
});

const editorial = localFont({
  src: [
    { path: "./fonts/instrument-serif.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--ff-instrument-serif",
  display: "swap",
});

const title = "Vinicios Engelage — Full stack, app & interface";
const description =
  "Desenvolvedor full stack especializado em aplicativos e design de interface. Trabalho do schema do banco à animação da tela.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.viniengelage.com"),
  title: { default: title, template: "%s | Vinicios Engelage" },
  description,
  applicationName: "Vinicios Engelage",
  alternates: { canonical: "/" },
  authors: [{ name: "Vinicios Engelage", url: "https://www.viniengelage.com" }],
  creator: "Vinicios Engelage",
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Vinicios Engelage",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${body.variable} ${display.variable} ${mono.variable} ${editorial.variable}`}
    >
      <body>
        <Script
          id="person-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Vinicios Engelage",
              url: "https://www.viniengelage.com",
              image: "https://www.viniengelage.com/profile.png",
              jobTitle: "Desenvolvedor full stack",
              email: "oi@viniengelage.com",
              sameAs: [
                "https://github.com/viniengelage",
                "https://www.linkedin.com/in/viniengelage/",
                "https://instagram.com/viniengelage",
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
