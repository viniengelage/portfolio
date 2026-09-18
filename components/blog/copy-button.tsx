"use client";

import { CheckIcon, CopyIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState } from "react";

/** Ilha client isolada: o resto do `<CodeBlock>` continua Server Component. */
export function CopyButton({ value, label = "Copiar código" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      className="copy-button"
      onClick={copy}
      data-copied={copied}
      aria-label={copied ? "Copiado" : label}
    >
      {copied ? <CheckIcon weight="bold" aria-hidden="true" /> : <CopyIcon weight="bold" aria-hidden="true" />}
      <span className="copy-button__text" aria-hidden="true">{copied ? "Copiado" : "Copiar"}</span>
    </button>
  );
}
