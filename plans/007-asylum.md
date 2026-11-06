# 007 — Landing do Asylum (`/asylum` + `/en/asylum`)

**Status:** DONE
**Fonte:** Open Pencil, `Portifolio.fig`, página `08 — Asylum / Lançamento`, frame `asylum-landing` (1440×10891).

## Escopo

1. Traduzir o frame `asylum-landing` para uma rota do site, seção por seção.
2. i18n só desta página: pt-BR em `/asylum`, inglês em `/en/asylum`. No inglês, sai todo
   texto que vende "em português" como diferencial.
3. Badge de versão ligado às releases do GitHub: a versão vem da última release e o badge
   aponta para ela.

Fora do escopo: i18n do resto do site, card do Asylum no "Lado B" (não existe na página
`01 — Home / Desktop` do design).

## Seções (ids do frame → componente)

| Frame | O que é | Notas |
|---|---|---|
| `nav` (0:582) | nav própria do produto, flutuante | lockup + 4 âncoras + GitHub + Baixar. Ganha um seletor PT/EN, que o design não tem |
| `section-hero` (0:144) | ícone, pill de versão, h1, lead, CTAs, janela `shot/devices` | grade de 128px a 7% + 3 nós + bloom `violet-700` |
| `section-proof` (0:188) | 3 números | o último é a versão (`v2.0`), derivada da mesma release |
| `section-devices` (0:205) | 3 cards de simulador + faixa de tools do agente | banda elevada |
| `section-tools` (0:241) | 4 cards com screenshot + 3 mini cards | o screenshot vaza do card (640 de 588) |
| `section-ui` (0:300) | 3 docks com fade + card de configurações | banda elevada |
| `section-agent` (0:343) | 4 features + janela + chips de provedor | bloom à direita |
| `section-efficiency` (0:406) | 4 cards de tokens, faixa, bloco de benchmarks com janela sobreposta | banda elevada |
| `section-profiles` (0:452) | copy + dock com 5 ícones + janela | |
| `section-opensource` (0:495) | card do repo + bloco de instalação | banda elevada |
| `section-cta` (0:555) | prompt, h2, CTAs, anéis de sinal, footer | reaproveita `.signal` do contato |

## Decisões

- **Rotas:** `app/asylum/page.tsx` e `app/en/asylum/page.tsx` são finas e chamam o mesmo
  `components/asylum/landing.tsx`. Prefixo `/en` deixa o caminho aberto para um i18n do
  site inteiro sem mudar URLs. `alternates.languages` liga as duas (hreflang).
- **`lang`:** o `<html lang="pt-BR">` vem do root layout. Em vez de reestruturar em route
  groups com dois root layouts, a landing inglesa marca `lang="en"` no próprio wrapper,
  que é o que leitores de tela e o Google respeitam.
- **Textos:** `content/asylum/{pt,en}.ts` satisfazem o mesmo tipo `AsylumCopy`, então faltar
  uma chave no inglês quebra o `typecheck`. Os itens que só fazem sentido em pt-BR
  (fato "pt-BR e inglês", "em pt-BR" no sync etc.) simplesmente não existem no `en.ts`.
- **Ids de âncora** neutros e iguais nos dois idiomas (`#simulators`, `#tools`…), para o
  hreflang apontar para a mesma estrutura.
- **Versão:** `getLatestRelease()` em `lib/asylum.ts` lê a API do GitHub com
  `revalidate: 3600`. A tag `asylum-v2.0.14` vira `v2.0.14` e o link vai para a página da
  release. Se a API falhar, cai na versão fixa e em `/releases`. Os downloads usam
  `/releases/latest/download/<asset>`, que o GitHub redireciona sempre para a última.
- **Cor do produto:** `#7C3AED` / `#2E1065` (botão primário e ícone) não estão nas
  variáveis do arquivo. Viram tokens escopados `--asylum-brand` / `--asylum-brand-deep` na
  raiz da landing, sem poluir `:root`.
- **Fontes:** o design usa Inter Tight também no corpo desta página, e Geist só no
  wordmark. Geist é carregada com `next/font` no módulo da landing, então só esta rota baixa.
- **Ícone:** `AsylumIcon` desenha o SVG exportado do frame `app-icon`, parametrizado pelo
  gradiente (os 5 ícones de perfil são o mesmo traço com cores diferentes).
- **Screenshots:** os PNGs originais saem de dentro do `Portifolio.fig` (é um zip;
  `images/<hash>`, o mesmo hash do image fill de cada `shot/*`) e viram WEBP sem perda
  em `public/asylum/`. Não use `export_image` para isso: ele reamostra o original e
  perde nitidez. Servidos com `next/image` em `unoptimized`: o original sem perda, sem
  srcset (ver correção 4).
- **Mobile:** em até 720px, os prints de janela inteira (hero, agente, perfis,
  configurações) são recortados em quadrado no ponto que importa (`<Shot focus>`),
  em vez de encolhidos. O benchmarks vira 4:3 na tabela, com o painel por cima.
- **OG:** a peça `linkedin-link-1200x627` virou `public/og/asylum.jpg`, só na versão pt,
  porque o texto dela está em português.

## Depois da entrega

- Revisão do design: a faixa de números perdeu "158 commits, de um dev só" e o bloco
  de instalação perdeu o passo do `xattr` (app não notarizado); ficaram dois passos.
  Os ids dos nós mudaram ao reabrir o arquivo: o frame agora é `0:289`, busque pelo nome.

- Card do Asylum no Lado B (`components/sections/lab.tsx`), com `AsylumThumb`.
- Revisão das imagens no mobile: originais do `.fig`, qualidade 90 e recorte (acima).

## Correções feitas durante a execução

1. **Número da versão na faixa:** o plano previa ligar o destaque `v2.0` à release, mas
   um número de 40px como link compete com o badge. Só o badge leva à release; o
   destaque mostra `major.minor` da mesma resposta da API.
2. **Fade das docks:** era para valer só nas docks mais altas que a janela, mas em
   colunas largas (shell de 1520px) o terminal também passa da altura. O fade vale para
   todas e saiu dos textos (`tall` era apresentação dentro do conteúdo).
3. **Especificidade:** `asylum.css` é importado antes das regras de `globals.css`, então
   `.asy-hero` perdia o `padding-block` para `.band` no mobile. Toda sobrescrita de classe
   global agora vai com dois seletores (`.band.asy-hero`, `.asy .asy-nav__github`).
4. **Prints borrados no ar:** o otimizador do `next/image` estragava as imagens de
   duas formas. Os `sizes` fixos (`384px` nas docks) assumiam a coluna de 1200px, mas o
   shell é fluido até 1520px: o navegador pedia arquivo menor que a área e ampliava. E a
   recodificação em WEBP com perda subamostra a cor, o que borra o texto colorido da
   sintaxe. Para estes prints de interface plana o original sem perda tem o mesmo peso
   da versão reduzida (50–135 KB), então `<Shot>` passou a usar `unoptimized` e os
   `sizes` saíram. Densidade no desktop largo: 2× ou mais em quase tudo; o hero (1.44×)
   e as configurações (1.74×) ficam abaixo de retina porque os originais do `.fig` têm
   1728px e 1280px.

## Verificação

- `bun run typecheck`
- `bun run build`
- `bun test lib/asylum.test.ts` (parse da tag da release)
- Navegador: `/asylum` e `/en/asylum` em ultrawide e 390, comparados com o export do frame.
  Sem scroll horizontal em 390. As alturas das seções ficaram a ±20px das do frame.
