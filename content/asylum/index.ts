import type { Metadata } from "next";
import { en } from "./en";
import { pt } from "./pt";
import type { AsylumCopy, AsylumLocale } from "./types";

export type { AsylumCopy, AsylumLocale } from "./types";

export const asylumCopy: Record<AsylumLocale, AsylumCopy> = { pt, en };

/** Prefixo `/en` em vez de query ou cookie: cada idioma tem URL própria e indexável. */
export const ASYLUM_PATHS: Record<AsylumLocale, string> = {
  pt: "/asylum",
  en: "/en/asylum",
};

export const ASYLUM_HTML_LANG: Record<AsylumLocale, string> = { pt: "pt-BR", en: "en" };

const OG_LOCALE: Record<AsylumLocale, string> = { pt: "pt_BR", en: "en_US" };

export function asylumMetadata(locale: AsylumLocale): Metadata {
  const { title, description } = asylumCopy[locale].meta;
  const url = ASYLUM_PATHS[locale];
  const other: AsylumLocale = locale === "pt" ? "en" : "pt";

  /**
   * A peça `linkedin-link-1200x627` (Open Pencil, página 08) está em português,
   * então só a versão pt a usa. A inglesa herda o Open Graph do site.
   */
  const images =
    locale === "pt"
      ? [{ url: "/og/asylum.jpg", width: 1200, height: 627, alt: title }]
      : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "pt-BR": ASYLUM_PATHS.pt,
        en: ASYLUM_PATHS.en,
        "x-default": ASYLUM_PATHS.pt,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: OG_LOCALE[locale],
      alternateLocale: OG_LOCALE[other],
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}
