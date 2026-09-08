---
description: Refinar e criar uma Task no Jira conectado ao projeto.
argument-hint: <pedido da tarefa>
allowed-tools: Read, Glob, Grep, mcp__pakitec-cloud-mcp__jira_get_workspace_binding, mcp__pakitec-cloud-mcp__jira_list_profiles, mcp__pakitec-cloud-mcp__jira_bind_workspace, mcp__pakitec-cloud-mcp__jira_create_task, mcp__pakitec-cloud-mcp__jira_link_issues, jira_get_workspace_binding, jira_list_profiles, jira_bind_workspace, jira_create_task, jira_link_issues
---

<!-- sdd:section command.sdd-task:start -->
Voce esta executando o comando `/sdd-task`.

Objetivo: transformar o pedido do usuario em uma Task Jira clara, verificavel e pronta para planejamento usando as tools Jira do MCP.

Entrada do usuario:

$ARGUMENTS

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

Fluxo obrigatorio:

1. Execute o `JIRA_GATE`: identifique o `workspacePath` e chame `jira_get_workspace_binding` antes de analisar o pedido ou escrever qualquer arquivo. Em seguida execute o `MULTI_GATE`.
2. Se nao houver vinculo, liste os perfis com `jira_list_profiles`, pergunte qual perfil e projeto usar e chame `jira_bind_workspace`. Nao escolha um Jira por conta propria.
3. Chame `jira_get_workspace_binding` novamente. Prossiga somente depois de receber perfil habilitado, projeto e `customFieldMap`. Se a vinculacao falhar ou for recusada, encerre sem criar rascunho local ou issue.
4. Leia `docs/constitution.md` e os templates obrigatorios. Use exclusivamente o contexto Jira validado para este workspace.
5. Inspecione apenas o contexto necessario do projeto para identificar stack, componentes afetados, restricoes, integracoes e comandos de validacao.
6. Separe fatos fornecidos de inferencias. Nunca invente regra de negocio, prazo, comportamento ou decisao de produto.
7. Prepare um titulo objetivo, ator/problema/resultado, escopo e de dois a cinco criterios de aceite observaveis em Dado/Quando/Entao. Antecipe regras, permissoes, erros, dados e integracoes relevantes para reduzir bloqueios no `/sdd-plan`.
8. Verifique e apresente possiveis problemas: ambiguidades, regras ausentes, cenarios de erro, permissoes, seguranca, dados, integracoes, observabilidade, migracao e impacto em compatibilidade.
9. Registre perguntas e decisoes pendentes na descricao em `Faltou discutir com a equipe`. Campos sem resposta nao devem ser preenchidos com fatos inventados.
10. Para campos personalizados, consulte `jiraProfile.customFieldMap` do contexto retornado. Passe em `fields` apenas nomes logicos existentes nesse mapa; o MCP converte esses nomes para os IDs `customfield_*` do Jira conectado. Use o argumento dedicado `acceptanceCriteria` quando esse alias estiver configurado.
11. Mostre ao usuario o payload final resumido e solicite confirmacao explicita antes de qualquer escrita no Jira.
12. Somente apos a confirmacao, chame `jira_create_task` com `workspacePath`, `summary`, `description`, `acceptanceCriteria` e `fields` aplicaveis ao perfil conectado.
13. Ao final, informe chave Jira, campos preenchidos, campos nao configurados, pendencias registradas e sugira `/sdd-plan <ISSUE-KEY>`.

MODO MULTI (somente quando o `MULTI_GATE` confirmou dois ou mais projetos e o usuario aprovou distribuir a feature):

M1. Defina um `groupId` no formato `grp-<YYYYMMDD>-<slug-curto>` derivado do pedido.
M2. Para cada membro aprovado, refine uma task com escopo proprio daquele projeto: reaproveite os passos 4 a 10 usando o `workspacePath` e o contexto Jira daquele membro. Backend concentra API, dados e regras; frontend concentra UI e integracao; bibliotecas concentram componentes reutilizaveis. Nunca duplique o mesmo escopo em projetos diferentes.
M3. Mostre um unico payload consolidado com todas as tasks propostas (uma por projeto) e solicite UMA confirmacao explicita para o conjunto.
M4. Somente apos a confirmacao, crie as tasks na ordem definida chamando `jira_create_task` por membro, cada uma com seu `workspacePath` e incluindo `fields.labels` com o valor `sdd-group:<groupId>`. Colete as chaves retornadas.
M5. Depois que TODAS as chaves foram confirmadas, crie os links nativos entre as tasks do grupo: para cada par distinto, chame `jira_link_issues` com o `workspacePath` da issue de origem, `issueKey` da origem e `targetIssueKey` do par, usando `linkType: "Relates"`. Basta um link por par (o Jira registra os dois sentidos). Falha de link nao apaga tasks ja criadas: relate o par que ficou sem link e siga.
M6. Depois dos links, grave o `group.json` identico em `docs/sdd/specs/<ISSUE-KEY>/group.json` de cada membro, conforme o esquema do bloco multi-projeto. Nao grave nenhum `group.json` antes de ter todas as chaves.
M7. Ao final, liste as chaves criadas por projeto, o `groupId`, os labels aplicados, os links criados e sugira `/sdd-plan <qualquer-chave-do-grupo>`. Qualquer falha de criacao de task interrompe o conjunto: relate o que ja foi criado, nao grave `group.json` parcial e nao invente vinculos.

Nao crie subtarefas, nao altere status e nao inicie implementacao neste comando.
<!-- sdd:section command.sdd-task:end -->
