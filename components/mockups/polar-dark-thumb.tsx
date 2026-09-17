/**
 * Miniatura do Polar Dark para o card do Lado B.
 *
 * O truque é o JSON se autodemonstrar: cada valor hexadecimal está pintado com
 * a própria cor que nomeia. Uma fileira de swatches mostraria a paleta; isto
 * mostra a paleta *e* o formato do tema ao mesmo tempo.
 */

const LINES: { key: string; value: string; tone: "teal" | "violet" | "amber" }[] = [
  { key: '"name"', value: '"Polar Dark"', tone: "teal" },
  { key: '"keyword"', value: '"#C084FC"', tone: "violet" },
  { key: '"string"', value: '"#2DD4BF"', tone: "teal" },
  { key: '"attribute"', value: '"#E8B368"', tone: "amber" },
];

/** Estrela de quatro pontas: raio vertical mais longo que o horizontal. */
const STAR =
  "M100 0C100 98.4 118 120 200 120C118 120 100 141.6 100 240C100 141.6 82 120 0 120C82 120 100 98.4 100 0Z";

export function PolarDarkThumb() {
  return (
    <div
      className="polar-thumb"
      role="img"
      aria-label="Marca do Polar Dark ao lado de quatro linhas do JSON do tema, cada valor pintado com a cor que ele define."
    >
      <svg className="polar-thumb__star" viewBox="0 0 200 240" aria-hidden="true" focusable="false">
        <path d={STAR} />
      </svg>

      <pre className="polar-thumb__code" aria-hidden="true">
        {LINES.map((line) => (
          <span className="polar-thumb__line" key={line.key}>
            <b className="polar-thumb__key">{line.key}</b>
            <i className="polar-thumb__punct">: </i>
            <b className="polar-thumb__value" data-tone={line.tone}>
              {line.value}
            </b>
          </span>
        ))}
      </pre>
    </div>
  );
}
