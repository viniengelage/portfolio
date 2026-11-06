import type { AsylumCopy } from "../../content/asylum";
import { Reveal } from "../reveal";
import { SectionHead, Shot } from "./shared";

/** Altura dos prints das docks em CSS px; a largura é sempre 384. */
const DOCK_HEIGHT: Record<string, number> = {
  "dock-thread": 908,
  "dock-terminal": 614,
  "dock-db": 908,
};

export function AsylumInterface({ copy }: { copy: AsylumCopy["interface"] }) {
  const { settings } = copy;

  return (
    <section className="band band--raised" id="interface" aria-labelledby="interface-title">
      <div className="shell band__inner asy-stack">
        <SectionHead id="interface-title" head={copy.head} />

        <div className="asy-docks">
          {copy.docks.map((dock, index) => (
            <Reveal key={dock.shot} delay={index * 60}>
              <figure className="asy-dock">
                {/* as docks são mais altas que a janela: o fade avisa que continua */}
                <div className="asy-window asy-dock__window">
                  <Shot
                    name={dock.shot}
                    width={384}
                    height={DOCK_HEIGHT[dock.shot] ?? 908}
                    alt={dock.alt}
                  />
                </div>
                <figcaption>
                  <span className="asy-kicker">{dock.label}</span>
                  <span className="asy-card__body">{dock.body}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="asy-settings glass">
          <div className="asy-window asy-settings__window">
            <Shot
              name="settings-filter"
              width={640}
              height={450}
              alt={settings.alt}
              // a lista de valores com a origem de cada um, sem a barra lateral
              focus="40% 30%"
            />
          </div>
          <div className="asy-settings__copy">
            <p className="asy-kicker asy-kicker--muted">{settings.label}</p>
            <h3>{settings.title}</h3>
            <p className="asy-card__body">{settings.body}</p>
            <ul className="asy-facts">
              {settings.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
