const code = [
  ["kw", "export "],
  ["kw", "function "],
  ["fn", "northStar"],
  ["pun", "("],
  ["param", "theme"],
  ["pun", ") {"],
];

export function PolarDarkMockup() {
  return (
    <div
      className="mk mk--polar-dark"
      role="img"
      aria-label="Mockup ilustrativo do tema Polar Dark no VS Code, com painel de arquivos, código TypeScript e terminal integrados."
    >
      <div className="mk__stage" aria-hidden="true">
        <div className="mk-pol__window">
          <div className="mk-pol__titlebar">
            <span className="mk-pol__traffic">
              <i />
              <i />
              <i />
            </span>
            <span>polar-dark.tsx — polar-dark</span>
          </div>

          <div className="mk-pol__body">
            <aside className="mk-pol__activity">
              <span>⌘</span>
              <span>⌕</span>
              <span>⌘</span>
              <span>◫</span>
            </aside>

            <aside className="mk-pol__sidebar">
              <p>EXPLORER</p>
              <strong>POLAR DARK</strong>
              <span>⌄ src</span>
              <span className="mk-pol__file mk-pol__file--active">◇ polar-dark.tsx</span>
              <span>◇ palette.ts</span>
              <span>◇ theme.json</span>
              <span>⌄ assets</span>
            </aside>

            <div className="mk-pol__editor">
              <div className="mk-pol__tab">polar-dark.tsx <span>×</span></div>
              <div className="mk-pol__code">
                <span className="mk-pol__line"><i>1</i>{code.map(([kind, value], index) => <b className={`mk-pol__${kind}`} key={index}>{value}</b>)}</span>
                <span className="mk-pol__line"><i>2</i><b className="mk-pol__pun">  return </b><b className="mk-pol__violet">"#C084FC"</b><b className="mk-pol__pun">;</b></span>
                <span className="mk-pol__line"><i>3</i><b className="mk-pol__pun">{"}"}</b></span>
                <span className="mk-pol__line mk-pol__line--blank"><i>4</i></span>
                <span className="mk-pol__line"><i>5</i><b className="mk-pol__comment">// syntax with a violet north star</b></span>
                <span className="mk-pol__line"><i>6</i><b className="mk-pol__kw">const </b><b className="mk-pol__param">palette </b><b className="mk-pol__pun">= </b><b className="mk-pol__fn">northStar</b><b className="mk-pol__pun">(</b><b className="mk-pol__violet">"dark"</b><b className="mk-pol__pun">);</b></span>
              </div>

              <div className="mk-pol__terminal">
                <span className="mk-pol__terminal-title">TERMINAL</span>
                <p><b>➜</b> polar-dark <em>git status</em></p>
                <p><span>✓</span> working tree clean</p>
              </div>
            </div>
          </div>

          <div className="mk-pol__status"><span>main*</span><span>TypeScript React</span><span>Ln 6, Col 34</span></div>
        </div>
      </div>

      <span className="mk__badge" aria-hidden="true">Mockup ilustrativo</span>
    </div>
  );
}
