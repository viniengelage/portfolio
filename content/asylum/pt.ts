import type { AsylumCopy } from "./types";

/** Cópia literal do frame `asylum-landing` no Open Pencil. Ao mudar aqui, mude lá. */
export const pt: AsylumCopy = {
  meta: {
    title: "Asylum — editor para mobile e full-stack",
    description:
      "Editor com simulador iOS, emulador Android, navegador, API, banco e Docker dentro dele, e um agente que sabe usar tudo isso. Feito sobre o Zed, gratuito e open source.",
  },
  skipLink: "Pular para o conteúdo",

  nav: {
    label: "Navegação do Asylum",
    links: {
      simulators: "Simuladores",
      tools: "Ferramentas",
      agent: "Agente",
      openSource: "Open source",
    },
    github: "GitHub",
    download: "Baixar",
    switchTo: { short: "EN", label: "Read this page in English" },
  },

  hero: {
    badge: "gratuito e open source",
    badgeLabel: "notas da versão no GitHub",
    title: {
      before: "Programar é loucura.\nAqui ela tem paredes ",
      accent: "acolchoadas.",
    },
    lead: "Um editor para mobile e full-stack com simulador iOS, emulador Android, navegador, API, banco e Docker dentro dele. E um agente que sabe usar tudo isso. Feito sobre o Zed, em Rust, sem conta e sem assinatura.",
    downloadMac: "Baixar para macOS",
    viewSource: "Ver código no GitHub",
    platforms: "macOS Apple Silicon · Windows (preview) · GPL-3.0",
    shotAlt:
      "O Asylum com o código de um app Expo, o terminal rodando o Metro e os simuladores de iOS e Android lado a lado, na mesma janela.",
  },

  proof: {
    stats: [
      { value: "16", label: "crates próprias em Rust" },
      { value: "~95 mil", label: "linhas novas sobre o Zed" },
    ],
    versionLabel: "publicada · atualiza sozinha",
  },

  devices: {
    head: {
      eyebrow: "Simuladores",
      title: { before: "Seu app rodando\n", accent: "ao lado", after: " do código." },
      lead: "Cansei de pular entre Xcode, Android Studio e o editor. Aqui os aparelhos ficam numa aba, lado a lado, e o agente também mexe neles.",
    },
    cards: [
      {
        mark: "iOS Simulator",
        tag: "só macOS",
        tone: "warn",
        title: "Embutido no editor",
        body: "Roda pelo SimulatorKit da Apple, dentro de uma aba do Asylum. Escolha o runtime e o aparelho, gerencie simuladores e simule localização.",
      },
      {
        mark: "Android Emulator",
        tag: "macOS · Windows · Linux",
        tone: "ok",
        title: "Sem instalar o Android Studio",
        body: "O Asylum baixa JDK, SDK e imagens de sistema e cria os AVDs sozinho. Vários emuladores rodando ao mesmo tempo, no mesmo painel.",
      },
      {
        mark: "Web Preview",
        tag: "só macOS",
        tone: "warn",
        title: "Chromium numa aba",
        body: "Navegador numa aba do workspace, com DevTools. Também abre os PDFs do projeto sem sair do editor.",
      },
    ],
    toolsLabel: "O agente também usa",
  },

  tools: {
    head: {
      eyebrow: "Tudo numa janela",
      title: { before: "As ferramentas que viviam\nem outras ", accent: "janelas." },
      lead: "Banco, API, containers, logs, PRs e tarefas viram docks do editor, e cada dock vira ferramenta do agente.",
    },
    cards: [
      {
        label: "Banco de dados · PostgreSQL",
        title: "SQL com autocomplete e edição em transação",
        body: "Conexão por TLS ou túnel SSH, árvore do catálogo, grade paginada. Edite células e aplique tudo numa transação. O agente lê por uma conexão só-leitura.",
        shot: "db-query",
        alt: "Editor SQL do Asylum com autocomplete aberto e a grade de resultados embaixo.",
        tint: "violet",
      },
      {
        label: "Cliente de API · OpenAPI / Swagger",
        title: "A coleção nasce do seu openapi.yml",
        body: "Tags viram pastas, operações viram requests, servers viram ambientes e o securitySchemes vira login. Mande um request direto da spec, pelo code lens.",
        shot: "api",
        alt: "Cliente de API do Asylum com um request de login e a resposta em JSON.",
        tint: "blue",
      },
      {
        label: "Docker · Compose",
        title: "Containers agrupados pelo seu compose",
        body: "Terminal e logs no centro do editor, com o estado de cada serviço marcado no próprio docker-compose.yml. O agente lê à vontade, pede antes de mexer e nunca vê suas variáveis de ambiente.",
        shot: "docker",
        alt: "docker-compose.yml aberto no Asylum, com o estado dos serviços e os logs de um container.",
        tint: "teal",
      },
      {
        label: "Pull requests · GitHub e Bitbucket",
        title: "O PR da sua branch sempre no topo",
        body: "Diffs, comentários, checks e merge sem abrir o site. Dá para abrir um PR vendo os commits que faltam subir, ou mencionar o PR para o agente revisar.",
        shot: "repo-pr",
        alt: "Dock de pull requests do Asylum ao lado do código e do simulador.",
        tint: "amber",
      },
    ],
    minis: [
      {
        label: "Elasticsearch",
        title: "Logs em ES|QL e traces de APM",
        body: "Live tail dos data streams. O agente consulta só-leitura e com dados pessoais mascarados.",
      },
      {
        label: "ClickUp",
        title: "A tarefa da branch, com timer",
        body: "Suas tarefas numa dock. Peça ao agente para comentar, mover ou transformar a conversa numa user story.",
      },
      {
        label: "Configurações",
        title: "Sync pelo seu GitHub, em pt-BR",
        body: "Configurações sincronizadas em gists privados da sua conta, sem servidor do Asylum no meio. Interface em português ou inglês.",
      },
    ],
  },

  interface: {
    head: {
      eyebrow: "Interface",
      title: { before: "Redesenhado\n", accent: "peça por peça." },
      lead: "A dock do agente, a barra de status e as configurações foram refeitas do zero. São 245 ícones desenhados para o Asylum, e a interface inteira está em português.",
    },
    docks: [
      {
        label: "Thread em cards",
        body: 'Terminal, subagente e edição viram cards com estado, tempo e ações. Leituras e buscas se juntam em "Explorou o projeto".',
        shot: "dock-thread",
        alt: "Conversa com o agente em cards: exploração do projeto, edição, terminal rodando e um subagente.",
      },
      {
        label: "Terminal que se explica",
        body: 'Estado por extenso, tempo e exit code sempre à vista. Sucesso colapsa sozinho; falha abre no erro, com "Rodar de novo".',
        shot: "dock-terminal",
        alt: "Estados das ferramentas do agente: concluído, falhou com o erro aberto e saída cortada.",
      },
      {
        label: "Respostas com dados",
        body: 'Consultas voltam como tabela e gráfico dentro da conversa, com "Ver SQL", "Abrir no Banco" e "Copiar CSV".',
        shot: "dock-db",
        alt: "Resposta do agente com uma tabela das tarefas atrasadas, consultada no banco.",
      },
    ],
    settings: {
      label: "Configurações",
      title: "Cada valor diz de onde veio",
      body: 'A janela mostra qual escopo você está editando (todos os perfis, um perfil ou o projeto), de onde vem cada valor e um filtro "Só o que muda". Ganhou páginas de Integrações, Dispositivos, Navegador e Sync.',
      facts: [
        "docks viram abas, pensado para ultrawide",
        "barra de status numa régua só, perfil na sua cor",
        "tema Polar Dark, IBM Plex Sans e Mono",
        "aprovações com o motivo e o escopo à vista",
      ],
      alt: 'Janela de configurações do Asylum com o filtro "Só o que muda" ativo no perfil Trabalho.',
    },
  },

  agent: {
    head: {
      eyebrow: "Asylum Agent",
      title: { before: "Um agente que usa ", accent: "tudo", after: " isso." },
      lead: "Ele planeja, roda subagentes, mexe nos simuladores e consulta o banco. E gasta menos tokens que antes para fazer isso.",
    },
    features: [
      {
        label: "Plan mode",
        title: "Plano antes de tocar no código",
        body: "Ele propõe os passos e os arquivos. Você edita, aprova com ⌘↵ e acompanha o progresso num card.",
      },
      {
        label: "Agentes e esteiras",
        title: "Agentes por tarefa, em pipeline",
        body: "Crie agentes chamados por /comando, importe os subagentes do Claude Code e encadeie tudo em esteiras com aprovação.",
      },
      {
        label: "Aprendizados",
        title: "Memória que você aprova",
        body: "O que ele aprende sobre o projeto vira nota aprovada por você e entra em toda conversa nova.",
      },
      {
        label: "Toolkits",
        title: "Cada dock vira ferramenta",
        body: "Banco, API, Docker, PRs, simuladores e navegador expõem ferramentas ao agente. Você liga ou desliga cada toolkit por perfil, e toda escrita pede aprovação.",
      },
    ],
    shotAlt: "Plano do agente pronto para aprovação, com os passos e os arquivos que ele vai mexer.",
    providersLabel: "Use o modelo que quiser",
    providers: [
      "Claude · assinatura via OAuth",
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
      "Claude Code e Codex via ACP",
      "MCP",
    ],
  },

  efficiency: {
    head: {
      eyebrow: "Menos tokens, modelo certo",
      title: { before: "Gasta ", accent: "menos", after: " para fazer o mesmo." },
      lead: "Antes de cada chamada, o Asylum corta o que não ajuda o agente. E cada parte do trabalho vai para o modelo mais barato que dá conta.",
    },
    featured: {
      label: "MCP sob demanda",
      value: "~380 mil",
      title: "tokens por chamada, só de schema",
      body: "Era o que um dos meus perfis gastava, e metade vinha de um único servidor com 524 ferramentas. Agora cada servidor só entra quando o agente pede e você aprova.",
    },
    cards: [
      {
        label: "Terminal",
        title: "Só a saída que importa",
        body: "Progresso de build, testes que passaram, dicas do git e linhas repetidas saem antes de chegar ao modelo. Erros ficam inteiros, com o começo e o fim.",
      },
      {
        label: "JSON",
        title: "Respostas grandes, enxutas",
        body: "Fetch, MCP e toolkits mandam o primeiro e o último item das listas e tudo que parece erro. Você continua vendo o resultado completo.",
      },
      {
        label: "repo_map",
        title: "Mapa em vez de leitura",
        body: "Uma chamada mostra as pastas e os símbolos de cada arquivo, com a linha. Depois o agente lê só o trecho de que precisa.",
      },
    ],
    strip: [
      "a thread mostra quantos tokens foram economizados",
      "aprendizados aprovados poupam redescobrir o projeto",
    ],
    bench: {
      label: "Subagentes no Automático",
      title: "O modelo e o esforço certos para cada subtarefa",
      body: 'Antes de abrir um subagente, o agente consulta o benchmarks.md: Terminal-Bench, FrontierCode, preço e "bom para / evitar para" de cada modelo em cada nível de esforço. Fica com o mais barato que resolve sem retrabalho, e o card do subagente explica a escolha.',
      facts: [
        "números publicados pelos laboratórios, com fonte",
        "editável: projeto › usuário › padrão do Asylum",
        "linha inválida sinalizada direto no editor",
      ],
      alt: "Arquivo benchmarks.md aberto no Asylum, com a tabela de modelos e o nível de esforço de cada um.",
      panelAlt: "Painel do agente com a opção Automático escolhida para os subagentes.",
    },
  },

  profiles: {
    eyebrow: "Perfis",
    title: { before: "Trabalho e pessoal,\n", accent: "lado a lado." },
    lead: "Cada perfil é uma instância isolada: dados, identidade do git, provedores de IA, servidores MCP, contas e chaveiro próprios. Pastas do trabalho sempre abrem no perfil do trabalho.",
    dockLabel: "Ícones dos perfis no Dock do macOS",
    dockCaption: "No macOS, cada perfil ganha um ícone de cor própria no Dock e no ⌘-Tab.",
    shotAlt: "Seletor de perfis do Asylum com os perfis Trabalho e Pessoal.",
  },

  openSource: {
    head: {
      eyebrow: "Open source",
      title: { before: "Código aberto, ", accent: "inteiro." },
      lead: "Sem conta, sem assinatura e sem servidor próprio. Está tudo no GitHub: dá para ler, compilar, abrir issue ou mandar PR.",
    },
    description:
      "Fork independente do Zed, atualizado com o upstream (hoje está no Zed 1.27). O que deixa o Zed rápido continua lá: interface na GPU, tree-sitter, LSP, multi-buffers e Vim mode.",
    facts: [
      { value: "Rust", label: "GPUI · tree-sitter · LSP" },
      { value: "macOS + Win", label: "Linux compila do fonte" },
      { value: "pt-BR", label: "e inglês" },
    ],
    chips: ["sem conta", "sem assinatura", "sem servidor próprio", "sem telemetria remota"],
    cta: "Ver o repositório",
    install: {
      label: "instalar · zsh",
      steps: ["1. baixe a última versão em", "2. abra e escolha um perfil"],
    },
  },

  cta: {
    prompt: "dev é loucura",
    title: { before: "Pare de trocar de ", accent: "janela." },
    lead: "Gratuito, open source e em português. Fiz porque cansei de ter dez janelas abertas para cuidar de um app só.",
    downloadMac: "Baixar para macOS",
    downloadWindows: "Windows (preview)",
  },

  footer: {
    notice: "Projeto independente, sem afiliação com a Zed Industries.",
  },
};
