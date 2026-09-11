# Revisao QA ISSUE-KEY

<!-- sdd:section specs.qa-template:start -->
## Veredito

`PASS`, `FAIL` ou `BLOCKED`.

## Criterios verificados

## Comandos executados

## Evidencias

## Gate de evidencia visual

Aplique este gate somente quando a issue tem requisito de frontend (bloco `visualEvidence` presente no workflow). Issues sem frontend ignoram esta secao.

- Cada criterio `AC-*` visual exige uma evidencia oficial (`kind = official`). Captura `exploratory` ou `failure` nao aprova o criterio.
- O QA nao atinge `PASS` sem a evidencia oficial obrigatoria, nem quando o servidor de navegador esta indisponivel, com versao abaixo de `v0.0.78` ou com tools ausentes. Nesses casos, registre o motivo e marque `BLOCKED`.
- A validacao le os arquivos por caminho seguro em `evidence/<ISSUE-KEY>/`. Caminho com `..`, symlink externo ou arquivo irregular e rejeitado com motivo.
- Nenhum anexo, comentario ou retorno expoe Base64, cookies, headers de autenticacao ou dados pessoais.
- PNG oficial acima de 10 MB permanece local, marcado para nao publicacao, e nunca sobe ao Jira.

Preencha a tabela por criterio visual:

| Criterio | Jornada | Resultado | Evidencia (anexo Jira) |
| --- | --- | --- | --- |
| `AC-XXX` | | | |

## Problemas bloqueantes

## Problemas nao bloqueantes

## Riscos residuais

Somente `PASS` autoriza conclusao da issue principal.
<!-- sdd:section specs.qa-template:end -->
