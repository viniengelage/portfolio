import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { CodeBlock } from "../../components/blog/code-block";
import { Reveal } from "../../components/reveal";
import {
  POLAR_DARK,
  polarDarkCodeVars,
  polarDarkSurfaces,
  polarDarkSyntax,
} from "../../lib/polar-dark";

const title = "Polar Dark";
const description =
  "Tema escuro para Zed e VS Code com as cores do design system deste portfólio. Onze cores de sintaxe, cada uma com uma origem declarada.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, url: "/polar-dark", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

/** Sem JSX de propósito: o tokenizador do site não distingue tag de variável,
 *  e uma prévia com tag pintada de branco contradiria a tabela logo abaixo. */
const SAMPLE = `import { useMemo } from "react";
import type { Star } from "./catalog";

// a estrela polar não se move — é esse o ponto
export function describe(star: Star) {
  const visible = useMemo(() => star.magnitude < 6.5, [star]);

  if (!visible) {
    return { label: "invisível a olho nu", tone: "muted" };
  }

  return { label: star.name, tone: "accent" };
}
`;

const ZED_INSTALL = `mkdir -p ~/.config/zed/themes
curl -o ~/.config/zed/themes/polar-dark.json \\
  ${POLAR_DARK.zedThemeUrl}
`;

const VSCODE_INSTALL = `code --install-extension ${POLAR_DARK.vscode.extensionId}
`;

const decisions = [
  {
    title: "#08070C em vez de preto puro",
    body: "Preto absoluto borra em painel OLED. E a escada de elevação corre para dentro: o editor é a superfície mais funda, a moldura fica por cima dele — o contrário do que a maioria dos temas faz.",
  },
  {
    title: "Um violeta que nenhum token usa",
    body: "#6D28D9 é exclusivo do véu da linha ativa, do foco e do texto fantasma da IA. Como nenhuma cor de sintaxe o usa, sugestão de modelo nunca se confunde com código que já está escrito.",
  },
  {
    title: "Tipo e função dividem o mesmo azul",
    body: "Escolha consciente, não descuido: na prática a distinção entre os dois vem da posição, não da cor. Quem quiser separar tem #88BCFB livre na rampa ANSI do terminal.",
  },
];

export default function PolarDarkPage() {
  return (
    <>
      <a className="skip-link" href="#previa">
        Pular para a prévia
      </a>

      <main className="theme">
        {/* --- 1. cabeçalho ----------------------------------------- */}
        <header className="band theme-hero">
          <div className="bloom theme-hero__bloom" aria-hidden="true" />

          <div className="shell band__inner">
            <Link href="/#lado-b" className="post-back">
              <ArrowLeftIcon weight="bold" aria-hidden="true" /> Voltar para os projetos
            </Link>

            <p className="label theme-hero__label">Tema</p>
            <h1 className="theme-hero__title">{POLAR_DARK.name}</h1>

            <p className="theme-hero__lead">
              As cores deste site, dentro do editor. Um tema escuro para Zed e VS Code cuja paleta de
              sintaxe saiu de um design system em uso — cada cor tem origem, nenhuma foi escolhida
              isolada.
            </p>

            <ul className="theme-hero__meta mono">
              <li>v{POLAR_DARK.version}</li>
              <li>{POLAR_DARK.license}</li>
              <li>
                {POLAR_DARK.zed.styleKeys} chaves · {POLAR_DARK.zed.captures} captures
              </li>
            </ul>

            <div className="theme-hero__actions">
              <a className="btn" href="#instalar">
                Instalar
              </a>
              <a className="btn" href={POLAR_DARK.repo} target="_blank" rel="noreferrer">
                Ver no GitHub
                <ArrowUpRightIcon weight="bold" aria-hidden="true" />
              </a>
            </div>
          </div>
        </header>

        {/* --- 2. prévia --------------------------------------------- */}
        <section className="band band--raised theme-preview" id="previa" aria-label="Prévia">
          <div className="shell band__inner">
            <div className="theme-preview__frame" style={polarDarkCodeVars}>
              <CodeBlock
                code={SAMPLE}
                lang="ts"
                filename="catalog/describe.ts"
                highlightLines={[6]}
                copyable={false}
              />
            </div>

            <p className="theme-preview__caption mono">
              Pintado com os valores do próprio tema. A linha destacada é o véu da linha ativa.
            </p>
          </div>
        </section>

        {/* --- 3. paleta --------------------------------------------- */}
        <section className="band theme-palette" aria-labelledby="paleta">
          <div className="shell band__inner">
            <Reveal className="section-head">
              <div className="section-head__title">
                <p className="label">Paleta</p>
                <h2 id="paleta">Onze cores, cada uma com um motivo</h2>
              </div>
              <div className="section-head__aside">
                <p>
                  Três delas são os acentos dos produtos que estão no ar. Ler código neste tema é ler
                  as mesmas cores do resto do portfólio.
                </p>
              </div>
            </Reveal>

            <ul className="pal-grid">
              {polarDarkSyntax.map((swatch) => (
                <li className="pal-card glass" key={swatch.hex}>
                  <span
                    className="pal-card__chip"
                    style={{ background: swatch.hex }}
                    aria-hidden="true"
                  />
                  <p className="pal-card__name">{swatch.name}</p>
                  <p className="pal-card__hex mono">{swatch.hex}</p>
                  <p className="pal-card__carries">{swatch.carries}</p>
                  {swatch.origin ? (
                    <p className="pal-card__origin mono">{swatch.origin}</p>
                  ) : null}
                </li>
              ))}
            </ul>

            <div className="pal-surfaces">
              <p className="label label--muted">Superfícies</p>
              <ul>
                {polarDarkSurfaces.map((surface) => (
                  <li key={surface.hex}>
                    <span
                      className="pal-surfaces__chip"
                      style={{ background: surface.hex }}
                      aria-hidden="true"
                    />
                    <b className="mono">{surface.hex}</b>
                    <span>{surface.use}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* --- 4. decisões ------------------------------------------- */}
        <section className="band band--raised theme-decisions" aria-labelledby="decisoes">
          <div className="shell band__inner">
            <Reveal className="section-head">
              <div className="section-head__title">
                <p className="label">Decisões</p>
                <h2 id="decisoes">O que não é óbvio</h2>
              </div>
            </Reveal>

            <ol className="decision-list">
              {decisions.map((decision, index) => (
                <Reveal as="li" key={decision.title} delay={index * 60}>
                  <p className="decision__index mono">{String(index + 1).padStart(2, "0")}</p>
                  <h3>{decision.title}</h3>
                  <p className="decision__body">{decision.body}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* --- 5. instalação ----------------------------------------- */}
        <section className="band theme-install" id="instalar" aria-labelledby="instalar-titulo">
          <div className="shell band__inner">
            <Reveal className="section-head">
              <div className="section-head__title">
                <p className="label">Instalar</p>
                <h2 id="instalar-titulo">Dois editores, dois comandos</h2>
              </div>
            </Reveal>

            <div className="install-grid">
              <div className="install">
                <h3>Zed</h3>
                <p className="install__lead">
                  O Zed lê arquivos de tema na hora — não precisa reiniciar.
                </p>
                <CodeBlock code={ZED_INSTALL} lang="sh" filename="Zed" />
                <p className="install__foot">
                  Depois, <kbd>cmd</kbd> <kbd>K</kbd> <kbd>cmd</kbd> <kbd>T</kbd> e escolha{" "}
                  <strong>{POLAR_DARK.name}</strong>.
                </p>
              </div>

              <div className="install">
                <h3>VS Code</h3>
                <p className="install__lead">
                  Pela linha de comando, ou buscando por <strong>{POLAR_DARK.name}</strong> na aba de
                  extensões.
                </p>
                <CodeBlock code={VSCODE_INSTALL} lang="sh" filename="VS Code" />
                <p className="install__foot">
                  Também funciona no Cursor e em qualquer fork que leia o Marketplace.
                </p>
              </div>
            </div>

            <p className="theme-foot">
              Código, changelog e licença no{" "}
              <a className="prose-a" href={POLAR_DARK.repo} target="_blank" rel="noreferrer">
                repositório
              </a>
              . Achou uma cor errada em alguma linguagem? Abre uma issue.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
