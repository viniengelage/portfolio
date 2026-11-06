/**
 * ASYLUM — editor para mobile e full-stack, fork independente do Zed.
 *
 * Fonte de verdade: github.com/viniengelage/asylum
 *
 * A versão não fica escrita na página: vem da última release publicada, para o
 * badge nunca mostrar um número que o GitHub já deixou para trás.
 */

const REPO = "https://github.com/viniengelage/asylum";

export const ASYLUM = {
  name: "Asylum",
  slug: "viniengelage/asylum",
  repo: REPO,
  releases: `${REPO}/releases`,
  license: "GPL-3.0",
  /**
   * `/releases/latest/download/<asset>` é redirecionado pelo GitHub para o asset
   * da última release. Os nomes são os que o workflow de release publica.
   */
  downloads: {
    macos: `${REPO}/releases/latest/download/Asylum-aarch64.dmg`,
    windows: `${REPO}/releases/latest/download/Asylum-x86_64.exe`,
  },
} as const;

export type AsylumRelease = {
  /** Sem o prefixo `v`, ex.: `2.0.14`. */
  version: string;
  /** Página da release no GitHub. */
  url: string;
};

/**
 * Usado quando a API do GitHub falha (rate limit, rede no build). A versão é a
 * última conferida à mão; o link vai para a lista, que nunca fica errada.
 */
const FALLBACK_RELEASE: AsylumRelease = { version: "2.0.14", url: ASYLUM.releases };

const LATEST_RELEASE_API = "https://api.github.com/repos/viniengelage/asylum/releases/latest";

/** Uma hora: a API sem token aceita 60 chamadas por hora, e release não sai de minuto em minuto. */
const REVALIDATE_SECONDS = 3600;

/** `asylum-v2.0.14` → `2.0.14`. Qualquer outro formato é recusado. */
export function parseReleaseTag(tag: string): string | null {
  const match = /^(?:asylum-)?v?(\d+\.\d+\.\d+)$/.exec(tag.trim());
  return match ? match[1] : null;
}

/** `2.0.14` → `2.0`, o número que o design usa nos destaques. */
export function minorVersion(version: string): string {
  return version.split(".").slice(0, 2).join(".");
}

export async function getLatestRelease(): Promise<AsylumRelease> {
  try {
    const response = await fetch(LATEST_RELEASE_API, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) throw new Error(`GitHub respondeu ${response.status}`);

    const data = (await response.json()) as { tag_name?: unknown; html_url?: unknown };
    const version = typeof data.tag_name === "string" ? parseReleaseTag(data.tag_name) : null;

    // O link vai para o href da página: só aceita URL de release deste repositório.
    const url = data.html_url;
    if (!version || typeof url !== "string" || !url.startsWith(`${ASYLUM.releases}/`)) {
      throw new Error("release sem tag ou URL reconhecível");
    }

    return { version, url };
  } catch (error) {
    console.warn(`[asylum] usando a release de fallback: ${(error as Error).message}`);
    return FALLBACK_RELEASE;
  }
}
