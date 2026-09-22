# Pesquisa tecnica SCRUM-1074 — PakiNavigationRail

<!-- sdd:section specs.research-template:start -->
## Arquivos e simbolos relevantes

### Especificacao e gates
- `docs/sdd/specs/SCRUM-1074/spec.md` — requisitos FR-001..FR-013, NFR-001..NFR-005, AC-001..AC-011, US-001..US-005.
- `docs/sdd/specs/SCRUM-1074/checklist.md` — aprovacao do refinement gate.
- `docs/sdd/specs/SCRUM-1074/issue.md` — snapshot da issue Jira.
- `docs/constitution.md` — regras de escrita PT-BR e validacao minima (`npm run test`, `npm run build`).
- `docs/sdd/templates/angular.md` — padrao standalone, OnPush, `inject()`, Signals, testes `*.spec.ts` na mesma pasta.

### Componente a preservar (nao pode mudar — AC-011 / CA11)
- `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.ts` — API publica: `input.required<readonly PakiSidenavItem[]>('items')`, `input(false)('expanded')`, `output<boolean>('toggle')`, `output<void>('opened')`, `output<void>('closed')`; interfaces `PakiSidenavItem` e `PakiSidenavState`.
- `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.html` — template com `RouterLink`/`RouterLinkActive`, `ariaCurrentWhenActive="page"`, grupos de um nivel.
- `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.scss` — larguras `--paki-sidenav-width: 48px` (recolhido) e `240px` (expandido); usa `prefers-reduced-motion`.
- `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.spec.ts` — 17 testes; devem permanecer verdes e inalterados.
- `projects/pakitec-angular-components/src/stories/sidenav.stories.ts` — stories independentes; nao serao tocadas.

Nota importante: PakiSidenav usa larguras 48px/240px. O PakiNavigationRail usa 64px/216px (NFR-005). Sao componentes distintos; nenhum valor do sidenav deve ser reaproveitado ou alterado.

### Barrels de exportacao (arquivos a tocar)
- `projects/pakitec-angular-components/src/lib/components/index.ts` — barrel; cada componente e exportado com `export * from './<pasta>/<arquivo>';` (linha 12 exporta o sidenav). Adicionar linha para o navigation-rail.
- `projects/pakitec-angular-components/src/public-api.ts` — reexporta `./lib/components/index`. Nao precisa de mudanca direta se o barrel de componentes for atualizado, mas confirmar no plano.

### Padroes de referencia para a implementacao
- `projects/pakitec-angular-components/src/lib/components/switch/paki-switch.ts` — uso de `model(false)` para two-way binding (padrao para `expanded`/`expandedChange`).
- `projects/pakitec-angular-components/src/lib/components/module-tabs/paki-module-tabs.ts` — componente com `RouterLink`/`RouterLinkActive` e `input.required`.
- `projects/pakitec-angular-components/src/lib/components/button/paki-button.ts` — padrao de estado por `effect()` e atributos aria via `host`.
- `projects/pakitec-angular-components/src/lib/components/button/paki-button.spec.ts` — padrao de teste com Host component e TestBed.

### Tema e estilo
- `projects/pakitec-angular-components/src/styles/pakitec-theme.scss` — tokens de cor e foco.

### Configuracao de build, teste e Storybook
- `angular.json` — build via `@angular/build:ng-packagr`; teste via `@angular/build:unit-test` (`tsconfig.spec.json`); Storybook via `@storybook/angular-vite`, `configDir` em `projects/pakitec-angular-components/.storybook`.
- `package.json` — scripts `test` (`ng test`), `build` (`ng build`), `build-storybook` (`ng run pakitec-angular-components:build-storybook`); Angular 22, `@angular/router` disponivel.
- `projects/pakitec-angular-components/.storybook/preview.ts` — toolbar global de tema claro/escuro via `document.documentElement.dataset.theme`; addon-a11y com `test: 'todo'`.
- `projects/pakitec-angular-components/.storybook/main.ts` — coleta stories em `../src/**/*.stories.@(...)`.

### Simbolos esperados do novo componente
- `PakiNavigationRail` — componente standalone, selector `paki-navigation-rail`.
- `PakiNavigationRailItem` — interface: `id: string`, `label: string`, `route?: string`, `icon?: string`, `disabled?: boolean`, `position?: 'main' | 'footer'`.
- `PakiNavigationRailBrand` — interface: `label: string`, `route?: string`.

## Arquitetura e padroes existentes

- Todos os componentes sao standalone com `ChangeDetectionStrategy.OnPush`. A biblioteca nao usa a arvore `core/shared/modules` do `angular.md`; segue o layout plano `lib/components/<nome>/`. Respeitar o padrao existente da biblioteca, nao a arvore de aplicacao.
- Cada componente vive em pasta propria com `<nome>.ts`, `<nome>.html`, `<nome>.scss` e `<nome>.spec.ts` na mesma pasta. Alguns usam o sufixo `.component` (date, select); a maioria usa apenas o prefixo `paki-`. Recomendo seguir o padrao majoritario: `paki-navigation-rail.ts/.html/.scss/.spec.ts`.
- Two-way binding: `PakiSwitch` usa `model(false)`. `model()` gera automaticamente o par `expanded` + `expandedChange`, atendendo FR-001 sem output manual.
- Router: `PakiSidenav` e `PakiModuleTabs` importam `RouterLink` e `RouterLinkActive` e usam `routerLinkActive="active"` com `ariaCurrentWhenActive="page"`. Esse e o padrao para rota ativa e `aria-current` (FR-003 / AC-002).
- Icones: nao ha biblioteca de icones. O campo `icon` e tratado como classe CSS opcional (`<span [class]="'... ' + icon" aria-hidden="true">`), com glifos definidos no proprio SCSS do componente (ex.: `.icon-dashboard::before { content: '...' }` no sidenav). Item sem `icon` simplesmente nao renderiza o span (FR-010 / AC-009).
- Atributos aria por binding: `[attr.aria-expanded]`, `[attr.aria-label]`, `[attr.aria-controls]` no template; `PakiButton` aplica aria via bloco `host`. Ambos os padroes servem.
- Estilo: SCSS por token CSS custom property (`var(--color-...)`). O host define largura por variavel local (`--paki-sidenav-width`) e alterna por classe de estado. Reproduzir esse padrao com `--paki-navigation-rail-width` alternando 64px/216px.
- Animacao e `prefers-reduced-motion`: o sidenav define `transition: width ...` e um bloco `@media (prefers-reduced-motion: reduce) { transition: none; }`. Reaproveitar esse padrao (NFR-003 / FR-002 / AC-001).
- Foco visivel: regra global `:focus-visible { outline: 3px solid color-mix(in srgb, var(--color-accent) 60%, transparent); outline-offset: 2px; }` em `pakitec-theme.scss` (linhas 124-127). Cobre links, botoes e o controle de expansao sem CSS extra (NFR-002 / AC-010), desde que os controles sejam elementos focaveis nativos (`<a>`, `<button>`).

## Testes e comandos atuais

- Runner: `ng test` usa o builder `@angular/build:unit-test`. Os specs usam Jasmine-style (`describe`/`it`/`expect`) com `TestBed`; matchers como `toHaveLength` indicam camada de compatibilidade Vitest/Jasmine. Escrever os novos testes no mesmo estilo dos specs existentes (`paki-sidenav.spec.ts`, `paki-button.spec.ts`).
- Padrao de teste de router: `provideRouter([...])`, `TestBed.inject(Router).navigateByUrl(...)`, depois `await fixture.whenStable()` e `fixture.detectChanges()` para validar `aria-current` (ver `paki-sidenav.spec.ts` linhas 53-69).
- Padrao de teste de output: `fixture.componentInstance.<output>.subscribe(...)` acumulando valores (ver `paki-sidenav.spec.ts` linhas 253-283). Serve para `expandedChange` e `itemSelected`.
- Padrao de teste de largura: ler `getComputedStyle(host).getPropertyValue('--paki-sidenav-width')` (linhas 310-321). Serve para validar 64px/216px.
- Comandos de validacao (NFR-004 / AC-011): `npm run test`, `npm run build`, `npm run build-storybook`.

### Estrategia de teste por criterio de aceite
- AC-001 (CA1, FR-001/FR-002): iniciar recolhido; observar `--paki-navigation-rail-width` = 64px; acionar expansao; observar 216px, `expandedChange=true` emitido, `aria-expanded="true"` no controle. Reduced-motion: assert de que a regra CSS existe (teste visual/QA cobre o comportamento renderizado).
- AC-002 (CA2, FR-003): item com `route`; observar `<a>` com `routerLink`, classe `active` e `aria-current="page"` apos navegacao; `itemSelected` emitido com o `id`.
- AC-003 (CA3, FR-004): item sem `route`; observar ausencia de navegacao (elemento `<button>` ou `<span>`, sem `<a>`); apenas `itemSelected` emitido com `id`.
- AC-004 (CA4, FR-005): item `disabled`; observar `aria-disabled="true"`, sem navegacao e sem emissao de `itemSelected` ao acionar.
- AC-005 (CA5, FR-006): item `position="footer"`; observar renderizacao em container separado, ancorado ao rodape, distinto dos itens `main`; ausencia de `position` tratada como `main`.
- AC-006 (CA6, FR-007): `brand` com `label` exibe o label; com `brand.route` o cabecalho navega (`<a>`); sem `route` nao e navegavel (`<span>`/`<div>`).
- AC-007 (CA7, FR-008): estado recolhido; observar apenas o icone visivel, `aria-label` com o label e `title` (tooltip) presente.
- AC-008 (CA8, FR-009): `items` vazio; observar renderizacao sem erro e cabecalho de marca presente se `brand` fornecido (espelha o teste do sidenav com lista vazia).
- AC-009 (CA9, FR-010): item sem `icon`; observar ausencia de span de icone e `label` preservado como nome acessivel.
- AC-010 (CA10, FR-011/NFR-001/NFR-002): tema claro e escuro; observar `aria-expanded`, `aria-current`, `aria-disabled` refletindo estado; foco visivel (auditoria de contraste e o QA visual, premissa R2).
- AC-011 (CA11, FR-012/NFR-004): `PakiNavigationRail` exportado em `components/index.ts` e `public-api.ts`; `PakiSidenav` inalterado (api, comportamento, testes verdes); `npm run test`, `npm run build`, `npm run build-storybook` sem erro.

### Como validar CA11 (preservacao)
- `git diff` limitado a arquivos novos + as duas linhas de barrel; nenhum arquivo de `sidenav/` alterado.
- Suite `paki-sidenav.spec.ts` continua verde sem edicao.
- Build da biblioteca e do Storybook concluem.

## Integracoes e dados

- Angular Router (`RouterLink`, `RouterLinkActive`) — ja dependencia (`@angular/router` em `package.json`). Necessario para itens e cabecalho com rota.
- Tokens de `pakitec-theme.scss` — cor de superficie (`--color-bg-surface`), borda (`--color-border-subtle`, `--color-border-default`), texto (`--color-text-primary`, `--color-text-secondary`, `--color-text-faint`), acento (`--color-accent`, `--color-accent-tint`), foco (`:focus-visible` global). Suporte a tema escuro via `:root[data-theme='dark']`.
- Storybook — toolbar global alterna tema; a story do rail nao precisa de configuracao extra de tema. Precisa de `provideRouter` via `applicationConfig` (ver `sidenav.stories.ts` e `SidenavActiveItemHost` para o padrao de item ativo).
- Imagens de marca `compactImageUrl`/`expandedImageUrl` ficam fora do contrato publico (premissa R4); aparecem apenas nas stories.

## Alternativas consideradas

- Two-way `expanded`: `model()` (escolhida, alinhada a `PakiSwitch`) vs. `input` + `output` manual como em `PakiSidenav`. `model()` reduz codigo e gera `expandedChange` automaticamente. Alternativa manual seria valida, mas o padrao `model()` ja existe na biblioteca.
- Emissao de `itemSelected`: `output<string>()` emitindo o `id` no handler de clique do item. Emitir para itens com e sem rota; suprimir para item `disabled` (FR-005). Nao usar `RouterLink` sozinho para detectar selecao, pois itens sem rota tambem emitem.
- Item com rota vs. sem rota vs. disabled: renderizar `<a routerLink>` quando ha `route` e nao `disabled`; `<button>` quando nao ha `route` (acionavel por teclado, emite `itemSelected`); elemento nao interativo com `aria-disabled="true"` quando `disabled`. Alternativa de sempre usar `<a>` foi descartada por semantica e acessibilidade.
- Rodape (`position="footer"`): particionar `items()` em dois grupos por `computed` (main e footer) e renderizar o grupo footer em container ancorado com `margin-top:auto`. Alternativa via projecao de conteudo (`ng-content`) foi descartada porque o contrato define itens por dados, nao por slots.
- Tooltip no estado recolhido: atributo nativo `title` (auxiliar) + `aria-label` como nome acessivel (premissa R1). Sem componente de tooltip proprio, coerente com a ausencia de tooltip na biblioteca.
- Transicao respeitando reduced-motion: bloco `@media (prefers-reduced-motion: reduce)` no SCSS do componente, identico ao padrao do sidenav.
- Sufixo de arquivo: `paki-navigation-rail.ts` (padrao majoritario) vs. `.component.ts` (date/select). Recomendo o padrao majoritario para coerencia com sidenav e module-tabs.

## Riscos tecnicos

- R-A — Regressao no PakiSidenav (AC-011). Mitigacao: nao tocar em nenhum arquivo de `sidenav/`; alterar apenas arquivos novos e as duas linhas de barrel; manter a suite `paki-sidenav.spec.ts` verde.
- R-B — Contraste WCAG 2.1 AA com os tokens atuais (premissa R2, NFR-001). Pontos de atencao no tema claro: `--color-text-secondary: #5b5e6b` sobre `--neutral-0` fica ~5.4:1 (ok para texto); `--color-text-faint: #8a8da0` sobre branco fica ~3.0:1 (abaixo de 4.5:1 para texto). O item ativo usa `--color-accent: #4f46e5` sobre `--color-accent-tint: #eef0ff` (~contraste bom). No tema escuro, `--color-text-secondary: #9498ab` sobre `--color-bg-surface: #15171f` fica adequado. Risco: usar `--color-text-faint` para labels ou icones pode falhar AA. Mitigacao: usar `--color-text-secondary`/`--color-text-primary` para texto do item; validar cada estado no QA visual; ajustes ficam no consumo dos tokens, sem alterar o contrato publico.
- R-C — Contraste do indicador de foco (NFR-002, minimo 3:1 para UI). O `:focus-visible` global usa 60% de opacidade do acento sobre superficie; verificar 3:1 nos dois temas no QA. Mitigacao: se falhar, reforcar o outline apenas no SCSS do componente.
- R-D — Semantica de item disabled. Um `<a>` com `aria-disabled` ainda e focavel e navegavel; para nao navegar, o item disabled deve ser `<button disabled>` ou elemento nao interativo com `aria-disabled="true"` e sem handler. Mitigacao: nao renderizar `routerLink` quando `disabled`; bloquear `itemSelected`.
- R-E — Teste de `prefers-reduced-motion` em unit test e limitado; o runner nao simula a media query com confianca. Mitigacao: cobrir a presenca da regra CSS por unit test simples e delegar o comportamento renderizado ao QA visual.
- R-F — Tooltip `title` nao e testavel por leitor de tela em unit test. Mitigacao: assert de que `title` e `aria-label` existem no estado recolhido; comportamento final validado no QA.
- R-G — Ambiguidade de sufixo de arquivo (`.component` vs. sem sufixo). Mitigacao: decisao registrada; usar `paki-navigation-rail.ts` sem `.component`.

## Lacunas

- Nome exato dos glifos de icone: a spec trata `icon` como identificador de icone opcional. Como nao ha biblioteca de icones, o plano deve decidir se o SCSS do componente define glifos proprios (como o sidenav) ou apenas aplica a classe recebida. Sem impacto no contrato publico.
- Valores de contraste acima sao estimativas; a auditoria oficial WCAG (>= 4.5:1 texto, >= 3:1 UI) ocorre no QA visual (SC-004), nos dois temas.
- Separacao visual entre `main` e `footer` (AC-005) nao define espessura ou cor de divisor; o plano escolhe usando tokens existentes (`--color-border-subtle`).

## Arquivos a criar (proposta para o plano)

- `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.ts`
- `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.html`
- `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.scss`
- `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.spec.ts`
- `projects/pakitec-angular-components/src/stories/navigation-rail.stories.ts`

## Arquivos a tocar

- `projects/pakitec-angular-components/src/lib/components/index.ts` — adicionar `export * from './navigation-rail/paki-navigation-rail';`.
- `projects/pakitec-angular-components/src/public-api.ts` — ja reexporta o barrel; confirmar que a exportacao propaga (nenhuma edicao esperada).

Somente conclusoes sustentadas por evidencia do repositorio acima.
<!-- sdd:section specs.research-template:end -->
