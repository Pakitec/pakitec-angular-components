# Tarefas ISSUE-KEY

<!-- sdd:section specs.tasks-template:start -->
## Formato

`TASK-ID [P?] [US-ID] Descricao com path exato`

`[P]` marca execucao paralela potencialmente segura: arquivos diferentes e nenhuma dependencia pendente. O build so honra `[P]` quando iniciado com `--parallel`; por padrao a execucao e sequencial e `[P]` e apenas informativo.

## Fase 1 - Setup/Fundacao

Inclua somente o necessario para desbloquear jornadas.

## Fase 2 - US-001 (P1)

**Objetivo**: valor isolado da jornada.  
**Teste independente**: validacao da jornada sem depender das posteriores.

### Testes

- [ ] `TASK-001 [P] [US-001]` Criar teste em `path/exato`.

### Implementacao

- [ ] `TASK-002 [US-001]` Implementar comportamento em `path/exato`.

**Checkpoint**: US-001 funciona e pode ser demonstrada isoladamente.

## Fases seguintes

Repita por `US-*` em ordem de prioridade, preservando checkpoints anteriores.

## Evidencia visual (quando aplicavel)

Inclua tarefas de evidencia visual somente quando a issue tem requisito de frontend. Cada criterio `AC-*` visual precisa de uma evidencia oficial validada por caminho seguro e publicada sem Base64. O gate de QA bloqueia `QA_PASSED` sem a evidencia oficial obrigatoria ou com o servidor de navegador incompativel. Issues sem frontend ignoram esta secao.

## Fase final - Polish e validacao

- [ ] Executar comandos do plano.
- [ ] Confirmar estrutura, documentacao e ausencia de overengineering.
- [ ] Quando houver requisito visual, confirmar evidencia oficial publicada e gate de QA satisfeito.

## Contrato de cada tarefa

- Tipo: implementation | test | documentation | qa
- Ownership: agente responsavel
- Requisitos: `FR-*`, `NFR-*`
- Criterios: `AC-*`
- Dependencias: nenhuma
- Arquivos provaveis:
- Objetivo:
- Validacao:
- Subtarefa Jira: pendente
- Estado: pending

Cada tarefa deve ser pequena o suficiente para execucao sem redesenhar o plano. Nenhuma tarefa pode esconder decisao de produto.
<!-- sdd:section specs.tasks-template:end -->
