import { Reveal } from "../reveal";

type Entry = {
  year: string;
  role: string;
  org?: string;
  orgAccent?: string;
  description: string;
  tags?: string[];
  current?: boolean;
};

/** PLACEHOLDER: 2020–2022, 2018–2020 e 2016 aguardam os dados reais. */
const entries: Entry[] = [
  {
    year: "2024 — hoje",
    current: true,
    role: "Produto próprio",
    org: "Organizadin · Bússola",
    description:
      "Desenho e construo dois produtos do zero: interface, design system, app e backend. É onde o full stack e o design finalmente moram no mesmo lugar.",
    tags: ["React Native", "Design System", "Node", "LLM"],
  },
  {
    year: "2022 — 2024",
    role: "Desenvolvedor",
    org: "Trix Investimentos",
    orgAccent: "var(--accent-trix)",
    description:
      "PLACEHOLDER — descrever o que você fez no Trix: app de investimentos em FIIs e ações, carteiras, simulador, onboarding.",
    tags: ["React Native", "TypeScript", "Fintech"],
  },
  {
    year: "2020 — 2022",
    role: "PLACEHOLDER — cargo",
    org: "PLACEHOLDER — empresa",
    description:
      "PLACEHOLDER — uma linha sobre o que mudou nessa fase: que problema você resolvia e o que aprendeu.",
    tags: ["PLACEHOLDER"],
  },
  {
    year: "2018 — 2020",
    role: "PLACEHOLDER — cargo",
    org: "PLACEHOLDER — empresa",
    description: "PLACEHOLDER — uma linha sobre o que mudou nessa fase.",
    tags: ["PLACEHOLDER"],
  },
  {
    year: "2016",
    role: "Primeira linha em produção",
    description:
      "PLACEHOLDER — como começou. Vale contar a origem: o que te puxou pra programação e pro design.",
  },
];

export function Timeline() {
  return (
    <section className="band" id="trajetoria">
      <div className="shell band__inner">
        <Reveal className="section-head">
          <div className="section-head__title">
            <p className="label">Trajetória</p>
            <h2>Como cheguei até aqui</h2>
          </div>
          <div className="section-head__aside">
            <p>
              Uma década indo do backend para a interface — e descobrindo que o lugar mais
              interessante é no meio dos dois.
            </p>
          </div>
        </Reveal>

        <ol className="timeline">
          {entries.map((entry, index) => (
            <Reveal
              key={entry.year}
              as="li"
              delay={index * 60}
              className={`timeline__item${entry.current ? " timeline__item--now" : ""}`}
            >
              <p className="timeline__year">{entry.year}</p>

              <div className="timeline__node" aria-hidden="true">
                <span className="timeline__dot" />
                {entry.current && (
                  <>
                    <span className="timeline__echo" style={{ "--echo": 1 } as React.CSSProperties} />
                    <span className="timeline__echo" style={{ "--echo": 2 } as React.CSSProperties} />
                    <span className="timeline__echo" style={{ "--echo": 3 } as React.CSSProperties} />
                  </>
                )}
              </div>

              <div className="timeline__content">
                <h3>
                  {entry.role}
                  {entry.org && (
                    <span
                      className="timeline__org"
                      style={entry.orgAccent ? ({ color: entry.orgAccent } as React.CSSProperties) : undefined}
                    >
                      {" "}
                      · {entry.org}
                    </span>
                  )}
                </h3>
                <p className="timeline__description">{entry.description}</p>
                {entry.tags && (
                  <ul className="timeline__tags">
                    {entry.tags.map((tag) => (
                      <li key={tag} className="chip">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
