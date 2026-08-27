# Feature Specification: distribuicao-github-e-migracao-joe

**Feature ID**: `TASK-001`  
**Jira Issue**: `SCRUM-886`  
**Stack**: `node`  
**Status**: Draft  
**Created**: 2026-08-27  
**Source**: https://pakitec.atlassian.net/browse/SCRUM-886
**Projeto Jira/GitHub**: pakitec-angular-components

## Objetivo

Disponibilizar componentes Angular por versão Git para migração do Pakitec Joe

## Historia Jira

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

## Criterios de Aceite

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

## Campos Customizados

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

## Anexos

- Nenhum anexo.

## Requisitos Funcionais

- **FR-001**: Implementar o comportamento descrito na historia `SCRUM-886`.
- **FR-002**: Entregar exatamente a necessidade descrita em `Visao do Usuario`.
- **FR-003**: Seguir o `Prototipo` quando houver telas/fluxos de front ou app.
- **FR-004**: Cumprir todas as `Regras de Negocio` sem criar comportamento contraditorio.
- **FR-005**: Considerar os `Detalhes Tecnicos` no planejamento e preservar compatibilidade com os fluxos existentes do projeto.

## Edge Cases

- Dados incompletos ou antigos relacionados a historia.
- Falha de rede/API quando o fluxo depender de integracoes externas.
- Usuario sem permissao para executar a acao principal.

## Criterios de Sucesso

- **SC-001**: Todos os criterios de aceite da historia Jira foram atendidos.
- **SC-002**: Testes/validacoes definidos em `plan.md` foram executados.
- **SC-003**: O comportamento entregue foi comparado com `Visao do Usuario` antes da conclusao.
- **SC-004**: Jira recebeu comentario final com resumo, validacoes e pendencias.

## Fora de Escopo

- Mudancas nao descritas na historia Jira ou nos comentarios/criterios aceitos.

## Assumptions

- A historia Jira e a fonte oficial de escopo.
- O campo `Projeto` deve bater com o repo GitHub carregado antes de qualquer planejamento.
- Campos customizados e anexos complementam, mas nao substituem, os criterios de aceite.
