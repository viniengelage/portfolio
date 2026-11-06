import Link from "next/link";
import type { AsylumCopy } from "../../content/asylum";
import { ASYLUM } from "../../lib/asylum";
import { AUTHOR } from "../../lib/posts";
import { Reveal } from "../reveal";
import { AsylumIcon } from "./icon";
import { Accented, Prompt } from "./shared";

/** Diâmetro e opacidade dos `signal-ring-*` do frame, do menor para o maior. */
const RINGS = [
  { size: 280, op: 20 },
  { size: 460, op: 14 },
  { size: 680, op: 9 },
  { size: 940, op: 5.5 },
  { size: 1240, op: 3.5 },
];

type CtaProps = {
  copy: AsylumCopy["cta"];
  footer: AsylumCopy["footer"];
};

export function AsylumCta({ copy, footer }: CtaProps) {
  return (
    <section className="band asy-cta" id="download" aria-labelledby="download-title">
      <div className="bloom asy-cta__bloom" aria-hidden="true" />
      {/* as ondas do contato do site, centradas no título */}
      <div className="asy-cta__signals" aria-hidden="true">
        {RINGS.map((ring, index) => (
          <span
            key={ring.size}
            className="signal"
            style={
              {
                width: `${ring.size}px`,
                height: `${ring.size}px`,
                "--signal-delay": `${index * 0.8}s`,
                "--signal-op": `${ring.op}%`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="shell band__inner">
        <div className="asy-cta__copy">
          <Reveal>
            <p>
              <Prompt text={copy.prompt} />
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h2 id="download-title" className="asy-cta__title">
              <Accented text={copy.title} />
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <p className="asy-cta__lead">{copy.lead}</p>
          </Reveal>

          <Reveal delay={240} className="asy-actions">
            <a className="btn asy-btn--primary" href={ASYLUM.downloads.macos}>
              {copy.downloadMac}
            </a>
            <a className="btn" href={ASYLUM.downloads.windows}>
              {copy.downloadWindows}
            </a>
          </Reveal>
        </div>

        <footer className="footer asy-footer">
          <div className="footer__brand">
            <AsylumIcon size={24} swirl={false} />
            <p>
              © {new Date().getFullYear()} <Link href="/">{AUTHOR.name}</Link> · {ASYLUM.license}
            </p>
          </div>
          <p className="footer__colophon">{footer.notice}</p>
        </footer>
      </div>
    </section>
  );
}
