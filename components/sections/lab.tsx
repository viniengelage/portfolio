import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { PolarDarkThumb } from "../mockups/polar-dark-thumb";
import { Reveal } from "../reveal";

/**
 * LADO B — projetos pequenos.
 *
 * Vive logo depois de `<Work />` e continua a mesma faixa elevada de propósito:
 * abrir uma dobra própria daria a estes projetos o mesmo peso dos produtos em
 * produção. A hierarquia vem do head menor e do label em cinza, não em violeta.
 */

type SideProject = {
  mark: string;
  /** O que é, em duas ou três palavras — ocupa o lugar do período. */
  kind: string;
  accent: string;
  title: string;
  description: string;
  stack: string[];
  href: string;
  cta: string;
  /** Link externo abre em nova aba e troca a seta. */
  external?: boolean;
  thumb: React.ReactNode;
};

const projects: SideProject[] = [
  {
    mark: "Polar Dark",
    kind: "tema para o editor",
    accent: "var(--accent)",
    title: "Meu tema para passar o dia no editor",
    description:
      "Tema escuro para Zed e VS Code, baseado na minha identidade visual e ajustado para leitura diária. São 150 chaves de interface e sintaxe, com licença MIT.",
    stack: ["Zed", "VS Code", "JSON", "MIT"],
    href: "/polar-dark",
    cta: "Ver o tema",
    thumb: <PolarDarkThumb />,
  },
];

export function Lab() {
  return (
    <section className="lab" id="lado-b">
      <div className="shell lab__inner">
        <div className="lab__divider" role="presentation" />

        <Reveal className="section-head lab__head">
          <div className="section-head__title">
            <p className="label label--muted">Lado B</p>
            <h2>Coisas menores, feitas por gosto</h2>
          </div>
          <div className="section-head__aside">
            <p className="mono lab__note">
              Projetos pequenos, sem cliente ou prazo. Começam com algum incômodo que quero resolver.
            </p>
          </div>
        </Reveal>

        <div className="lab__list" data-count={projects.length}>
          {projects.map((project, index) => (
            <Reveal key={project.mark} as="article" delay={index * 60}>
              <div
                className="lab-card glass"
                style={{ "--project-accent": project.accent } as React.CSSProperties}
              >
                <div className="lab-card__thumb">{project.thumb}</div>

                <div className="lab-card__body">
                  <p className="lab-card__meta">
                    <span className="lab-card__mark">{project.mark}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.kind}</span>
                  </p>

                  <h3>{project.title}</h3>
                  <p className="lab-card__description">{project.description}</p>

                  <ul className="lab-card__stack">
                    {project.stack.map((item) => (
                      <li key={item} className="chip">
                        {item}
                      </li>
                    ))}
                  </ul>

                  {project.external ? (
                    <a
                      className="link-arrow lab-card__link"
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {project.cta}
                      <ArrowUpRightIcon weight="bold" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link className="link-arrow lab-card__link" href={project.href}>
                      {project.cta}
                      <ArrowRightIcon weight="bold" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
