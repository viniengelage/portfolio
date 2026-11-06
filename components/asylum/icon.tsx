/**
 * Ícone do Asylum: o "A" com o redemoinho, exportado do frame `app-icon`
 * (Open Pencil, página 08). Os ícones de perfil do Dock são o mesmo traço com
 * outro gradiente, por isso a cor é parâmetro e não um SVG por variação.
 *
 * O gradiente fica no CSS e não num <linearGradient>: vários ícones na mesma
 * página repetiriam o mesmo `id` de <defs>.
 */

const TONES = {
  violet: { from: "#7c3aed", to: "#2e1065", swirl: "#e8b368" },
  amber: { from: "#d97706", to: "#451a03", swirl: "#c084fc" },
  teal: { from: "#0d9488", to: "#042f2e", swirl: "#e8b368" },
  blue: { from: "#2563eb", to: "#172554", swirl: "#e8b368" },
  rose: { from: "#e11d48", to: "#4c0519", swirl: "#e8b368" },
} as const;

export type AsylumIconTone = keyof typeof TONES;

const LETTER = "M23.38 68.75L44 20.63L64.63 68.75";

const SWIRL =
  "M44 51.56L44.02 51.44L44.09 51.34L44.19 51.25L44.31 51.2L44.46 51.18L44.64 51.22L44.79 51.3L44.95 51.44L45.07 51.61L45.17 51.84L45.2 52.08L45.19 52.35L45.12 52.65L44.98 52.92L44.76 53.18L44.5 53.4L44.17 53.59L43.79 53.69L43.38 53.75L42.93 53.71L42.5 53.57L42.08 53.35L41.7 53.04L41.35 52.66L41.08 52.2L40.89 51.67L40.8 51.08L40.84 50.48L40.98 49.88L41.23 49.29L41.61 48.74L42.09 48.26L42.68 47.85L43.35 47.56L44.07 47.39L44.84 47.35L45.63 47.45L46.39 47.71L47.13 48.11L47.8 48.66L48.35 49.33L48.8 50.12L49.1 50.98L49.24 51.91L49.21 52.87L49 53.83L48.61 54.76L48.06 55.62L47.33 56.38L46.46 56.99L45.48 57.47L44.4 57.75L43.28 57.85L42.13 57.73L40.99 57.41L39.93 56.86L38.96 56.13L38.65 55.84";

type AsylumIconProps = {
  size: number;
  tone?: AsylumIconTone;
  /** Os ícones pequenos (nav, rodapé) mostram só o "A", como no design. */
  swirl?: boolean;
  className?: string;
};

export function AsylumIcon({ size, tone = "violet", swirl = true, className }: AsylumIconProps) {
  const colors = TONES[tone];

  return (
    <span
      className={`asy-icon ${className ?? ""}`.trim()}
      style={
        {
          "--icon-size": `${size}px`,
          "--icon-from": colors.from,
          "--icon-to": colors.to,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <svg viewBox="0 0 88 88" focusable="false">
        <path
          d={LETTER}
          fill="none"
          stroke="#f5f3ff"
          // sem o redemoinho o "A" fica mais grosso, como no `mini-icon` do design
          strokeWidth={swirl ? 9.625 : 10.3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {swirl ? (
          <path d={SWIRL} fill="none" stroke={colors.swirl} strokeWidth={2.4} strokeLinecap="round" />
        ) : null}
      </svg>
    </span>
  );
}
