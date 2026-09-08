# Feature Specification: SCRUM-1002

<!-- sdd:section specs.spec-template:start -->
**Issue**: `SCRUM-1002`
**Status**: Draft
**Input**: Jira validado pelo refinement gate `1574e56fa566`

## Objetivo

Disponibilizar na biblioteca `pakitec-angular-components` um componente de navegacao lateral chamado `paki-sidenav`.
O componente permite que desenvolvedores montem layouts de aplicacao com a mesma identidade visual dos demais componentes Pakitec.
Ele oferece itens de menu simples, grupos com submenus e controle de largura expandido/colapsado.

## Usuarios e Cenarios

### US-001 - Navegar entre modulos (P1)

Como desenvolvedor(a) frontend, quero incluir links de navegacao no sidenav para que o usuario acesse modulos da aplicacao.

**Por que P1**: a navegacao basica e o valor principal do componente.
Sem ela, o sidenav nao cumpre seu proposito.

**Teste independente**: renderizar `paki-sidenav` com uma lista de itens que contenham `label` e `route` e verificar que cada item e um link navegavel com `RouterLink`.

**Cenarios de aceite**:

1. `AC-001` — **Dado** que o desenvolvedor importa o componente da biblioteca, **quando** renderiza `<paki-sidenav>` sem itens, **entao** o componente monta a estrutura de navegacao lateral sem erros.
2. `AC-002` — **Dado** uma lista de itens com `label` e `route`, **quando** o componente recebe essa lista por input, **entao** renderiza cada item como link navegavel utilizando `RouterLink`.
3. `AC-003` — **Dado** que o usuario acessa uma rota presente no sidenav, **quando** a rota corresponde a um item, **entao** o item ativo recebe o estilo visual de selecao via `RouterLinkActive`.

### US-002 - Visualizar grupos e submenus (P1)

Como desenvolvedor(a) frontend, quero agrupar itens de menu para que o usuario possa expandir ou recolher submenus.

**Por que P1**: agrupamentos organizam navegacoes grandes e sao requisito de negocio confirmado.

**Teste independente**: fornecer um item com `children` e verificar que o clique no grupo alterna a visibilidade dos filhos.

**Cenarios de aceite**:

1. `AC-007` — **Dado** um item de menu com filhos, **quando** o usuario clica no grupo, **entao** o grupo expande/recolhe e mostra/oculta os itens filhos.

### US-003 - Ajustar largura do sidenav (P2)

Como desenvolvedor(a) frontend, quero controlar o estado expandido/colapsado do sidenav para que a aplicacao adapte o layout ao contexto.

**Por que P2**: o controle externo de largura e necessario, mas depende da jornada de navegacao ja existir.

**Teste independente**: passar `expanded=true`, disparar a alternancia e verificar que o componente emite o novo valor e atualiza a largura.

**Cenarios de aceite**:

1. `AC-006` — **Dado** que a aplicacao passa o input `expanded=true`, **quando** o usuario alterna o estado, **entao** o componente emite o evento `toggle` com o novo valor e atualiza a largura do sidenav.

## Requisitos funcionais

- `FR-001`: O componente renderiza uma lista de itens de navegacao recebida por input.
- `FR-002`: Cada item com `route` usa `RouterLink` e `RouterLinkActive` para indicar o item ativo.
- `FR-003`: Itens podem ter um icone opcional e um label obrigatorio.
- `FR-004`: Itens podem ter filhos e funcionar como grupo expansivel/recolhivel.
- `FR-005`: A profundidade de submenu e limitada a um nivel.
- `FR-006`: O sidenav suporta os estados expandido e colapsado.
- `FR-007`: O estado expandido/colapsado e controlado pela aplicacao via input/output.
- `FR-008`: O componente emite eventos open/close quando o estado muda.
- `FR-009`: A largura do sidenav e 240 px no estado expandido e 64 px no estado colapsado.
- `FR-010`: O componente e exportado em `src/lib/components/index.ts` e `src/public-api.ts`.
- `FR-011`: O componente oferece story no Storybook.

## Requisitos nao funcionais

- `NFR-001`: O componente e standalone e usa `ChangeDetectionStrategy.OnPush`.
- `NFR-002`: O estado interno usa Signals.
- `NFR-003`: O estilo usa SCSS e tokens de `pakitec-theme.scss` para claro e escuro.
- `NFR-004`: O componente possui testes unitarios.
- `NFR-005`: A execucao de `npm run test` e `npm run build` finaliza com sucesso.
- `NFR-006`: A navegacao por teclado expoe roles ARIA e foco visivel adequados.

## Entidades e Dados

- `PakiSidenavItem`
  - `label`: string obrigatoria. Texto do item.
  - `route`: string opcional. Rota usada com `RouterLink`.
  - `icon`: string opcional. Nome do icone a exibir.
  - `expanded`: boolean opcional. Estado inicial do grupo.
  - `children`: array opcional de `PakiSidenavItem`. Filhos de um grupo.
- `PakiSidenavState`
  - `expanded`: boolean. Estado atual do sidenav.

## Edge Cases

- Lista de itens vazia: o componente monta a estrutura sem itens visiveis.
- Item com `route` vazia ou invalida: o comportamento segue o `RouterLink` padrao do Angular.
- Grupo sem filhos: o item comporta-se como item simples, sem botao de expansao.
- Submenu aninhado alem de um nivel: a spec adota profundidade maxima de um nivel conforme aviso `W-01`.
- Todos os itens inativos: nenhum item recebe estilo de selecao.
- Alternancia rapida de estado: o componente emite o evento mais recente.
- Tema inesperado: a renderizacao usa tokens do tema; cores fora do tema sao fora de escopo.

## Criterios de sucesso

- `SC-001`: Componente monta sem itens e sem erros de console.
- `SC-002`: Itens com `route` renderizam como links `RouterLink`.
- `SC-003`: Item ativo recebe classe visual de selecao via `RouterLinkActive`.
- `SC-004`: Tipografia, cores e espacamentos seguem os tokens de `pakitec-theme.scss` nos modos claro e escuro.
- `SC-005`: `npm run test` e `npm run build` finalizam com sucesso.
- `SC-006`: Alternar o estado expandido emite evento `toggle` com o novo valor.
- `SC-007`: Grupos expandem e recolhem ao clicar no cabecalho do grupo.
- `SC-008`: Navegacao por teclado possui roles ARIA e foco visivel.

## Escopo

- Criar `PakiSidenav` em `projects/pakitec-angular-components/src/lib/components/sidenav/`.
- Adotar standalone component, `OnPush`, Signals e `input()`/`output()`.
- Reutilizar tokens de `pakitec-theme.scss`.
- Suportar itens simples e grupos com submenus de um nivel.
- Integrar com `RouterLink` e `RouterLinkActive`.
- Controlar estado expandido/colapsado via input/output.
- Definir larguras 240 px / 64 px.
- Exportar em `src/lib/components/index.ts` e `src/public-api.ts`.
- Criar story no Storybook.
- Garantir `npm run test` e `npm run build` sem regressoes.

## Fora de escopo

- Persistencia automatica do estado em `localStorage` ou `sessionStorage`.
- Sidenav sobreposto (overlay).
- Integracao com backend ou dados remotos.
- Submenus com mais de um nivel de profundidade.
- Controle de permissao ou visibilidade dinamica de itens.

## Dependencias

- Angular Router (`RouterLink`, `RouterLinkActive`).
- `pakitec-theme.scss` e tokens existentes.
- Padroes de componentes ja adotados no projeto (`PakiModuleTabs`, `PakiPageHeader`).

## Premissas

- O projeto usa Angular standalone components, Signals e `OnPush`.
- O tema claro/escuro ja esta definido em `pakitec-theme.scss`.
- A profundidade de submenu adotada e de um nivel conforme aviso `W-01`.
- O evento de alternancia e chamado `toggle`; a nomenclatura exata de `open`/`close` sera definida na spec tecnica conforme aviso `W-02`.
- Os tokens exatos de estilo serao mapeados a partir de `pakitec-theme.scss` e componentes existentes conforme aviso `W-03`.
- Performance segue o padrao `OnPush` do projeto; nao ha metricas adicionais conforme aviso `W-04`.

## Rastreabilidade

- `FR-001`, `FR-002`, `FR-003` -> `US-001` -> `AC-001`, `AC-002`, `AC-003` -> `SC-001`, `SC-002`, `SC-003`.
- `FR-004`, `FR-005` -> `US-002` -> `AC-007` -> `SC-007`.
- `FR-006`, `FR-007`, `FR-008`, `FR-009` -> `US-003` -> `AC-006` -> `SC-006`.
- `FR-010`, `FR-011`, `NFR-001` a `NFR-006` -> escopo transversal -> `AC-004`, `AC-005`, `AC-008` -> `SC-004`, `SC-005`, `SC-008`.

## Clarificacoes

Nenhuma marcacao `[NEEDS CLARIFICATION]` permanece nesta spec.

## Gate da Spec

`READY` somente com `checklist.md` aprovado.
<!-- sdd:section specs.spec-template:end -->
