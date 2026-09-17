/**
 * Renderiza brand/linkedin-cover.html em PNG 1584×396 (medida do LinkedIn).
 *
 *   bun run brand:cover
 *
 * As fontes da marca não ficam versionadas — são baixadas do Google Fonts na
 * primeira execução e guardadas em brand/.fonts (ignorado pelo git).
 */
import { existsSync, mkdirSync } from "node:fs";
import { $ } from "bun";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const DIR = import.meta.dir;
const WIDTH = 1584;
const HEIGHT = 396;
/** Render mais alto e corte depois: ver o comentário no <style> do HTML. */
const RENDER_HEIGHT = 600;

const fonts: Record<string, string> = {
  "InterTight-Bold.ttf":
    "https://fonts.gstatic.com/s/intertight/v9/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mj6AiqXA.ttf",
  "InterTight-SemiBold.ttf":
    "https://fonts.gstatic.com/s/intertight/v9/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mj0QiqXA.ttf",
  "InstrumentSerif-Italic.ttf":
    "https://fonts.gstatic.com/s/instrumentserif/v5/jizHRFtNs2ka5fXjeivQ4LroWlx-6zATiw.ttf",
  "JetBrainsMono-Medium.ttf":
    "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8-qxjPQ.ttf",
};

if (!existsSync(CHROME)) {
  console.error("Google Chrome não encontrado — é ele que rasteriza o HTML.");
  process.exit(1);
}

mkdirSync(`${DIR}/.fonts`, { recursive: true });

for (const [name, url] of Object.entries(fonts)) {
  const path = `${DIR}/.fonts/${name}`;
  if (existsSync(path)) continue;
  console.log(`baixando ${name}…`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`falhou ao baixar ${name}: ${response.status}`);
  await Bun.write(path, await response.arrayBuffer());
}

const raw = `${DIR}/.render.png`;
const out = `${DIR}/linkedin-cover.png`;

await $`${CHROME} --headless --disable-gpu --hide-scrollbars --window-size=${WIDTH},${RENDER_HEIGHT} --screenshot=${raw} file://${DIR}/linkedin-cover.html`.quiet();
await $`sips -c ${HEIGHT} ${WIDTH} ${raw} --out ${out}`.quiet();
await $`rm ${raw}`.quiet();

console.log(`✓ ${out} — ${WIDTH}×${HEIGHT}`);
