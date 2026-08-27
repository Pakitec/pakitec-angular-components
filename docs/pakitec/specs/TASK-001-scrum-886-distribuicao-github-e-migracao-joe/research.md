# Research: distribuicao-github-e-migracao-joe

**Feature ID**: `TASK-001`  
**Jira Issue**: `SCRUM-886`

## Jira Source

- URL: https://pakitec.atlassian.net/browse/SCRUM-886
- Status inicial: A fazer
- Assignee: Unassigned
- Projeto Jira/GitHub: pakitec-angular-components
- Labels:
- angular
- github-package
- pakitec-task

## Campos de Produto/Tecnicos

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

## Decisoes

- [Registrar decisoes tecnicas tomadas durante a implementacao.]

## Perguntas Pendentes

- [Registrar duvidas que precisam voltar para o Jira/produto.]

## Referencias

- `jira-context.md`
- `spec.md`
- `plan.md`
- Anexos em `jira/attachments/`
