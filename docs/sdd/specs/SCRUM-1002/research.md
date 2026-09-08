# Pesquisa Técnica: SCRUM-1002 — PakiSidenav

## Resumo executivo

A biblioteca já adota componentes standalone, Signals, `OnPush` e SCSS com tokens de `pakitec-theme.scss`. O componente `PakiSidenav` pode seguir os mesmos padrões dos componentes existentes, sem introduzir novas bibliotecas ou arquitetura. O principal ponto de atenção é a ausência de uma biblioteca de ícones no projeto: a implementação deve tratar o campo `icon` como string opcional e decidir como renderizá-lo.

## Caminhos e símbolos relevantes

### Especificação e gates
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/docs/sdd/specs/SCRUM-1002/spec.md` — requisitos funcionais e não funcionais.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/docs/sdd/specs/SCRUM-1002/checklist.md` — aprovação do refinement gate e da spec.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/docs/sdd/specs/SCRUM-1002/issue.md` — snapshot da issue Jira.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/docs/constitution.md` — regras de escrita, Jira e evidência visual.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/docs/sdd/templates/angular.md` — padrões de componentes, estado e testes.

### Biblioteca de componentes
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/projects/pakitec-angular-components/src/lib/components/index.ts` — barrel de exportação dos componentes.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/projects/pakitec-angular-components/src/public-api.ts` — API pública da biblioteca.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/projects/pakitec-angular-components/src/lib/components/module-tabs/paki-module-tabs.ts` — exemplo de componente com `RouterLink`/`RouterLinkActive`.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/projects/pakitec-angular-components/src/lib/components/page-header/paki-page-header.ts` — exemplo de componente simples com inputs.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/projects/pakitec-angular-components/src/lib/components/pagination/paki-pagination.ts` — exemplo de componente com `output()`.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/projects/pakitec-angular-components/src/lib/components/switch/paki-switch.ts` — exemplo de componente com `model()`.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/projects/pakitec-angular-components/src/lib/components/input/paki-input.ts` — exemplo de uso de Signals e `computed()`.

### Tema, estilo e stories
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/projects/pakitec-angular-components/src/styles/pakitec-theme.scss` — tokens de cor, borda, tipografia, sombra e raio.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/projects/pakitec-angular-components/src/stories/module-tabs.stories.ts` — exemplo de story com `provideRouter`.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/projects/pakitec-angular-components/src/stories/page-header.stories.ts` — exemplo de story com `moduleMetadata`.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/projects/pakitec-angular-components/.storybook/preview.ts` — toolbar de tema claro/escuro.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/projects/pakitec-angular-components/.storybook/main.ts` — configuração de stories e compodoc.

### Configuração de build e testes
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/angular.json` — builder de biblioteca, testes e Storybook.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/package.json` — scripts `test`, `build`, `storybook` e dependências.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/projects/pakitec-angular-components/tsconfig.lib.json` — configuração de build da biblioteca.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/projects/pakitec-angular-components/tsconfig.spec.json` — configuração de testes com Vitest.
- `/Volumes/External HD/Projetos/pakitec/pakitec-angular-components/projects/pakitec-angular-components/vitest.config.ts` — plugin do Storybook/Vitest para testes no navegador.

### Símbolos esperados do novo componente
- `PakiSidenav` — componente principal.
- `PakiSidenavItem` — interface de item de menu.
- `PakiSidenavState` — tipo ou interface do estado expandido/colapsado.
- Seletor: `paki-sidenav`.
- Pasta: `projects/pakitec-angular-components/src/lib/components/sidenav/`.
- Story: `src/stories/sidenav.stories.ts`.

## Padrões existentes no repositório

### Componentes
- Todo componente é standalone e declara `imports` no decorador.
- Todo componente novo usa `ChangeDetectionStrategy.OnPush`.
- Inputs usam `input()` ou `input.required()`.
- Outputs usam `output()` (ex.: `PakiPagination.pageChange`).
- Estados internos usam `signal()` e derivados usam `computed()`.
- Modelos de domínio ficam em `src/lib/models/`, mas interfaces pequenas e coesas também são declaradas no próprio arquivo do componente (ex.: `PakiModuleTab` em `paki-module-tabs.ts`).
- Nomes de arquivos seguem o padrão `paki-<nome>.ts`, `paki-<nome>.html`, `paki-<nome>.scss`, `paki-<nome>.spec.ts`. Componentes complexos usam sufixo `.component.ts`.

### Navegação
- `PakiModuleTabs` importa `RouterLink` e `RouterLinkActive` do `@angular/router`.
- A classe ativa recebe a classe `active` via `routerLinkActive="active"`.
- Links usam `[routerLink]="tab.route"` e `ariaCurrentWhenActive="page"`.
- O story de `PakiModuleTabs` fornece `provideRouter` via `applicationConfig` para que os links funcionem no Storybook.

### Estilo
- O tema é carregado no Storybook por `preview.ts`.
- Tokens usados pelos componentes existentes: `--color-bg-page`, `--color-bg-surface`, `--color-border-default`, `--color-border-subtle`, `--color-text-primary`, `--color-text-secondary`, `--color-text-faint`, `--color-accent`, `--color-accent-tint`, `--radius-sm`, `--radius-md`, `--shadow-card`.
- O arquivo `pakitec-theme.scss` define `:root` para o tema claro e `:root[data-theme='dark']` para o tema escuro.
- `:focus-visible` já tem estilo global no tema; componentes podem complementar, mas não precisam redefinir.

### Exportação
- `src/lib/components/index.ts` reexporta cada componente com `export * from './<pasta>/<arquivo>'`.
- `src/public-api.ts` reexporta `src/lib/components/index` e modelos.

### Testes
- Framework: Vitest com Angular TestBed (`@angular/build:unit-test`).
- Arquivos de teste ficam ao lado do arquivo testado.
- Testes usam `TestBed.configureTestingModule({ imports: [Componente] })`.
- Inputs são definidos com `fixture.componentRef.setInput('nome', valor)`.
- Outputs são assinados com `fixture.componentInstance.nomeOutput.subscribe(...)`.
- `provideRouter` é usado para testar componentes com `RouterLink`.

## Testes afetados ou relacionados

- Nenhum teste existente será modificado.
- O novo componente precisa dos seguintes testes:
  1. Renderiza estrutura vazia sem erros (`FR-001`, `SC-001`).
  2. Renderiza itens com `route` como links `RouterLink` (`FR-002`, `SC-002`).
  3. Aplica classe ativa via `RouterLinkActive` quando a rota corresponde (`FR-002`, `SC-003`).
  4. Alterna estado expandido/colapsado e emite `toggle` com o novo valor (`FR-006`, `FR-007`, `FR-008`, `SC-006`).
  5. Expande e recolhe grupos ao clicar no cabeçalho (`FR-004`, `FR-005`, `SC-007`).
  6. Verifica roles ARIA e foco visível (`NFR-006`, `SC-008`).
- Testes do Storybook serão adicionados automaticamente pelo plugin `@storybook/addon-vitest` quando a story `sidenav.stories.ts` existir.

## Integrações e dependências externas

- `@angular/router` — já dependência do projeto. Fornece `RouterLink` e `RouterLinkActive`.
- `@angular/cdk` — já dependência, mas provavelmente não será necessária para o sidenav.
- `@angular/core` — fornece `Component`, `input`, `output`, `signal`, `computed`, `ChangeDetectionStrategy`.
- `pakitec-theme.scss` — tokens visuais já existentes.
- Storybook 10 com `@storybook/angular-vite` — para documentação e testes visuais.
- Vitest + Playwright — para testes de componentes e stories.
- Não há biblioteca de ícones instalada (ex.: FontAwesome, Heroicons, Material Icons).

## Riscos identificados

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Ausência de biblioteca de ícones | O campo `icon` da interface fica sem renderer definido. | Tratar `icon` como string opcional. Renderizar como classe CSS ou `<span>`/`<svg>` inline mínimo. Documentar que o consumidor deve fornecer o próprio ícone ou classe. |
| Estado expandido/colapsado controlado externamente | Comportamento pode ficar inconsistente se a aplicação não sincronizar o input após o output. | Usar `model()` ou combinar `input()` + `output()` com nome claro (`expanded` + `toggle`). O plano técnico deve decidir a API exata. |
| Grupos independentes do estado do sidenav | A especificação exige que grupos expandam/recolham mesmo quando o sidenav está colapsado. | Manter estado dos grupos em Signals separados; não depender do estado de largura para decidir visibilidade dos filhos. |
| Larguras fixas 240 px / 64 px | Podem conflitar com layouts responsivos do consumidor. | Aplicar larguras via variáveis CSS ou classes no `:host`, permitindo override por CSS. |
| Testes com `RouterLinkActive` | Exigem configuração de rota no TestBed. | Fornecer `provideRouter` nos testes, como em `paki-module-tabs.spec.ts`. |
| Submenus além de um nível | Fora de escopo, mas dados de entrada podem conter `children` aninhados. | A implementação deve renderizar apenas um nível ou ignorar netos. A spec já define profundidade máxima de um nível. |

## Alternativas consideradas

1. **Ícones**
   - *Opção A:* Instalar biblioteca de ícones. Rejeitada: adiciona dependência externa e foge do padrão dos demais componentes.
   - *Opção B:* Renderizar `icon` como nome de classe CSS. Favorecida: permite que o consumidor use a biblioteca de ícones da aplicação.
   - *Opção C:* Usar SVG inline fixo. Rejeitada: limita o conjunto de ícones e acopla assets ao componente.

2. **Controle do estado expandido/colapsado**
   - *Opção A:* `model()` (two-way binding). Rejeitada parcialmente: a spec fala em input/output, mas `model()` já é usado em `PakiSwitch`.
   - *Opção B:* `input('expanded')` + `output('toggle')`. Favorecida: alinha-se à spec e ao exemplo de `PakiPagination`, deixando o controle explícito para a aplicação.

3. **Profundidade de submenu**
   - *Opção A:* Permitir recursão ilimitada. Rejeitada: fora de escopo e complica acessibilidade.
   - *Opção B:* Limitar a um nível e documentar. Favorecida: atende a spec e simplifica template e testes.

4. **Estrutura de arquivos**
   - Seguir o padrão simples `paki-sidenav.ts`, `paki-sidenav.html`, `paki-sidenav.scss`, `paki-sidenav.spec.ts`, sem sufixo `.component`. Favorecida: consistente com `PakiModuleTabs`, `PakiPageHeader`, `PakiPagination` e `PakiSwitch`.

## Lacunas de informação

1. **Ícones**: a spec define `icon` como string, mas não especifica o formato esperado (nome de classe, SVG path, emoji, etc.). A implementação deve documentar a convenção adotada.
2. **Eventos open/close**: a issue menciona “eventos open/close”, mas a spec usa o nome `toggle`. O plano técnico deve confirmar se haverá um único output `toggle` ou dois outputs `open`/`close`.
3. **Tokens exatos para sidenav**: não há tokens específicos de sidenav no tema. O plano técnico deve mapear os tokens genéricos (`--color-bg-surface`, `--color-border-subtle`, `--color-accent`, etc.) para as regiões do componente.
4. **Comportamento de grupos quando colapsado**: a spec diz que grupos expandem/recolhem independentemente do estado do sidenav, mas não define se o sidenav deve expandir automaticamente ao abrir um grupo. Presumimos que não, pois o estado é controlado pela aplicação.
5. **Slots ou conteúdo extra**: a spec não menciona `ng-content`, cabeçalho customizado ou rodapé. O componente inicial deve seguir a API mínima definida.
6. **Animações**: não há requisito de transição de largura ou de grupo. Caso desejado, deve ser tratado como aprimoramento futuro.
