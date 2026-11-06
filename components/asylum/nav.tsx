import Link from "next/link";
import {
  ASYLUM_HTML_LANG,
  ASYLUM_PATHS,
  type AsylumCopy,
  type AsylumLocale,
} from "../../content/asylum";
import { ASYLUM } from "../../lib/asylum";
import { AsylumIcon } from "./icon";

/**
 * Nav própria do produto. Reaproveita a pílula `.nav` do site, mas os links são
 * âncoras da landing e não as seções do portfólio. O seletor de idioma não
 * existe no design: entrou com o i18n.
 */
export function AsylumNav({ copy, locale }: { copy: AsylumCopy["nav"]; locale: AsylumLocale }) {
  const other: AsylumLocale = locale === "pt" ? "en" : "pt";

  return (
    <nav className="nav glass asy-nav" aria-label={copy.label}>
      <a className="asy-nav__lockup" href="#top">
        <AsylumIcon size={28} swirl={false} />
        <span className="asy-wordmark">asylum</span>
      </a>

      <div className="nav__links">
        <a href="#simulators">{copy.links.simulators}</a>
        <a href="#tools">{copy.links.tools}</a>
        <a href="#agent">{copy.links.agent}</a>
        <a href="#open-source">{copy.links.openSource}</a>
      </div>

      <div className="asy-nav__actions">
        <Link
          className="asy-nav__lang"
          href={ASYLUM_PATHS[other]}
          hrefLang={ASYLUM_HTML_LANG[other]}
          lang={ASYLUM_HTML_LANG[other]}
          aria-label={copy.switchTo.label}
        >
          {copy.switchTo.short}
        </Link>
        <a className="btn asy-nav__github" href={ASYLUM.repo} target="_blank" rel="noreferrer">
          {copy.github}
        </a>
        {/* leva ao CTA final, onde a pessoa escolhe macOS ou Windows */}
        <a className="btn asy-btn--primary" href="#download">
          {copy.download}
        </a>
      </div>
    </nav>
  );
}
