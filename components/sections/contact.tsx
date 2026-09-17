import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { AUTHOR } from "../../lib/posts";
import { Reveal } from "../reveal";

const socials = [
  { label: "GitHub", href: "https://github.com/viniengelage" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/viniengelage/" },
  { label: "X", href: "https://x.com/viniengelage" },
  { label: "Instagram", href: "https://instagram.com/viniengelage" },
];

// PLACEHOLDER: confirmar o e-mail de contato
const email = "oi@viniengelage.com";

/**
 * Fixo de propósito: com Cache Components ligado, `new Date()` em
 * Server Component quebra o prerender por ser valor instável.
 */
const year = 2026;

export function Contact() {
  return (
    <section className="band band--raised contact" id="contato">
      <div className="bloom contact__bloom" aria-hidden="true" />
      {/* o sinal sendo emitido */}
      <div className="contact__signals" aria-hidden="true">
        {[240, 400, 600, 840, 1120].map((size, index) => (
          <span
            key={size}
            className="signal"
            style={
              {
                width: `${size}px`,
                height: `${size}px`,
                "--signal-delay": `${index * 0.8}s`,
                "--signal-op": `${18 - index * 3}%`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="shell band__inner contact__inner">
        <Reveal>
          <p className="label">Contato</p>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="contact__title">
            Vamos construir algo que <em className="editorial">respire</em>
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <p className="contact__lead">
            Aberto a projetos de produto — app, web ou design system. Respondo em até um dia útil.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <a className="contact__email" href={`mailto:${email}`}>
            {email}
            <ArrowUpRight weight="bold" aria-hidden="true" />
          </a>
        </Reveal>

        <Reveal delay={320}>
          <ul className="contact__socials">
            {socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noreferrer">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <footer className="footer">
          <div className="footer__brand">
            <Link href="/" aria-label="Página inicial">
              <img className="brand-mark" src="/logo-mark.svg" alt="" width={22} height={32} />
            </Link>
            <p>
              © {year} {AUTHOR.name} · Feito com carinho
            </p>
          </div>
          {/*<p className="footer__colophon">Desenhado no Penpot, construído em Next.js</p>*/}
        </footer>
      </div>
    </section>
  );
}
