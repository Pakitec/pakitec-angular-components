# Pesquisa tecnica SCRUM-1110 — PakiToast e estados de erro no PakiInput e PakiSelect

<!-- sdd:section specs.research-template:start -->
## Arquivos e simbolos relevantes

### Especificacao e gates

- `docs/sdd/specs/SCRUM-1110/spec.md` — requisitos FR-001..FR-017, NFR-001..NFR-008, AC-001..AC-016, US-001..US-005.
- `docs/sdd/specs/SCRUM-1110/checklist.md` — refinement gate aprovado (hash `9711307e5dd2`).
- `docs/sdd/specs/SCRUM-1110/issue.md` — snapshot da issue Jira, sem anexos (manifesto vazio).
- `docs/constitution.md` — regras de escrita PT-BR e validacao minima (`npm run test`, `npm run build`).
- `docs/sdd/templates/angular.md` — padrao standalone, OnPush, `inject()`, Signals, testes `*.spec.ts` na mesma pasta.

### PakiInput (ja possui input de erro — alinhar semantica)

- `projects/pakitec-angular-components/src/lib/components/input/paki-input.ts` — standalone, OnPush, `ControlValueAccessor` com `NG_VALUE_ACCESSOR` (linhas 4-13). Inputs signal: `label`, `type`, `placeholder`, `autocomplete`, `hint`, `list`, `error` (linha 20), `mask`, `showPasswordToggle`. Output: `blurred`.
- `projects/pakitec-angular-components/src/lib/components/input/paki-input.html`:
  - `[attr.aria-invalid]="error() ? true : null"` (linha 14).
  - `[attr.aria-describedby]="error() || hint() ? 'support-' + label() : null"` (linha 15).
  - Mensagem de erro: `@if (error()) { <small class="error" [id]="'support-' + label()">` (linhas 41-45).
- `projects/pakitec-angular-components/src/lib/components/input/paki-input.scss` — borda invalida: `input[aria-invalid='true'] { border-color: var(--error-500); }` (linhas 37-39); texto de erro: `.error { color: var(--error-500); }` (linhas 91-93).
- `projects/pakitec-angular-components/src/lib/components/input/paki-input.spec.ts` — padrao de teste com Host component e TestBed; nenhum teste atual cobre `error`, `aria-invalid` ou `aria-describedby`.

Falhas identificadas no mecanismo atual de erro (a corrigir nesta issue):

- O `id` da mensagem deriva do texto do label ('support-' + label). Dois campos com o mesmo label geram ids duplicados; labels com acento ou espaco geram ids invalidos para `aria-describedby`.
- Nao existe forma de marcar o campo invalido sem mensagem (edge case da spec): `aria-invalid` depende de `error()` nao vazio.
- `aria-describedby` muda de alvo quando erro e hint alternam, apontando para o mesmo id. A associacao funciona, mas o id precisa ser estavel e unico.

### PakiSelect (recebe a mesma API)

- `projects/pakitec-angular-components/src/lib/components/select/paki-select.component.ts` — standalone, OnPush, `ControlValueAccessor` (linhas 55-64). Inputs: `label`, `placeholder`, `items`, `options` (deprecated), `searchFn`, `noResultsMessage`. Nao possui `error`, `hint`, `aria-invalid` nem mensagem abaixo do campo.
- `projects/pakitec-angular-components/src/lib/components/select/paki-select.component.html` — input com `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-activedescendant`. Lista com `role="listbox"` e `role="option"`. Estrutura externa `<label><span>{{ label() }}</span>...</label>` igual ao PakiInput, o que facilita espelhar o bloco de erro.
- `projects/pakitec-angular-components/src/lib/components/select/paki-select.component.scss` — estilos do campo usam os mesmos tokens do input (`--color-bg-surface`, `--color-border-default`, `--color-accent` no foco). Nao ha regra para `[aria-invalid='true']`.
- `projects/pakitec-angular-components/src/lib/components/select/paki-select.component.spec.ts` — padrao com Host components (`LocalHost`, `RemoteHost`), importa `vi` do vitest. Nenhum teste cobre estado de erro.

### Novo componente de toast (nao existe hoje)

- Nao existe nenhum servico na biblioteca: a busca por `@Injectable` e `providedIn` em `projects/pakitec-angular-components/src/lib` nao retorna resultados. O PakiToast introduz o primeiro servico e o primeiro container da biblioteca.
- Simbolos a criar: `PakiToast` (componente standalone, selector `paki-toast`), `PakiToastService` (servico `providedIn: 'root'` com a fila de toasts em Signal), container (componente standalone, ex.: `PakiToastContainer`, renderizado uma vez pela aplicacao consumidora) e o modelo `PakiToastConfig`/`PakiToastData`.
- `@angular/animations` esta em devDependencies e nao e usado em nenhum componente. Nao ha padrao de animacao via framework; o padrao existente e transicao CSS com `@media (prefers-reduced-motion: reduce)`.

### Barrels de exportacao (arquivos a tocar)

- `projects/pakitec-angular-components/src/lib/components/index.ts` — barrel com `export * from './<pasta>/<arquivo>';` por componente. Adicionar a linha do toast.
- `projects/pakitec-angular-components/src/public-api.ts` — reexporta `./lib/components/index` (linha 5). Nenhuma edicao esperada, desde que o barrel de componentes seja atualizado (AC-016).

### Tema, tokens e stories

- `projects/pakitec-angular-components/src/styles/pakitec-theme.scss`:
  - Cores base: `--success-500`, `--warning-500`, `--error-500`, `--info-500` (linhas 13-16), aplicadas nos dois temas.
  - Tokens de superficie de feedback com tema: `--color-success-bg/-text`, `--color-warning-bg/-text`, `--color-error-bg/-text` (linhas 26-31 e 54-59 no tema escuro).
  - Lacuna: nao existe par `--color-info-bg` / `--color-info-text` em nenhum dos temas. O toast do tipo info precisa desse par novo (NFR-001, AC-015).
  - Foco visivel global: `:focus-visible { outline: 3px solid color-mix(in srgb, var(--color-accent) 60%, transparent); }` (linhas 124-127).
  - Sombras disponiveis: `--shadow-card`, `--shadow-dialog`, `--shadow-backdrop` (linhas 36-38).
- `projects/pakitec-angular-components/.storybook/preview.ts` — toolbar global `theme` alterna `document.documentElement.dataset['theme']` entre `light` e `dark` (linhas 8-20). Stories novas recebem o tema sem configuracao extra. Addon a11y em modo `test: 'todo'`.
- `projects/pakitec-angular-components/src/stories/input.stories.ts` — Playground ja passa `[error]="error"` (linha 8); nao ha story dedicada ao estado invalido.
- `projects/pakitec-angular-components/src/stories/select.stories.ts` — padrao `render` com template, `moduleMetadata`, stories de cenario (card largo, card recortado, dialog).

### Configuracao de build, teste e Storybook

- `angular.json` — build via `@angular/build:ng-packagr`; teste via `@angular/build:unit-test` (`tsconfig.spec.json`); Storybook `@storybook/angular-vite` com `configDir` em `projects/pakitec-angular-components/.storybook`.
- `package.json` (raiz) — scripts `test` (`ng test`), `build` (`ng build`), `build-storybook` (`ng run pakitec-angular-components:build-storybook`). Angular 22.3+; `@angular/cdk` ^22.1.3 ja e dependencia.
- `projects/pakitec-angular-components/tsconfig.spec.json` — `types: ["vitest/globals"]`; specs convivem com `@storybook/addon-vitest` (projeto de teste de browser em `projects/pakitec-angular-components/vitest.config.ts`).

## Arquitetura e padroes existentes

- A biblioteca nao segue a arvore `core/shared/modules` do `angular.md`; usa o layout plano `lib/components/<nome>/`. Manter este padrao (o research de SCRUM-1074 registra a mesma decisao).
- Todo componente e standalone com `ChangeDetectionStrategy.OnPush` e inputs signal (`input()`), outputs (`output()`) e estado interno em `signal`. PakiToast segue o mesmo.
- Pasta por componente com `<nome>.ts`, `<nome>.html`, `<nome>.scss` e `<nome>.spec.ts` na mesma pasta. O sufixo `.component` aparece em date e select; a maioria usa so o prefixo `paki-`. Para o toast, seguir o padrao majoritario: `lib/components/toast/paki-toast.ts` com `paki-toast-container.ts` ao lado (mesma pasta, como `select-highlight.ts` fica ao lado do select).
- Estilos por tokens CSS custom property (`var(--color-...)`), com seletores de estado por atributo (ex.: `[aria-invalid='true']`).
- Reduced motion: `@media (prefers-reduced-motion: reduce)` no SCSS do componente. Precedentes: `paki-sidenav.scss` (linha 198), `paki-navigation-rail.scss` (linha 30), `paki-skeleton.scss` (linha 26). Teste cobre a presenca da regra regex no CSS compilado, como `paki-navigation-rail.spec.ts` (linhas 344-356).
- Padrao de teste: Host components no proprio spec, `TestBed.configureTestingModule({ imports: [Host] })`, `fixture.detectChanges()`, asserts no DOM. Temporizadores com espera real (`wait(320)` em `paki-select.component.spec.ts`) ou `vi` do vitest.

### Arquitetura recomendada para o PakiToast

Evidencia base: a biblioteca tem zero servicos hoje, o CDK ja e dependencia e tem uso efetivo em `paki-date.component.ts` (linha 14, overlay). Escolhas recomendadas:

1. **`PakiToastService` (`@Injectable({ providedIn: 'root' })`)** — unico ponto de entrada do consumidor. Mantem `readonly toasts = signal<readonly PakiToastData[]>([])`. Metodos `success/title, description, config`, `error(...)`, `warning(...)`, `info(...)` e `dismiss(id)`. Gera `id` com contador interno. Aplica os duracoes padrao: success 5000 ms; warning e info 7000 ms; error sem autodismiss (`duration = 0` / `null`). Todo valor aceita sobreposicao no `config` (AC-003, AC-004).
2. **Empilhamento no servico** — o servico controla a janela de no maximo 3 visiveis com ordem FIFO (first in/first out) e retencao de erros (AC-005, AC-006, FR-006, FR-007): ao inserir o quarto toast, remove primeiro o toast nao critico mais antigo; nunca remove `type === 'error'`. Toasts de erro acima do limite ficam visiveis mesmo que a contagem passe de 3 — a retencao tem precedencia sobre o limite, porque a spec proibe o descarte de erro.
3. **`PakiToastContainer` (componente standalone)** — declarado uma vez na raiz da aplicacao consumidora (FR-010). Le `service.toasts()` e renderiza a lista. Recebe `input` de `position` com padrao `top-right` (FR-008): `top-right | top-left | bottom-right | bottom-left`. Posicionamento por CSS `position: fixed` no wrapper, com `z-index` acima de `1000` (o painel do select usa `1000`; o toast precisa ficar acima de campos e modais comuns).
4. **`PakiToast` (componente de item)** — renderiza titulo, descricao, icone de tipo e botao de fechar com `aria-label`. Emite `closed` para o container. Pausa de autodismiss por bindings do host ou template: `(mouseenter)`, `(mouseleave)`, `(focusin)`, `(focusout)` sobre o item (FR-005, AC-007).
5. **Autodismiss com pausa sem acumulo** — o container guarda por toast `remainingMs` e `startedAt` (timestamps `performance.now()`); em pausa, atualiza `remainingMs`; em retomada, recria o `setTimeout(remainingMs)`. Isso evita intervalos acumuladores e preserva o tempo restante real. Em testes, `vi.useFakeTimers()` controla os avanco de tempo.
6. **Regiao live** — o wrapper do container carrega `aria-live="polite"` e `aria-atomic="false"` (FR-009). Toasts de erro usam `role="alert"` no proprio item, que implica `aria-live="assertive"` (ver `list-feedback[role='alert']` em `pakitec-theme.scss`, linha 210 — o projeto ja usa esse padrao). Nao criar uma `LiveAnnouncer` do zero, mas considerar o `LiveAnnouncer` do `@angular/cdk/a11y` como dependencia ja disponivel; manter regiao live no template e suficiente.
7. **Animacao sem framework** — entrada/saida com transicao CSS de `transform` + `opacity` no SCSS, com o bloco `@media (prefers-reduced-motion: reduce) { transition: none; animation: none; }` (NFR-002, AC-014). Saida animada via fase explícita no Signal do item (`leaving: true`) antes de remover da lista; duracao da fase deve se igualar a da transicao. Sem `@angular/animations`.
8. **API de erro alinhada (PakiInput e PakiSelect)** — manter o input `error: string` existente e adicionar `invalid = input(false)` nos dois componentes. Regra unica: o campo fica invalido quando `invalid()` ou `error()` nao vazio; a borda vermelha usa essa regra; a mensagem so renderiza quando `error()` nao vazio (edge case: invalido sem mensagem, spec Edge Cases). Isso preserva 100% dos usos atuais de `[error]` no PakiInput (AC-008, compatibilidade FR-016).
9. **Ids estaveis e unicos** — trocar `'support-' + label()` por um contador static de instancia do componente (ex.: `paki-input-error-7`), como feito por bibliotecas de componentes Angular. `aria-describedby` aponta para o id da mensagem quando ha erro; `aria-invalid="true"` quando invalido (FR-014, AC-010). No PakiSelect, espelhar o mesmo padrao no `input[role="combobox"]` e o bloco `<small class="error">` abaixo do `.paki-select__control`.
10. **Marcadores alem da cor** — a mensagem de texto ja cumpre FR-015 (AC-011). Reforcar com icone de alerta opcional ao lado da mensagem e com o proprio `aria-invalid`, usando tokens de feedback do tema.

## Testes e comandos atuais

- Runner: `ng test` usa `@angular/build:unit-test`; specs usam `describe`/`it`/`expect` com `TestBed` e, quando necessario, `vi` do vitest (`paki-select.component.spec.ts` linha 2).
- Padrao de teste de formulario: Host component com `ReactiveFormsModule` e `FormControl` (`paki-input.spec.ts`, linhas 5-11). Vale tambem para template-driven com `FormsModule` e `ngModel` (historia de `input.stories.ts`).
- Reduced motion: assert de presenca da regra `@media (prefers-reduced-motion: reduce)` no CSS compilado (`paki-navigation-rail.spec.ts` linhas 344-356). O comportamento renderizado fica para o QA visual.
- Timers: `vi.useFakeTimers()` disponivel; ou espera real com `wait(ms)`.
- Comandos de validacao (NFR-004..NFR-006, SC-004): `npm run test`, `npm run build`, `npm run build-storybook`. Nao ha lint configurado no `package.json`; ha Prettier (`.prettierrc`) sem script de checagem.
- `evidence/` recebe os capturas oficiais por issue (`evidence/SCRUM-1074`, `evidence/SCRUM-1002`); para SCRUM-1110 o QA visual cria `evidence/SCRUM-1110/`.

### Estrategia de teste por criterio de aceite

- AC-001/AC-003/AC-004 (FR-001..FR-004): servicos com fake timers — disparar cada tipo; observar `toasts()` com conteudo; avanco de tempo remove success apos 5 s, warning/info apos 7 s; error permanece; duracao customizada sobrescreve o padrao.
- AC-002 (FR-003): criar fixture do container; clicar no botao de fechar; o toast sai de `toasts()`.
- AC-005/AC-006 (FR-006/FR-007): disparar 4 toasts; validar no maximo 3; com erro visivel, o proximo nao critico sai primeiro e o erro permanece.
- AC-007 (FR-005): fixture do container; disparar toast; com `mouseenter`, o relogio pausa (remainingMs congela); `mouseleave` retoma. Mesmo ciclo com `focusin`/`focusout`.
- AC-008/AC-009 (FR-012/FR-013): hosts com `[error]="'Campo obrigatório'"`; asserts de borda por classe/atributo e presenca da mensagem abaixo do campo, nos dois componentes.
- AC-010/AC-011 (FR-014/FR-015): asserts de `aria-invalid="true"`, `aria-describedby` apontando para o id real do `<small class="error">` e mensagem visivel com erro setado; teste de campo invalido sem mensagem (so borda).
- AC-012/AC-013 (FR-017): host com formulario + container + servico; falha simulada dispara toast de erro e aplica `error` nos campos; asserts simultaneos. Erro sem campo: so o toast aparece.
- AC-014 (NFR-002): assert da regra `prefers-reduced-motion` no CSS do toast (padrao navigation-rail).
- AC-015 (NFR-001): stories nos dois temas; a toolbar de tema do preview cobre a troca; o QA visual valida contraste.
- AC-016 (FR-011): assert de importacao em teste do barrel (`public-api`) ou build da biblioteca; `npm run build` ja valida a superficie publica via ng-packagr.

## Integracoes e dados

- Sem dependencia nova: toda a estrutura proposta usa `@angular/core`, `@angular/common` e `@angular/forms`, ja presentes. `@angular/cdk` permanece opcional.
- Tokens de tema da propria biblioteca (`pakitec-theme.scss`): cores de fundo/texto de feedback, bordas, sombras e foco. Precisa do par `--color-info-bg`/`--color-info-text` novo nos dois temas.
- Storybook: `@storybook/angular-vite` + compodoc; stories novas em `src/stories/toast.stories.ts` com demos de cada tipo, cada posicao e cada duracao nos dois temas (via toolbar do preview).
- Evidencia visual: capturas oficiais em `evidence/SCRUM-1110/` por criterio visual (constitution, secao "Evidência visual de frontend").
- Nao ha dados sensiveis: toast so exibe titulo/descricao fornecidos pelo consumidor.

## Alternativas consideradas

- **Posicionamento do container: CSS `position: fixed` (recomendada) vs. CDK Overlay.** O CDK Overlay ja e dependencia (uso em `paki-date.component.ts`), mas a `top layer` de `<dialog open>` modais oculta overlays fixos/empilhados; a spec nao exige toast dentro de dialog. Fixed direto e mais simples, segue o padrao do painel do select (comentario em `paki-select.component.scss`, linhas 84-86) — descartado o Overlay como desnecessario para este escopo.
- **Regiao live no template (recomendada) vs. `LiveAnnouncer` do CDK.** O `LiveAnnouncer` facilita anuncios, mas adiciona camada e o anuncio de entrada de toast funciona com `aria-live` no conteiner + `role="alert"` para erros. Descartado o primeiro por suficiencia do segundo; reavaliar se o QA de acessibilidade falhar.
- **Animacao: transicao CSS + `@media (prefers-reduced-motion: reduce)` (recomendada) vs. `@angular/animations`.** A biblioteca nao usa o modulo de animacoes em nenhum componente; adicionar agora seria desproporcional. Precedente de CSS nos componentes sidenav/navigation-rail/skeleton.
- **API de erro: `invalid: boolean` + `error: string` com regra "qualquer um marca invalido" (recomendada) vs. so `error: string` (como esta hoje) vs. so `invalid` + `errorMessage`.** Hoje so existe `error`, que nao cobre o edge case "invalido sem mensagem". Separar `invalid` e `errorMessage` quebraria a API atual de `[error]`. A uniao preserva o uso atual e atende ao edge case.
- **Ids da mensagem: contador interno por instancia (recomendado) vs. `'support-' + label()` (atual).** O atual gera ids duplicados quando dois campos usam o mesmo label e ids com espaco/acento. Um contador atende `aria-describedby` com id estavel (mudanca interna, sem impacto publico).
- **Posicao da notificacao: input no container (recomendado) vs. `InjectionToken` de configuracao global.** O input no container e mais simples, direto e testavel; um token global adiciona superficie sem ganho para o escopo.
- **Timer do autodismiss: `remainingMs` + `performance.now()` com `setTimeout` recriado (recomendado) vs. `setInterval` acumulador com tick por segundo.** O intervalo consome mais e perde precisao em pausa; a versao de timestamp so cria timer no momento certo e congela o valor restante.
- **Saida animada: fase `leaving` no Signal antes de remover (recomendada) vs. remover direto.** Sem a fase, o item some abruptamente e impede a transicao de saida; so a fase respeita o contrato visual.
- **Limite de toasts e retencao de erros no servico (recomendado) vs. no container.** A regra e de negocio (FR-006/FR-007) e precisa ser testavel sem renderizacao; o servico guarda a fila e o container apenas reflete.

## Riscos tecnicos

- **R-A — Regressao no PakiInput/PakiSelect em usos atuais (FR-016).** Mitigacao: preservar o input `error` com mesma semantica (string nao vazia marca invalido, mensagem abaixo, `aria-invalid`); adicionar `invalid` como canal novo; nao renomear nenhum input; suite `paki-input.spec.ts` e `paki-select.component.spec.ts` continua verde.
- **R-B — Troca do `id` da mensagem no PakiInput (`'support-' + label()` para id unico).** Uso atual pode depender de seletores DOM em testes de consumidores, mas o id nao faz parte da API publica. Mitigacao: manter `aria-describedby` consistente com o id real (o que o mecanismo atual ja exige); registrar no plano como mudanca interna.
- **R-C — Toast escondido sob `<dialog>` modal (top layer).** O `position: fixed` do container nao vence a top layer; toasts emitidos a partir de fluxos com `<dialog open>` podem nao aparecer. Mitigacao: documentar a limitacao; se for requisito de QA, migrar o container para o `Popover API` ou anexar ao `HTMLDialogElement` ativo. Nao bloqueante nesta spec.
- **R-D — Precisao do autodismiss em segundo plano.** `setTimeout` atrasa em abas inativas; o tempo restante real se preserva por usar `performance.now()` e `remainingMs`, mas o fechamento pode atrasar. Aceitavel para o criterio.
- **R-E — `LiveAnnouncer`/regiao live com tecnologia assistiva.** A anunciacao de entrada depende de o navegador/leitor detectar a mutacao no DOM. `role="alert"` em erros tem suporte amplo; toasts nao criticos com `aria-live="polite"` podem nao anunciar em algumas combinacoes. Mitigacao: QA com leitor disponivel; fallback de `LiveAnnouncer` registrado nas alternativas.
- **R-F — `prefers-reduced-motion` nao e simulavel com confianca em unit test.** Mitigacao: assert de CSS por regex (padrao navigation-rail); comportamento final no QA visual (evidencia oficial em `evidence/SCRUM-1110/`).
- **R-G — Contraste dos tokens de feedback nos dois temas (AC-015, NFR-001).** O par `--color-info-bg`/`--color-info-text` nao existe; definir valores novos no tema claro e escuro e validar contraste (texto >= 4.5:1, indicadores >= 3:1) no QA. Estimativa inicial: `#cffafe`/`#155e75` no claro e `#164e63`/`#a5f3fc` no escuro; ajuste fica a cargo do plano e do QA.
- **R-H — Empilhamento com mutacao de erro.** Se existirem 3 erros visiveis e chegar um quarto toast, a regra FIFO se aplica ao antecessor nao critico mais antigo; se todos forem erro, ninguem sai e a fila aceita mais de 3 ate fechamento manual. Confirmar na issue ja resolvido pela premissa (secao Premissas, spec linhas 165-171) — regra preservada.
- **R-I — Ordem entre remocao animada e FIFO.** Um toast marcado `leaving` continua ocupando o slot visual brevemente; o servico pode remove-lo da janela ativa assim que entra na fase `leaving`, sem aguardar o fim da transicao. Mitigacao: estado explicito no modelo (`leaving: boolean`) e teste de que a remocao da fila nao depende do fim da animacao.

## Lacunas

- **Formato exato da API de `PakiToastConfig`.** A spec define tipo, titulo, descricao, duracao e posicao, mas nao fixa nomes de campos ou se `duration = 0` significa "sem autodismiss". O plano decide; recomendo `duration?: number` com `0`/`undefined` herdando o padrao do tipo e valor negativo desabilitando o autodismiss — ou um flag dedicado `sticky: boolean`, a definir no plano.
- **Ponto de "um unico container por aplicacao" (FR-010).** A spec diz um container; nao esclarece enforcement (erro em tempo de desenvolvimento se duplicado) nem posicionamento declarado. O plano decide entre um warning `dev-mode` e apenas documentacao de uso.
- **Nome e forma do container.** `PakiToastContainer` como componente a declarar na raiz, ou diretiva/provider imperativo. A decisao cabe ao plano; a evidencia do repo favorece o componente (padrao de componentes em pasta propria + barrel).
- **Comportamento visual de erro sem mensagem no PakiInput/PakiSelect.** A spec confirma o estado visual sem mensagem vazia; nao define espacamento residual. O plano aplica `min-height: 0` e remove o slot quando `error()` vazio.
- **Posicoes suportadas alem das 4 cantos.** A spec cita "outra posicao" sem enumerar; recomendo as 4 cantos clasicas (top-right, top-left, bottom-right, bottom-left) e o plano confirma.
- **Criterio de anuncio na troca de mensagem em campo invalido.** Edge case da spec (mensagem atualizada em campo invalido) nao define se a tecnologia assistiva reanuncia. A associacao por `aria-describedby` tende a reanunciar por mutacao; o plano documenta e o QA valida.

Somente conclusoes sustentadas por evidencia do repositorio acima.
<!-- sdd:section specs.research-template:end -->
