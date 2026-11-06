import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { AsylumCopy } from "../../content/asylum";
import { ASYLUM, minorVersion, type AsylumRelease } from "../../lib/asylum";
import { Reveal } from "../reveal";
import { AsylumIcon } from "./icon";
import { Accented, Shot } from "./shared";

/**
 * Nós do blueprint, como deslocamento a partir do centro da página e não em %:
 * a grade é ancorada no centro, então os nós ficam nos mesmos cruzamentos em
 * qualquer largura. Coordenadas tiradas dos `blueprint-node` do frame.
 */
const NODES = [
  { dx: -384, y: 256, dur: "3.2s", warm: false },
  { dx: 512, y: 128, dur: "2.6s", warm: true },
  { dx: 384, y: 512, dur: "3.8s", warm: false },
];

type HeroProps = {
  copy: AsylumCopy["hero"];
  proof: AsylumCopy["proof"];
  release: AsylumRelease;
};

export function AsylumHero({ copy, proof, release }: HeroProps) {
  const version = `v${release.version}`;
  const badge = `${version} · ${copy.badge}`;

  return (
    <section className="band asy-hero" aria-labelledby="asylum-title">
      <div className="asy-hero__grid" aria-hidden="true">
        {NODES.map((node) => (
          <span
            key={node.dx}
            className={`blueprint__node asy-hero__node ${node.warm ? "asy-hero__node--warm" : ""}`}
            style={
              {
                "--dx": `${node.dx}px`,
                "--y": `${node.y}px`,
                "--node-dur": node.dur,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className="bloom asy-hero__bloom" aria-hidden="true" />

      <div className="shell band__inner">
        <div className="asy-hero__copy">
          <Reveal className="asy-hero__brand">
            <AsylumIcon size={88} className="asy-hero__icon" />
            {/* O badge é a versão publicada: vem da API do GitHub e leva às notas dela. */}
            <a
              className="pill asy-hero__badge"
              href={release.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${badge}, ${copy.badgeLabel}`}
            >
              <span className="pill__dot" aria-hidden="true" />
              {badge}
              <ArrowUpRightIcon weight="bold" aria-hidden="true" />
            </a>
          </Reveal>

          <Reveal delay={80}>
            <h1 id="asylum-title" className="asy-hero__title">
              <Accented text={copy.title} />
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="asy-hero__lead">{copy.lead}</p>
          </Reveal>

          <Reveal delay={240} className="asy-actions">
            <a className="btn asy-btn--primary" href={ASYLUM.downloads.macos}>
              {copy.downloadMac}
            </a>
            <a className="btn" href={ASYLUM.repo} target="_blank" rel="noreferrer">
              {copy.viewSource}
              <ArrowUpRightIcon weight="bold" aria-hidden="true" />
            </a>
          </Reveal>

          <Reveal delay={280}>
            <p className="mono asy-hero__platforms">{copy.platforms}</p>
          </Reveal>
        </div>

        <Reveal delay={320} className="asy-window asy-hero__window">
          <Shot
            name="devices"
            width={1200}
            height={750}
            alt={copy.shotAlt}
            // um pouco do código e os dois simuladores: é a frase do título
            focus="80% 50%"
            preload
          />
        </Reveal>

        <dl className="asy-proof">
          {proof.stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
          <div>
            <dt>{proof.versionLabel}</dt>
            <dd>v{minorVersion(release.version)}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
