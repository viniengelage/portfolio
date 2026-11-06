import type { AsylumCopy } from "../../content/asylum";
import { Reveal } from "../reveal";
import { SectionHead, Shot } from "./shared";

export function AsylumTools({ copy }: { copy: AsylumCopy["tools"] }) {
  return (
    <section className="band" id="tools" aria-labelledby="tools-title">
      <div className="shell band__inner asy-stack">
        <SectionHead id="tools-title" head={copy.head} />

        <div className="asy-grid">
          <ul className="asy-grid asy-grid--2">
            {copy.cards.map((card, index) => (
              <Reveal as="li" key={card.shot} delay={(index % 2) * 60} className="asy-tool glass">
                {/* a janela é maior que o card de propósito: o print vaza e é cortado */}
                <div className="asy-tool__visual" data-tint={card.tint}>
                  <div className="asy-window asy-tool__window">
                    <Shot name={card.shot} width={640} height={400} alt={card.alt} sizes="640px" />
                  </div>
                </div>
                <div className="asy-tool__copy">
                  <p className="asy-kicker asy-kicker--muted">{card.label}</p>
                  <h3>{card.title}</h3>
                  <p className="asy-card__body">{card.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <ul className="asy-grid asy-grid--3">
            {copy.minis.map((mini, index) => (
              <Reveal
                as="li"
                key={mini.label}
                delay={index * 60}
                className="asy-card asy-card--compact glass"
              >
                <p className="asy-kicker asy-kicker--muted">{mini.label}</p>
                <h3>{mini.title}</h3>
                <p className="asy-card__body">{mini.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
