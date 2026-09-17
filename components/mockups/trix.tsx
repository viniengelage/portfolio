import type { CSSProperties } from "react";

/** Custom properties (--mk-*) no atributo style, sem brigar com o tipo CSSProperties. */
const vars = (value: Record<string, string | number>) => value as CSSProperties;

/** Curva de patrimônio. A área fecha na base; a linha é o mesmo traçado aberto. */
const CURVE = "M0,200 C60,190 108,176 156,150 C206,122 256,84 312,52 C360,24 400,10 436,0";
const CURVE_AREA = `${CURVE} L436,250 L0,250 Z`;

/** Renda mensal dos últimos 12 meses, em px de altura. */
const MONTHS = [14, 20, 17, 26, 22, 30, 27, 36, 32, 40, 37, 48];

const WALLETS = [
  { name: "Tijolos Premium", kind: "FII · Shoppings e galpões", value: "R$ 7.240,00", delta: "+0,82%" },
  { name: "Dividendos", kind: "Ações · Renda consistente", value: "R$ 3.980,12", delta: "+0,64%" },
  { name: "Trix Kids", kind: "Carteira infantil", value: "R$ 1.260,20", delta: "+0,71%" },
];

export function TrixMockup() {
  return (
    <div
      className="mk mk--trix"
      role="img"
      aria-label="Mockup ilustrativo do app Trix: tela de patrimônio investido com renda dos últimos doze meses e lista de carteiras, sobre uma curva ascendente de patrimônio."
    >
      <div className="mk__stage" aria-hidden="true">
        {/* fundo: curva de patrimônio atravessando atrás do device */}
        <div className="mk__asset mk-trix__curve">
          <svg viewBox="0 0 436 250" preserveAspectRatio="none" focusable="false">
            <path className="mk-trix__area" d={CURVE_AREA} />
            <path className="mk-trix__line" d={CURVE} pathLength={1} />
          </svg>
          <span className="mk-trix__dot" />
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

              <p className="mk__title">Minha carteira</p>

              {/* card de patrimônio */}
              <div className="mk__card">
                <span className="mk__label">Patrimônio investido</span>
                <p className="mk__value">R$ 12.480,32</p>
                <div className="mk__row mk__row--tight">
                  <span className="mk__chip">+ R$ 94,20</span>
                  <span className="mk__label">de renda neste mês</span>
                </div>
              </div>

              {/* renda dos últimos 12 meses */}
              <div>
                <span className="mk__section-label">Renda dos últimos 12 meses</span>
                <div className="mk-trix__chart">
                  {MONTHS.map((height, index) => {
                    const isCurrent = index === MONTHS.length - 1;
                    return (
                      <span
                        key={index}
                        className={`mk-trix__bar${isCurrent ? " mk-trix__bar--current" : ""}`}
                        style={vars({
                          "--mk-bar": `${height}px`,
                          "--mk-o": (0.3 + index * 0.045).toFixed(2),
                          "--i": index,
                        })}
                      />
                    );
                  })}
                </div>
              </div>

              {/* carteiras */}
              <div className="mk__list">
                <span className="mk__list-head">Minhas carteiras</span>
                {WALLETS.map((wallet) => (
                  <div className="mk__item" key={wallet.name}>
                    <span className="mk__item-body">
                      <span className="mk__item-title">{wallet.name}</span>
                      <span className="mk__item-meta">{wallet.kind}</span>
                    </span>
                    <span className="mk__item-trail">
                      <span className="mk__item-value mk__mono">{wallet.value}</span>
                      <span className="mk__item-delta mk__mono">{wallet.delta}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* card flutuante: rendimento creditado, sangrando pelo topo */}
          <div className="mk__float mk-trix__float">
            <div className="mk__float-row">
              <span className="mk-trix__icon">↑</span>
              <span className="mk__float-body">
                <span className="mk__float-title">Rendimento creditado</span>
                <span className="mk__float-meta">Tijolos Premium · hoje</span>
              </span>
              <span className="mk__float-figure mk__mono">+R$ 48,20</span>
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
