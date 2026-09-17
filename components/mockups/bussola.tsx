import type { CSSProperties } from "react";

/** Custom properties (--mk-*) no atributo style, sem brigar com o tipo CSSProperties. */
const vars = (value: Record<string, string | number>) => value as CSSProperties;

/** Os 7 passos da jornada. O passo 3 (índice 2) é o ativo. */
const STEPS = [0, 1, 2, 3, 4, 5, 6];
const ACTIVE_STEP = 2;

const THREAD = [
  {
    from: "user" as const,
    text: "Tenho uma decisão grande essa semana. Não consigo pensar em outra coisa.",
  },
  {
    from: "guide" as const,
    text: "Nenhuma travessia se faz só com visão. Também se faz cuidando das velas e do convés.",
  },
  {
    from: "user" as const,
    text: "Isso parece pouco perto do tamanho da decisão.",
  },
];

/** Termômetro dos 5 pilares. */
const PILLARS = [
  { label: "Trab", pct: 80 },
  { label: "Corpo", pct: 40 },
  { label: "Vínc", pct: 95 },
  { label: "Mente", pct: 55 },
  { label: "Prop", pct: 70 },
];

export function BussolaMockup() {
  return (
    <div
      className="mk mk--bussola"
      role="img"
      aria-label="Mockup ilustrativo do app Bússola: conversa guiada no passo 3 da jornada, com um anel de sete etapas ao fundo e um termômetro dos cinco pilares da vida."
    >
      <div className="mk__stage" aria-hidden="true">
        {/* fundo: anel dos 7 passos */}
        <div className="mk__asset mk-bus__ring">
          {STEPS.map((step) => (
            <span
              key={step}
              className={`mk-bus__node${step === ACTIVE_STEP ? " mk-bus__node--active" : ""}`}
              style={vars({ "--i": step })}
            />
          ))}
        </div>

        <div className="mk__rig">
          <div className="mk__device">
            <div className="mk__screen">
              <div className="mk__status">
                <span className="mk__status-time">9:41</span>
                <span className="mk__status-icons">
                  <i />
                  <i />
                  <i />
                </span>
              </div>

              <div>
                <p className="mk-bus__step mk__mono">Passo 03 · Ver</p>
                <p className="mk__title">A Jornada</p>
              </div>

              {/* thread de conversa */}
              <div className="mk-bus__thread">
                {THREAD.map((message, index) => (
                  <p
                    key={index}
                    className={`mk-bus__bubble mk-bus__bubble--${message.from === "user" ? "user" : "guide"}`}
                  >
                    {message.text}
                  </p>
                ))}
              </div>

              {/* prescrição do passo */}
              <div className="mk-bus__action">
                <span className="mk-bus__action-label mk__mono">Ação mínima</span>
                <span className="mk-bus__action-text">
                  Que pequena coisa hoje merece mais cuidado do que uma grande decisão?
                </span>
              </div>
            </div>
          </div>

          {/* card flutuante: termômetro, sangrando pela esquerda */}
          <div className="mk__float mk-bus__float">
            <div className="mk__float-row">
              <span className="mk__float-title">Termômetro</span>
              <span className="mk__float-meta">hoje</span>
            </div>
            <div className="mk-bus__pillars">
              {PILLARS.map((pillar, index) => (
                <div className="mk-bus__pillar" key={pillar.label}>
                  <span className="mk-bus__pillar-track">
                    <span
                      className="mk-bus__pillar-fill"
                      style={vars({ "--mk-h": `${pillar.pct}%`, "--i": index })}
                    />
                  </span>
                  <span className="mk-bus__pillar-label mk__mono">{pillar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <span className="mk__badge" aria-hidden="true">
        Mockup ilustrativo
      </span>
    </div>
  );
}
