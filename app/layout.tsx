import type { Metadata } from "next";
import { Inter, Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * As variáveis do next/font usam namespace próprio (`--ff-*`).
 * Elas são injetadas no <html>, que é o mesmo elemento de `:root` —
 * se reusassem os nomes semânticos (`--font-display`), o mapeamento em
 * globals.css viraria auto-referência e a fonte nunca resolveria.
 */
const body = Inter({
  subsets: ["latin"],
  variable: "--ff-inter",
  display: "swap",
});

const display = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--ff-inter-tight",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--ff-jetbrains-mono",
  display: "swap",
});

const editorial = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--ff-instrument-serif",
  display: "swap",
});

const title = "Vinicios Engelage — Full stack, app & interface";
const description =
  "Desenvolvedor full stack com especialidade em aplicativos e design de interface. Construo produtos do schema do banco ao detalhe de animação.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.viniengelage.com"),
  title: { default: title, template: "%s | Vinicios Engelage" },
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Vinicios Engelage",
    locale: "pt_BR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${body.variable} ${display.variable} ${mono.variable} ${editorial.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
