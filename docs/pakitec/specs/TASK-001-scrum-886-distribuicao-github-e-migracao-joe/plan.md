# Implementation Plan: distribuicao-github-e-migracao-joe

**Feature ID**: `TASK-001`  
**Jira Issue**: `SCRUM-886`  
**Spec**: `spec.md`  
**Stack**: `node`
**Projeto Jira/GitHub**: pakitec-angular-components

## Contexto

Implementar a historia Jira `SCRUM-886` seguindo o contexto Pakitec do projeto:

- `AGENTS.md`
- `docs/pakitec-project-context.md`
- `docs/pakitec/constitution.md`
- `docs/pakitec/specs/TASK-001-scrum-886-distribuicao-github-e-migracao-joe/jira-context.md`

## Abordagem

1. Confirmar que `Projeto` do Jira bate com o repo GitHub carregado na IDE; se nao bater, interromper.
2. Ler historia, criterios de aceite, `Visao do Usuario`, `Prototipo`, `Regras de Negocio`, `Detalhes Tecnicos` e anexos.
3. Mapear arquivos impactados antes de editar codigo.
4. Implementar em passos pequenos, preservando padroes locais.
5. Conferir o comportamento entregue contra `Visao do Usuario` e `Regras de Negocio`.
6. Rodar testes/lints relevantes.
7. Atualizar Jira com progresso, validacoes e pendencias.

## Contexto Jira para Planejamento

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

## Areas Impactadas

- [Definir apos inspecao do projeto.]

## Validacoes

- [Definir comandos reais do projeto.]
- `pakitec_validate_project_structure` quando houver mudanca estrutural.

## Riscos

- Campo customizado ou anexo pode conter requisito nao refletido na descricao principal.
- Implementar no projeto errado invalida a entrega; conferir o repo antes de planejar.
- Prototipo pode ser opcional, mas quando existir deve guiar telas/fluxos de front ou app.
- Status/transitions do Jira podem variar por projeto.
- Subtasks geradas sao fases SDD e podem precisar de detalhamento adicional durante a implementacao.
