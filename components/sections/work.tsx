import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { BussolaMockup } from "../mockups/bussola";
import { OrganizadinMockup } from "../mockups/organizadin";
import { PolarDarkMockup } from "../mockups/polar-dark";
import { TrixMockup } from "../mockups/trix";
import { Reveal } from "../reveal";

type Project = {
  mark: string;
  period: string;
  accent: string;
  title: string;
  description: string;
  role: string;
  stack: string[];
  url: string;
  href: string;
  mockup: React.ReactNode;
  reverse?: boolean;
};

const projects: Project[] = [
  {
    mark: "Polar Dark",
    period: "open source",
    accent: "var(--accent)",
    title: "Um tema escuro feito para deixar o código respirar",
    description:
      "Tema para VS Code e Zed construído a partir de um sistema de design real. Cinco cores de sintaxe, superfícies com viés violeta e a rampa ANSI completa mantêm o editor focado no código.",
    role: "Direção visual · Mapeamento de tokens de interface e sintaxe · Port para VS Code e Zed",
    stack: ["VS Code", "Zed", "JSON", "Design system"],
    url: "github.com/viniengelage/polaris-theme",
    href: "https://github.com/viniengelage/polaris-theme",
    mockup: <PolarDarkMockup />,
  },
  {
    mark: "Organizadin",
    period: "em produção",
    accent: "var(--accent-organizadin)",
    title: "O mês inteiro organizado, sem planilha",
    description:
      "App de organização financeira pessoal para iOS e Android. Contas, cartões, limites, assinaturas e lembretes num lugar só — com Open Finance importando o extrato e relatórios que explicam o mês em texto.",
    role: "Planejamento, design e desenvolvimento completo do produto · Design system · App, backend e integração Open Finance",
    stack: ["React Native", "TypeScript", "Node", "Open Finance"],
    url: "organizadin.com",
    href: "https://organizadin.com",
    mockup: <OrganizadinMockup />,
  },
  {
    mark: "Bússola",
    period: "em produção",
    accent: "var(--accent-bussola)",
    title: "Um método para decidir com clareza",
    description:
      "Não é um chat de IA — é um método de sete passos que usa a IA como espelho. Separa fato de narrativa, medo de verdade, e termina sempre numa ação mínima concreta. Com check-in diário e termômetro de padrões.",
    role: "Design de produto e interface · Arquitetura da conversa · Frontend e integração com LLM",
    stack: ["React", "TypeScript", "Node", "LLM"],
    url: "bussola.vc",
    href: "https://bussola.vc",
    mockup: <BussolaMockup />,
    reverse: true,
  },
  {
    mark: "Trix",
    period: "2022 — 2024",
    accent: "var(--accent-trix)",
    title: "Viver de renda, em cinco cliques",
    description:
      "App de investimentos em fundos imobiliários e ações da gestora TRX. Carteiras prontas montadas por especialistas, aporte a partir de R$ 150 e DARF automático — incluindo o Trix Kids, conta de investimento para menores.",
    role: "Desenvolvedor principal · Migração da arquitetura legada para Expo com atualizações OTA · Reescrita do serviço de API · Criação e adoção do novo design system",
    stack: ["React Native", "TypeScript", "Fintech", "CVM"],
    url: "trix.com.br",
    href: "https://trix.com.br",
    mockup: <TrixMockup />,
  },
];

export function Work() {
  return (
    <section className="band band--raised" id="trabalho">
      <div className="shell band__inner">
        <Reveal className="section-head">
          <div className="section-head__title">
            <p className="label">Meus projetos</p>
            <h2>Produtos que estão no ar</h2>
          </div>
          <div className="section-head__aside">
            <p className="mono work__disclaimer">
              As telas são recriações ilustrativas feitas para este portfólio — não são capturas dos
              produtos.
            </p>
          </div>
        </Reveal>

        <div className="work__list">
          {projects.map((project, index) => (
            <Reveal key={project.mark} as="article" delay={index * 60}>
              <div
                className={`project glass${project.reverse ? " project--reverse" : ""}`}
                style={{ "--project-accent": project.accent } as React.CSSProperties}
              >
                <div className="project__visual">{project.mockup}</div>

                <div className="project__copy">
                  <p className="project__meta">
                    <span className="project__mark">{project.mark}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.period}</span>
                  </p>

                  <h3>{project.title}</h3>
                  <p className="project__description">{project.description}</p>

                  <div className="project__role">
                    <p className="label label--muted">Meu papel</p>
                    <p>{project.role}</p>
                  </div>

                  <ul className="project__stack">
                    {project.stack.map((item) => (
                      <li key={item} className="chip">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    className="link-arrow project__link"
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {project.url}
                    <ArrowUpRightIcon weight="bold" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
