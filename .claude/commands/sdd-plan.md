---
description: Especificar e planejar uma issue Jira com agentes SDD, sem implementar codigo.
argument-hint: <ISSUE-KEY>
allowed-tools: Read, Glob, Grep, Bash, Write, Edit, Agent, mcp__pakitec-cloud-mcp__jira_get_workspace_binding, mcp__pakitec-cloud-mcp__jira_list_profiles, mcp__pakitec-cloud-mcp__jira_bind_workspace, mcp__pakitec-cloud-mcp__jira_get_issue, mcp__pakitec-cloud-mcp__jira_list_attachments, mcp__pakitec-cloud-mcp__jira_read_attachment, mcp__pakitec-cloud-mcp__jira_create_subtask, mcp__pakitec-cloud-mcp__jira_edit_task, mcp__pakitec-cloud-mcp__jira_record_sdd_event, jira_get_workspace_binding, jira_list_profiles, jira_bind_workspace, jira_get_issue, jira_list_attachments, jira_read_attachment, jira_create_subtask, jira_edit_task, jira_record_sdd_event
---

<!-- sdd:section command.sdd-plan:start -->
Voce esta executando `/sdd-plan` para planejar uma issue Jira. Entrada: `$ARGUMENTS`.

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

1. Extraia exatamente uma chave no formato `PROJ-123`. Se estiver ausente ou ambigua, pergunte antes de continuar. Antes do `JIRA_GATE`, execute a descoberta de peers do bloco multi-projeto: se a chave pertencer a um grupo, aplique o FANOUT e planeje cada membro, na `order`, executando as regras abaixo por completo dentro do workspace de cada membro; caso contrario, siga em MODO SINGLE sem alteracao.
2. Execute o `JIRA_GATE` antes de criar ou alterar `docs/sdd/specs`: chame `jira_get_workspace_binding`. Se nao houver vinculo, liste perfis, pergunte qual perfil/projeto usar, vincule e valide novamente. Sem contexto Jira valido, encerre sem gerar planejamento local.
3. Execute o checkpoint inicial na seguinte sequencia:
   a. Leia a issue com `jira_get_issue`. Recuse se o projeto nao corresponder ao binding.
   b. Calcule um hash normalizado dos campos principais da issue.
   c. Chame `jira_record_sdd_event` no pai com `eventKey: <ISSUE>/plan/<hash12>/started`, `eventType: PLAN_STARTED`, `targetStatus: inProgress` e o proximo passo.
   d. Falha neste checkpoint bloqueia o comando. Nao prossiga.
4. Consulte anexos. Nesta fase, leia os relevantes diretamente do Jira apenas para avaliacao; nao crie diretorio, asset, spec, workflow ou subtarefa.
5. Leia `.claude/agents/sdd-refinement-reviewer.md` e delegue usando exatamente `subagent_type: "sdd-refinement-reviewer"`. Nunca use `code`, `developer` ou agente generico.
6. Se o veredito for `BLOCKED`, registre `PLAN_BLOCKED` no pai com a mesma revisao, blockers e proximo passo; pare antes de qualquer escrita local ou subtarefa.
7. Para refinar, colete respostas do usuario e mostre um patch Jira proposto. Somente apos confirmacao explicita use `jira_edit_task`; depois releia a issue e repita o `REFINEMENT_GATE` completo. Resposta em chat sem persistencia no Jira nao libera o planejamento.
8. O gate so passa com zero blockers, zero `NEEDS CLARIFICATION`, criterios verificaveis e anexos obrigatorios acessiveis. Warnings aceitos devem virar premissas explicitas e reversiveis.
9. Somente apos `REFINEMENT_GATE: PASS`, leia os padroes e crie/retome a pasta. Inicialize ou migre `workflow.json` schema v2 com `runId`, `planRevision`, `attempts`, `eventLedger` e `pendingJiraEvents`.
10. Execute `ATTACHMENT_INGEST`: baixe todos os anexos listados para `assets/`. Use `<attachmentId>-<nome-saneado>`, removendo diretorios, controles e caracteres fora de `[A-Za-z0-9._-]`; nunca sobrescreva IDs diferentes.
11. Grave texto em UTF-8 e decodifique binarios Base64 sem imprimir conteudo em logs. Calcule SHA-256 e gere `assets/manifest.json` com ID, nome original, path relativo, MIME, tamanhos, hash, status e erro seguro. Nunca execute anexos.
12. Antes dos agentes, delegue exatamente `sdd-jira-coordinator` para criar/reconciliar `[SDD][SPEC] Specification`, `[SDD][RESEARCH] Technical Research` e `[SDD][PLAN] Technical Plan`.
13. Leia `sdd-orchestrator.md` e delegue exatamente `sdd-orchestrator` em modo PLAN. Para cada agente, o orquestrador deve transicionar/comentar a subtarefa com `TASK_STARTED` antes da chamada e `TASK_COMPLETED` somente apos artefato/check aprovado.14. A sequencia exata e `sdd-spec-writer`, `sdd-researcher`, `sdd-planner`; depois `sdd-jira-coordinator` reconcilia as `TASK-*` e a subtarefa `[SDD][QA] Quality Review`, cuja chave confirmada e registrada em `qa.issueKey`. Spec com `NEEDS CLARIFICATION` registra falha e volta ao refinement.
15. Nao edite codigo, nao crie branch e nao invoque implementador ou QA neste comando.
16. Grave `phase: "READY_TO_BUILD"` somente com refinement PASS, checklist PASS, documentos completos, hashes consistentes e subtarefas reconciliadas.

Protocolo fail-fast: nao use `run_in_background` ao delegar agentes que precisam de Jira MCP.

| Tipo de erro | Condicao | Comportamento |
|---|---|---|
| Recuperavel (1 retry) | Timeout, rede, `429`, `5xx` | Repita uma vez com o mesmo agente e `eventKey` |
| Definitivo | Tool MCP ausente, `Agent type not found`, permissao, input invalido, artefato ausente, teste ou validacao FAIL, segunda falha | Retorne `BLOCKED:MCP_UNAVAILABLE` quando a tool MCP estiver ausente; registre o evento de falha ou bloqueio da fase (`TASK_FAILED`, `PLAN_BLOCKED` ou `BUILD_BLOCKED`); adicione `pendingJiraEvents` se o Jira estiver temporariamente indisponivel; interrompa sem retry |

Nunca continue parcialmente nem implemente como fallback.
<!-- sdd:section command.sdd-plan:end -->
