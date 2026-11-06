import { Fragment } from "react";
import type { AsylumCopy } from "../../content/asylum";
import { Reveal } from "../reveal";
import { SectionHead, Shot } from "./shared";

export function AsylumEfficiency({ copy }: { copy: AsylumCopy["efficiency"] }) {
  const { featured, bench } = copy;

  return (
    <section className="band band--raised" id="efficiency" aria-labelledby="efficiency-title">
      <div className="shell band__inner asy-stack">
        <SectionHead id="efficiency-title" head={copy.head} />

        <div className="asy-grid asy-tokens">
          <ul className="asy-grid asy-grid--4">
            <Reveal as="li" className="asy-card asy-card--featured glass">
              <p className="asy-kicker">{featured.label}</p>
              <p className="asy-card__value">{featured.value}</p>
              <h3>{featured.title}</h3>
              <p className="asy-card__body">{featured.body}</p>
            </Reveal>
            {copy.cards.map((card, index) => (
              <Reveal as="li" key={card.label} delay={(index + 1) * 60} className="asy-card glass">
                <p className="asy-kicker asy-kicker--muted">{card.label}</p>
                <h3>{card.title}</h3>
                <p className="asy-card__body">{card.body}</p>
              </Reveal>
            ))}
          </ul>

          <Reveal className="asy-strip">
            {copy.strip.map((item, index) => (
              <Fragment key={item}>
                {index > 0 ? (
                  <span className="asy-strip__sep" aria-hidden="true">
                    ·
                  </span>
                ) : null}
                <p className="asy-strip__text asy-arrow">{item}</p>
              </Fragment>
            ))}
          </Reveal>
        </div>

        <div className="asy-bench">
          <Reveal className="asy-bench__copy">
            <p className="asy-kicker">{bench.label}</p>
            <h3>{bench.title}</h3>
            <p className="asy-bench__body">{bench.body}</p>
            <ul className="asy-facts asy-facts--plain">
              {bench.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </Reveal>

          {/* o painel do Automático fica por cima do benchmarks.md, como no frame */}
          <Reveal delay={120} className="asy-bench__visual">
            <div className="asy-window asy-bench__file">
              <Shot
                name="benchmarks-md"
                width={680}
                height={436}
                alt={bench.alt}
              />
            </div>
            <div className="asy-window asy-bench__panel">
              <Shot
                name="auto-model-panel"
                width={360}
                height={292}
                alt={bench.panelAlt}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
