import { BlueprintGrid } from "../blueprint-grid";
import { Reveal } from "../reveal";

const nodes = [
  { left: "31%", top: "15%", dur: "2.4s" },
  { left: "62%", top: "8%", dur: "3.6s" },
  { left: "84%", top: "67%", dur: "3s" },
  { left: "13%", top: "89%", dur: "4s" },
];

const stats = [
  { value: "+6", label: "anos construindo produto" },
  { value: "+20 mil", label: "pessoas atingidas" },
  { value: "3", label: "plataformas · iOS, Android, Web" },
];

const profile = [
  ["local", "Foz do Iguaçu · BR"],
  ["fuso", "GMT−3"],
  ["stack", "TypeScript · React · IA · Node"],
  ["foco", "Mobile e Web"],
];

export function Hero() {
  return (
    <section className="band hero">
      <BlueprintGrid nodes={nodes} />
      <div className="bloom hero__bloom" aria-hidden="true" />

      <div className="shell band__inner hero__grid">
        <div className="hero__copy">
          <Reveal>
            <p className="pill">
              <span className="pill__dot" />
              Disponível para projetos
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="hero__title">Vinicios Engelage</h1>
            <p className="hero__tagline">
              Código que sustenta, interface que <em className="editorial">respira.</em>
            </p>
          </Reveal>

          <Reveal delay={160}>
            <p className="hero__lead">
              Desenvolvedor full stack com especialidade em aplicativos e design de interface.
              Construo produtos do schema do banco ao detalhe de animação. E cuido especialmente do
              detalhe.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="hero__actions">
              <a className="btn" href="#trabalho">
                Ver projetos
              </a>
              <a className="btn" href="/blog">
                Ler o blog
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <dl className="hero__stats">
              {stats.map((stat) => (
                <div key={stat.value + stat.label}>
                  <dt>{stat.value}</dt>
                  <dd>{stat.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={200} className="hero__aside">
          <div className="panel glass">
            <p className="label">Perfil técnico</p>
            <dl className="panel__rows">
              {profile.map(([key, value]) => (
                <div key={key} className="panel__row">
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
