import type { AsylumCopy } from "./types";

/**
 * Tradução de `pt.ts`. O que no português vende o idioma ("em pt-BR", "a
 * interface inteira está em português", o fato "pt-BR e inglês") fica de fora:
 * para quem lê em inglês não é argumento.
 */
export const en: AsylumCopy = {
  meta: {
    title: "Asylum — an editor for mobile and full-stack",
    description:
      "An editor with the iOS Simulator, Android Emulator, a browser, API, database and Docker built in, plus an agent that can use all of them. Built on Zed, free and open source.",
  },
  skipLink: "Skip to content",

  nav: {
    label: "Asylum navigation",
    links: {
      simulators: "Simulators",
      tools: "Tools",
      agent: "Agent",
      openSource: "Open source",
    },
    github: "GitHub",
    download: "Download",
    switchTo: { short: "PT", label: "Ler esta página em português" },
  },

  hero: {
    badge: "free and open source",
    badgeLabel: "release notes on GitHub",
    title: {
      before: "Coding is madness.\nHere it gets ",
      accent: "padded walls.",
    },
    lead: "An editor for mobile and full-stack work with the iOS Simulator, Android Emulator, a browser, API, database and Docker inside it. And an agent that knows how to use all of it. Built on Zed, in Rust, with no account and no subscription.",
    downloadMac: "Download for macOS",
    viewSource: "View source on GitHub",
    platforms: "macOS Apple Silicon · Windows (preview) · GPL-3.0",
    shotAlt:
      "Asylum with an Expo app's code, the terminal running Metro and the iOS and Android simulators side by side in one window.",
  },

  proof: {
    stats: [
      { value: "16", label: "Rust crates of its own" },
      { value: "~95k", label: "new lines on top of Zed" },
    ],
    versionLabel: "released · updates itself",
  },

  devices: {
    head: {
      eyebrow: "Simulators",
      title: { before: "Your app running\n", accent: "next to", after: " the code." },
      lead: "I got tired of jumping between Xcode, Android Studio and the editor. Here the devices live in a tab, side by side, and the agent can drive them too.",
    },
    cards: [
      {
        mark: "iOS Simulator",
        tag: "macOS only",
        tone: "warn",
        title: "Built into the editor",
        body: "Runs through Apple's SimulatorKit inside an Asylum tab. Pick the runtime and the device, manage simulators and simulate location.",
      },
      {
        mark: "Android Emulator",
        tag: "macOS · Windows · Linux",
        tone: "ok",
        title: "No Android Studio needed",
        body: "Asylum downloads the JDK, SDK and system images and creates the AVDs for you. Several emulators running at once, in the same panel.",
      },
      {
        mark: "Web Preview",
        tag: "macOS only",
        tone: "warn",
        title: "Chromium in a tab",
        body: "A browser in a workspace tab, with DevTools. It also opens the project's PDFs without leaving the editor.",
      },
    ],
    toolsLabel: "The agent uses them too",
  },

  tools: {
    head: {
      eyebrow: "All in one window",
      title: { before: "The tools that used to live\nin other ", accent: "windows." },
      lead: "Database, API, containers, logs, PRs and tasks become editor docks, and every dock becomes a tool for the agent.",
    },
    cards: [
      {
        label: "Database · PostgreSQL",
        title: "SQL with autocomplete and transactional edits",
        body: "Connect over TLS or an SSH tunnel, browse the catalog tree, page through results. Edit cells and apply everything in one transaction. The agent reads through a read-only connection.",
        shot: "db-query",
        alt: "Asylum's SQL editor with autocomplete open and the results grid below.",
        tint: "violet",
      },
      {
        label: "API client · OpenAPI / Swagger",
        title: "The collection comes from your openapi.yml",
        body: "Tags become folders, operations become requests, servers become environments and securitySchemes becomes login. Send a request straight from the spec with a code lens.",
        shot: "api",
        alt: "Asylum's API client with a login request and its JSON response.",
        tint: "blue",
      },
      {
        label: "Docker · Compose",
        title: "Containers grouped by your compose file",
        body: "Terminal and logs in the middle of the editor, with each service's state marked in docker-compose.yml itself. The agent reads freely, asks before changing anything and never sees your environment variables.",
        shot: "docker",
        alt: "docker-compose.yml open in Asylum, with each service's state and a container's logs.",
        tint: "teal",
      },
      {
        label: "Pull requests · GitHub and Bitbucket",
        title: "Your branch's PR always on top",
        body: "Diffs, comments, checks and merge without opening the website. Open a PR while seeing the commits you still have to push, or mention the PR so the agent reviews it.",
        shot: "repo-pr",
        alt: "Asylum's pull request dock next to the code and the simulator.",
        tint: "amber",
      },
    ],
    minis: [
      {
        label: "Elasticsearch",
        title: "ES|QL logs and APM traces",
        body: "Live tail of your data streams. The agent queries read-only, with personal data masked.",
      },
      {
        label: "ClickUp",
        title: "Your branch's task, with a timer",
        body: "Your tasks in a dock. Ask the agent to comment, move a task or turn the conversation into a user story.",
      },
      {
        label: "Settings",
        title: "Sync through your GitHub",
        body: "Settings synced to private gists on your own account, with no Asylum server in between.",
      },
    ],
  },

  interface: {
    head: {
      eyebrow: "Interface",
      title: { before: "Redesigned\n", accent: "piece by piece." },
      lead: "The agent dock, the status bar and the settings were rebuilt from scratch, with 245 icons drawn for Asylum.",
    },
    docks: [
      {
        label: "Threads as cards",
        body: 'Terminal runs, subagents and edits become cards with state, timing and actions. Reads and searches fold into "Explored the project".',
        shot: "dock-thread",
        alt: "A conversation with the agent as cards: project exploration, an edit, a running terminal and a subagent.",
      },
      {
        label: "A terminal that explains itself",
        body: 'State spelled out, timing and exit code always visible. Success collapses on its own; a failure opens on the error, with "Run again".',
        shot: "dock-terminal",
        alt: "States of the agent's tools: finished, failed with the error open, and truncated output.",
      },
      {
        label: "Answers with data",
        body: 'Queries come back as tables and charts inside the conversation, with "View SQL", "Open in Database" and "Copy CSV".',
        shot: "dock-db",
        alt: "The agent answering with a table of overdue tasks queried from the database.",
      },
    ],
    settings: {
      label: "Settings",
      title: "Every value says where it came from",
      body: 'The window shows which scope you are editing (all profiles, one profile or the project), where each value comes from, and a "Only what changes" filter. It gained Integrations, Devices, Browser and Sync pages.',
      facts: [
        "docks become tabs, made for ultrawide screens",
        "the status bar on a single rule, profile in its color",
        "Polar Dark theme, IBM Plex Sans and Mono",
        "approvals show the reason and the scope",
      ],
      alt: "Asylum's settings window with the changed-values filter on for the Work profile.",
    },
  },

  agent: {
    head: {
      eyebrow: "Asylum Agent",
      title: { before: "An agent that uses ", accent: "all", after: " of it." },
      lead: "It plans, runs subagents, drives the simulators and queries the database. And it spends fewer tokens than before doing it.",
    },
    features: [
      {
        label: "Plan mode",
        title: "A plan before touching the code",
        body: "It proposes the steps and the files. You edit, approve with ⌘↵ and follow the progress in a card.",
      },
      {
        label: "Agents and pipelines",
        title: "Agents per task, chained together",
        body: "Create agents called with a /command, import Claude Code's subagents and chain everything into pipelines with approval.",
      },
      {
        label: "Learnings",
        title: "Memory you approve",
        body: "What it learns about the project becomes a note you approve, and it goes into every new conversation.",
      },
      {
        label: "Toolkits",
        title: "Every dock becomes a tool",
        body: "Database, API, Docker, PRs, simulators and the browser expose tools to the agent. You turn each toolkit on or off per profile, and every write asks for approval.",
      },
    ],
    shotAlt: "The agent's plan ready for approval, with the steps and the files it will change.",
    providersLabel: "Use any model you like",
    providers: [
      "Claude · subscription via OAuth",
      "OpenAI",
      "Gemini",
      "Ollama",
      "LM Studio",
      "OpenRouter",
      "Mistral",
      "DeepSeek",
      "xAI",
      "Bedrock",
      "Copilot",
      "Claude Code and Codex via ACP",
      "MCP",
    ],
  },

  efficiency: {
    head: {
      eyebrow: "Fewer tokens, right model",
      title: { before: "Spends ", accent: "less", after: " to do the same." },
      lead: "Before every call, Asylum cuts what doesn't help the agent. And each part of the work goes to the cheapest model that can handle it.",
    },
    featured: {
      label: "On-demand MCP",
      value: "~380k",
      title: "tokens per call, just for schemas",
      body: "That's what one of my profiles was spending, and half of it came from a single server with 524 tools. Now each server only joins when the agent asks and you approve.",
    },
    cards: [
      {
        label: "Terminal",
        title: "Only the output that matters",
        body: "Build progress, passing tests, git hints and repeated lines are dropped before they reach the model. Errors stay whole, with their start and end.",
      },
      {
        label: "JSON",
        title: "Large responses, trimmed",
        body: "Fetch, MCP and toolkits send the first and last items of each list and anything that looks like an error. You still see the full result.",
      },
      {
        label: "repo_map",
        title: "A map instead of reading",
        body: "One call shows the folders and each file's symbols with their line. Then the agent reads only the part it needs.",
      },
    ],
    strip: [
      "the thread shows how many tokens were saved",
      "approved learnings save rediscovering the project",
    ],
    bench: {
      label: "Subagents on Auto",
      title: "The right model and effort for each subtask",
      body: 'Before opening a subagent, the agent checks benchmarks.md: Terminal-Bench, FrontierCode, price and "good for / avoid for" for each model at each effort level. It picks the cheapest one that gets it done without rework, and the subagent card explains the choice.',
      facts: [
        "numbers published by the labs, with sources",
        "editable: project › user › Asylum default",
        "invalid lines flagged right in the editor",
      ],
      alt: "benchmarks.md open in Asylum, with the table of models and the effort level of each.",
      panelAlt: "The agent panel with Auto selected for subagents.",
    },
  },

  profiles: {
    eyebrow: "Profiles",
    title: { before: "Work and personal,\n", accent: "side by side." },
    lead: "Each profile is an isolated instance: its own data, git identity, AI providers, MCP servers, accounts and keychain. Work folders always open in the work profile.",
    dockLabel: "Profile icons in the macOS Dock",
    dockCaption: "On macOS, each profile gets an icon in its own color in the Dock and in ⌘-Tab.",
    shotAlt: "Asylum's profile picker with the Work and Personal profiles.",
  },

  openSource: {
    head: {
      eyebrow: "Open source",
      title: { before: "Open source, ", accent: "all of it." },
      lead: "No account, no subscription and no server of its own. Everything is on GitHub: read it, build it, open an issue or send a PR.",
    },
    description:
      "An independent fork of Zed, kept up to date with upstream (currently on Zed 1.27). What makes Zed fast is still there: a GPU-rendered interface, tree-sitter, LSP, multi-buffers and Vim mode.",
    facts: [
      { value: "Rust", label: "GPUI · tree-sitter · LSP" },
      { value: "macOS + Win", label: "Linux builds from source" },
    ],
    chips: ["no account", "no subscription", "no server of its own", "no remote telemetry"],
    cta: "View the repository",
    install: {
      label: "install · zsh",
      steps: ["1. download the latest version from", "2. open it and pick a profile"],
    },
  },

  cta: {
    prompt: "coding is madness",
    title: { before: "Stop switching ", accent: "windows." },
    lead: "Free and open source. I built it because I was tired of keeping ten windows open to look after a single app.",
    downloadMac: "Download for macOS",
    downloadWindows: "Windows (preview)",
  },

  footer: {
    notice: "Independent project, not affiliated with Zed Industries.",
  },
};
