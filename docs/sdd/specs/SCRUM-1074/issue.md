# Snapshot da issue SCRUM-1074

<!-- sdd:section specs.issue-template:start -->
- Jira: `SCRUM-1074`
- Projeto: `SCRUM`
- Status no momento do planejamento: `Em andamento`
- Capturado em: `2026-09-21T18:43:50-03:00`
- Hash normalizado: `f1fb3c6ec4c6`

## Resumo

Criar o componente reutilizavel PakiNavigationRail.

Ator: aplicacoes Angular que consomem a biblioteca pakitec-angular-components.
Problema: nao existe um componente de navegacao em rail (faixa vertical) com estados
recolhido/expandido; o PakiSidenav atual cobre outro caso e nao deve ser alterado.
Resultado: novo componente `<paki-navigation-rail>` reutilizavel, acessivel e tematico,
exportado pela API publica, sem impacto no PakiSidenav.

## Descricao

Novo componente standalone `<paki-navigation-rail>` que oferece navegacao lateral em
rail vertical recolhivel. Suporta estados recolhido (64px) e expandido (216px), com
transicao que respeita `prefers-reduced-motion`. Exibe icones e labels, destaca a rota
ativa, mostra cabecalho de marca por label e ancora um item fixo no rodape, separado dos
itens principais. Emite `expandedChange` e `itemSelected`. Usa tokens visuais de
`pakitec-theme.scss` e funciona em tema claro e escuro. Atende acessibilidade com foco
visivel, nomes acessiveis e atributos `aria-expanded`, `aria-current` e `aria-disabled`.
Nao persiste estado; a aplicacao consumidora decide sobre persistencia. Exporta em
`components/index.ts` e `public-api.ts`; cria stories e testes; preserva o PakiSidenav.

## Criterios e campos personalizados

### Campos personalizados

- Projeto (customfield_10078): `Componentes`.
- Regras de negocio (customfield_10079): itens `footer` ficam ancorados ao rodape e
  separados dos `main`; item `disabled` nao navega, nao emite `itemSelected` e recebe
  `aria-disabled`; item sem `route` nao navega e apenas emite `itemSelected`; a rota
  ativa recebe estilo visual ativo e `aria-current`; o estado expandido e controlado
  pelo consumidor via two-way `expanded`/`expandedChange` e inicia recolhido, sem
  persistencia interna; no recolhido os itens mostram so o icone com label acessivel via
  `aria-label` e tooltip; lista vazia renderiza sem erro e o cabecalho de marca aparece
  se fornecido; acessibilidade segue WCAG 2.1 AA em tema claro e escuro.
- Detalhes tecnicos (customfield_10081): biblioteca Angular standalone; componente OnPush
  com `input()`/`output()` e Signals; integra RouterLink e RouterLinkActive; largura
  recolhida 64px e expandida 216px; transicao respeita `prefers-reduced-motion`; usa
  tokens de `projects/pakitec-angular-components/src/styles/pakitec-theme.scss`; exporta
  em `components/index.ts` e `public-api.ts`; validacao com `npm run test`,
  `npm run build` e `npm run build-storybook`.

### Criterios de aceite (Dado/Quando/Entao)

- CA1 — Expandir/recolher: Dado o rail recolhido (64px, padrao inicial), quando o usuario
  aciona o controle de expandir, entao o rail passa a 216px, emite `expandedChange=true`,
  o controle expoe `aria-expanded=true` e a transicao respeita `prefers-reduced-motion`.
- CA2 — Item com rota: Dado um item com `route`, quando o usuario o seleciona, entao a
  rota e ativada via RouterLink, o item recebe estilo ativo e `aria-current="page"` e
  `itemSelected` e emitido com o id do item.
- CA3 — Item sem rota: Dado um item sem `route`, quando o usuario o seleciona, entao
  nenhuma navegacao ocorre e apenas `itemSelected` e emitido com o id.
- CA4 — Item desabilitado: Dado um item `disabled`, quando o usuario tenta seleciona-lo,
  entao nao navega, nao emite `itemSelected` e expoe `aria-disabled="true"`.
- CA5 — Item de rodape: Dado um item com `position="footer"`, entao e renderizado
  ancorado ao rodape, separado visualmente dos itens `position="main"`.
- CA6 — Cabecalho de marca: Dado um `brand` com `label`, entao o cabecalho de marca exibe
  o label; com `brand.route`, o cabecalho navega ao ser acionado.
- CA7 — Labels no recolhido: Dado o rail recolhido, quando um item e exibido, entao mostra
  apenas o icone e o label fica acessivel via `aria-label` e tooltip (title).
- CA8 — Lista vazia: Dado `items` vazio, entao o rail renderiza sem erros e o cabecalho de
  marca ainda aparece se `brand` for fornecido.
- CA9 — Item sem icone: Dado um item sem `icon`, entao o item e renderizado sem icone,
  mantendo o label como nome acessivel.
- CA10 — Tema e acessibilidade: Dado tema claro ou escuro (tokens de
  `pakitec-theme.scss`), entao o foco e visivel em links, botoes e no controle de
  expansao, o contraste atende WCAG 2.1 AA e `aria-expanded`, `aria-current` e
  `aria-disabled` refletem o estado.
- CA11 — Preservacao e exportacao: Dado o build da biblioteca, entao PakiNavigationRail e
  exportado em `components/index.ts` e `public-api.ts`, o PakiSidenav permanece inalterado
  (API, comportamento e testes) e `npm run test`, `npm run build` e `npm run
  build-storybook` concluem sem erros.

### API publica sugerida (contrato)

- `PakiNavigationRailItem { id: string; label: string; route?: string; icon?: string;
  disabled?: boolean; position?: 'main' | 'footer' }`
- `PakiNavigationRailBrand { label: string; route?: string }`
- Outputs: `expandedChange`, `itemSelected`. Two-way: `expanded`.

## Anexos relevantes

A issue nao possui anexos. `docs/sdd/specs/SCRUM-1074/assets/manifest.json` existe com
`items` vazio. Nao ha assets para consumir.

## Subtarefas existentes

- `SCRUM-1075` — [SDD][SPEC] Specification — Em andamento.
- `SCRUM-1076` — [SDD][RESEARCH] Technical Research — A fazer.
- `SCRUM-1077` — [SDD][PLAN] Technical Plan — A fazer.

Este arquivo e um snapshot para rastreabilidade. A issue Jira continua sendo a fonte da
demanda.
<!-- sdd:section specs.issue-template:end -->
