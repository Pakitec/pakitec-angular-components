# Plano tecnico SCRUM-1110 — PakiToast e API de erro no PakiInput e PakiSelect

<!-- sdd:section specs.plan-template:start -->
## Resumo

Entrega duas capacidades da biblioteca pakitec-angular-components:

1. **PakiToast**: servico `PakiToastService` (fila de toasts em Signal), container unico
   `PakiToastContainer` (regiao live, empilhamento, posicoes de canto) e item `PakiToast`
   (titulo, descricao, icone de tipo, botao de fechar, pausa de autodismiss). Quatro tipos:
   success, error, warning e info. Duracoes padrao: success 5 s; warning e info 7 s; error
   sem autodismiss. Limite de 3 toasts visiveis com descarte FIFO (first in/first out) e
   retencao de erros. Animacao por transicao CSS com `prefers-reduced-motion`.
2. **API de erro uniforme**: entradas `invalid: boolean` e `error: string` no PakiInput e no
   PakiSelect com a mesma semantica: o campo fica invalido quando `invalid()` ou `error()`
   nao vazio; a mensagem aparece somente com `error()` nao vazio. Ids estaveis por
   contador de instancia alimentam `aria-invalid` e `aria-describedby`.

A entrega adiciona os tokens `--color-info-bg` e `--color-info-text` nos dois temas e
exporta a API do toast pelo barrel publico. Nenhum comportamento atual do PakiInput ou do
PakiSelect muda para usos existentes (FR-016).

## Constitution Check

- Padroes por stack lidos: `docs/sdd/templates/angular.md` (standalone, OnPush,
  `inject()`, Signals, specs `*.spec.ts` na mesma pasta) e `docs/constitution.md` (escrita
  clara PT-BR, validacao minima `npm run test` e `npm run build`).
- Arquitetura existente preservada: segue o layout plano `lib/components/<nome>/` da
  biblioteca (nao a arvore `core/shared/modules` do template generico). O PakiInput ja e
  `ControlValueAccessor`; a API nova se soma sem quebrar usos atuais de `[error]`.
- Seguranca, testes e qualidade atendidos: dados sem sensibilidade; testes unitarios por
  AC com fake timers; validacao por `npm run test`, `npm run build`,
  `npm run build-storybook`; evidencia visual oficial dos 11 criterios declarados.
- Frontend com evidencia visual: a issue exige observacao de UI; os criterios visuais estao
  declarados neste plano para o orquestrador preencher `visualEvidence.criteria`.
- Desvios justificados abaixo: nenhum desvio. Ver Complexity Tracking (N/A).

## Contexto tecnico

- Runtime/stack: Angular 22, componentes standalone com `ChangeDetectionStrategy.OnPush`,
  Signals (`input`, `output`, `signal`, `computed`), `inject()`. Servico
  `providedIn: 'root'`.
- Dependencias: nenhuma dependencia nova. Usa `@angular/core` e `@angular/common`, ja
  presentes. `@angular/cdk` permanece disponivel mas nao entra nesta entrega.
- Dados/storage: sem persistencia. Toast vive apenas em memoria, do disparo a saida.
- Auth/permissoes: nao se aplica. Toast e erro inline exibem somente texto fornecido pelo
  consumidor.
- Plataformas: biblioteca Angular consumida por aplicacoes web; temas claro e escuro por
  tokens de `pakitec-theme.scss`.
- Restricoes: duracoes padrao fixas por tipo (FR-004); limite de 3 toasts com retencao de
  erros (FR-006, FR-007); container unico por aplicacao (FR-010); regiao live e atributos
  ARIA (NFR-003); `prefers-reduced-motion` (NFR-002); compatibilidade total com
  `ControlValueAccessor`, template-driven e Reactive Forms (FR-016).

## Arquitetura e abordagem

### Decisoes das lacunas do research

- **Formato de `PakiToastConfig`**: `duration?: number` em milissegundos. `undefined`
  herda o padrao do tipo; `0` desabilita o autodismiss (toast "sticky"). Alternativa
  rejeitada: flag `sticky: boolean`, pois duplica a semantica de `duration = 0`. Config
  aceita ainda `position?: PakiToastPosition` por toast (fallback para a posicao do
  container).
- **Enforcement de container unico (FR-010)**: o `PakiToastContainer` mantem um contador
  static de instancias. Em `ngOnInit`, quando `isDevMode()` e o contador passa de 1, o
  container emite `warn` no console e nao bloqueia a renderizacao. Alternativa rejeitada:
  `InjectionToken` de guarda, mais superficie sem ganho.
- **Nome e forma do container**: componente standalone `PakiToastContainer`, selector
  `paki-toast-container`, declarado uma vez na raiz da aplicacao consumidora. Segue o
  padrao de pasta propria + barrel.
- **Erro sem mensagem**: o slot da mensagem nao renderiza quando `error()` esta vazio;
  nenhum espacamento residual (`min-height` zero) aparece abaixo do campo. Borda vermelha e
  `aria-invalid="true"` dependem somente de `invalid() || error()` nao vazio.
- **Posicoes suportadas**: as 4 cantos — `top-right` (padrao), `top-left`, `bottom-right`,
  `bottom-left`. O container recebe `input<PakiToastPosition>('position')` com padrao
  `top-right` (FR-008).
- **Reanuncio de mensagem atualizada**: a mensagem de erro vive em elemento com id estavel
  associado por `aria-describedby`; a mutacao de texto no mesmo elemento provoca reanuncio
  pela tecnologia assistiva. O plano nao adiciona mecanismo extra; o QA visual/auditivo
  valida o edge case da spec.

### Modelo de dados do toast

`PakiToastData`: `id: number`, `type: PakiToastType` (`success | error | warning | info`),
`title: string`, `description: string`, `duration: number` (resolvida apos aplicar padrao
e override), `position?: PakiToastPosition`, `leaving: boolean` (fase de saida animada).
O servico guarda `remainingMs`/`startedAt` em mapa interno (fora do Signal publico) para o
autodismiss com pausa sem acumulo.

### Servico (regras de negocio, testavel sem renderizacao)

`PakiToastService` mantem `readonly toasts = signal<readonly PakiToastData[]>([])`.
Metodos: `success(title, description, config?)`, `error(...)`, `warning(...)`, `info(...)`,
`dismiss(id)` e `dismissAll()`. Ao inserir um toast com a janela cheia (3 visiveis), remove
primeiro o toast nao critico mais antigo; nunca remove `type === 'error'` (FR-006, FR-007).
Se todos os visiveis forem erros, a fila cresce alem de 3: a retencao tem precedencia sobre
o limite, conforme premissa da spec. Toasts marcados `leaving` saem da janela ativa assim
que entram na fase de saida, sem aguardar o fim da transicao CSS (R-I).

### Container e item

`PakiToastContainer` le `service.toasts()`, aplica a classe de posicao no wrapper
`position: fixed` com `z-index` acima de 1000 e renderiza cada `PakiToast`. O wrapper
carrega `aria-live="polite"` e `aria-atomic="false"` (FR-009); itens do tipo error carregam
`role="alert"` no proprio item, reforcando o anuncio assertivo (precedente:
`list-feedback[role='alert']` em `pakitec-theme.scss`).

`PakiToast` renderiza icone de tipo, titulo, descricao e botao de fechar com `aria-label`.
Emite `closed` ao container. O container controla o timer por toast com
`performance.now()`, pausa em `(mouseenter)`/`(focusin)` e retoma em
`(mouseleave)`/`(focusout)` recriando `setTimeout(remainingMs)` (FR-005, AC-007). Saida
animada: o item passa por fase `leaving` antes da remocao; a duracao da fase iguala a da
transicao CSS. Todo movimento usa transicao CSS de `transform` e `opacity`, sem
`@angular/animations`, com `@media (prefers-reduced-motion: reduce)` suprimindo transicao e
animacao (NFR-002, AC-014).

### API de erro nos campos

Regra unica nos dois componentes: estado invalido = `invalid()` ou `error()` nao vazio.
`aria-invalid="true"` e borda vermelha seguem essa regra. A mensagem `<small class="error">`
renderiza somente com `error()` nao vazio, com id estavel unico por instancia
(`paki-input-error-<n>`, `paki-select-error-<n>`, contador static). `aria-describedby`
aponta para o id da mensagem quando ha erro; mantem tambem o id do hint no PakiInput quando
nao ha erro, preservando o comportamento atual (FR-014, AC-010). Nenhum estado depende
apenas de cor: a mensagem de texto acompanha o indicador visual e recebe um icone de
alerta opcional via CSS (FR-015, AC-011). A entrada `invalid` e nova; a entrada `error`
mantem nome e semantica atuais no PakiInput, preservando usos existentes (FR-016, R-A).

### Arquivos a alterar

- `projects/pakitec-angular-components/src/styles/pakitec-theme.scss`: adicionar
  `--color-info-bg` e `--color-info-text` nos blocos dos temas claro e escuro (NFR-001,
  AC-015, R-G). Valores iniciais: claro `#cffafe`/`#155e75`; escuro `#164e63`/`#a5f3fc`.
  O QA visual confirma o contraste.
- `projects/pakitec-angular-components/src/lib/components/input/paki-input.ts`: adicionar
  `invalid = input(false)` e contador static de instancia para o id da mensagem.
- `projects/pakitec-angular-components/src/lib/components/input/paki-input.html`: trocar
  `'support-' + label()` por id estavel; aplicar `aria-invalid` pela regra unica; renderizar
  a mensagem somente com `error()` nao vazio.
- `projects/pakitec-angular-components/src/lib/components/input/paki-input.scss`: borda
  invalida sem depender de mensagem; sem espacamento residual sem mensagem.
- `projects/pakitec-angular-components/src/lib/components/input/paki-input.spec.ts`:
  adicionar cobertura de erro (AC-008, AC-010, AC-011).
- `projects/pakitec-angular-components/src/lib/components/select/paki-select.component.ts`:
  adicionar `invalid = input(false)`, `error = input('')` e contador static de instancia.
- `projects/pakitec-angular-components/src/lib/components/select/paki-select.component.html`:
  aplicar `aria-invalid`/`aria-describedby` no `input[role="combobox"]` e o bloco de
  mensagem abaixo do controle.
- `projects/pakitec-angular-components/src/lib/components/select/paki-select.component.scss`:
  regra de borda invalida por `[aria-invalid='true']` com os tokens de feedback.
- `projects/pakitec-angular-components/src/lib/components/select/paki-select.component.spec.ts`:
  adicionar cobertura de erro (AC-009, AC-010, AC-011).
- `projects/pakitec-angular-components/src/lib/components/index.ts`: adicionar exports do
  toast (componente, container, servico e modelos) (FR-011, AC-016).
- `projects/pakitec-angular-components/src/stories/input.stories.ts`: adicionar story do
  estado invalido.
- `projects/pakitec-angular-components/src/stories/select.stories.ts`: adicionar story do
  estado invalido.

### Arquivos a criar

- `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.models.ts`:
  tipos `PakiToastType`, `PakiToastPosition`, interfaces `PakiToastConfig` e
  `PakiToastData`, mapa de duracoes padrao por tipo.
- `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.service.ts`:
  `PakiToastService` com fila em Signal, metodos por tipo, `dismiss`, FIFO e retencao de
  erros.
- `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.service.spec.ts`:
  testes do servico com `vi.useFakeTimers()` (AC-001, AC-003, AC-004, AC-005, AC-006).
- `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.ts` /
  `.html` / `.scss`: container standalone com posicao, regiao live, timers com pausa e
  warning de instancia duplicada em dev mode.
- `projects/pakitec-angular-components/src/lib/components/toast/paki-toast-container.spec.ts`:
  testes de renderizacao, fechamento e pausa (AC-002, AC-007, AC-009-parcial nao: ver
  tasks.md).
- `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.ts` / `.html` /
  `.scss`: item standalone com icone, titulo, descricao, botao de fechar, `role="alert"` em
  error e transicoes com reduced-motion.
- `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.spec.ts`: testes
  do item (conteudo, fechamento, papel ARIA por tipo).
- `projects/pakitec-angular-components/src/stories/toast.stories.ts`: stories dos 4 tipos,
  duracoes, empilhamento, posicoes e cenario combinado de falha de salvamento.

Confirmacao: `projects/pakitec-angular-components/src/public-api.ts` reexporta
`./lib/components/index`; nenhuma edicao esperada.

## Contratos e dados

- `PakiToastConfig`: `duration?: number` (ms; `undefined` herda o padrao do tipo; `0`
  desabilita autodismiss), `position?: PakiToastPosition` (por toast).
- Duracoes padrao: success 5000 ms; warning 7000 ms; info 7000 ms; error 0 (sem
  autodismiss).
- Entradas novas nos campos: `invalid: boolean` (padrao `false`). Entrada existente
  `error: string` mantida (PakiInput) e criada no PakiSelect com a mesma semantica.
- Sem persistencia interna. Sem dados sensiveis: tipos, ids, estilos e textos do
  consumidor.

### Evidencia visual (obrigatoria — a issue tem frontend)

Os criterios abaixo exigem observacao de UI renderizada e nao sao cobertos por unit test.
Cada um exige evidencia oficial PNG no QA. O orquestrador declara todos em
`visualEvidence.criteria` antes das capturas, inicialmente como
`{ "criteriaId": "AC-00X" }`, e completa hash e metadados apos a publicacao. Lista vazia
nunca dispensa o QA visual.

Criterios visuais declarados:

- `AC-001`: toast success com titulo e descricao e autodismiss apos 5 segundos.
- `AC-002`: fechamento manual pelo botao de fechar.
- `AC-004`: toast error persistente sem fechamento automatico.
- `AC-005`: empilhamento com no maximo 3 toasts e descarte FIFO.
- `AC-006`: retencao de erro no empilhamento.
- `AC-008`: PakiInput invalido com borda vermelha e mensagem abaixo do campo.
- `AC-009`: PakiSelect invalido com o mesmo comportamento visual do PakiInput.
- `AC-011`: estado invalido com marcadores alem da cor (mensagem de texto).
- `AC-012`: toast de erro global e erros inline simultaneos em falha de salvamento.
- `AC-014`: entrada e saida do toast sem animacao com `prefers-reduced-motion` ativo.
- `AC-015`: toast e campo invalido nos temas claro e escuro com tokens aplicados.

Cada criterio precisa de evidencia oficial PNG (`kind = official`, ate 10 MB, nome
deterministico `SCRUM-1110-AC-00X-desktop.png`). Manifesto em
`evidence/SCRUM-1110/manifest.json` com `criteriaId`, `kind`, `status`, `viewport`,
`file`, `mimeType`, `size`, `sha256` e `containsSensitiveData`. As capturas NAO sao
geradas no planejamento. Em `QA_PASSED` e `BUILD_COMPLETED`, enviar
`visualPreflight: { available, version, tools }` observado pelo cliente. `manifestPath`
padrao; sem nome alternativo.

## Seguranca e privacidade

- Toast e erro inline exibem somente texto fornecido pelo consumidor; nenhum dado sensivel
  transita pela biblioteca.
- Evidencia visual: ler os PNG por caminho seguro em `evidence/SCRUM-1110/`, conferir
  SHA-256, tamanho e MIME antes de publicar; bloquear evidencia marcada como sensivel.
  Nenhum retorno expoe Base64; rejeitar caminho com `..`, symlink externo ou arquivo
  irregular.

## Observabilidade

- Nao aplicavel: biblioteca de interface de usuario sem telemetria nem logging (NFR-008
  registrado como nao aplicavel no refinement). A verificacao ocorre por testes unitarios,
  QA visual e pelos comandos de build/test da biblioteca.

## Etapas de implementacao

1. Adicionar os tokens `--color-info-bg`/`--color-info-text` nos dois temas.
2. Criar os modelos do toast e o esqueleto compilavel de servico, container e item.
3. Implementar o servico: metodos por tipo, duracoes, dismiss, FIFO e retencao de erros.
4. Implementar container e item: renderizacao, fechamento, regiao live, timers com pausa,
   fase `leaving` e reduced-motion.
5. Implementar a API de erro no PakiInput e no PakiSelect (regra unica, ids estaveis).
6. Cobrir o cenario combinado de falha de salvamento (toast de erro + erros inline).
7. Adicionar exports no barrel e criar as stories (toast, estados invalidos, combinado).
8. Polish e validacao: `npm run test`, `npm run build`, `npm run build-storybook`;
   preparar as evidencias visuais dos criterios declarados.

Ordem sugerida das tarefas: tokens de tema; modelos; esqueleto; servico; container e item;
API de erro no PakiInput; API de erro no PakiSelect; cenario combinado; exports; stories;
evidencia visual; validacao final.

## Estrategia de testes

Testes unitarios com `TestBed`, Host components e `vi.useFakeTimers()` no estilo de
`paki-select.component.spec.ts`. Cobertura por criterio:

- AC-001/AC-003/AC-004 (FR-001..FR-004): servico com fake timers; cada tipo entra em
  `toasts()` com titulo e descricao; success sai apos 5 s; warning/info apos 7 s; error
  permanece; duracao customizada sobrescreve o padrao.
- AC-002 (FR-003): fixture do container; clique no botao de fechar remove o toast.
- AC-005/AC-006 (FR-006/FR-007): disparar 4 toasts; no maximo 3 visiveis; com erro visivel,
  o nao critico mais antigo sai primeiro e o erro permanece.
- AC-007 (FR-005): `mouseenter`/`focusin` pausa o timer; `mouseleave`/`focusout` retoma com
  o tempo restante.
- AC-008/AC-009 (FR-012/FR-013): hosts com `error` e `invalid`; borda por
  `[aria-invalid='true']` e mensagem abaixo do campo nos dois componentes.
- AC-010/AC-011 (FR-014/FR-015): `aria-invalid="true"`; `aria-describedby` aponta para o id
  real da mensagem; campo invalido sem mensagem mostra somente a borda.
- AC-012/AC-013 (FR-017): host com formulario + container + servico; falha simulada dispara
  toast de erro e aplica `error` nos campos; erro sem campo mostra somente o toast.
- AC-014 (NFR-002): assert da regra `prefers-reduced-motion` no SCSS do toast (padrao
  navigation-rail); comportamento renderizado no QA visual.
- AC-015 (NFR-001): presenca dos tokens `--color-info-bg`/`--color-info-text` nos dois
  temas; stories cobrem os dois temas via toolbar do preview; contraste no QA visual.
- AC-016 (FR-011): export no barrel; `npm run build` valida a superficie publica via
  ng-packagr.

Validacao global (NFR-004..NFR-006, SC-004): `npm run test`, `npm run build`,
`npm run build-storybook`.

## Rollout e rollback

- Rollout: adicao aditiva. O toast e novo e opcional; a entrada `invalid` tem padrao
  `false` e nao altera usos atuais. Consumidores adotam ao importar a API pelo barrel.
- Rollback: remover a pasta `toast/`, `toast.stories.ts` e as stories de estado invalido;
  reverter as alteracoes em `paki-input.*`, `paki-select.*`, `pakitec-theme.scss` e a linha
  do barrel. A troca do id `support-<label>` por id numerado e mudanca interna; o id nao
  faz parte da API publica. Suites existentes de input e select continuam verdes.

## Riscos e mitigacoes

- R-A — Regressao no PakiInput/PakiSelect (FR-016): manter nome e semantica da entrada
  `error`; adicionar `invalid` como canal novo; suites `paki-input.spec.ts` e
  `paki-select.component.spec.ts` verdes sem alteracao de comportamento antigo.
- R-B — Troca do id da mensagem no PakiInput: id nao e API publica; manter
  `aria-describedby` consistente com o id real; registrar como mudanca interna.
- R-C — Toast escondido sob `<dialog>` modal (top layer): documentar a limitacao; migracao
  para Popover API fica fora do escopo; nao bloqueante nesta spec.
- R-D — Atraso de `setTimeout` em aba inativa: `performance.now()` preserva o tempo
  restante real; aceitavel para o criterio.
- R-E — Anuncio por tecnologia assistiva: `role="alert"` em erros e `aria-live="polite"` no
  container; fallback com `LiveAnnouncer` do CDK registrado como alternativa se o QA falhar.
- R-F — `prefers-reduced-motion` nao simulavel em unit test: assert de CSS por regex;
  comportamento final no QA visual.
- R-G — Contraste dos novos tokens info nos dois temas: valores iniciais definidos neste
  plano; QA visual valida texto >= 4.5:1 e indicadores >= 3:1; ajuste de valor permitido
  sem mudar o contrato.
- R-H — Empilhamento com todos os visiveis do tipo error: a fila cresce alem de 3 ate
  fechamento manual; regra confirmada pela premissa da spec.
- R-I — Ordem entre remocao animada e FIFO: toast em fase `leaving` sai da janela ativa sem
  aguardar o fim da transicao; estado explicito `leaving` no modelo e teste dedicado.

## Complexity Tracking

| Desvio | Necessidade | Alternativa simples rejeitada |
| --- | --- | --- |
| N/A | N/A | N/A |

## Gate de execucao

`READY_TO_BUILD` quando:

- spec sem `NEEDS CLARIFICATION` e `checklist.md` aprovado (refinement gate
  `9711307e5dd2`).
- Este `plan.md` e `tasks.md` gravados, com paths reais e AC visuais declarados.
- Decisoes tecnicas fechadas: `duration: number` com `0` sticky; warning de container
  duplicado em dev mode; `PakiToastContainer` como componente; 4 posicoes de canto; ids por
  contador de instancia; erro sem mensagem sem slot residual; reanuncio por mutacao do
  texto.
- Todo FR-001..FR-017 e AC-001..AC-016 mapeados a ao menos uma tarefa em `tasks.md`.
- Nenhuma pergunta de produto pendente. Todas as lacunas do research resolvidas neste
  plano.
<!-- sdd:section specs.plan-template:end -->
