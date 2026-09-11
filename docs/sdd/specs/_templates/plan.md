# Plano tecnico ISSUE-KEY

<!-- sdd:section specs.plan-template:start -->
## Resumo

## Constitution Check

- Padroes por stack lidos.
- Arquitetura existente preservada.
- Seguranca, testes e qualidade atendidos.
- Desvios justificados abaixo.

## Contexto tecnico

- Runtime/stack:
- Dependencias:
- Dados/storage:
- Auth/permissoes:
- Plataformas:
- Restricoes:

## Arquitetura e abordagem

### Arquivos a alterar

- `path`: motivo.

### Arquivos a criar

- `path`: responsabilidade.

## Contratos e dados

### Evidencia visual (opcional)

Preencha esta subsecao somente quando a issue tem requisito de frontend. O bloco `visualEvidence` no workflow e opcional; issues sem frontend nao dependem do servidor de navegador e mantem o comportamento atual.

- No planejamento, declare todos os criterios visuais em `visualEvidence.criteria`, inicialmente como `{ "criteriaId": "AC-001" }`. Apos publicar, complete hash e metadados do anexo. Nunca use uma lista vazia para dispensar o QA visual.
- Informe `visualEvidence.manifestPath` se o manifesto tiver nome alternativo dentro da raiz da issue.
- Em `QA_PASSED` e `BUILD_COMPLETED`, envie o preflight observado pelo cliente no argumento `visualPreflight: { available, version, tools }`.
- Manifesto em `evidence/<ISSUE-KEY>/manifest.json` lista cada evidencia com `criteriaId`, `kind`, `status`, `viewport`, `file`, `mimeType`, `size`, `sha256` e `containsSensitiveData`.
- Somente PNG oficial (`kind = official`) de ate 10 MB e publicado no Jira, com nome deterministico (`SCRUM-XXX-AC-001-desktop.png`).
- A publicacao retorna apenas metadados (identificador, nome, hash, criterio) e adiciona um comentario com tabela; nunca expoe Base64.

## Seguranca e privacidade

- Se a issue tem evidencia visual: leia os arquivos por caminho seguro em `evidence/<ISSUE-KEY>/`, confira SHA-256, tamanho e MIME, e bloqueie evidencia marcada como sensivel. Nenhum retorno expoe Base64.

## Observabilidade

## Etapas de implementacao

## Estrategia de testes

## Rollout e rollback

## Riscos e mitigacoes

## Complexity Tracking

| Desvio | Necessidade | Alternativa simples rejeitada |
| --- | --- | --- |
| N/A | N/A | N/A |

## Gate de execucao

Defina condicoes objetivas para `READY_TO_BUILD`; nenhuma pergunta de produto pode ser resolvida no plano.
<!-- sdd:section specs.plan-template:end -->
