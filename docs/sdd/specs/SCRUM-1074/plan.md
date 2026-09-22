# Plano tecnico SCRUM-1074 — PakiNavigationRail

<!-- sdd:section specs.plan-template:start -->
## Resumo

Cria o componente standalone `PakiNavigationRail`, uma faixa de navegacao vertical
recolhivel, acessivel (WCAG 2.1 AA) e tematica. O componente entrega estados recolhido
(64px) e expandido (216px) por two-way `expanded`/`expandedChange`, itens com rota
opcional, item desabilitado, posicao `main`/`footer`, cabecalho de marca e saida
`itemSelected`. A adicao nao altera o PakiSidenav (AC-011). Todo o codigo novo vive em
`projects/pakitec-angular-components/src/lib/components/navigation-rail/` e uma story em
`src/stories/navigation-rail.stories.ts`. O barrel de componentes ganha uma linha de
export.

## Constitution Check

- Padroes por stack lidos: `docs/sdd/templates/angular.md` (standalone, OnPush,
  `inject()`, Signals, specs `*.spec.ts` na mesma pasta) e `docs/constitution.md` (escrita
  clara PT-BR, validacao minima `npm run test` e `npm run build`).
- Arquitetura existente preservada: segue o layout plano `lib/components/<nome>/` da
  biblioteca (nao a arvore `core/shared/modules` do template generico). Usa `model()` como
  `PakiSwitch`, `RouterLink`/`RouterLinkActive` como `PakiSidenav`/`PakiModuleTabs`, tokens
  de `pakitec-theme.scss`. Nenhum arquivo de `sidenav/` e tocado.
- Seguranca, testes e qualidade atendidos: dados sem sensibilidade; testes unitarios por
  AC no estilo dos specs existentes; validacao por `npm run test`, `npm run build`,
  `npm run build-storybook`; QA visual para contraste, foco, reduced-motion e tooltip.
- Desvios justificados abaixo: nenhum desvio. Ver Complexity Tracking (N/A).

## Contexto tecnico

- Runtime/stack: Angular 22, componentes standalone com `ChangeDetectionStrategy.OnPush`,
  Signals (`model`, `input`, `output`, `computed`), `inject()`.
- Dependencias: `@angular/router` (RouterLink, RouterLinkActive) ja disponivel; Storybook
  `@storybook/angular-vite`; build `@angular/build:ng-packagr`; testes
  `@angular/build:unit-test` (Jasmine-style + TestBed).
- Dados/storage: sem persistencia. O componente nao guarda estado (FR-013); a decisao de
  persistir `expanded` e do consumidor.
- Auth/permissoes: nao se aplica. Dados sem sensibilidade.
- Plataformas: biblioteca Angular consumida por aplicacoes web; tema claro/escuro via
  tokens de `pakitec-theme.scss`.
- Restricoes: larguras fixas 64px/216px (NFR-005); WCAG 2.1 AA (NFR-001, NFR-002); respeito
  a `prefers-reduced-motion` (NFR-003); PakiSidenav inalterado (FR-012, AC-011).

## Arquitetura e abordagem

O componente renderiza o host com largura controlada por variavel CSS local
`--paki-navigation-rail-width`, alternada por classe de estado entre 64px e 216px. O
`expanded` usa `model(false)` (gera `expanded` + `expandedChange` automaticamente,
FR-001). O controle de expansao e um `<button>` nativo com `[attr.aria-expanded]`
refletindo o estado (FR-002). A transicao de largura respeita `prefers-reduced-motion` por
`@media` no SCSS (NFR-003).

Os itens vem por `input<readonly PakiNavigationRailItem[]>('items')`. Um `computed`
particiona `items()` em dois grupos: `mainItems` (`position` ausente ou `main`) e
`footerItems` (`position === 'footer'`). O grupo footer e renderizado em container ancorado
com `margin-top: auto` e separado por divisor com token `--color-border-subtle` (FR-006,
AC-005).

Cada item e renderizado por semantica:
- Com `route` e nao `disabled`: `<a routerLink [routerLink]="item.route"
  routerLinkActive="active" ariaCurrentWhenActive="page">` (FR-003, AC-002).
- Sem `route` e nao `disabled`: `<button>` acionavel por teclado, emite `itemSelected`
  (FR-004, AC-003).
- `disabled`: elemento nao interativo com `[attr.aria-disabled]="true"`, sem `routerLink` e
  sem handler; nao navega e nao emite `itemSelected` (FR-005, AC-004, risco R-D).

`itemSelected` usa `output<string>()` e emite o `id` no handler de clique de itens com e
sem rota; suprimido quando `disabled` (FR-003/FR-004/FR-005).

No estado recolhido cada item mostra apenas o icone; o `label` fica como `[attr.aria-label]`
(nome acessivel, premissa R1) e como `[title]` (tooltip auxiliar) (FR-008, AC-007). Icone:
o campo `icon` e aplicado como classe CSS opcional em um `<span [class]="item.icon"
aria-hidden="true">`; item sem `icon` nao renderiza o span (FR-010, AC-009). Decisao de
glifos (lacuna do research): o SCSS do componente nao define glifos proprios; ele apenas
aplica a classe recebida, deixando os glifos a cargo da aplicacao consumidora. Isso mantem
o contrato publico estavel e evita acoplar o rail a um conjunto fixo de icones.

O cabecalho de marca vem por `input<PakiNavigationRailBrand | undefined>('brand')`. Com
`brand.route` renderiza `<a routerLink>` navegavel; sem `route` renderiza elemento nao
interativo (`<span>`/`<div>`), por simetria com os itens (FR-007, AC-006, premissa R3). Com
`items` vazio o rail renderiza sem erro e mantem o cabecalho se `brand` existir (FR-009,
AC-008).

Foco visivel usa a regra global `:focus-visible` de `pakitec-theme.scss`; os controles sao
elementos focaveis nativos (`<a>`, `<button>`), sem CSS extra (NFR-002, AC-010). Contraste
de texto usa `--color-text-secondary`/`--color-text-primary` (nunca `--color-text-faint`,
risco R-B). Item ativo usa `--color-accent`/`--color-accent-tint`.

### Arquivos a alterar

- `projects/pakitec-angular-components/src/lib/components/index.ts`: adicionar
  `export * from './navigation-rail/paki-navigation-rail';` para expor a API publica
  (FR-012, AC-011).

### Arquivos a criar

- `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.ts`:
  componente standalone OnPush, selector `paki-navigation-rail`; interfaces
  `PakiNavigationRailItem` e `PakiNavigationRailBrand`; `model(false)` para `expanded`;
  `input('items')`, `input('brand')`; `output<string>('itemSelected')`; `computed` de
  particao main/footer; handler que suprime emissao em `disabled`.
- `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.html`:
  template com controle de expansao (`aria-expanded`), cabecalho de marca, grupo main,
  grupo footer ancorado; itens por `<a routerLink>`/`<button>`/elemento nao interativo
  conforme rota/disabled; icone por span opcional; `aria-label` e `title`.
- `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.scss`:
  largura por `--paki-navigation-rail-width` (64px/216px), tokens de tema, estilo ativo,
  divisor do rodape, `@media (prefers-reduced-motion: reduce)` para suprimir transicao.
- `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.spec.ts`:
  testes Jasmine/TestBed por AC (AC-001..AC-011), com Host component, `provideRouter` e
  leitura de `--paki-navigation-rail-width`.
- `projects/pakitec-angular-components/src/stories/navigation-rail.stories.ts`: stories com
  `provideRouter` via `applicationConfig`; variantes recolhido/expandido, com brand, com
  footer, lista vazia; imagens de marca `compactImageUrl`/`expandedImageUrl` apenas aqui
  (premissa R4).

Confirmacao: `projects/pakitec-angular-components/src/public-api.ts` (linha 5) reexporta
`./lib/components/index`; nenhuma edicao esperada. A exportacao propaga pelo barrel.

## Contratos e dados

- `PakiNavigationRailItem`: `id: string`, `label: string`, `route?: string`,
  `icon?: string`, `disabled?: boolean`, `position?: 'main' | 'footer'`.
- `PakiNavigationRailBrand`: `label: string`, `route?: string`.
- Entradas: `expanded` (model, boolean, padrao `false`), `items`
  (`readonly PakiNavigationRailItem[]`), `brand` (`PakiNavigationRailBrand | undefined`).
- Saidas: `expandedChange` (boolean, gerado por `model`), `itemSelected` (string, id do
  item).
- Sem persistencia interna (FR-013). Dados sem sensibilidade.

### Evidencia visual (obrigatoria — a issue tem frontend)

Os criterios abaixo exigem observacao de UI renderizada e nao sao totalmente cobertos por
unit test. Cada um exige uma evidencia oficial PNG publicada no QA. Declarar todos em
`visualEvidence.criteria` do workflow, inicialmente como `{ "criteriaId": "AC-00X" }`, e
completar hash e metadados apos a publicacao. Nunca usar lista vazia para dispensar o QA
visual.

Criterios visuais declarados:

- `AC-001`: larguras 64px (recolhido) e 216px (expandido) e transicao de largura.
- `AC-002`: estilo de item ativo e `aria-current="page"` na rota ativa.
- `AC-005`: item de rodape ancorado e separado visualmente dos itens `main`.
- `AC-006`: cabecalho de marca exibindo o label (e navegavel com `brand.route`).
- `AC-007`: estado recolhido mostrando apenas o icone (label via aria-label/tooltip).
- `AC-010`: foco visivel e contraste WCAG 2.1 AA em tema claro e escuro.

Cada criterio precisa de evidencia oficial PNG (`kind = official`, ate 10 MB, nome
deterministico `SCRUM-1074-AC-00X-desktop.png`). Manifesto em
`evidence/SCRUM-1074/manifest.json` com `criteriaId`, `kind`, `status`, `viewport`,
`file`, `mimeType`, `size`, `sha256` e `containsSensitiveData`. As capturas NAO sao
geradas no planejamento; aqui apenas se declara o requisito. Em `QA_PASSED` e
`BUILD_COMPLETED`, enviar `visualPreflight: { available, version, tools }` observado pelo
cliente. `manifestPath` padrao; sem nome alternativo.

## Seguranca e privacidade

- Dados do componente (labels, rotas, ids) nao tem sensibilidade; nenhum tratamento
  especial de PII.
- Evidencia visual: ler os PNG por caminho seguro em `evidence/SCRUM-1074/`, conferir
  SHA-256, tamanho e MIME antes de publicar; bloquear evidencia marcada como sensivel.
  Nenhum retorno expoe Base64; a publicacao retorna apenas metadados e um comentario com
  tabela.

## Observabilidade

- Nao ha telemetria nem logging no componente de UI. A verificacao ocorre por testes
  unitarios (comportamento e atributos aria), QA visual (contraste, foco, reduced-motion,
  tooltip) e pelos comandos de build/test da biblioteca.

## Etapas de implementacao

1. Criar o esqueleto do componente (`.ts`/`.html`/`.scss`) com contrato publico, `model`,
   `input`, `output` e particao main/footer.
2. Implementar a semantica de item (rota/sem rota/disabled), `itemSelected` e atributos
   aria.
3. Implementar cabecalho de marca, estado recolhido (icone-only, aria-label, title) e
   larguras 64px/216px com transicao e reduced-motion.
4. Escrever os testes por AC no `.spec.ts`.
5. Adicionar o export no barrel de componentes.
6. Criar as stories com `provideRouter` e variantes.
7. Polish e validacao: `npm run test`, `npm run build`, `npm run build-storybook`;
   confirmar PakiSidenav inalterado (git diff limitado a arquivos novos + 1 linha de
   barrel) e preparar as evidencias visuais dos AC declarados.

## Estrategia de testes

Testes unitarios Jasmine/TestBed no estilo de `paki-sidenav.spec.ts` e
`paki-button.spec.ts`, com Host component e `provideRouter`. Cobertura por AC:

- AC-001: iniciar recolhido; ler `--paki-navigation-rail-width` = 64px; acionar expansao;
  observar 216px, `expandedChange=true` e `aria-expanded="true"`. Reduced-motion: asserir a
  presenca da regra CSS (comportamento renderizado no QA visual, risco R-E).
- AC-002: item com `route`; observar `<a>` com `routerLink`, classe `active` e
  `aria-current="page"` apos navegacao; `itemSelected` emitido com o `id`.
- AC-003: item sem `route`; observar `<button>` (sem `<a>`) e apenas `itemSelected` com o
  `id`.
- AC-004: item `disabled`; observar `aria-disabled="true"`, sem navegacao e sem emissao de
  `itemSelected`.
- AC-005: item `position="footer"` em container separado, ancorado; ausencia de `position`
  tratada como `main`.
- AC-006: `brand` com `label` exibe o label; com `brand.route` navega (`<a>`); sem `route`
  nao navegavel.
- AC-007: estado recolhido; icone visivel, `aria-label` com o label e `title` presente
  (comportamento de tooltip no QA visual, risco R-F).
- AC-008: `items` vazio; sem erro e cabecalho presente se `brand` fornecido.
- AC-009: item sem `icon`; sem span de icone e `label` preservado como nome acessivel.
- AC-010: `aria-expanded`/`aria-current`/`aria-disabled` refletindo estado (contraste e
  foco no QA visual, premissa R2).
- AC-011: export em `components/index.ts`; PakiSidenav inalterado (suite verde); comandos
  de build/test sem erro.

Validacao global (NFR-004, AC-011): `npm run test`, `npm run build`,
`npm run build-storybook`.

## Rollout e rollback

- Rollout: adicao aditiva. O componente e novo e opcional; consumidores adotam ao importar
  `PakiNavigationRail`. Nenhuma migracao necessaria.
- Rollback: remover os arquivos novos de `navigation-rail/` e `navigation-rail.stories.ts`
  e reverter a unica linha de export no barrel. O PakiSidenav e o restante da biblioteca
  permanecem intactos.

## Riscos e mitigacoes

- R-A — Regressao no PakiSidenav (AC-011): nao tocar em `sidenav/`; alterar apenas arquivos
  novos e 1 linha de barrel; manter `paki-sidenav.spec.ts` verde e inalterado.
- R-B — Contraste com tokens atuais (NFR-001): usar `--color-text-secondary`/
  `--color-text-primary` para texto e icone, nunca `--color-text-faint`; auditar cada
  estado no QA visual.
- R-C — Contraste do indicador de foco (NFR-002, 3:1): validar o `:focus-visible` global
  nos dois temas no QA; se falhar, reforcar o outline apenas no SCSS do componente.
- R-D — Semantica de item disabled: nao renderizar `routerLink` quando `disabled`; usar
  elemento nao interativo com `aria-disabled="true"` sem handler; bloquear `itemSelected`.
- R-E — `prefers-reduced-motion` dificil em unit test: asserir presenca da regra CSS e
  delegar o comportamento renderizado ao QA visual.
- R-F — Tooltip `title` nao testavel por leitor de tela em unit test: asserir presenca de
  `title` e `aria-label` no estado recolhido; comportamento final no QA visual.
- R-G — Ambiguidade de sufixo de arquivo: decisao registrada — usar
  `paki-navigation-rail.ts` sem `.component`.
- Glifos de icone (lacuna do research): decisao registrada — o SCSS nao define glifos
  proprios; aplica somente a classe recebida em `icon`. Contrato publico inalterado.

## Complexity Tracking

| Desvio | Necessidade | Alternativa simples rejeitada |
| --- | --- | --- |
| N/A | N/A | N/A |

## Gate de execucao

`READY_TO_BUILD` quando:

- spec sem `NEEDS CLARIFICATION` e `checklist.md` aprovado (refinement gate
  `f1fb3c6ec4c6`).
- Este `plan.md` e `tasks.md` gravados, com paths reais e AC visuais declarados.
- Decisoes tecnicas fechadas: `model()` para `expanded`; semantica rota/sem-rota/disabled;
  particao main/footer por `computed`; glifos por classe recebida; sufixo sem `.component`.
- Nenhuma pergunta de produto pendente. Todas as lacunas do research resolvidas neste
  plano.
<!-- sdd:section specs.plan-template:end -->
