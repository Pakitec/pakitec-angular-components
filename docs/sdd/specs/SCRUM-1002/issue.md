# Snapshot da issue SCRUM-1002

<!-- sdd:section specs.issue-template:start -->
- Jira: `SCRUM-1002`
- Projeto: `SCRUM`
- Status no momento do planejamento: `Em andamento`
- Capturado em: `2026-09-07T21:43:35-03:00`
- Hash normalizado: `1574e56fa566`

## Resumo

Criar o componente `paki-sidenav` na biblioteca `pakitec-angular-components`.
O componente fornece navegacao lateral padronizada para layouts de aplicacao Pakitec.

## Descricao

A demanda parte do desenvolvedor(a) frontend.
A biblioteca precisa de um sidenav que combine com a identidade visual dos demais componentes.
O componente deve ser standalone, usar `ChangeDetectionStrategy.OnPush`, Signals e `input()`.
Deve reutilizar tokens de `pakitec-theme.scss` nos modos claro e escuro.
Deve suportar itens simples, itens com rota, icones opcionais, grupos com submenus de ate um nivel e estados expandido/colapsado.
O estado expandido/colapsado e controlado pela aplicacao via input/output, sem persistencia automatica.
As larguras padrao sao 240 px expandido e 64 px colapsado.
Deve expor eventos open/close para a aplicacao consumidora.
Todo item com `route` usa `RouterLink` e `RouterLinkActive`.

## Criterios e campos personalizados

- **Componente customizado**: Componentes
- **Regras de negocio customfield**:
  - Expor estados expandido/colapsado e eventos open/close.
  - Grupos de menu expandem/recolhem independentemente do estado do sidenav.
  - Larguras padrao: 240 px expandido e 64 px colapsado.
  - Estado controlado pela aplicacao via input/output, sem persistencia automatica.
  - Itens com `route` usam `RouterLink`/`RouterLinkActive`.
- **Detalhes tecnicos customfield**:
  - Componente Angular standalone com SCSS e tokens do tema.
  - Testes unitarios, export via `public-api.ts` e Storybook.
  - Estados e grupos via Signals.
  - Eventos open/close via `output()`.
  - Sem persistencia em storage.

## Anexos relevantes

Nenhum anexo na issue.
O manifesto de assets esta vazio.

## Subtarefas existentes

- `SCRUM-1003` — [SDD][SPEC] Specification
- `SCRUM-1004` — [SDD][RESEARCH] Technical Research
- `SCRUM-1005` — [SDD][PLAN] Technical Plan
- `SCRUM-1006` — [SDD][QA] Quality Review

Este arquivo e um snapshot para rastreabilidade.
A issue Jira continua sendo a fonte da demanda.
<!-- sdd:section specs.issue-template:end -->
