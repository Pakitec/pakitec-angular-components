# Tarefas SCRUM-1074 — PakiNavigationRail

<!-- sdd:section specs.tasks-template:start -->
## Formato

`TASK-ID [P?] [US-ID] Descricao com path exato`

`[P]` marca execucao paralela potencialmente segura: arquivos diferentes e nenhuma
dependencia pendente. O build so honra `[P]` quando iniciado com `--parallel`; por padrao a
execucao e sequencial e `[P]` e apenas informativo.

## Fase 1 - Setup/Fundacao

Cria o esqueleto do componente compartilhado por todas as jornadas. Bloqueia US-001..US-005
porque os arquivos `.ts`/`.html`/`.scss` sao editados por todas as tarefas de
implementacao.

- [ ] `TASK-001 [US-001]` Criar o esqueleto standalone OnPush do componente com contrato
  publico: interfaces `PakiNavigationRailItem` e `PakiNavigationRailBrand`, `model(false)`
  para `expanded`, `input('items')`, `input('brand')`, `output<string>('itemSelected')`,
  `computed` de particao main/footer e host com selector `paki-navigation-rail`.
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: FR-001, FR-012, FR-013
  - Criterios: AC-011
  - Dependencias: nenhuma
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.ts`,
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.html`,
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.scss`
  - Objetivo: base compilavel para as jornadas seguintes.
  - Validacao: componente compila; `paki-navigation-rail.ts` expoe as duas interfaces e as
    entradas/saidas; `computed` separa `mainItems` de `footerItems`.
  - Subtarefa Jira: pendente
  - Estado: pending

**Checkpoint**: componente vazio renderiza sem erro e expoe o contrato publico.

## Fase 2 - US-001 - Navegar por rotas pelo rail (P1)

**Objetivo**: itens com rota, sem rota e disabled com destaque de ativo e emissao de
`itemSelected`.  
**Teste independente**: renderizar itens com e sem `route` e um `disabled`; acionar cada
tipo e observar navegacao, estilo ativo, `aria-current` e `itemSelected`.

### Testes

- [ ] `TASK-002 [US-001]` Criar testes de navegacao por item em
  `paki-navigation-rail.spec.ts`: item com rota (AC-002), sem rota (AC-003) e disabled
  (AC-004).
  - Tipo: test
  - Ownership: sdd-implementer
  - Requisitos: FR-003, FR-004, FR-005
  - Criterios: AC-002, AC-003, AC-004
  - Dependencias: TASK-001
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.spec.ts`
  - Objetivo: cobrir os tres modos de item por unit test.
  - Validacao: testes de AC-002/AC-003/AC-004 escritos e falhando antes da implementacao.
  - Subtarefa Jira: pendente
  - Estado: pending

### Implementacao

- [ ] `TASK-003 [US-001]` Implementar a semantica de item e `itemSelected` no template e no
  handler: `<a routerLink routerLinkActive="active" ariaCurrentWhenActive="page">` com
  rota; `<button>` sem rota; elemento nao interativo com `aria-disabled="true"` quando
  disabled; emissao de `itemSelected` com o `id` em rota/sem-rota e supressao em disabled.
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: FR-003, FR-004, FR-005
  - Criterios: AC-002, AC-003, AC-004
  - Dependencias: TASK-001, TASK-002
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.html`,
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.ts`,
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.scss`
  - Objetivo: navegacao correta e `itemSelected` conforme spec.
  - Validacao: testes de AC-002/AC-003/AC-004 verdes; item disabled sem `routerLink` e sem
    emissao.
  - Subtarefa Jira: pendente
  - Estado: pending

**Checkpoint**: US-001 funciona; item com rota navega e emite, sem rota so emite, disabled
inerte.

## Fase 3 - US-002 - Recolher e expandir o rail (P1)

**Objetivo**: two-way `expanded`, larguras 64/216px, `aria-expanded`, reduced-motion e item
recolhido so-icone.  
**Teste independente**: iniciar recolhido; acionar expansao; observar largura,
`expandedChange` e `aria-expanded`.

### Testes

- [ ] `TASK-004 [US-002]` Criar testes de expansao e estado recolhido em
  `paki-navigation-rail.spec.ts`: larguras 64/216px e `expandedChange`/`aria-expanded`
  (AC-001); icone-only com `aria-label` e `title` no recolhido (AC-007); presenca da regra
  de reduced-motion.
  - Tipo: test
  - Ownership: sdd-implementer
  - Requisitos: FR-001, FR-002, FR-008, NFR-003, NFR-005
  - Criterios: AC-001, AC-007
  - Dependencias: TASK-001
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.spec.ts`
  - Objetivo: cobrir estado recolhido/expandido por unit test.
  - Validacao: testes de AC-001/AC-007 escritos; leitura de
    `--paki-navigation-rail-width` = 64px/216px.
  - Subtarefa Jira: pendente
  - Estado: pending

### Implementacao

- [ ] `TASK-005 [US-002]` Implementar controle de expansao e estado recolhido: `<button>`
  com `[attr.aria-expanded]`; largura por `--paki-navigation-rail-width` alternando
  64px/216px; item recolhido mostra apenas icone com `[attr.aria-label]` e `[title]`;
  transicao de largura com `@media (prefers-reduced-motion: reduce)` suprimindo a animacao.
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: FR-001, FR-002, FR-008, NFR-003, NFR-005
  - Criterios: AC-001, AC-007
  - Dependencias: TASK-001, TASK-004
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.html`,
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.scss`,
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.ts`
  - Objetivo: recolher/expandir controlado com largura e aria corretos.
  - Validacao: testes de AC-001/AC-007 verdes; regra de reduced-motion presente no SCSS.
  - Subtarefa Jira: pendente
  - Estado: pending

**Checkpoint**: US-002 funciona; rail recolhe/expande, emite `expandedChange` e mostra
so-icone recolhido.

## Fase 4 - US-003 - Cabecalho de marca e item de rodape (P2)

**Objetivo**: cabecalho de marca navegavel/nao-navegavel e item ancorado ao rodape.  
**Teste independente**: renderizar `brand` (com e sem `route`) e um item
`position="footer"`; observar label, navegacao e ancoragem separada.

### Testes

- [ ] `TASK-006 [US-003]` Criar testes de marca e rodape em `paki-navigation-rail.spec.ts`:
  item footer ancorado e separado (AC-005); brand com label e navegacao por `brand.route`
  (AC-006).
  - Tipo: test
  - Ownership: sdd-implementer
  - Requisitos: FR-006, FR-007
  - Criterios: AC-005, AC-006
  - Dependencias: TASK-001
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.spec.ts`
  - Objetivo: cobrir marca e rodape por unit test.
  - Validacao: testes de AC-005/AC-006 escritos; footer em container distinto do main.
  - Subtarefa Jira: pendente
  - Estado: pending

### Implementacao

- [ ] `TASK-007 [US-003]` Implementar cabecalho de marca e grupo de rodape: `brand` com
  `route` em `<a routerLink>`, sem `route` em elemento nao interativo (premissa R3); grupo
  `footerItems` ancorado com `margin-top: auto` e divisor por `--color-border-subtle`;
  ausencia de `position` tratada como `main`.
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: FR-006, FR-007
  - Criterios: AC-005, AC-006
  - Dependencias: TASK-001, TASK-006
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.html`,
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.scss`,
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.ts`
  - Objetivo: marca e rodape renderizados e separados.
  - Validacao: testes de AC-005/AC-006 verdes; footer ancorado ao rodape.
  - Subtarefa Jira: pendente
  - Estado: pending

**Checkpoint**: US-003 funciona; cabecalho de marca aparece e o item de rodape fica
ancorado e separado.

## Fase 5 - US-004 - Dados incompletos ou vazios (P2)

**Objetivo**: robustez com `items` vazio e item sem `icon`.  
**Teste independente**: renderizar `items` vazio (com e sem `brand`) e item sem `icon`;
observar ausencia de erros e label como nome acessivel.

### Testes

- [ ] `TASK-008 [US-004]` Criar testes de robustez em `paki-navigation-rail.spec.ts`:
  `items` vazio com brand presente (AC-008); item sem `icon` com label como nome acessivel
  (AC-009).
  - Tipo: test
  - Ownership: sdd-implementer
  - Requisitos: FR-009, FR-010
  - Criterios: AC-008, AC-009
  - Dependencias: TASK-001
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.spec.ts`
  - Objetivo: cobrir estados de dados parciais por unit test.
  - Validacao: testes de AC-008/AC-009 escritos.
  - Subtarefa Jira: pendente
  - Estado: pending

### Implementacao

- [ ] `TASK-009 [US-004]` Implementar renderizacao robusta: com `items` vazio, renderizar
  sem erro e manter o cabecalho de marca se `brand` fornecido; item sem `icon` nao
  renderiza o span de icone e mantem o `label` como `aria-label`/texto.
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: FR-009, FR-010
  - Criterios: AC-008, AC-009
  - Dependencias: TASK-001, TASK-008
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.html`,
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.ts`
  - Objetivo: sem erro em estados parciais; label sempre acessivel.
  - Validacao: testes de AC-008/AC-009 verdes.
  - Subtarefa Jira: pendente
  - Estado: pending

**Checkpoint**: US-004 funciona; rail resiste a `items` vazio e item sem icone.

## Fase 6 - US-005 - Tema, acessibilidade e preservacao (P1)

**Objetivo**: aria coerente, foco visivel, contraste WCAG 2.1 AA nos dois temas, export e
PakiSidenav inalterado.  
**Teste independente**: alternar tema; verificar foco e contraste; rodar `npm run test`,
`npm run build`, `npm run build-storybook`; confirmar export e PakiSidenav intacto.

### Testes

- [ ] `TASK-010 [US-005]` Criar testes de acessibilidade e export em
  `paki-navigation-rail.spec.ts`: `aria-expanded`/`aria-current`/`aria-disabled`
  refletindo estado (AC-010); presenca da regra `:focus-visible`/outline no escopo do
  componente; verificar `PakiNavigationRail` importavel via barrel (AC-011).
  - Tipo: test
  - Ownership: sdd-implementer
  - Requisitos: FR-011, FR-012, NFR-001, NFR-002, NFR-004
  - Criterios: AC-010, AC-011
  - Dependencias: TASK-003, TASK-005, TASK-007, TASK-009
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.spec.ts`
  - Objetivo: cobrir atributos aria e disponibilidade da API por unit test.
  - Validacao: testes de AC-010 (atributos aria) e AC-011 (export) escritos.
  - Subtarefa Jira: pendente
  - Estado: pending

### Implementacao

- [ ] `TASK-011 [US-005]` Aplicar estilo tematico e foco no SCSS usando tokens de
  `pakitec-theme.scss`: texto/icone por `--color-text-secondary`/`--color-text-primary`
  (nunca `--color-text-faint`, risco R-B); item ativo por `--color-accent`/
  `--color-accent-tint`; controles como elementos focaveis nativos herdando o
  `:focus-visible` global; validar coerencia de `aria-expanded`/`aria-current`/
  `aria-disabled`.
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: FR-011, NFR-001, NFR-002
  - Criterios: AC-010
  - Dependencias: TASK-005, TASK-010
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.scss`,
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/paki-navigation-rail.html`
  - Objetivo: contraste e foco adequados nos dois temas.
  - Validacao: testes de AC-010 verdes; QA visual confirma contraste/foco (AC-010).
  - Subtarefa Jira: pendente
  - Estado: pending

- [ ] `TASK-012 [P] [US-005]` Adicionar o export do componente no barrel:
  `export * from './navigation-rail/paki-navigation-rail';` em `components/index.ts`;
  confirmar que `public-api.ts` (linha 5) ja propaga sem edicao.
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: FR-012, NFR-004
  - Criterios: AC-011
  - Dependencias: TASK-001
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/index.ts`
  - Objetivo: expor `PakiNavigationRail` pela API publica.
  - Validacao: `PakiNavigationRail` importavel; `public-api.ts` sem alteracao; PakiSidenav
    inalterado.
  - Subtarefa Jira: pendente
  - Estado: pending

- [ ] `TASK-013 [P] [US-005]` Criar as stories do componente com `provideRouter` via
  `applicationConfig`: variantes recolhido, expandido, com brand navegavel, com item de
  rodape e lista vazia; imagens de marca `compactImageUrl`/`expandedImageUrl` somente aqui
  (premissa R4).
  - Tipo: documentation
  - Ownership: sdd-implementer
  - Requisitos: FR-001, FR-003, FR-006, FR-007, NFR-004
  - Criterios: AC-001, AC-002, AC-005, AC-006, AC-007
  - Dependencias: TASK-003, TASK-005, TASK-007
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/stories/navigation-rail.stories.ts`
  - Objetivo: base de demonstracao e superficie para o QA visual.
  - Validacao: `npm run build-storybook` sem erro; variantes renderizam.
  - Subtarefa Jira: pendente
  - Estado: pending

**Checkpoint**: US-005 funciona; aria e foco corretos, componente exportado, stories
prontas para o QA visual.

## Evidencia visual (obrigatoria — a issue tem frontend)

Cada criterio `AC-*` visual precisa de uma evidencia oficial PNG validada por caminho
seguro e publicada sem Base64. O gate de QA bloqueia `QA_PASSED` sem a evidencia oficial
obrigatoria ou com o servidor de navegador incompativel. As capturas NAO sao geradas no
planejamento nem pela implementacao; sao produzidas e validadas no QA visual sobre as
stories.

- [ ] `TASK-014 [US-005]` Preparar e declarar a evidencia visual dos AC de frontend:
  registrar cada criterio em `visualEvidence.criteria` e no manifesto; produzir uma
  evidencia oficial PNG por criterio nos dois temas quando aplicavel.
  - Tipo: qa
  - Ownership: sdd-implementer
  - Requisitos: NFR-001, NFR-002, NFR-003
  - Criterios: AC-001, AC-002, AC-005, AC-006, AC-007, AC-010
  - Dependencias: TASK-013
  - Arquivos provaveis: `evidence/SCRUM-1074/manifest.json`
  - Objetivo: garantir evidencia oficial para os criterios que exigem observacao de UI.
  - Validacao: manifesto lista cada `criteriaId` com `kind = official`, `sha256`,
    `viewport`, `size`, `mimeType`, `containsSensitiveData`; PNG deterministico
    `SCRUM-1074-AC-00X-desktop.png` ate 10 MB; gate de QA satisfeito.
  - Subtarefa Jira: pendente
  - Estado: pending

Criterios visuais declarados (exigem observacao de UI): AC-001 (larguras 64/216px e
transicao), AC-002 (estilo ativo/aria-current), AC-005 (rodape separado), AC-006 (cabecalho
de marca), AC-007 (recolhido so-icone), AC-010 (foco visivel/contraste/tema claro-escuro).

## Fase final - Polish e validacao

- [ ] `TASK-015 [US-005]` Executar a validacao final e confirmar preservacao: rodar
  `npm run test`, `npm run build`, `npm run build-storybook`; confirmar `git diff` limitado
  a arquivos novos + a unica linha do barrel; confirmar `paki-sidenav.spec.ts` verde e
  nenhum arquivo de `sidenav/` alterado; confirmar ausencia de overengineering.
  - Tipo: qa
  - Ownership: sdd-implementer
  - Requisitos: FR-012, NFR-004
  - Criterios: AC-011
  - Dependencias: TASK-002..TASK-014
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/navigation-rail/`,
    `projects/pakitec-angular-components/src/lib/components/index.ts`
  - Objetivo: fechar a entrega sem regressao no PakiSidenav.
  - Validacao: os tres comandos concluem sem erro; PakiSidenav inalterado (API,
    comportamento, testes); evidencia oficial publicada e gate de QA satisfeito.
  - Subtarefa Jira: pendente
  - Estado: pending

## Contrato de cada tarefa

- Tipo: implementation | test | documentation | qa
- Ownership: sdd-implementer
- Requisitos: `FR-*`, `NFR-*`
- Criterios: `AC-*`
- Dependencias: listadas por tarefa
- Arquivos provaveis: paths exatos por tarefa
- Objetivo: por tarefa
- Validacao: por tarefa
- Subtarefa Jira: pendente
- Estado: pending

Cada tarefa e pequena o suficiente para execucao sem redesenhar o plano. Nenhuma tarefa
esconde decisao de produto.
<!-- sdd:section specs.tasks-template:end -->
