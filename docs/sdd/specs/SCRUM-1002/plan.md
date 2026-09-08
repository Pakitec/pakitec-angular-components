# Plano técnico SCRUM-1002

<!-- sdd:section specs.plan-template:start -->

## Resumo

Criar o componente `paki-sidenav` na biblioteca `pakitec-angular-components`.
O componente fornece navegação lateral com itens simples, grupos com submenu de um nível e controle de largura expandido/colapsado.

## Constitution Check

- Padrões do repositório lidos: `docs/sdd/templates/angular.md`, `PakiModuleTabs`, `PakiPageHeader`, `PakiPagination`, `PakiSwitch`, tema e stories.
- Arquitetura existente preservada: standalone, `OnPush`, Signals, `input()`/`output()`, SCSS com tokens.
- Segurança, privacidade, observabilidade e rollback avaliados.
- Desvios justificados em Complexity Tracking.

## Contexto técnico

- Runtime/stack: Angular 22 standalone, TypeScript 6, SCSS, Vitest, Storybook 10, Playwright.
- Dependências: `@angular/router` para `RouterLink` e `RouterLinkActive`; tema `pakitec-theme.scss` já existente.
- Dados/storage: nenhum estado persistente; estado controlado pela aplicação via input/output.
- Auth/permissões: fora de escopo.
- Plataformas: navegador moderno; build de biblioteca via `ng-packagr`.
- Restrições: sem biblioteca de ícones no projeto; profundidade máxima de submenu de um nível.

## Arquitetura e abordagem

O componente fica em `projects/pakitec-angular-components/src/lib/components/sidenav/`.
Ele segue o padrão dos componentes existentes: arquivo único sem sufixo `.component`, template e estilo separados, standalone, `OnPush`, Signals.

### Estrutura interna

- `PakiSidenav` mantém:
  - `items` (input requerido): lista de `PakiSidenavItem`.
  - `expanded` (input, padrão `false`): largura do sidenav.
  - `toggle` (output): emite o novo booleano quando o estado muda.
  - `opened` e `closed` (outputs): emitem sem payload quando o sidenav entra no estado correspondente. Resolve `FR-008` sem quebrar `SC-006`.
  - Signals internos para o estado de cada grupo; independentes do estado de largura.
- Template:
  - `<nav>` com `aria-label`.
  - Itens simples usam `RouterLink`, `RouterLinkActive` e `ariaCurrentWhenActive="page"`.
  - Grupos usam `<button>` para expandir/recolher filhos.
  - Ícone opcional renderizado como `<span>` com classe CSS fornecida pelo consumidor.
- Estilo:
  - Larguras fixas 240 px e 64 px via variáveis CSS internas.
  - Cores, bordas, tipografia e espaçamentos por tokens de `pakitec-theme.scss`.
  - Foco visível reutiliza o `:focus-visible` global do tema.

### Arquivos a criar

- `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.ts`: componente, tipos e lógica.
- `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.html`: template.
- `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.scss`: estilo.
- `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.spec.ts`: testes unitários.
- `projects/pakitec-angular-components/src/stories/sidenav.stories.ts`: story do Storybook.

### Arquivos a alterar

- `projects/pakitec-angular-components/src/lib/components/index.ts`: exportar `PakiSidenav`.
- `projects/pakitec-angular-components/src/public-api.ts`: já reexporta `index.ts`; verificar se o novo componente aparece automaticamente.

## Contratos e dados

### Tipos

```ts
export interface PakiSidenavItem {
  label: string;
  route?: string;
  icon?: string;
  expanded?: boolean;
  children?: readonly PakiSidenavItem[];
}

export type PakiSidenavState = {
  expanded: boolean;
};
```

### Inputs

- `items`: `readonly PakiSidenavItem[]` (requerido).
- `expanded`: `boolean` (padrão `false`).

### Outputs

- `toggle`: emite `boolean` com o novo valor de `expanded`.
- `opened`: emite `void` quando o sidenav passa para expandido.
- `closed`: emite `void` quando o sidenav passa para colapsado.

### Comportamento esperado

- Lista vazia: renderiza estrutura sem itens.
- Item com `route`: vira link navegável; classe `active` aplicada via `RouterLinkActive`.
- Item com `children`: vira grupo; clique alterna visibilidade dos filhos.
- Grupos sem filhos: comportam-se como item simples.
- Submenus aninhados além de um nível: ignorados ou renderizados apenas no primeiro nível.
- Ícone: classe CSS opcional em `<span>`; o consumidor fornece a biblioteca de ícones.

## Evidência visual

Critérios visuais obrigatórios para o orquestrador preencher `visualEvidence.criteria` antes das capturas:

- `{ "criteriaId": "AC-004" }`: aparência do sidenav no tema claro expandido.
- `{ "criteriaId": "AC-005" }`: aparência do sidenav no tema escuro expandido.
- `{ "criteriaId": "AC-008" }`: foco visível e navegação por teclado.

O manifesto de evidências fica em `evidence/SCRUM-1002/manifest.json`.
Capturas oficiais usam nome `SCRUM-1002-<criteriaId>-desktop.png`.

## Segurança e privacidade

- O componente não armazena dados sensíveis, credenciais ou estado em `localStorage`/`sessionStorage`.
- A evidência visual lê arquivos por caminho seguro em `evidence/SCRUM-1002/`.
- Nenhum retorno expõe Base64, cookies ou headers de autenticação.
- Evidências maiores que 10 MB ou marcadas como sensíveis não são publicadas.

## Observabilidade

- Não há telemetria específica do componente.
- O sucesso é verificado por `npm run test` e `npm run build`.
- O Storybook fornece preview visual e testes automáticos via `@storybook/addon-vitest`.

## Etapas de implementação

1. Criar tipos e estrutura de arquivos do sidenav.
2. Implementar itens simples com `RouterLink`/`RouterLinkActive` (US-001).
3. Implementar grupos expansíveis com Signals independentes (US-002).
4. Implementar controle de largura e eventos `toggle`/`opened`/`closed` (US-003).
5. Aplicar estilos com tokens de tema e garantir foco visível.
6. Exportar o componente e criar story no Storybook.
7. Executar testes, build e capturar evidências visuais.

## Estratégia de testes

- Testes unitários ao lado do componente em `paki-sidenav.spec.ts`.
- `TestBed` importa `PakiSidenav` e fornece `provideRouter` para `RouterLink`.
- Casos de teste:
  - renderiza estrutura vazia sem erros (`SC-001`).
  - renderiza itens com `route` como links (`SC-002`).
  - aplica classe ativa quando a rota corresponde (`SC-003`).
  - alterna estado expandido e emite `toggle` com novo valor (`SC-006`).
  - emite `opened`/`closed` quando o estado muda (`FR-008`).
  - expande e recolhe grupos ao clicar no cabeçalho (`SC-007`).
  - mantém grupos independentes do estado de largura.
  - expõe roles ARIA e foco visível (`SC-008`).
- Story no Storybook valida visualmente tema claro/escuro e interação.

## Rollout e rollback

- Rollout: merge do componente na branch `master`; exports atualizados; build publicado.
- Rollback: remover export de `src/lib/components/index.ts`; o componente deixa de fazer parte da API pública sem afetar código que não o importe.

## Riscos e mitigações

| Risco | Impacto | Mitigação |
| --- | --- | --- |
| Ausência de biblioteca de ícones | `icon` fica sem renderer | Tratar `icon` como classe CSS opcional; documentar a convenção. |
| Inconsistência de estado controlado externamente | Aplicação pode não sincronizar input após output | Manter `expanded` como input e emitir `toggle` com o novo valor; `opened`/`closed` ajudam o consumidor a reagir. |
| Grupos colapsam quando sidenav está colapsado | Usabilidade ruim | Grupos mantêm Signals próprios; a visibilidade dos filhos não depende da largura do sidenav. |
| Larguras fixas conflitam com layout responsivo | Quebra em telas pequenas | Aplicar larguras via variáveis CSS no `:host`; o consumidor pode sobrescrever por CSS. |

## Complexity Tracking

| Desvio | Necessidade | Alternativa simples rejeitada |
| --- | --- | --- |
| Três outputs (`toggle`, `opened`, `closed`) | Atender tanto `SC-006` (`toggle`) quanto `FR-008` e a issue (`open`/`close`) | Apenas `toggle`: não cobre explicitamente a expectativa da issue de eventos separados. |
| Grupos com Signals separados | Especificação exige independência do estado de largura | Estado compartilhado: violaria o requisito. |
| Ícone como classe CSS | Não existe biblioteca de ícones no projeto | Instalar biblioteca de ícones: adiciona dependência externa. |

## Gate de execução

`READY_TO_BUILD` quando:

- `spec.md` e `checklist.md` aprovados sem `NEEDS CLARIFICATION`.
- `plan.md` e `tasks.md` publicados na pasta `docs/sdd/specs/SCRUM-1002/`.
- Decisões técnicas resolvidas: eventos, ícone, tokens, Signals de grupos e `provideRouter`.
- Nenhuma pergunta de produto pendente.

<!-- sdd:section specs.plan-template:end -->
