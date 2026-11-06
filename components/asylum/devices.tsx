import type { AsylumCopy } from "../../content/asylum";
import { Reveal } from "../reveal";
import { SectionHead } from "./shared";

/** Nomes reais das ferramentas do agente: não se traduzem. */
const AGENT_TOOLS = [
  "device_tap",
  "device_swipe",
  "device_type",
  "device_screenshot",
  "device_logs",
  "browser_click",
  "browser_console",
  "browser_eval",
];

export function AsylumDevices({ copy }: { copy: AsylumCopy["devices"] }) {
  return (
    <section
      className="band band--raised"
      id="simulators"
      aria-labelledby="simulators-title"
    >
      <div className="shell band__inner asy-stack">
        <SectionHead id="simulators-title" head={copy.head} />

        <ul className="asy-grid asy-grid--3">
          {copy.cards.map((card, index) => (
            <Reveal as="li" key={card.mark} delay={index * 60} className="asy-card glass">
              <p className="asy-card__meta">
                <span className="asy-mark">{card.mark}</span>
                <span className="asy-tag" data-tone={card.tone}>
                  {card.tag}
                </span>
              </p>
              <h3>{card.title}</h3>
              <p className="asy-card__body">{card.body}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal className="asy-strip asy-strip--accent">
          <p className="asy-kicker">{copy.toolsLabel}</p>
          <p className="asy-strip__text">{AGENT_TOOLS.join(" · ")}</p>
        </Reveal>
      </div>
    </section>
  );
}
