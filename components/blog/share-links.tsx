"use client";

import { CheckIcon, LinkIcon, LinkedinLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState } from "react";

export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const shareTargets = [

    {
      label: "Compartilhar no LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: <LinkedinLogoIcon weight="bold" aria-hidden="true" />,
      text: "LinkedIn",
    },
  ];

  return (
    <div className="share" role="group" aria-label="Compartilhar este post">
      {shareTargets.map((target) => (
        <a
          key={target.text}
          className="share__item"
          href={target.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={target.label}
        >
          {target.icon}
          <span>{target.text}</span>
        </a>
      ))}

      <button type="button" className="share__item" onClick={copyLink} data-copied={copied || undefined}>
        {copied ? <CheckIcon weight="bold" aria-hidden="true" /> : <LinkIcon weight="bold" aria-hidden="true" />}
        <span>{copied ? "Link copiado" : "Copiar link"}</span>
      </button>
    </div>
  );
}
