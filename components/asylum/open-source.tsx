import { ArrowUpRightIcon, GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import type { AsylumCopy } from "../../content/asylum";
import { ASYLUM } from "../../lib/asylum";
import { Reveal } from "../reveal";
import { Prompt, SectionHead } from "./shared";

type OpenSourceProps = {
  copy: AsylumCopy["openSource"];
  /** O mesmo prompt do CTA, que fecha o bloco de instalação. */
  prompt: string;
};

export function AsylumOpenSource({ copy, prompt }: OpenSourceProps) {
  const [download, quarantine, open] = copy.install.steps;

  return (
    <section className="band band--raised" id="open-source" aria-labelledby="open-source-title">
      <div className="shell band__inner asy-stack">
        <SectionHead id="open-source-title" head={copy.head} />

        <div className="asy-os">
          <Reveal className="asy-repo glass">
            <div className="asy-repo__head">
              <p className="asy-repo__name">
                <GithubLogoIcon weight="fill" aria-hidden="true" />
                {ASYLUM.slug}
              </p>
              <span className="asy-tag asy-tag--pill" data-tone="ok">
                {ASYLUM.license}
              </span>
            </div>

            <p className="asy-repo__desc">{copy.description}</p>

            <dl className="asy-repo__facts">
              {copy.facts.map((fact) => (
                <div key={fact.value}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            <ul className="asy-repo__chips">
              {copy.chips.map((chip) => (
                <li key={chip} className="chip">
                  {chip}
                </li>
              ))}
            </ul>

            <a className="btn asy-repo__cta" href={ASYLUM.repo} target="_blank" rel="noreferrer">
              {copy.cta}
              <ArrowUpRightIcon weight="bold" aria-hidden="true" />
            </a>
          </Reveal>

          <Reveal delay={120}>
            <figure className="asy-code">
              <figcaption className="asy-code__bar">
                <span className="asy-code__dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="asy-code__lang">{copy.install.label}</span>
              </figcaption>
              <pre>
                <code>
                  <span className="asy-code__c"># {download}</span>
                  {"\n"}
                  <span className="asy-code__c">
                    #{"    "}
                    <a href={ASYLUM.releases} target="_blank" rel="noreferrer">
                      github.com/{ASYLUM.slug}/releases
                    </a>
                  </span>
                  {"\n\n"}
                  <span className="asy-code__c"># {quarantine}</span>
                  {"\n"}
                  <span className="asy-code__k">xattr</span> -dr com.apple.quarantine{" "}
                  <span className="asy-code__s">/Applications/Asylum.app</span>
                  {"\n\n"}
                  <span className="asy-code__c"># {open}</span>
                  {"\n"}
                  <span className="asy-code__k">open</span> -a{" "}
                  <span className="asy-code__s">Asylum</span>
                  {"\n\n"}
                  <Prompt text={prompt} />
                </code>
              </pre>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
