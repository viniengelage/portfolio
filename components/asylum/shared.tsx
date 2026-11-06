import Image from "next/image";
import { Fragment } from "react";
import type { AccentedText, SectionHeadCopy } from "../../content/asylum/types";
import { Reveal } from "../reveal";

/** Título com uma palavra no serifado editorial. `\n` vira <br />. */
export function Accented({ text }: { text: AccentedText }) {
  return (
    <>
      {text.before.split("\n").map((line, index) => (
        <Fragment key={index}>
          {index > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
      <em className="editorial">{text.accent}</em>
      {text.after}
    </>
  );
}

export function SectionHead({ id, head }: { id: string; head: SectionHeadCopy }) {
  return (
    <Reveal className="section-head">
      <div className="section-head__title">
        <p className="label">{head.eyebrow}</p>
        <h2 id={id}>
          <Accented text={head.title} />
        </h2>
      </div>
      <div className="section-head__aside">
        <p>{head.lead}</p>
      </div>
    </Reveal>
  );
}

type ShotProps = {
  /**
   * Nome do arquivo em `public/asylum/`, igual ao do retângulo `shot/*` no design.
   * Os arquivos são os PNGs originais do `.fig` em WEBP sem perda.
   */
  name: string;
  /** Tamanho em CSS px no desktop, só para a proporção e o layout. */
  width: number;
  height: number;
  alt: string;
  sizes: string;
  /**
   * No mobile, recorta em quadrado no ponto dado (`object-position`) em vez de
   * encolher a janela inteira: um editor em 342px deixa o texto com ~2px.
   */
  focus?: string;
  preload?: boolean;
};

/** 75 (o padrão do Next) borra o texto fino dos prints; precisa estar em `images.qualities`. */
const SHOT_QUALITY = 90;

export function Shot({ name, width, height, alt, sizes, focus, preload }: ShotProps) {
  return (
    <Image
      src={`/asylum/${name}.webp`}
      width={width}
      height={height}
      alt={alt}
      sizes={sizes}
      quality={SHOT_QUALITY}
      preload={preload}
      className={focus ? "asy-shot--crop" : undefined}
      style={focus ? ({ "--focus": focus } as React.CSSProperties) : undefined}
    />
  );
}

/** `asylum ~ $ dev é loucura_`, o prompt que fecha o bloco de instalação e abre o CTA. */
export function Prompt({ text }: { text: string }) {
  return (
    <span className="asy-prompt">
      <span className="asy-prompt__host">asylum</span>{" "}
      <span className="asy-prompt__path">~ $</span> {text}
      <span className="asy-prompt__cursor" aria-hidden="true">
        _
      </span>
    </span>
  );
}
