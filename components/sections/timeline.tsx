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

const entries: Entry[] = [
  {
    year: "2024 — hoje",
    role: "Software Engineer",
    org: "Trix Investimentos",
    orgAccent: "var(--accent-trix)",
    description:
      "Desenvolvedor principal do aplicativo. Migrei a arquitetura legada para Expo com atualizações OTA, tirando correções de bugs da fila da loja, e reescrevi o serviço de API. Também criei o novo design system e o adotei durante a migração dos componentes legados.",
    tags: ["Expo", "React Native", "TypeScript", "React Query"],
    current: true,
  },
  {
    year: "2024 — hoje",
    role: "Founder",
    org: "Organizadin",
    orgAccent: "var(--accent-organizadin)",
    description:
      "App de organização financeira pessoal com Open Finance. Planejei, desenhei e construí sozinho, da primeira anotação à publicação nas lojas, incluindo design system, app e backend.",
    tags: [
      "TypeScript",
      "Expo",
      "React Native",
      "Design System",
      "Node",
      "NestJS",
      "PostgreSQL",
      "Open Finance",
    ],
  },
  {
    year: "2023 — 2024",
    role: "Software Engineer",
    org: "Tree ID",
    description:
      "Responsável técnico de um CRM de agendamento para clínicas de saúde. Conduzi o produto do design à API e à manutenção em produção.",
    tags: ["TypeScript", "React"],
  },
  {
    year: "2022 — 2023",
    role: "Software Engineer",
    org: "MbLabs",
    description:
      "Plataforma de leilões online. Implementei novas funcionalidades e ajudei a construir o design system que passou a padronizar a interface entre o app e a web.",
    tags: ["TypeScript", "React Native", "React"],
  },
  {
    year: "2020 — 2022",
    role: "Software Engineer",
    org: "BraPay",
    description:
      "Onde comecei, como estagiário. Primeiro num app de delivery de comida: geolocalização, WebSockets para acompanhar o pedido em tempo real e o design system, que criei e mantive. Depois numa plataforma de criptomoedas, com a mesma stack.",
    tags: ["TypeScript", "React Native", "React", "Node", "Express"],
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
              Há seis anos trabalho entre engenharia e design. Foi nessa interseção que encontrei o
              tipo de produto que gosto de construir.
            </p>
          </div>
        </Reveal>

        <ol className="timeline">
          {entries.map((entry, index) => (
            <Reveal
              key={index}
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
