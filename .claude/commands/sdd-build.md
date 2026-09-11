---
description: Executar um planejamento SDD aprovado, sincronizando subtarefas Jira e QA.
argument-hint: <ISSUE-KEY> [--parallel]
allowed-tools: Read, Glob, Grep, Bash, Write, Edit, Agent, mcp__pakitec-cloud-mcp__jira_get_workspace_binding, mcp__pakitec-cloud-mcp__jira_list_profiles, mcp__pakitec-cloud-mcp__jira_bind_workspace, mcp__pakitec-cloud-mcp__jira_get_issue, mcp__pakitec-cloud-mcp__jira_list_attachments, mcp__pakitec-cloud-mcp__jira_edit_task, mcp__pakitec-cloud-mcp__jira_record_sdd_event, jira_get_workspace_binding, jira_list_profiles, jira_bind_workspace, jira_get_issue, jira_list_attachments, jira_edit_task, jira_record_sdd_event
---

<!-- sdd:section command.sdd-build:start -->
Voce esta executando `/sdd-build` para implementar uma issue Jira planejada. Entrada: `$ARGUMENTS`.

O `workflow.json` tem um unico escritor por fase: o agente que assume o papel de orquestrador — o agente principal do comando, ou o `sdd-orchestrator` quando a fase foi delegada a ele. Apos delegar uma fase, o comando nao escreve `workflow.json` ate o retorno; dados produzidos pelo delegado voltam no resultado e sao persistidos por um unico escritor.

Fluxo multi-projeto (opcional, ativado apenas com dois ou mais workspaces vinculados). Enquanto houver um unico workspace vinculado, este bloco nao muda nada: siga o fluxo padrao do comando sem qualquer alteracao.

Vocabulario:

- Grupo: uma mesma feature que atravessa dois ou mais projetos (por exemplo backend, frontend e uma biblioteca de componentes). Cada projeto participante vira UMA Task Jira top-level propria. Subtarefa exige o mesmo projeto do pai, portanto o grupo usa tasks separadas, linkadas nativamente no Jira via `jira_link_issues` (`Relates`) e unidas pelo label compartilhado, nunca subtarefas entre projetos.
- `groupId`: identificador estavel do grupo no formato `grp-<YYYYMMDD>-<slug-curto>`. O mesmo valor aparece no label `sdd-group:<groupId>` de todas as tasks e no `group.json` de cada membro.
- Membro: um par `{ projeto Jira, workspace }` que participa do grupo, com um `role` curto e humano (`backend`, `frontend`, `components`).

MULTI_GATE (deteccao — execute depois do `JIRA_GATE` e antes de agir):

1. Liste os workspaces abertos na sessao (os roots do cliente). Para cada um, chame `jira_get_workspace_binding` com o `workspacePath` absoluto.
2. Conte os workspaces com vinculo Jira habilitado (perfil + projeto validos).
   - 0 ou 1 vinculado: MODO SINGLE. Ignore todo o restante deste bloco e siga o fluxo padrao do comando, sem alteracao.
   - 2 ou mais vinculados: MODO MULTI candidato. Nao ative automaticamente. Apresente os projetos detectados e pergunte se esta feature deve ser distribuida entre eles. Sem confirmacao explicita, permaneca em MODO SINGLE usando o workspace escolhido pelo usuario.
3. Em MODO MULTI, confirme com o usuario a lista final de membros (default: todos os vinculados) e a `order` entre eles. A ordem e sequencial e reflete dependencia: tipicamente o projeto que define o contrato/API vem antes dos consumidores.

`group.json` (um por spec, gravado em `docs/sdd/specs/<ISSUE-KEY>/group.json` de cada membro):

```json
{
  "groupId": "grp-20260819-checkout",
  "createdAt": "<ISO-8601 com timezone>",
  "order": ["BACK-12", "FRONT-8"],
  "members": [
    { "project": "BACK", "issueKey": "BACK-12", "workspacePath": "/abs/backend", "role": "backend" },
    { "project": "FRONT", "issueKey": "FRONT-8", "workspacePath": "/abs/frontend", "role": "frontend" }
  ]
}
```

Regras do manifesto:

- Todos os membros compartilham exatamente o mesmo `groupId`, o mesmo array `order` e a mesma lista `members`; apenas o arquivo vive dentro de cada workspace.
- `order` lista as issueKeys na ordem de execucao. `members` descreve cada par projeto/workspace com `project`, `issueKey`, `workspacePath` absoluto e `role`.
- Grave o `group.json` de todos os membros somente depois que TODAS as tasks do grupo foram criadas e suas chaves confirmadas.

Descoberta de peers (execute quando o comando recebe uma issueKey):

1. Procure `docs/sdd/specs/<ISSUE-KEY>/group.json` no workspace atual.
2. Sem arquivo, ou arquivo sem a issueKey recebida em `members`: a issue NAO pertence a nenhum grupo. Siga o fluxo single padrao, sem alteracao.
3. Com arquivo valido: confirme que cada membro em `members` ainda e alcancavel — o workspace existe e `jira_get_issue` retorna a issue no projeto esperado. Membro inacessivel bloqueia o modo multi; relate e pare antes de agir.

FANOUT (execucao de fase em MODO MULTI):

- Itere `order` de forma sequencial. Para cada issueKey, execute o fluxo single COMPLETO deste comando dentro do workspace do membro correspondente: seu proprio binding, seu proprio `docs/sdd/specs/<KEY>/`, seus proprios agentes. Um membro so inicia depois que o anterior concluiu com sucesso.
- Cada membro e uma execucao single independente e idempotente: retomar o grupo nao repete membros ja concluidos.
- Falha ou bloqueio em um membro interrompe o grupo imediatamente, preservando os membros ja concluidos. Relate qual membro bloqueou e o motivo e nao inicie os membros seguintes.
- Ao final, consolide um resumo com uma linha por membro: issueKey, projeto, status final e observacao curta.

Contexto de execucao do Pakitec Pilot:

- No inicio do comando, leia uma unica vez as variaveis `PAKITEC_SDD_PHASE`, `PAKITEC_SDD_RUNNER`, `PAKITEC_SDD_MODEL`, `PAKITEC_SDD_MODEL_LABEL` e `PAKITEC_SDD_EXECUTION_ID` usando `printenv` sem imprimir outros valores do ambiente.
- Monte `executionContext` somente com os valores nao vazios: `phase`, `runner`, `model`, `modelLabel` e `executionId`.
- Inclua esses mesmos campos em toda chamada `jira_record_sdd_event`, qualquer que seja o tipo do evento.
- Ao delegar um agente que possa registrar eventos Jira, inclua `executionContext` no prompt da delegacao e ordene que ele o preserve sem alteracoes em todas as chamadas.
- Se as variaveis nao existirem (execucao fora do Pilot), omita os campos; isso nao bloqueia o fluxo.

Regras obrigatorias:

1. Extraia exatamente uma chave `PROJ-123`. Reconheca a flag opcional `--parallel` em `$ARGUMENTS` (ausencia = execucao sequencial, que e o default) e persista a escolha em `workflow.json` como `buildConcurrency` (`sequential` ou `parallel`) para retomadas deterministas; em FANOUT multi-projeto a flag vale para todos os membros. Antes do `JIRA_GATE`, execute a descoberta de peers do bloco multi-projeto: se a chave pertencer a um grupo, aplique o FANOUT e implemente cada membro, na `order`, executando as regras abaixo por completo dentro do workspace de cada membro; caso contrario, siga em MODO SINGLE sem alteracao. Em MODO SINGLE, execute o `JIRA_GATE` antes de ler ou alterar o workflow: resolva o vinculo; se ausente, permita escolha assistida, vincule e valide novamente. Sem Jira valido, encerre sem executar codigo.
2. Leia a issue, confirme o projeto vinculado e somente entao abra constituicao e `docs/sdd/specs/<ISSUE-KEY>/workflow.json`.
3. Recuse a execucao quando o workflow nao existir, nao registrar `refinement.verdict: "PASS"`, nao possuir checklist aprovado, contiver `NEEDS CLARIFICATION`, estiver `BLOCKED` ou nunca tiver atingido `READY_TO_BUILD`; indique `/sdd-plan <ISSUE-KEY>`.
4. Migre workflow v1 para v2 preservando dados. Antes de trabalhar, descarregue todos os `pendingJiraEvents`; falha impede retomada.
5. Valide anexos e hashes. Mudanca material exige novo `/sdd-plan`.
6. Capture `buildStartedAt` em ISO-8601 com timezone no momento de inicio real do build, persista no `workflow.json` e registre `PHASE_STARTED` no pai com eventKey `<ISSUE>/<runId>/r<revision>/build/started`, `targetStatus: inProgress` e o horario de inicio no resumo.
7. Delegue exatamente `sdd-orchestrator` em modo BUILD. Para cada `TASK-*`, use exclusivamente `subagent_type: "sdd-implementer"`; para QA, `sdd-qa-reviewer`; para a revisao final consultiva pos-QA, `sdd-code-review`; nunca `code` ou fallback direto. Apos delegar a fase ao `sdd-orchestrator`, nao escreva `workflow.json` ate o retorno; a sequencia dos itens 8 a 13 e executada por quem estiver orquestrando.
8. Para cada tarefa delegada, siga esta sequencia:

   **Antes de delegar o agente:**
   - Capture e persista `startedAt` na entrada da tarefa no `workflow.json`.
   - Registre `TASK_STARTED` na subtarefa com `targetStatus: inProgress`.

   **Apos o retorno do agente:**
   - Capture `finishedAt` e a observacao final.
   - Registre `TASK_COMPLETED` com arquivos, validacoes e `targetStatus: done` somente quando tudo passar.

9. Por padrao o build e SEQUENCIAL: delegue uma `TASK-*` por vez, na ordem de `tasks.md`, e integre o worktree de cada tarefa na branch de trabalho atual antes de iniciar a proxima, de modo que cada tarefa parta do resultado ja consolidado da anterior. Neste modo os marcadores `[P]` sao apenas informativos e nao alteram a execucao. Habilite paralelismo somente quando `buildConcurrency` for `parallel` (flag `--parallel` do item 1): nesse caso, tarefas consecutivas marcadas `[P]` em `tasks.md` podem ser delegadas em paralelo, no maximo 3 simultaneas, cada uma em seu proprio worktree; registre `TASK_STARTED` e `startedAt` de todas antes de disparar o lote e integre os worktrees sequencialmente, na ordem das tarefas, somente depois de todo o lote retornar. Antes de disparar um lote, confirme que os `Arquivos provaveis` das tarefas do lote nao se cruzam; havendo intersecao ou qualquer duvida de isolamento, rebaixe para execucao sequencial. Conflito de merge registra `BUILD_BLOCKED` preservando os worktrees. Se uma tarefa do lote falhar, aguarde o retorno das demais, registre os resultados individuais e so entao bloqueie.
10. Depois de cada retorno, consolide evidencias no `workflow.json`, incluindo horarios explicitos por tarefa. Se o agente criou worktree isolado, integre/mergeie as alteracoes aprovadas na branch de trabalho atual antes de marcar a tarefa como concluida. Nao repita tarefa concluida; bloqueios reais devem ser registrados na subtarefa correspondente.
11. Em qualquer erro, capture `buildFinishedAt` em ISO-8601 com timezone, registre `TASK_BLOCKED` ou `TASK_FAILED` na subtarefa e `BUILD_BLOCKED` no pai; mantenha a subtarefa aberta e pare imediatamente. O comentario final do `BUILD_BLOCKED` deve informar `Inicio do build: <buildStartedAt>` e `Fim do build: <buildFinishedAt>`.
12. Para QA, capture `qa.startedAt`, registre `QA_STARTED` na subtarefa e no pai, usando `codeReview` no pai quando disponivel; delegue exclusivamente `sdd-qa-reviewer`, informando o ciclo atual (`qa.attempts + 1` de no maximo 3). Ao terminar, persista `qa.finishedAt`, `qa.attempts`, status e observacao.
12a. Em issue visual, confirme que `visualEvidence.criteria` declara todos os criterios de frontend antes das capturas. Delegue `sdd-visual-qa`, persista os metadados publicados sem remover criterios pendentes e envie o preflight observado (`visualPreflight: { available, version, tools }`) em cada `QA_PASSED` e `BUILD_COMPLETED`. O MCP verifica os hashes dos anexos antes de transicionar.
13. Em QA `FAIL` com correcoes minimas viaveis e dentro do escopo aprovado, execute um ciclo de correcao — no maximo 3 por build: incremente e persista `qa.attempts`; registre `TASK_PROGRESS` na subtarefa de QA com o ciclo `N/3` e os achados; delegue `sdd-implementer` somente com as correcoes minimas apontadas pelo QA, com a mesma disciplina de worktree e merge do item 8; repita o QA completo. Esgotados os 3 ciclos com `FAIL`, ou quando a correcao exigir mudanca de escopo, registre `QA_FAILED` na subtarefa e `BUILD_BLOCKED` no pai e pare.
14. `QA_FAILED` mantem cards abertos e bloqueia. Somente `QA_PASSED` conclui a subtask.
14a. Depois de `QA_PASSED` e antes de `BUILD_COMPLETED`, execute a revisao final de codigo **consultiva**: capture `codeReview.startedAt`, delegue exclusivamente `sdd-code-review` uma unica vez, passando a issue pai. O agente registra `CODE_REVIEW_STARTED`/`CODE_REVIEW_COMPLETED` na issue pai com achados por severidade via Open Code Review em modo delegation. Esta etapa e consultiva: qualquer resultado (`REVIEWED`, `SKIPPED` ou `BLOCKED:MCP_UNAVAILABLE`) NAO bloqueia o build e NAO dispara ciclo de correcao; achados `critical`/`high` sao alertas para analise humana. Persista `codeReview.finishedAt`, status e contagem de achados no `workflow.json`.
14b. Antes de `BUILD_COMPLETED`, confirme que todas as alteracoes dos worktrees dos agentes foram mergeadas na branch de trabalho atual e remova os worktrees temporarios criados para o build. Se algum worktree tiver alteracao nao consolidada, registre `BUILD_BLOCKED` e pare. Depois capture `buildFinishedAt` em ISO-8601 com timezone e persista no `workflow.json`.
15. Registre `BUILD_COMPLETED` seguindo esta sequencia:
    a. Capture `buildFinishedAt` em ISO-8601 com timezone. Persista no `workflow.json`.
    b. Monte o resumo textual com:
       - `Inicio do build: <buildStartedAt>` e `Fim do build: <buildFinishedAt>`
       - Uma linha por `TASK-*` com status final e observacao curta
       - Uma linha de QA com status, ciclos executados e observacao
       - Uma linha de code review com status (`REVIEWED`/`SKIPPED`) e contagem de achados por severidade
       - Validacoes executadas e observacoes gerais
    c. Chame `jira_record_sdd_event` no pai com `eventType: BUILD_COMPLETED`, `targetStatus: done`, o resumo montado em `summary` e as validacoes em `validations`. Nao inclua o campo `report`; o resumo em texto e suficiente.
    d. A notificacao Slack e enviada automaticamente pelo servidor conforme `SLACK_NOTIFY_EVENTS`; nao envie nada manualmente.
    e. Em `BUILD_BLOCKED`, nao monte o resumo completo de build; registre apenas o evento com blockers. A notificacao Slack de bloqueio tambem e automatica do servidor.

Protocolo fail-fast: nao use `run_in_background` ao delegar agentes que precisam de Jira MCP.

| Tipo de erro | Condicao | Comportamento |
|---|---|---|
| Recuperavel (1 retry) | Timeout, rede, `429`, `5xx` | Repita uma vez com o mesmo agente e `eventKey` |
| Definitivo | Tool MCP ausente, `Agent type not found`, permissao, input invalido, artefato ausente, teste ou validacao FAIL, segunda falha | Retorne `BLOCKED:MCP_UNAVAILABLE` quando a tool MCP estiver ausente; registre o evento de falha ou bloqueio da fase (`TASK_FAILED`, `PLAN_BLOCKED` ou `BUILD_BLOCKED`); adicione `pendingJiraEvents` se o Jira estiver temporariamente indisponivel; interrompa sem retry |

Nunca continue parcialmente nem implemente como fallback.

Nenhuma fase avanca sem comentario/transicao confirmados.

Nao altere escopo aprovado durante o build. Ao final, informe tarefas executadas, arquivos, comandos, evidencias, estados Jira, pendencias, worktrees removidos, `buildStartedAt` e `buildFinishedAt`.
<!-- sdd:section command.sdd-build:end -->
