import type { CSSProperties } from "react";

/** Custom properties (--mk-*) no atributo style, sem brigar com o tipo CSSProperties. */
const vars = (value: Record<string, string | number>) => value as CSSProperties;

/**
 * Heatmap de gastos: 7 colunas × 5 semanas.
 * Valor = alpha do fill em cima do accent. 0 = só contorno.
 */
const HEAT = [
  0, 0, 8, 0, 14, 0, 0,
  0, 20, 0, 0, 6, 0, 12,
  10, 0, 0, 26, 0, 0, 0,
  0, 6, 0, 0, 34, 0, 18,
  0, 0, 12, 0, 0, 0, 8,
];

/** Dia de maior gasto do mês — ganha o glow. */
const PEAK_DAY = 25;

/** Gastos por categoria, já ordenados. A % é relativa à maior categoria. */
const BUDGET = [
  { label: "Moradia", pct: 100, value: "R$ 1.418" },
  { label: "Mercado", pct: 68, value: "R$ 964" },
  { label: "Transporte", pct: 29, value: "R$ 411" },
];

const TRANSACTIONS = [
  { title: "Mercado Dia", category: "Mercado", value: "−R$ 86,40" },
  { title: "Corrida · centro", category: "Transporte", value: "−R$ 21,90" },
  { title: "Assinatura música", category: "Lazer", value: "−R$ 34,90" },
];

export function OrganizadinMockup() {
  return (
    <div
      className="mk mk--organizadin"
      role="img"
      aria-label="Mockup ilustrativo do app Organizadin: tela de saldo disponível para gastar, gastos ordenados por categoria e um calendário de gastos ao fundo."
    >
      <div className="mk__stage" aria-hidden="true">
        {/* fundo: calendário-heatmap sangrando pela esquerda */}
        <div className="mk__asset mk-org__calendar">
          {HEAT.map((heat, index) => (
            <span
              key={index}
              className={`mk-org__day${index === PEAK_DAY ? " is-peak" : ""}`}
              style={vars({ "--mk-heat": `${heat}%` })}
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
                <p className="mk__eyebrow">Boa noite,</p>
                <p className="mk__title">Vinicios</p>
              </div>

              {/* card de saldo */}
              <div className="mk__card">
                <div className="mk__row">
                  <span className="mk__label mk__label--xs">Disponível para gastar</span>
                  <span className="mk__chip">No ritmo</span>
                </div>
                <p className="mk__value">R$ 1.847,20</p>

                <div className="mk-org__budget">
                  {BUDGET.map((item, index) => (
                    <div className="mk-org__budget-row" key={item.label} style={vars({ "--i": index })}>
                      <span className="mk-org__budget-label">{item.label}</span>
                      <span className="mk__track mk-org__budget-track">
                        <span className="mk__track-fill" style={vars({ "--mk-w": `${item.pct}%` })} />
                      </span>
                      <span className="mk-org__budget-value mk__mono">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* transações do dia */}
              <div className="mk__list">
                <span className="mk__list-head">Hoje · 12 ago</span>
                {TRANSACTIONS.map((tx) => (
                  <div className="mk__item" key={tx.title}>
                    <span className="mk__item-icon" />
                    <span className="mk__item-body">
                      <span className="mk__item-title">{tx.title}</span>
                      <span className="mk__item-meta">{tx.category}</span>
                    </span>
                    <span className="mk__item-value mk__mono">{tx.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* card flutuante: limite da categoria, sangrando pela direita */}
          <div className="mk__float mk-org__float">
            <div className="mk__float-row">
              <span className="mk-org__ring" />
              <span className="mk__float-body">
                <span className="mk__float-title">Limite de Mercado</span>
                <span className="mk__float-meta">R$ 964 de R$ 1.240</span>
              </span>
              <span className="mk__float-figure mk__mono">78%</span>
            </div>
            <span className="mk__track">
              <span className="mk__track-fill" style={vars({ "--mk-w": "78%" })} />
            </span>
          </div>
        </div>
      </div>

      <span className="mk__badge" aria-hidden="true">
        Mockup ilustrativo
      </span>
    </div>
  );
}
