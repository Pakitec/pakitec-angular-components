# Tarefas SCRUM-1110 — PakiToast e API de erro no PakiInput e PakiSelect

<!-- sdd:section specs.tasks-template:start -->
## Formato

`TASK-ID [P?] [US-ID] Descricao com path exato`

`[P]` marca execucao paralela potencialmente segura: arquivos diferentes e nenhuma
dependencia pendente. O build so honra `[P]` quando iniciado com `--parallel`; por padrao a
execucao e sequencial e `[P]` e apenas informativo.

## Fase 1 - Setup/Fundacao

Adiciona os tokens de tema info e a base compilavel do toast (modelos, servico, container e
item). Bloqueia as jornadas porque o servico e os componentes sao compartilhados por
US-001, US-002, US-004 e US-005.

- [ ] `TASK-001 [P] [US-005]` Adicionar os tokens `--color-info-bg` e `--color-info-text`
  nos blocos dos temas claro e escuro de `pakitec-theme.scss`.
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: NFR-001
  - Criterios: AC-015
  - Dependencias: nenhuma
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/styles/pakitec-theme.scss`
  - Objetivo: suprir o par de tokens que o toast do tipo info precisa nos dois temas.
    Valores iniciais: claro `#cffafe`/`#155e75`; escuro `#164e63`/`#a5f3fc`.
  - Validacao: os dois blocos de tema definem o par; `npm run build` passa; contraste final
    confirmado no QA visual (AC-015).
  - Subtarefa Jira: pendente
  - Estado: pending

- [ ] `TASK-002 [P] [US-001]` Criar os modelos do toast em
  `lib/components/toast/paki-toast.models.ts`: tipos `PakiToastType`
  (`success | error | warning | info`) e `PakiToastPosition`
  (`top-right | top-left | bottom-right | bottom-left`), interfaces `PakiToastConfig`
  (`duration?: number`, `position?: PakiToastPosition`) e `PakiToastData`, e o mapa de
  duracoes padrao por tipo (success 5000, warning 7000, info 7000, error 0).
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: FR-001, FR-004, FR-008
  - Criterios: AC-003, AC-004
  - Dependencias: nenhuma
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.models.ts`
  - Objetivo: contrato de dados do toast usado por servico, container e item.
  - Validacao: arquivo compila; `duration = 0` documentado como "sem autodismiss"; mapa de
    duracoes exposto.
  - Subtarefa Jira: pendente
  - Estado: pending

- [ ] `TASK-003 [US-001]` Criar o esqueleto compilavel do toast: `PakiToastService`
  (`providedIn: 'root'`, fila vazia, metodos por tipo e `dismiss`/`dismissAll` como
  stubs), `PakiToastContainer` (standalone, selector `paki-toast-container`, `input` de
  `position` com padrao `top-right`) e `PakiToast` (standalone, selector `paki-toast`,
  `input` de dados, `output` `closed`).
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: FR-001, FR-008, FR-010
  - Criterios: nenhum direto (base)
  - Dependencias: TASK-002
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.service.ts`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.ts`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.html`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.scss`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.ts`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.html`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.scss`
  - Objetivo: base compilavel para os testes e a implementacao das jornadas.
  - Validacao: componentes e servico compilam; TestBed monta o container sem erro.
  - Subtarefa Jira: pendente
  - Estado: pending

**Checkpoint**: tokens info nos dois temas e base do toast compilando no TestBed.

## Fase 2 - US-001 - Feedback global via PakiToast (P1)

**Objetivo**: disparar toasts dos 4 tipos com titulo, descricao, fechamento manual e
autodismiss por duracao padrao ou configurada.  
**Teste independente**: disparar cada tipo a partir de um Host e validar conteudo,
fechamento manual e autodismiss com fake timers, sem depender do PakiInput nem do
PakiSelect.

### Testes

- [ ] `TASK-004 [US-001]` Criar os testes do servico em `paki-toast.service.spec.ts` com
  `vi.useFakeTimers()`: cada metodo insere o toast com titulo e descricao (AC-001); success
  sai apos 5 s; warning e info apos 7 s; duracao customizada sobrescreve o padrao (AC-003);
  error permanece sem autodismiss por padrao e com `duration: 0` (AC-004); `dismiss(id)`
  remove o toast.
  - Tipo: test
  - Ownership: sdd-implementer
  - Requisitos: FR-001, FR-002, FR-003, FR-004
  - Criterios: AC-001, AC-003, AC-004
  - Dependencias: TASK-003
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.service.spec.ts`
  - Objetivo: cobrir tipos, duracoes e dismiss por unit test.
  - Validacao: testes de AC-001/AC-003/AC-004 escritos e falhando antes da implementacao.
  - Subtarefa Jira: pendente
  - Estado: pending

- [ ] `TASK-005 [US-001]` Criar os testes de renderizacao e fechamento em
  `paki-toast.spec.ts` e `paki-toast-container.spec.ts`: item exibe titulo e descricao
  (AC-001); clique no botao de fechar remove o toast da fila (AC-002); botao de fechar tem
  nome acessivel.
  - Tipo: test
  - Ownership: sdd-implementer
  - Requisitos: FR-002, FR-003
  - Criterios: AC-001, AC-002
  - Dependencias: TASK-003
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.spec.ts`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.spec.ts`
  - Objetivo: cobrir conteudo e fechamento manual por unit test.
  - Validacao: testes de AC-001/AC-002 escritos e falhando antes da implementacao.
  - Subtarefa Jira: pendente
  - Estado: pending

### Implementacao

- [ ] `TASK-006 [US-001]` Implementar o `PakiToastService`: fila em `signal`, metodos
  `success/error/warning/info(title, description, config?)` que resolvem a duracao
  (padrao do tipo, override por `config.duration`, `duration: 0` sem autodismiss), `id`
  por contador interno, `dismiss(id)` e `dismissAll()`. Programar o autodismiss por toast
  com `setTimeout` e registro de `remainingMs`/`startedAt` em mapa interno.
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: FR-001, FR-002, FR-004
  - Criterios: AC-001, AC-003, AC-004
  - Dependencias: TASK-004
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.service.ts`
  - Objetivo: servico funcional com duracoes padrao e configuracao.
  - Validacao: testes de TASK-004 verdes.
  - Subtarefa Jira: pendente
  - Estado: pending

- [ ] `TASK-007 [US-001]` Implementar container e item: o container le `service.toasts()`
  e renderiza um `PakiToast` por entrada; o item exibe titulo, descricao, icone do tipo e
  botao de fechar com `aria-label`, emitindo `closed` que dispara `service.dismiss(id)`.
  Aparicao de cada tipo usa os tokens de feedback do tema (`--color-success-bg/-text`,
  `--color-warning-bg/-text`, `--color-error-bg/-text`, `--color-info-bg/-text`).
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: FR-001, FR-002, FR-003, NFR-001
  - Criterios: AC-001, AC-002
  - Dependencias: TASK-001, TASK-005, TASK-006
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.ts`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.html`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.scss`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.ts`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.html`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.scss`
  - Objetivo: toast visivel, legivel e fechavel pelo usuario final.
  - Validacao: testes de TASK-005 verdes; container posicionado no canto superior direito
    por padrao.
  - Subtarefa Jira: pendente
  - Estado: pending

**Checkpoint**: US-001 funciona; cada tipo de toast exibe conteudo, fecha manualmente e
respeita autodismiss padrao ou configurado.

## Fase 3 - US-002 - Multiplas notificacoes com empilhamento seguro (P2)

**Objetivo**: limite de 3 toasts visiveis com descarte FIFO, retencao de erros e pausa do
autodismiss em hover ou foco.  
**Teste independente**: disparar 4 ou mais toasts de tipos variados e validar limite,
ordem e retencao; pausar e retomar um toast por hover e foco.

### Testes

- [ ] `TASK-008 [US-002]` Criar os testes de empilhamento e pausa: com 3 toasts visiveis,
  o quarto remove o mais antigo (AC-005); com um erro visivel, o nao critico mais antigo
  sai primeiro e o erro permanece (AC-006); `mouseenter`/`focusin` pausa o timer e
  `mouseleave`/`focusout` retoma com o tempo restante (AC-007); toast em fase `leaving`
  libera a janela sem aguardar o fim da transicao (risco R-I).
  - Tipo: test
  - Ownership: sdd-implementer
  - Requisitos: FR-005, FR-006, FR-007
  - Criterios: AC-005, AC-006, AC-007
  - Dependencias: TASK-006
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.service.spec.ts`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.spec.ts`
  - Objetivo: cobrir FIFO, retencao de erro e pausa por unit test.
  - Validacao: testes de AC-005/AC-006/AC-007 escritos e falhando antes da implementacao.
  - Subtarefa Jira: pendente
  - Estado: pending

### Implementacao

- [ ] `TASK-009 [US-002]` Implementar o empilhamento no servico e a pausa no container:
  ao inserir com a janela cheia, remover o nao critico mais antigo e nunca remover
  `type === 'error'` (se todos forem erros, a fila cresce alem de 3); no container, pausar
  o timer do toast em `(mouseenter)`/`(focusin)` (congela `remainingMs`) e retomar em
  `(mouseleave)`/`(focusout)` recriando `setTimeout(remainingMs)`; marcar `leaving` antes
  de remover e liberar a janela na entrada da fase.
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: FR-005, FR-006, FR-007
  - Criterios: AC-005, AC-006, AC-007
  - Dependencias: TASK-007, TASK-008
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.service.ts`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.ts`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.html`
  - Objetivo: empilhamento seguro e pausa conforme spec.
  - Validacao: testes de TASK-008 verdes.
  - Subtarefa Jira: pendente
  - Estado: pending

**Checkpoint**: US-002 funciona; no maximo 3 toasts visiveis, erro nunca descartado e
autodismiss pausavel.

## Fase 4 - US-003 - Estado invalido acessivel no PakiInput e no PakiSelect (P1)

**Objetivo**: mesma API de erro nos dois campos: `invalid`, `error`, borda vermelha,
mensagem abaixo e associacao acessivel com ids estaveis.  
**Teste independente**: alternar um PakiInput e um PakiSelect entre valido e invalido e
validar borda, mensagem e atributos de acessibilidade, sem usar o PakiToast.

### Testes

- [ ] `TASK-010 [US-003]` Criar os testes de erro do PakiInput em `paki-input.spec.ts`:
  `error` nao vazio marca invalido, mostra borda e mensagem (AC-008); `invalid = true` sem
  `error` mostra somente a borda, sem slot residual; `aria-invalid="true"` e
  `aria-describedby` aponta para o id real da mensagem (AC-010); ids de duas instancias com
  o mesmo label sao distintos; mensagem de texto acompanha o estado (AC-011).
  - Tipo: test
  - Ownership: sdd-implementer
  - Requisitos: FR-012, FR-013, FR-014, FR-015, FR-016
  - Criterios: AC-008, AC-010, AC-011
  - Dependencias: nenhuma (arquivos existentes)
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/input/paki-input.spec.ts`
  - Objetivo: cobrir a API de erro do PakiInput por unit test.
  - Validacao: testes de AC-008/AC-010/AC-011 escritos; suite atual continua definindo o
    comportamento legado.
  - Subtarefa Jira: pendente
  - Estado: pending

- [ ] `TASK-011 [US-003]` Implementar a API de erro no PakiInput: adicionar
  `invalid = input(false)`; regra unica de invalido (`invalid()` ou `error()` nao vazio);
  contador static de instancia gerando `paki-input-error-<n>`; `aria-invalid` pela regra
  unica; `aria-describedby` apontando para a mensagem (e para o hint quando nao ha erro);
  bloco `<small class="error">` renderizado somente com `error()` nao vazio; SCSS sem
  espacamento residual sem mensagem.
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: FR-012, FR-013, FR-014, FR-015, FR-016
  - Criterios: AC-008, AC-010, AC-011
  - Dependencias: TASK-010
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/input/paki-input.ts`,
    `projects/pakitec-angular-components/src/lib/components/input/paki-input.html`,
    `projects/pakitec-angular-components/src/lib/components/input/paki-input.scss`
  - Objetivo: erro inline acessivel sem quebrar usos atuais de `[error]`.
  - Validacao: testes de TASK-010 verdes; suite pre-existente do PakiInput verde (FR-016).
  - Subtarefa Jira: pendente
  - Estado: pending

- [ ] `TASK-012 [US-003]` Criar os testes de erro do PakiSelect em
  `paki-select.component.spec.ts`: `error` nao vazio marca invalido, mostra borda e
  mensagem abaixo do controle (AC-009); `invalid = true` sem `error` mostra somente a
  borda; `aria-invalid` e `aria-describedby` no `input[role="combobox"]` (AC-010);
  mensagem de texto acompanha o estado (AC-011).
  - Tipo: test
  - Ownership: sdd-implementer
  - Requisitos: FR-012, FR-013, FR-014, FR-015, FR-016
  - Criterios: AC-009, AC-010, AC-011
  - Dependencias: nenhuma (arquivos existentes)
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/select/paki-select.component.spec.ts`
  - Objetivo: cobrir a API de erro do PakiSelect por unit test.
  - Validacao: testes de AC-009/AC-010/AC-011 escritos e falhando antes da implementacao.
  - Subtarefa Jira: pendente
  - Estado: pending

- [ ] `TASK-013 [US-003]` Implementar a API de erro no PakiSelect: adicionar
  `invalid = input(false)` e `error = input('')`; regra unica; contador static gerando
  `paki-select-error-<n>`; `aria-invalid` e `aria-describedby` no
  `input[role="combobox"]`; bloco `<small class="error">` abaixo do controle; regra SCSS
  `input[aria-invalid='true']` com borda em `--error-500`, espelhando o PakiInput.
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: FR-012, FR-013, FR-014, FR-015, FR-016
  - Criterios: AC-009, AC-010, AC-011
  - Dependencias: TASK-011, TASK-012
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/select/paki-select.component.ts`,
    `projects/pakitec-angular-components/src/lib/components/select/paki-select.component.html`,
    `projects/pakitec-angular-components/src/lib/components/select/paki-select.component.scss`
  - Objetivo: mesmo comportamento visual e acessivel do PakiInput no PakiSelect.
  - Validacao: testes de TASK-012 verdes; suite pre-existente do PakiSelect verde (FR-016).
  - Subtarefa Jira: pendente
  - Estado: pending

**Checkpoint**: US-003 funciona; os dois campos compartilham a mesma API de erro
acessivel, testada de forma independente.

## Fase 5 - US-004 - Feedback combinado em falha de salvamento (P1)

**Objetivo**: em erro de salvamento, toast de erro global e erros inline dos campos
informados aparecem ao mesmo tempo; erro sem campo mostra somente o toast.  
**Teste independente**: simular uma falha de salvamento com um formulario e validar a
presenca simultanea do toast de erro e dos erros inline.

### Testes

- [ ] `TASK-014 [US-004]` Criar o teste de integracao do cenario combinado: Host com
  formulario (PakiInput + PakiSelect), `PakiToastContainer` e `PakiToastService`; a falha
  simulada dispara `service.error(...)` e aplica `error` nos campos; asserts simultaneos de
  toast visivel e mensagens inline (AC-012); erro sem campo especifico mostra somente o
  toast (AC-013).
  - Tipo: test
  - Ownership: sdd-implementer
  - Requisitos: FR-017
  - Criterios: AC-012, AC-013
  - Dependencias: TASK-006, TASK-011, TASK-013
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.spec.ts`
  - Objetivo: provar que toast global e erros inline coexistem sem interferencia.
  - Validacao: testes de AC-012/AC-013 escritos e falhando antes da demonstracao; verdes ao
    final da fase, pois os mecanismos ja existem.
  - Subtarefa Jira: pendente
  - Estado: pending

### Implementacao

- [ ] `TASK-015 [US-004]` Criar a story de demonstracao do cenario combinado em
  `toast.stories.ts`: formulario com PakiInput e PakiSelect; botao de salvar simula falha e
  dispara ao mesmo tempo o toast de erro e os erros inline; variante de erro sem campo
  mostra somente o toast. A historia documenta o padrao de uso do consumidor (o mapeamento
  de erros do backend fica fora da biblioteca).
  - Tipo: documentation
  - Ownership: sdd-implementer
  - Requisitos: FR-017, NFR-006
  - Criterios: AC-012, AC-013
  - Dependencias: TASK-014
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/stories/toast.stories.ts`
  - Objetivo: superficie de demonstracao e de captura para a evidencia de AC-012.
  - Validacao: story renderiza os dois cenarios; testes de TASK-014 verdes;
    `npm run build-storybook` passa.
  - Subtarefa Jira: pendente
  - Estado: pending

**Checkpoint**: US-004 funciona; falha de salvamento mostra toast de erro e erros inline
ao mesmo tempo; erro sem campo mostra somente o toast.

## Fase 6 - US-005 - Temas, acessibilidade de movimento e publicacao da API (P2)

**Objetivo**: regiao live, posicoes de canto, reduced-motion, tokens nos dois temas e
exportacao publica do toast.  
**Teste independente**: alternar o tema, ativar prefers-reduced-motion e conferir a
importacao publica da API do toast.

### Testes

- [ ] `TASK-016 [US-005]` Criar os testes de acessibilidade, posicao e exportacao: wrapper
  do container com `aria-live="polite"` e itens de erro com `role="alert"` (FR-009,
  NFR-003); classe de posicao muda conforme o `input` (`top-right` padrao e as outras 3)
  (FR-008); presenca da regra `@media (prefers-reduced-motion: reduce)` no SCSS do toast
  (padrao navigation-rail) (NFR-002, AC-014); warning de instancia duplicada do container
  em dev mode (FR-010); `PakiToast`, `PakiToastService` e `PakiToastContainer` importaveis
  pelo barrel (FR-011, AC-016); tokens `--color-info-bg`/`--color-info-text` definidos nos
  dois temas (AC-015).
  - Tipo: test
  - Ownership: sdd-implementer
  - Requisitos: FR-008, FR-009, FR-010, FR-011, NFR-001, NFR-002, NFR-003
  - Criterios: AC-014, AC-015, AC-016
  - Dependencias: TASK-007
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.spec.ts`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.spec.ts`
  - Objetivo: cobrir acessibilidade, posicao e superficie publica por unit test.
  - Validacao: testes escritos; assert de reduced-motion por regex no CSS compilado.
  - Subtarefa Jira: pendente
  - Estado: pending

### Implementacao

- [ ] `TASK-017 [US-005]` Implementar regiao live, posicoes e reduced-motion: wrapper do
  container com `aria-live="polite"` e `aria-atomic="false"`; `role="alert"` no item do
  tipo error; classes de posicao para as 4 cantos com `position: fixed` e `z-index` acima
  de 1000; transicoes de entrada/saida por `transform` + `opacity` com fase `leaving`;
  `@media (prefers-reduced-motion: reduce)` suprimindo transicao e animacao; contador
  static de instancia com warning em `ngOnInit` quando `isDevMode()` e mais de 1
  container.
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: FR-008, FR-009, FR-010, NFR-002, NFR-003
  - Criterios: AC-014
  - Dependencias: TASK-009, TASK-016
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.ts`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.html`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.scss`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.html`,
    `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.scss`
  - Objetivo: toast acessivel, posicionavel e sem movimento com reduced-motion.
  - Validacao: testes de TASK-016 verdes; QA visual confirma AC-014 e AC-015.
  - Subtarefa Jira: pendente
  - Estado: pending

- [ ] `TASK-018 [US-005]` Adicionar os exports do toast no barrel
  `components/index.ts` (`export * from './toast/paki-toast';`, `paki-toast-container`,
  `paki-toast.service` e `paki-toast.models`); confirmar que `public-api.ts` reexporta sem
  edicao.
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: FR-011, NFR-005
  - Criterios: AC-016
  - Dependencias: TASK-003
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/index.ts`
  - Objetivo: expor componente, servico, container e modelos pela API publica.
  - Validacao: `npm run build` passa; simbolos importaveis sem import interno.
  - Subtarefa Jira: pendente
  - Estado: pending

- [ ] `TASK-019 [US-005]` Completar as stories: em `toast.stories.ts`, variantes dos 4
  tipos, duracao customizada, empilhamento de 4 toasts, cada posicao e reduced-motion; em
  `input.stories.ts` e `select.stories.ts`, stories do estado invalido com mensagem e do
  invalido sem mensagem. A toolbar de tema do preview cobre os dois temas (AC-015).
  - Tipo: documentation
  - Ownership: sdd-implementer
  - Requisitos: NFR-001, NFR-006
  - Criterios: AC-001, AC-004, AC-005, AC-006, AC-008, AC-009, AC-014, AC-015
  - Dependencias: TASK-007, TASK-013, TASK-017
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/stories/toast.stories.ts`,
    `projects/pakitec-angular-components/src/stories/input.stories.ts`,
    `projects/pakitec-angular-components/src/stories/select.stories.ts`
  - Objetivo: base de demonstracao e superficie para as capturas do QA visual.
  - Validacao: `npm run build-storybook` sem erro; variantes renderizam nos dois temas.
  - Subtarefa Jira: pendente
  - Estado: pending

**Checkpoint**: US-005 funciona; regiao live e posicoes corretas, reduced-motion
respeitado, API exportada pelo barrel e stories prontas para o QA visual.

## Evidencia visual (obrigatoria — a issue tem frontend)

Cada criterio `AC-*` visual precisa de uma evidencia oficial PNG validada por caminho
seguro e publicada sem Base64. O gate de QA bloqueia `QA_PASSED` sem a evidencia oficial
obrigatoria ou com o servidor de navegador incompativel. As capturas NAO sao geradas no
planejamento nem pela implementacao; sao produzidas e validadas no QA visual sobre as
stories.

- [ ] `TASK-020 [US-005]` Preparar e declarar a evidencia visual dos AC de frontend:
  registrar cada criterio em `visualEvidence.criteria` e no manifesto; produzir uma
  evidencia oficial PNG por criterio nos dois temas quando aplicavel.
  - Tipo: qa
  - Ownership: sdd-implementer
  - Requisitos: NFR-001, NFR-002, NFR-003
  - Criterios: AC-001, AC-002, AC-004, AC-005, AC-006, AC-008, AC-009, AC-011, AC-012,
    AC-014, AC-015
  - Dependencias: TASK-015, TASK-019
  - Arquivos provaveis: `evidence/SCRUM-1110/manifest.json`
  - Objetivo: garantir evidencia oficial para os criterios que exigem observacao de UI.
  - Validacao: manifesto lista cada `criteriaId` com `kind = official`, `sha256`,
    `viewport`, `size`, `mimeType`, `containsSensitiveData`; PNG deterministico
    `SCRUM-1110-AC-00X-desktop.png` ate 10 MB; gate de QA satisfeito.
  - Subtarefa Jira: pendente
  - Estado: pending

Criterios visuais declarados (exigem observacao de UI): AC-001 (toast success com
autodismiss), AC-002 (fechamento manual), AC-004 (toast error persistente), AC-005
(empilhamento FIFO com 3 visiveis), AC-006 (retencao de erro), AC-008 (PakiInput invalido),
AC-009 (PakiSelect invalido), AC-011 (marcadores alem da cor), AC-012 (feedback combinado),
AC-014 (reduced-motion), AC-015 (temas claro e escuro).

## Fase final - Polish e validacao

- [ ] `TASK-021 [US-005]` Executar a validacao final: rodar `npm run test`,
  `npm run build`, `npm run build-storybook`; confirmar `git diff` limitado aos arquivos
  previstos no plano; confirmar suites pre-existentes de input e select verdes sem
  alteracao de comportamento legado (FR-016); confirmar ausencia de overengineering.
  - Tipo: qa
  - Ownership: sdd-implementer
  - Requisitos: FR-016, NFR-004, NFR-005, NFR-006
  - Criterios: SC-004
  - Dependencias: TASK-001..TASK-020
  - Arquivos provaveis:
    `projects/pakitec-angular-components/src/lib/components/toast/`,
    `projects/pakitec-angular-components/src/lib/components/input/`,
    `projects/pakitec-angular-components/src/lib/components/select/`,
    `projects/pakitec-angular-components/src/lib/components/index.ts`,
    `projects/pakitec-angular-components/src/styles/pakitec-theme.scss`,
    `projects/pakitec-angular-components/src/stories/`
  - Objetivo: fechar a entrega sem regressao e com os tres comandos verdes.
  - Validacao: os tres comandos concluem sem erro; evidencia oficial publicada e gate de QA
    satisfeito.
  - Subtarefa Jira: pendente
  - Estado: pending

## Matriz de rastreabilidade

| Requisito | Tarefas |
| --- | --- |
| FR-001 | TASK-002, TASK-004, TASK-006, TASK-007 |
| FR-002 | TASK-004, TASK-005, TASK-007 |
| FR-003 | TASK-004, TASK-005, TASK-006, TASK-007 |
| FR-004 | TASK-002, TASK-004, TASK-006 |
| FR-005 | TASK-008, TASK-009 |
| FR-006 | TASK-008, TASK-009 |
| FR-007 | TASK-008, TASK-009 |
| FR-008 | TASK-002, TASK-016, TASK-017 |
| FR-009 | TASK-016, TASK-017 |
| FR-010 | TASK-003, TASK-016, TASK-017 |
| FR-011 | TASK-016, TASK-018 |
| FR-012 | TASK-010, TASK-011, TASK-012, TASK-013 |
| FR-013 | TASK-010, TASK-011, TASK-012, TASK-013 |
| FR-014 | TASK-010, TASK-011, TASK-012, TASK-013 |
| FR-015 | TASK-010, TASK-011, TASK-012, TASK-013 |
| FR-016 | TASK-010, TASK-011, TASK-012, TASK-013, TASK-021 |
| FR-017 | TASK-014, TASK-015 |
| NFR-001 | TASK-001, TASK-007, TASK-016, TASK-019, TASK-020 |
| NFR-002 | TASK-016, TASK-017, TASK-020 |
| NFR-003 | TASK-016, TASK-017, TASK-020 |
| NFR-004 | TASK-021 |
| NFR-005 | TASK-018, TASK-021 |
| NFR-006 | TASK-015, TASK-019, TASK-021 |
| NFR-007 | nao aplicavel (fora de escopo na spec) |
| NFR-008 | nao aplicavel (sem observabilidade em biblioteca de UI) |

| Criterio | Tarefas |
| --- | --- |
| AC-001 | TASK-004, TASK-005, TASK-006, TASK-007, TASK-019, TASK-020 |
| AC-002 | TASK-005, TASK-007, TASK-020 |
| AC-003 | TASK-002, TASK-004, TASK-006 |
| AC-004 | TASK-002, TASK-004, TASK-006, TASK-019, TASK-020 |
| AC-005 | TASK-008, TASK-009, TASK-019, TASK-020 |
| AC-006 | TASK-008, TASK-009, TASK-019, TASK-020 |
| AC-007 | TASK-008, TASK-009 |
| AC-008 | TASK-010, TASK-011, TASK-019, TASK-020 |
| AC-009 | TASK-012, TASK-013, TASK-019, TASK-020 |
| AC-010 | TASK-010, TASK-011, TASK-012, TASK-013 |
| AC-011 | TASK-010, TASK-011, TASK-012, TASK-013, TASK-020 |
| AC-012 | TASK-014, TASK-015, TASK-020 |
| AC-013 | TASK-014, TASK-015 |
| AC-014 | TASK-016, TASK-017, TASK-019, TASK-020 |
| AC-015 | TASK-001, TASK-016, TASK-019, TASK-020 |
| AC-016 | TASK-016, TASK-018 |

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
