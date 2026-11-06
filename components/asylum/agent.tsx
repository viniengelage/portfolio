import type { AsylumCopy } from "../../content/asylum";
import { Reveal } from "../reveal";
import { SectionHead, Shot } from "./shared";

export function AsylumAgent({ copy }: { copy: AsylumCopy["agent"] }) {
  const [featured, ...providers] = copy.providers;

  return (
    <section className="band asy-agent" id="agent" aria-labelledby="agent-title">
      <div className="bloom asy-agent__bloom" aria-hidden="true" />

      <div className="shell band__inner asy-stack">
        <SectionHead id="agent-title" head={copy.head} />

        <div className="asy-agent__body">
          <ul className="asy-features">
            {copy.features.map((feature, index) => (
              <Reveal as="li" key={feature.label} delay={index * 60}>
                <p className="asy-kicker">{feature.label}</p>
                <h3>{feature.title}</h3>
                <p className="asy-card__body">{feature.body}</p>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={120} className="asy-window asy-window--glow">
            <Shot
              name="plan-ready"
              width={732}
              height={458}
              alt={copy.shotAlt}
              sizes="(max-width: 720px) 160vw, (max-width: 1024px) calc(100vw - 48px), 732px"
              // o painel do plano, que é o assunto do print
              focus="78% 50%"
            />
          </Reveal>
        </div>

        <Reveal className="asy-providers">
          <p className="asy-kicker asy-kicker--muted">{copy.providersLabel}</p>
          <ul>
            <li className="chip asy-chip--on">{featured}</li>
            {providers.map((provider) => (
              <li key={provider} className="chip">
                {provider}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
