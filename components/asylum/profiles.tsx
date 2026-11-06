import type { AsylumCopy } from "../../content/asylum";
import { Reveal } from "../reveal";
import { AsylumIcon, type AsylumIconTone } from "./icon";
import { Accented, Shot } from "./shared";

/** Ordem e estado do `dock` no frame: os três primeiros estão abertos. */
const DOCK: { tone: AsylumIconTone; open: boolean }[] = [
  { tone: "amber", open: true },
  { tone: "teal", open: true },
  { tone: "violet", open: true },
  { tone: "blue", open: false },
  { tone: "rose", open: false },
];

export function AsylumProfiles({ copy }: { copy: AsylumCopy["profiles"] }) {
  return (
    <section className="band" id="profiles" aria-labelledby="profiles-title">
      <div className="shell band__inner asy-profiles">
        <Reveal className="asy-profiles__copy">
          <div className="section-head__title">
            <p className="label">{copy.eyebrow}</p>
            <h2 id="profiles-title">
              <Accented text={copy.title} />
            </h2>
          </div>
          <p className="asy-profiles__lead">{copy.lead}</p>

          <div className="asy-dockbar" role="img" aria-label={copy.dockLabel}>
            {DOCK.map((item) => (
              <span key={item.tone} className="asy-dockbar__item" data-open={item.open}>
                <AsylumIcon size={64} tone={item.tone} />
              </span>
            ))}
          </div>
          <p className="mono asy-profiles__caption">{copy.dockCaption}</p>
        </Reveal>

        <Reveal delay={120} className="asy-window">
          <Shot
            name="profiles"
            width={640}
            height={400}
            alt={copy.shotAlt}
            // o seletor de perfis fica no canto inferior esquerdo
            focus="0% 100%"
          />
        </Reveal>
      </div>
    </section>
  );
}
