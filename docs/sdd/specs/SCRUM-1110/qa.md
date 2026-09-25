# QA SCRUM-1110 (subtarefa SCRUM-1135) - ciclo 1/3

**Veredito**: FAIL  
**Revisao**: branch `feat/scrum-1110-toast-error-states`, HEAD `2a7dce6`, diff `master...HEAD`

## Comandos executados

| Comando | Resultado |
| --- | --- |
| `CI=true npm run test -- --watch=false` | PASS - 19 arquivos, 129/129 testes |
| `npm run build` | PASS - ng-packagr gerou `dist/pakitec-angular-components` |
| `npm run build-storybook` | PASS |
| Verificacao sha256 de `evidence/SCRUM-1110/manifest.json` | 24/24 conferem; os 11 criteriaId de `workflow.visualEvidence.criteria` estao cobertos |
| Busca por `innerHTML`, `bypassSecurity`, `DomSanitizer` e `eval(` em `src/lib` e `src/stories` | nenhuma ocorrencia |
| Contraste WCAG (script) | erro inline claro 4.83:1 sobre surface e 4.54:1 sobre page; escuro 6.47:1 e 7.03:1; pares info/success/warning/error do toast entre 6.46:1 e 10.62:1 |
| Simulacao de `pauseAutodismiss`/`resumeAutodismiss` com a mesma logica | falha confirmada: hover e foco juntos fazem `remainingMs` chegar a 0 e o toast fechar com o foco ainda dentro |

## Achados

### High

- **H-1 (FR-005, plano: "pausa sem acumulo")** Arquivos: `projects/pakitec-angular-components/src/lib/components/toast/paki-toast.service.ts:138-163` e `paki-toast-container.html:12-15`.
  - `pauseAutodismiss` nao atualiza `startedAt` e nao sabe se o timer ja esta pausado. Uma segunda pausa (`mouseenter` seguido de `focusin`) desconta de novo o tempo desde o inicio.
  - `resume` roda no primeiro `mouseleave` ou `focusout`, mesmo que a outra condicao continue ativa.
  - Resultado: o toast fecha enquanto o foco do teclado ainda esta dentro dele. A FR-005 exige retomar so quando hover **e** foco saem.
  - O teste do AC-007 cobre cada evento isolado, nao a combinacao.

### Medium

- **M-1 (plano, saida animada)** Arquivos: `paki-toast-container.html:10` e `paki-toast.scss:17`.
  - A classe `leaving` fica no host `<paki-toast>`, mas o seletor encapsulado e `.paki-toast__card.leaving`. Ele nunca casa, entao a transicao de saida nao acontece e o toast some sem animacao.
  - Nao quebra o AC-014 nem outro AC, mas deixa `PAKI_TOAST_LEAVE_DURATION_MS` e a fase `leaving` sem efeito visual.

### Low

- **L-1** `paki-toast.models.ts:22`: `PakiToastConfig.position` e publico, mas o servico ignora esse campo e `PakiToastData` nao o carrega. O plano previa um fallback por toast, e hoje a API engana o consumidor.
- **L-2** `paki-toast.spec.ts`: falta o assert da regra `prefers-reduced-motion` que o plano previa para o AC-014. Hoje so a evidencia visual cobre esse AC.
- **L-3** `paki-input.ts:36` e `paki-select.component.ts:89`: `this.error().length` lanca excecao se chegar `null` ou `undefined` em runtime (consumidor sem strictTemplates ou com `$any`). O template antigo so testava se o valor era truthy. Sugestao: `!!this.error()`.
- **L-4** `paki-toast-container.ts:51-52`: `instanceCount` nunca diminui (nao ha `ngOnDestroy`). Remontar o container, por exemplo ao recriar o shell ou em testes, gera um aviso falso de duplicidade.
- **L-5** (compatibilidade, informativo) Os ids de suporte do PakiInput mudaram de `support-<label>` para `paki-input-{error|hint}-N`. A mudanca e correta: corrige ids duplicados. Registrar no changelog.

## Correcoes minimas (todas dentro do escopo aprovado)

1. H-1: guardar por toast os estados `hovered` e `focused`, ou um contador de pausas. Pausar so na transicao de ativo para pausado e retomar so quando os dois estados estiverem falsos. Atualizar `startedAt` na pausa ou ignorar a pausa se o timer ja estiver pausado. Adicionar um teste com `mouseenter`, depois `focusin`, depois `mouseleave` (o toast deve continuar) e por fim `focusout` (retoma com o restante correto).
2. M-1: trocar o seletor para `:host(.leaving) .paki-toast__card`, incluido no bloco de reduced-motion. Outra opcao e passar `leaving` para o `PakiToast` e aplicar a classe no card.
3. L-1: remover `position` de `PakiToastConfig` ou documentar que a posicao e so do container.
4. L-2: adicionar o assert da regra `prefers-reduced-motion` no CSS do toast.
5. L-3: usar `!!this.error()` em `hasError`.
6. L-4: decrementar `instanceCount` em `ngOnDestroy`.

Seguranca: nao ha HTML dinamico; titulo, descricao e mensagens usam interpolacao com escape. Observabilidade: nao se aplica (NFR-008); o unico sinal e o `console.warn` de container duplicado, emitido so em dev mode.

## Matriz AC -> evidencia

| AC | Teste unitario | Visual (claro/escuro) | Status |
| --- | --- | --- | --- |
| AC-001 | service.spec: insercao e autodismiss de 5 s; toast.spec: conteudo; container.spec: renderizacao | AC-001 desktop e dark | OK |
| AC-002 | toast.spec: `closed`; container.spec: o clique remove | AC-002 antes e depois, desktop e dark | OK |
| AC-003 | service.spec: duracao customizada | nao exigido | OK |
| AC-004 | service.spec: error sem autodismiss e duration 0 | AC-004 desktop e dark | OK |
| AC-005 | service.spec: FIFO e ordem | AC-005 desktop e dark | OK |
| AC-006 | service.spec: retencao de erro e todos erros | AC-006 desktop e dark | OK |
| AC-007 | container.spec: hover e foco isolados | nao exigido | FALHA PARCIAL (H-1) |
| AC-008 | input.spec: error, invalid e borda | AC-008 desktop e dark | OK |
| AC-009 | select.spec: error, invalid e borda | AC-009 desktop e dark | OK |
| AC-010 | input.spec e select.spec: aria-invalid, describedby e ids unicos | nao exigido | OK |
| AC-011 | input.spec e select.spec: mensagem de texto | AC-011 desktop e dark | OK |
| AC-012 | container.spec: feedback combinado | AC-012 desktop e dark | OK |
| AC-013 | container.spec: so o toast | nao exigido | OK |
| AC-014 | sem teste (L-2) | AC-014 desktop e dark | OK (so visual) |
| AC-015 | contraste medido (script) | AC-015 desktop e dark | OK |
| AC-016 | container.spec: barrel; `npm run build` | nao exigido | OK |
