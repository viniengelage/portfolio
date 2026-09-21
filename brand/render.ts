/**
 * Rasteriza as peças de marca (HTML → PNG) com o Chrome headless.
 *
 *   bun run brand:cover    capa do LinkedIn, 1584×396
 *   bun run brand:og       thumbnail do post React Bulletproof, 1200×630
 *
 * Cada peça é a tradução de um board do Penpot; o HTML ao lado documenta qual.
 * As fontes da marca não ficam versionadas — são baixadas do Google Fonts na
 * primeira execução e guardadas em brand/.fonts (ignorado pelo git).
 */
import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { $ } from "bun";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const DIR = import.meta.dir;
const ROOT = dirname(DIR);

/** URLs estáticas (.ttf) do Google Fonts — o Chrome headless não lê woff2 local. */
const FONTS: Record<string, string> = {
  "InterTight-SemiBold.ttf":
    "https://fonts.gstatic.com/s/intertight/v9/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mj0QiqXA.ttf",
  "InterTight-Bold.ttf":
    "https://fonts.gstatic.com/s/intertight/v9/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mj6AiqXA.ttf",
  "Inter-Regular.ttf":
    "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf",
  "InstrumentSerif-Italic.ttf":
    "https://fonts.gstatic.com/s/instrumentserif/v5/jizHRFtNs2ka5fXjeivQ4LroWlx-6zATiw.ttf",
  "JetBrainsMono-Regular.ttf":
    "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPQ.ttf",
  "JetBrainsMono-Medium.ttf":
    "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8-qxjPQ.ttf",
  "JetBrainsMono-Bold.ttf":
    "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8L6tjPQ.ttf",
};

type Target = {
  html: string;
  /** Caminho de saída, relativo à raiz do projeto. */
  out: string;
  width: number;
  height: number;
  /**
   * PNG guarda o gradiente do bloom sem compressão útil (~450KB). Para as peças
   * que vão para a web, JPEG a 86 fica visualmente idêntico em ~115KB.
   */
  quality?: number;
  /**
   * O viewport do headless não é confiável na altura exata pedida, então o
   * render sai mais alto e o `sips` corta pelo centro. Os HTMLs centram a peça
   * justamente para o corte central cair em cima dela.
   */
  renderHeight: number;
  fonts: string[];
};

const TARGETS: Record<string, Target> = {
  cover: {
    html: "linkedin-cover.html",
    out: "brand/linkedin-cover.png",
    width: 1584,
    height: 396,
    renderHeight: 600,
    fonts: [
      "InterTight-Bold.ttf",
      "InterTight-SemiBold.ttf",
      "InstrumentSerif-Italic.ttf",
      "JetBrainsMono-Medium.ttf",
    ],
  },
  og: {
    html: "og-react-bulletproof.html",
    out: "public/og/react-bulletproof-arquitetura.jpg",
    width: 1200,
    height: 630,
    renderHeight: 900,
    quality: 86,
    fonts: [
      "InterTight-SemiBold.ttf",
      "Inter-Regular.ttf",
      "InstrumentSerif-Italic.ttf",
      "JetBrainsMono-Regular.ttf",
      "JetBrainsMono-Medium.ttf",
      "JetBrainsMono-Bold.ttf",
    ],
  },
};

const name = process.argv[2] ?? "cover";
const target = TARGETS[name];

if (!target) {
  console.error(`alvo desconhecido: ${name} — use ${Object.keys(TARGETS).join(" | ")}`);
  process.exit(1);
}

if (!existsSync(CHROME)) {
  console.error("Google Chrome não encontrado — é ele que rasteriza o HTML.");
  process.exit(1);
}

mkdirSync(`${DIR}/.fonts`, { recursive: true });

for (const file of target.fonts) {
  const path = `${DIR}/.fonts/${file}`;
  if (existsSync(path)) continue;
  const url = FONTS[file];
  if (!url) throw new Error(`fonte sem URL registrada: ${file}`);
  console.log(`baixando ${file}…`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`falhou ao baixar ${file}: ${response.status}`);
  await Bun.write(path, await response.arrayBuffer());
}

const raw = `${DIR}/.render.png`;
const out = `${ROOT}/${target.out}`;
mkdirSync(dirname(out), { recursive: true });

await $`${CHROME} --headless --disable-gpu --hide-scrollbars --window-size=${target.width},${target.renderHeight} --screenshot=${raw} file://${DIR}/${target.html}`.quiet();

if (target.quality) {
  await $`sips -c ${target.height} ${target.width} -s format jpeg -s formatOptions ${target.quality} ${raw} --out ${out}`.quiet();
} else {
  await $`sips -c ${target.height} ${target.width} ${raw} --out ${out}`.quiet();
}

await $`rm ${raw}`.quiet();

console.log(`✓ ${target.out} — ${target.width}×${target.height}`);
