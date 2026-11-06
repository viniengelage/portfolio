import { AsylumIcon } from "../asylum/icon";

/**
 * Miniatura do Asylum para o card do Lado B.
 *
 * Mesma ideia da do Polar Dark: a marca ao lado de um trecho que mostra o
 * produto funcionando. Aqui é o que a landing promete numa frase, as
 * ferramentas que viviam em outras janelas rodando dentro de uma só.
 */

const DOCKS: { name: string; state: string; tone: "ok" | "live" }[] = [
  { name: "iOS Simulator", state: "rodando", tone: "live" },
  { name: "Android Emulator", state: "rodando", tone: "live" },
  { name: "PostgreSQL", state: "conectado", tone: "ok" },
];

export function AsylumThumb() {
  return (
    <div
      className="asylum-thumb"
      role="img"
      aria-label="Ícone do Asylum ao lado de um terminal com o simulador de iOS, o emulador de Android e o banco rodando na mesma janela."
    >
      <AsylumIcon size={64} className="asylum-thumb__icon" />

      <pre className="asylum-thumb__code" aria-hidden="true">
        <span className="asylum-thumb__line">
          <b className="asylum-thumb__host">asylum</b> <i>~ $</i> open -a Asylum
        </span>
        {DOCKS.map((dock) => (
          <span className="asylum-thumb__line" key={dock.name}>
            <i>▸ </i>
            {dock.name.padEnd(17)}
            <b className="asylum-thumb__state" data-tone={dock.tone}>
              {dock.state}
            </b>
          </span>
        ))}
      </pre>
    </div>
  );
}
