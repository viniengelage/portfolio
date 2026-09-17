"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Hrefs absolutos (`/#id`) e não âncoras puras: a nav é usada também
 * nas páginas de blog, onde `#trabalho` não existe.
 */
const links = [
  { href: "/#trabalho", label: "Trabalho" },
  { href: "/#trajetoria", label: "Trajetória" },
  { href: "/blog", label: "Blog" },
];

/** No mobile o CTA vive dentro do overlay, então entra no mesmo stagger. */
const overlayLinks = [...links, { href: "/#contato", label: "Contato" }];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) firstLink.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <nav className="nav glass" aria-label="Navegação principal">
        <Link href="/" aria-label="Página inicial">
          <img className="brand-mark" src="/logo-mark.svg" alt="" width={22} height={32} />
        </Link>

        <div className="nav__links">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/#contato" className="btn nav__cta">
          Contato
        </Link>

        <button
          type="button"
          className="nav__menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </nav>

      <div
        id="menu-mobile"
        className="nav__overlay"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        aria-hidden={!open}
      >
        <nav>
          {/* O stagger vai numa custom property, não em `style.transitionDelay`:
              inline style vence qualquer regra da folha de estilo, e isso
              deixaria o press dos links esperando o delay de entrada.
              Ao fechar o delay zera, então a saída é imediata. */}
          {overlayLinks.map((link, index) => (
            <Link
              key={link.href}
              ref={index === 0 ? firstLink : undefined}
              href={link.href}
              onClick={() => setOpen(false)}
              style={
                {
                  "--link-delay": open ? `calc(80ms + ${index} * var(--stagger))` : "0ms",
                } as React.CSSProperties
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
