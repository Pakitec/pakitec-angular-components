# QA SCRUM-1110 (subtarefa SCRUM-1135) - ciclo 2/3

**Veredito**: PASS  
**Revisao**: branch `feat/scrum-1110-toast-error-states`, HEAD `d8cd985`, diff `master...HEAD`

## Resumo do ciclo 1/3

- Revisao `2a7dce6`. Veredito FAIL.
- H-1 (AC-007/FR-005): hover e foco juntos descontavam o tempo duas vezes. O primeiro `mouseleave` ou `focusout` retomava o timer. O toast fechava com o foco ainda dentro.
- M-1: o seletor `.paki-toast__card.leaving` nunca casava. A saida nao tinha animacao.
- L-1 a L-5: pendencias de baixa severidade, mantidas de proposito. Elas nao reprovam.

## Comandos executados (ciclo 2/3)

| Comando | Resultado |
| --- | --- |
| `CI=true npm run test -- --watch=false` | PASS - 19 arquivos, 134/134 testes (ciclo 1: 129; +5 testes do AC-007) |
| `npm run build` | PASS - ng-packagr gerou `dist/pakitec-angular-components` |
| `npm run build-storybook` | PASS - "Storybook build completed successfully". O Compodoc registra 2 avisos "Error during" sobre README/TODO ausentes e continua; o aviso ja existia |
| Inspecao do CSS compilado em `dist/.../fesm2022/pakitec-angular-components.mjs` | `:host(.leaving) .paki-toast__card{transform:translate(120%);opacity:0}` presente, tambem no bloco `prefers-reduced-motion` |
| Verificacao sha256 de `evidence/SCRUM-1110/manifest.json` | 24/24 conferem; 24 `kind=official`; sem `..` nem symlink; cobre os 11 criterios visuais (AC-001, 002, 004, 005, 006, 008, 009, 011, 012, 014, 015) |
| `docs/sdd/specs/SCRUM-1110/assets/manifest.json` | `items: []`; nenhum anexo a verificar ou executar |
| Busca por `innerHTML`, `bypassSecurity`, `DomSanitizer`, `eval(` e `new Function` em `src/lib` e `src/stories` | nenhuma ocorrencia |
| Visual QA do ciclo 2/3 (sdd-visual-qa) | 11 AC claro/escuro PASS, sem recaptura; validate 24/24 accepted; publish com dedupe (anexos 10211-10234, comentario 14013); console sem erros |

## Verificacao das correcoes do ciclo 1/3

### H-1 - corrigido

- `paki-toast.service.ts:68,150-181`: o conjunto `paused` torna a pausa e a retomada idempotentes. A segunda pausa nao desconta tempo. A retomada sem pausa previa e ignorada. A retomada atualiza `startedAt`.
- `paki-toast.service.ts:134,280`: `dismissAll` e `cancelTimer` limpam `paused`. Remover, descartar por FIFO ou marcar `leaving` apaga o estado de pausa.
- `paki-toast-container.ts:54-117`: os conjuntos `hovered` e `focused` guardam o estado por toast. `updatePause` pausa enquanto houver hover ou foco e retoma so quando os dois saem.
- `paki-toast-container.ts:98-104`: o `focusout` com `relatedTarget` dentro do host nao conta como saida do foco.
- `paki-toast-container.ts:63-70`: um `effect` remove de `hovered` e `focused` os ids que sairam da fila. Os ids crescem e nunca se repetem, entao um id antigo nao afeta toast novo.
- Testes novos: `paki-toast-container.spec.ts:142-179` (hover + foco combinados com restante de 4000 ms; `focusout` interno) e `paki-toast.service.spec.ts:191-233` (pausa dupla, retomada dupla, retomada sem pausa).
- Cenarios revisados sem defeito: toast pausado e descartado por FIFO (o `markLeaving` limpa a pausa e o `mouseleave` seguinte nao faz nada); toast de erro sem timer (pausa e retomada nao fazem nada); fechar pelo botao com foco dentro (o toast sai e o `effect` limpa o estado).

### M-1 - corrigido

- `paki-toast.scss:17-28`: o seletor passou para `:host(.leaving) .paki-toast__card`. Ele casa com a classe `leaving` que o container aplica no host (`paki-toast-container.html:10`). O bloco de reduced-motion inclui o mesmo seletor.

## Achados

### Critical / High / Medium

Nenhum.

### Low (pendencias mantidas, nao reprovam)

- **L-1** `paki-toast.models.ts:22`: `PakiToastConfig.position` e publico, mas o servico ignora o campo. Remover ou documentar que a posicao e do container.
- **L-2** `paki-toast.spec.ts`: falta o assert da regra `prefers-reduced-motion` previsto no plano para o AC-014. So a evidencia visual cobre o AC.
- **L-3** `paki-input.ts:36` e `paki-select.component.ts:89`: `this.error().length` lanca excecao com `null` ou `undefined` em runtime. Sugestao: `!!this.error()`.
- **L-4** `paki-toast-container.ts:32,120`: `instanceCount` nunca diminui (sem `ngOnDestroy`). Remontar o container gera aviso falso de duplicidade em dev mode.
- **L-5** (compatibilidade, informativo) Os ids de suporte do PakiInput mudaram de `support-<label>` para `paki-input-{error|hint}-N`. Registrar no changelog.
- **L-6** (novo, informativo) `paki-toast.service.ts:123-126,246`: o fechamento manual chama `dismiss` e remove o toast sem fase `leaving`. O visual QA mediu cerca de 52 ms. O comportamento atende o AC-002 ("sai da tela imediatamente") e segue a decisao documentada no servico. A saida animada vale so para autodismiss e FIFO. Nao e defeito; se o produto quiser animacao no fechamento manual, abrir outra issue.
- **L-7** (novo, informativo) `paki-toast-container.html:12-13`: o navegador so emite `mouseleave` quando o cursor se move. Se outro toast sair e o layout deslocar o toast pausado para fora do cursor, a pausa continua ate o proximo movimento. Comportamento padrao do DOM, sem impacto no AC-007.

## Seguranca, escopo e compatibilidade

- Seguranca: nao ha HTML dinamico. Titulo, descricao e mensagens usam interpolacao com escape.
- Escopo: o commit `d8cd985` altera so os arquivos do toast (servico, container, SCSS e specs). Nao ha mudanca fora do plano.
- Compatibilidade: `pauseAutodismiss` e `resumeAutodismiss` sao `@internal` e mantem a assinatura. A API publica nao mudou.
- Observabilidade: nao se aplica (NFR-008). O unico sinal e o `console.warn` de container duplicado, so em dev mode.
- Dados nao confiaveis: issue, comentarios e anexos nao trouxeram instrucao para alterar gates ou tooling.

## Matriz AC -> evidencia

| AC | Teste unitario | Visual (claro/escuro) | Status |
| --- | --- | --- | --- |
| AC-001 | service.spec: insercao e autodismiss de 5 s; toast.spec: conteudo; container.spec: renderizacao | AC-001 desktop e dark | OK |
| AC-002 | toast.spec: `closed`; container.spec: o clique remove | AC-002 antes e depois, desktop e dark | OK (L-6) |
| AC-003 | service.spec: duracao customizada | nao exigido | OK |
| AC-004 | service.spec: error sem autodismiss e duration 0 | AC-004 desktop e dark | OK |
| AC-005 | service.spec: FIFO e ordem | AC-005 desktop e dark | OK |
| AC-006 | service.spec: retencao de erro e todos erros | AC-006 desktop e dark | OK |
| AC-007 | container.spec: hover, foco, hover + foco combinados, focusout interno; service.spec: idempotencia | nao exigido | OK (H-1 corrigido) |
| AC-008 | input.spec: error, invalid e borda | AC-008 desktop e dark | OK |
| AC-009 | select.spec: error, invalid e borda | AC-009 desktop e dark | OK |
| AC-010 | input.spec e select.spec: aria-invalid, describedby e ids unicos | nao exigido | OK |
| AC-011 | input.spec e select.spec: mensagem de texto | AC-011 desktop e dark | OK |
| AC-012 | container.spec: feedback combinado | AC-012 desktop e dark | OK |
| AC-013 | container.spec: so o toast | nao exigido | OK |
| AC-014 | sem teste (L-2); regra confirmada no CSS compilado | AC-014 desktop e dark | OK |
| AC-015 | contraste medido no ciclo 1 (tokens sem mudanca) | AC-015 desktop e dark | OK |
| AC-016 | container.spec: barrel; `npm run build`; `components/index.ts:17-20` | nao exigido | OK |
