# Tasks: distribuicao-github-e-migracao-joe

**Feature ID**: `TASK-001`  
**Jira Issue**: `SCRUM-886`  
**Branch**: `feature/scrum-886-distribuicao-github-e-migracao-joe`  
**Projeto Jira/GitHub**: pakitec-angular-components
**Input**: `spec.md`, `plan.md`, `jira-context.md`

## Phase 1: SDD Mapping

- [ ] T001 Ler `AGENTS.md`, `docs/pakitec-project-context.md` e `docs/pakitec/constitution.md`.
- [ ] T002 Confirmar que o campo `Projeto` do Jira bate com o repo GitHub carregado na IDE; se nao bater, interromper e informar que o projeto esta errado.
- [ ] T003 Revisar `jira-context.md`, anexos, criterios de aceite e campos `Visao do Usuario`, `Prototipo`, `Regras de Negocio` e `Detalhes Tecnicos`.
- [ ] T004 Confirmar arquivos impactados no projeto antes de editar.

## Phase 2: Implementation

- [ ] T010 Implementar a historia `SCRUM-886` seguindo os padroes locais.
- [ ] T011 Garantir que a entrega atende exatamente a necessidade descrita em `Visao do Usuario`.
- [ ] T012 Para front/app, desenhar telas e fluxos seguindo `Prototipo` quando ele existir.
- [ ] T013 Implementar somente comportamento compativel com `Regras de Negocio`.
- [ ] T014 Usar `Detalhes Tecnicos` para orientar arquivos, APIs, modelos, migracoes ou integracoes.
- [ ] T015 Tratar loading, erro, vazio e permissao quando aplicavel.

## Phase 3: Validation

- [ ] T020 Rodar testes/lints/checks definidos em `plan.md`.
- [ ] T021 Validar manualmente os criterios de aceite.
- [ ] T022 Comparar o que foi feito com `Visao do Usuario` e registrar se o comportamento bate com o pedido.
- [ ] T023 Conferir que nenhuma `Regra de Negocio` foi violada.
- [ ] T024 Executar `pakitec_validate_project_structure` para este projeto.
- [ ] T025 Registrar no Jira arquivos alterados, validacoes, comparacao com `Visao do Usuario`, resultado de `pakitec_validate_project_structure` e pendencias.

## Notes

- Use a branch `feature/scrum-886-distribuicao-github-e-migracao-joe`.
- Nao marque a historia como concluida sem evidencia de validacao.
- Se houver duvida de escopo, comente no Jira antes de expandir a implementacao.
