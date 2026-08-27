# Pakitec Build Handoff: SCRUM-886 - distribuicao-github-e-migracao-joe

Voce esta no projeto `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components`, na branch `feature/scrum-886-distribuicao-github-e-migracao-joe`.

Este arquivo foi gerado pelo `pakitec_plan`. Ele e um pacote de contexto para uma execucao futura, nao uma ordem para iniciar desenvolvimento agora.

Nao implemente esta historia apenas porque este arquivo foi criado. Para iniciar desenvolvimento com agentes, execute `pakitec_build` separadamente para a issue `SCRUM-886`.

Quando `pakitec_build` for chamado, use estes arquivos como fonte:

- `docs/pakitec/specs/TASK-001-scrum-886-distribuicao-github-e-migracao-joe/jira-context.md`
- `docs/pakitec/specs/TASK-001-scrum-886-distribuicao-github-e-migracao-joe/jira-subtasks.md`
- `docs/pakitec/specs/TASK-001-scrum-886-distribuicao-github-e-migracao-joe/jira/subtasks.json`
- `docs/pakitec/specs/TASK-001-scrum-886-distribuicao-github-e-migracao-joe/spec.md`
- `docs/pakitec/specs/TASK-001-scrum-886-distribuicao-github-e-migracao-joe/plan.md`
- `docs/pakitec/specs/TASK-001-scrum-886-distribuicao-github-e-migracao-joe/tasks.md`
- `docs/pakitec/specs/TASK-001-scrum-886-distribuicao-github-e-migracao-joe/research.md`

## Jira SDD Subtasks

- Spec: SCRUM-887 | SDD Spec | https://pakitec.atlassian.net/browse/SCRUM-887
- Plan: SCRUM-888 | SDD Plan | https://pakitec.atlassian.net/browse/SCRUM-888
- Implementation: SCRUM-889 | Implementacao | https://pakitec.atlassian.net/browse/SCRUM-889
- Tests: SCRUM-890 | Testes e validacao | https://pakitec.atlassian.net/browse/SCRUM-890
- Review/Release: SCRUM-891 | Review e entrega | https://pakitec.atlassian.net/browse/SCRUM-891

Antes de editar:

1. Leia `AGENTS.md`, `docs/pakitec-project-context.md` e `docs/pakitec/constitution.md`.
2. Confirme que o campo `Projeto` do Jira (`pakitec-angular-components`) bate com o repo GitHub carregado na IDE; se nao bater, interrompa e informe que o projeto esta errado.
3. Leia a historia, criterios de aceite, `Visao do Usuario`, `Prototipo`, `Regras de Negocio`, `Detalhes Tecnicos`, campos customizados e anexos.
4. Mapeie os arquivos impactados e atualize `plan.md`/`tasks.md` se necessario.

## Campos Jira obrigatorios para o planejamento e build

### Visao do Usuario

Disponibilizar o pakitec-angular-components exclusivamente pelo GitHub com versão fixa, sem publicar no npm, e permitir que o front pakitec-joe instale e use seus componentes.

### Prototipo

- Nenhum prototipo informado.

### Regras de Negocio

A distribuição será feita apenas pelo GitHub; consumidores devem fixar uma tag de versão.

### Detalhes Tecnicos

Projeto carregado: pakitec-angular-components Path local analisado: /Volumes/External HD/Projetos/pakitec/pakitec-angular-components Stack inferida: node Estrutura observada: - projects Arquivos relevantes encontrados: - README.md - package.json - projects/pakitec-angular-components/.storybook/tsconfig.json - projects/pakitec-angular-components/README.md - projects/pakitec-angular-components/package.json - tsconfig.json
Node/package snapshot: package: pakitec-angular-components scripts: ng, start, build, watch, test, storybook, build-storybook dependencies: @angular/cdk, @angular/common, @angular/compiler, @angular/core, @angular/forms, @angular/platform-browser, @angular/router, rxjs, tslib devDependencies: @analogjs/vite-plugin-angular, @angular-devkit/architect, @angular-devkit/build-angular, @angular-devkit/core, @angular/animations, @angular/build, @angular/cli, @angular/compiler-cli, @chromatic-com/storybook, @compodoc/compodoc, @storybook/addon-a11y, @storybook/addon-docs, @storybook/addon-onboarding, @storybook/addon-vitest, @storybook/angular-vite
README snapshot: # Pakitec Angular Components
Biblioteca Angular 22 com os componentes e tokens visuais reutilizáveis do Pakitec Amora.
Catálogo visual: https://leonardoaa.github.io/pakitec-angular-components/
## Uso
```bash npm install pakitec-angular-components ```
Importe o tema global no `styles.scss` da aplicação:
```scss @use 'pakitec-angular-components/styles/pakitec-theme'; ```
Os componentes são standalone e podem ser importados diretamente:
```ts import { PakiButton, PakiInput } from 'pakitec-angular-components'; ```
## Storybook
```bash npm run storybook npm run build-storybook ```
O toolbar do Storybook permite alternar entre os temas claro e escuro.
## Componentes
- Badge - Button - Card - Combobox - Date - Input - Module tabs - Page header - Pagination - Select - Switch - Textarea Leitura tecnica inicial: - A implementacao deve partir do projeto 'pakitec-angular-components' e preservar os padroes locais detectados. - A demanda do usuario deve ser refinada em criterio de aceite antes de iniciar desenvolvimento. - Antes de executar, rodar pakitec_plan na issue criada para gerar TASK local, branch e contexto de implementacao.
Notas tecnicas informadas no prompt: Configurar o pacote raiz para build durante instalação Git e expor o bundle Angular e o tema SCSS gerados pelo ng-packagr. Prompt original resumido: Disponibilizar o pakitec-angular-components exclusivamente pelo GitHub com versão fixa, sem publicar no npm, e permitir que o front pakitec-joe instale e use seus componentes.

Durante a execucao iniciada por `pakitec_build`:

- Preserve os padroes do projeto.
- Nao implemente escopo fora da historia Jira sem registrar decisao.
- Para front/app, quando `Prototipo` trouxer imagem ou fluxo de tela, desenhe a UI seguindo a ideia dele.
- Nao entregue comportamento que contrarie `Regras de Negocio`.
- Atualize `tasks.md` conforme concluir etapas.
- E obrigatorio atualizar a subtarefa Jira da fase atual ao iniciar e ao concluir cada fase SDD.
- Para iniciar uma fase, chame `pakitec_jiraPostSubtaskProgress` com `taskDirectory` apontando para `docs/pakitec/specs/TASK-001-scrum-886-distribuicao-github-e-migracao-joe`, `phase` igual a `Spec`, `Plan`, `Implementation`, `Tests` ou `Review/Release`, `summary` descrevendo o inicio do trabalho e `transitionTo` como `inProgress` quando a transition estiver disponivel.
- Para concluir uma fase, chame `pakitec_jiraPostSubtaskProgress` novamente com resumo do que foi feito, arquivos alterados, validacoes executadas, bloqueios/pendencias e `transitionTo` como `done` quando a fase estiver realmente concluida.
- Se a fase bloquear por falta de informacao, comente na subtarefa correspondente com `blockers` preenchido e nao avance para a proxima fase sem registrar a decisao.
- Use `pakitec_jiraPostProgress` apenas para comentarios gerais na historia principal.

Antes de finalizar:

- Rode testes/lints/checks adequados ao projeto.
- Na fase `Tests`, se o projeto tiver Flutter Web, Angular, React/Vite ou Swagger/OpenAPI configurado, chame `pakitec_qaCollectWebEvidence` com `projectPath`, `taskDirectory` e `phase: "Tests"` para tentar rodar localmente, capturar prints e anexar evidencias na subtarefa Jira. Se a coleta falhar por falta de browser automation ou upload, registre o fallback; se o app nao rodar, avalie como bug de QA.
- Compare o que foi feito com `Visao do Usuario` e registre se o comportamento entregue bate com o que o usuario queria.
- Execute obrigatoriamente `pakitec_validate_project_structure` para o `projectPath` e `stack` desta tarefa antes de considerar a entrega concluida.
- Se `pakitec_validate_project_structure` retornar violacoes, corrija ou registre explicitamente o motivo antes de finalizar.
- Registre validacoes executadas.
- Garanta que as subtarefas `Spec`, `Plan`, `Implementation`, `Tests` e `Review/Release` tenham comentario final atualizado.
- No comentario final da subtarefa `Review/Release`, inclua o resultado de `pakitec_validate_project_structure`.
- Comente na historia principal apenas o resumo final, arquivos alterados, validacoes, comparacao com `Visao do Usuario`, resultado de `pakitec_validate_project_structure` e pendencias.
