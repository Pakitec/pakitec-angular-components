# Jira Context: SCRUM-886

**Issue**: https://pakitec.atlassian.net/browse/SCRUM-886  
**Summary**: Disponibilizar componentes Angular por versão Git para migração do Pakitec Joe  
**Status**: A fazer  
**Assignee**: Unassigned  
**Branch**: `feature/scrum-886-distribuicao-github-e-migracao-joe`
**Projeto Jira/GitHub**: pakitec-angular-components

## Description

## Faltou discutir com a equipe
- Confirmar criterios de aceite finais. - Validar prioridade, prazo e impacto em outros fluxos. - Confirmar se existem regras de negocio, prototipo ou casos extremos nao descritos.
## Detalhes tecnicos gerados pelo Pakitec
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

## Acceptance Criteria

- [NEEDS CLARIFICATION] Criterios de aceite nao encontrados no Jira.

## Visao do Usuario

Disponibilizar o pakitec-angular-components exclusivamente pelo GitHub com versão fixa, sem publicar no npm, e permitir que o front pakitec-joe instale e use seus componentes.

## Prototipo

- Nenhum prototipo informado.

## Regras de Negocio

A distribuição será feita apenas pelo GitHub; consumidores devem fixar uma tag de versão.

## Detalhes Tecnicos

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

## Custom Fields

### Detalhes técnicos

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

### Visão do usuário

Disponibilizar o pakitec-angular-components exclusivamente pelo GitHub com versão fixa, sem publicar no npm, e permitir que o front pakitec-joe instale e use seus componentes.

### Projeto

pakitec-angular-components

### Regras de negócio

A distribuição será feita apenas pelo GitHub; consumidores devem fixar uma tag de versão.

### Classificação

0|i004yf:

## Attachments

- Nenhum anexo.

## Execution Contract

- A historia Jira e a fonte de escopo.
- O Codex deve implementar no projeto em `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components`.
- Antes de planejar, o campo `Projeto` do Jira deve bater com o repo GitHub carregado na IDE; se nao bater, interromper e avisar que o projeto esta errado.
- `Visao do Usuario` descreve exatamente o comportamento que o usuario precisa ter ao final da historia.
- `Prototipo` pode trazer imagem/fluxo de tela; quando houver front/app, as telas devem seguir a ideia do prototipo.
- `Regras de Negocio` sao obrigatorias para o planejamento e a implementacao; nao entregue nada que contradiga essas regras.
- `Detalhes Tecnicos` complementam o planejamento com notas do desenvolvedor da historia.
- A branch esperada e `feature/scrum-886-distribuicao-github-e-migracao-joe`.
- O arquivo `jira/subtasks.json` mapeia fases SDD para subtarefas Jira.
- Durante a execucao, comentar na subtarefa da fase atual com `pakitec_jiraPostSubtaskProgress` ao iniciar e ao concluir cada fase.
- Use `transitionTo: inProgress` ao iniciar uma fase e `transitionTo: done` ao concluir, quando as transitions estiverem disponiveis.
- Antes de concluir, executar `pakitec_validate_project_structure` no projeto e registrar o resultado na subtarefa `Review/Release`.
- Ao final, comentar no Jira resumo, arquivos alterados, validacoes e pendencias.
