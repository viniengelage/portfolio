export type AsylumLocale = "pt" | "en";

/**
 * Título com uma palavra no serifado editorial.
 * `\n` em `before` vira quebra de linha, a mesma do frame no Open Pencil.
 */
export type AccentedText = {
  before: string;
  accent: string;
  after?: string;
};

export type SectionHeadCopy = {
  eyebrow: string;
  title: AccentedText;
  lead: string;
};

export type FeatureCopy = {
  label: string;
  title: string;
  body: string;
};

/** Cor de fundo do card, tirada da paleta do site. */
export type Tint = "violet" | "blue" | "teal" | "amber";

/**
 * Todos os textos da landing. pt e en satisfazem o mesmo tipo: esquecer uma
 * chave na tradução quebra o `typecheck`.
 *
 * Listas podem ter tamanhos diferentes entre os idiomas. É assim que o inglês
 * deixa de fora o que só faz sentido para quem lê em português.
 */
export type AsylumCopy = {
  meta: { title: string; description: string };
  skipLink: string;

  nav: {
    label: string;
    links: { simulators: string; tools: string; agent: string; openSource: string };
    github: string;
    download: string;
    /** Nome do outro idioma no seletor e o rótulo acessível dele. */
    switchTo: { short: string; label: string };
  };

  hero: {
    /** Vem depois da versão no badge: "v2.0.14 · gratuito e open source". */
    badge: string;
    /** Completa o nome acessível do badge, que leva para a release. */
    badgeLabel: string;
    title: AccentedText;
    lead: string;
    downloadMac: string;
    viewSource: string;
    platforms: string;
    shotAlt: string;
  };

  proof: {
    stats: { value: string; label: string }[];
    /** Rótulo do número da versão, o último da faixa. */
    versionLabel: string;
  };

  devices: {
    head: SectionHeadCopy;
    cards: { mark: string; tag: string; tone: "warn" | "ok"; title: string; body: string }[];
    toolsLabel: string;
  };

  tools: {
    head: SectionHeadCopy;
    cards: (FeatureCopy & { shot: string; alt: string; tint: Tint })[];
    minis: FeatureCopy[];
  };

  interface: {
    head: SectionHeadCopy;
    docks: (Omit<FeatureCopy, "title"> & { shot: string; alt: string })[];
    settings: FeatureCopy & { facts: string[]; alt: string };
  };

  agent: {
    head: SectionHeadCopy;
    features: FeatureCopy[];
    shotAlt: string;
    providersLabel: string;
    /** O primeiro aparece em destaque. */
    providers: string[];
  };

  efficiency: {
    head: SectionHeadCopy;
    featured: FeatureCopy & { value: string };
    cards: FeatureCopy[];
    strip: string[];
    bench: FeatureCopy & { facts: string[]; alt: string; panelAlt: string };
  };

  profiles: {
    eyebrow: string;
    title: AccentedText;
    lead: string;
    dockLabel: string;
    dockCaption: string;
    shotAlt: string;
  };

  openSource: {
    head: SectionHeadCopy;
    description: string;
    facts: { value: string; label: string }[];
    chips: string[];
    cta: string;
    install: {
      label: string;
      steps: [download: string, quarantine: string, open: string];
    };
  };

  cta: {
    prompt: string;
    title: AccentedText;
    lead: string;
    downloadMac: string;
    downloadWindows: string;
  };

  footer: {
    notice: string;
  };
};
