import { Geist } from "next/font/google";
import { ASYLUM_HTML_LANG, asylumCopy, type AsylumLocale } from "../../content/asylum";
import { getLatestRelease } from "../../lib/asylum";
import { AsylumAgent } from "./agent";
import { AsylumCta } from "./cta";
import { AsylumDevices } from "./devices";
import { AsylumEfficiency } from "./efficiency";
import { AsylumHero } from "./hero";
import { AsylumInterface } from "./interface";
import { AsylumNav } from "./nav";
import { AsylumOpenSource } from "./open-source";
import { AsylumProfiles } from "./profiles";
import { AsylumTools } from "./tools";

/** Só o wordmark usa Geist; carregada aqui para não pesar no resto do site. */
const wordmark = Geist({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--ff-geist",
  display: "swap",
});

/**
 * Landing do Asylum, tradução do frame `asylum-landing` (Open Pencil, página
 * `08 — Asylum / Lançamento`). As rotas `/asylum` e `/en/asylum` só escolhem o
 * idioma; todo o conteúdo vem de `content/asylum`.
 */
export async function AsylumLanding({ locale }: { locale: AsylumLocale }) {
  const copy = asylumCopy[locale];
  const release = await getLatestRelease();

  return (
    // O <html lang> é do root layout; aqui o idioma vale para a página inteira.
    <div id="top" className={`asy ${wordmark.variable}`} lang={ASYLUM_HTML_LANG[locale]}>
      <a className="skip-link" href="#conteudo">
        {copy.skipLink}
      </a>
      <AsylumNav copy={copy.nav} locale={locale} />

      <main id="conteudo">
        <AsylumHero copy={copy.hero} proof={copy.proof} release={release} />
        <AsylumDevices copy={copy.devices} />
        <AsylumTools copy={copy.tools} />
        <AsylumInterface copy={copy.interface} />
        <AsylumAgent copy={copy.agent} />
        <AsylumEfficiency copy={copy.efficiency} />
        <AsylumProfiles copy={copy.profiles} />
        <AsylumOpenSource copy={copy.openSource} prompt={copy.cta.prompt} />
        <AsylumCta copy={copy.cta} footer={copy.footer} />
      </main>
    </div>
  );
}
