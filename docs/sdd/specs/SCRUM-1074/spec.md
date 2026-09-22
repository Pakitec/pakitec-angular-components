# Feature Specification: SCRUM-1074

<!-- sdd:section specs.spec-template:start -->
**Issue**: `SCRUM-1074`  
**Status**: Draft  
**Input**: Jira validado pelo refinement gate (hash `f1fb3c6ec4c6`)

## Objetivo

Aplicacoes Angular que consomem a biblioteca pakitec-angular-components precisam de uma
navegacao lateral em rail vertical recolhivel, acessivel e tematica. Hoje so existe o
PakiSidenav, que atende outro caso de uso e nao pode mudar. Este componente,
PakiNavigationRail, entrega uma faixa de navegacao com estados recolhido e expandido,
destaque da rota ativa, cabecalho de marca e item de rodape. O valor e reduzir o esforco
das aplicacoes consumidoras para montar uma navegacao consistente, acessivel (WCAG 2.1
AA) e alinhada ao tema Pakitec, sem risco de regressao no PakiSidenav.

## Usuarios e Cenarios

### US-001 - Navegar por rotas pelo rail (P1)

Como aplicacao consumidora, quero exibir itens de navegacao com rota para que o usuario
final alcance as secoes do produto, com destaque da rota ativa e notificacao de selecao.

**Por que P1**: e o valor central do componente; sem navegacao por rota o rail nao cumpre
seu proposito.  
**Teste independente**: renderizar o rail com itens com e sem `route` e um item
`disabled`; acionar cada tipo e observar navegacao, estilo ativo, `aria-current` e a
emissao de `itemSelected`.

**Cenarios de aceite**:

1. `AC-002` (deriva de CA2) - **Dado** um item com `route`, **quando** o usuario o
   seleciona, **entao** a rota e ativada via RouterLink, o item recebe estilo ativo e
   `aria-current="page"` e `itemSelected` e emitido com o id do item.
2. `AC-003` (deriva de CA3) - **Dado** um item sem `route`, **quando** o usuario o
   seleciona, **entao** nenhuma navegacao ocorre e apenas `itemSelected` e emitido com o
   id.
3. `AC-004` (deriva de CA4) - **Dado** um item `disabled`, **quando** o usuario tenta
   seleciona-lo, **entao** nao navega, nao emite `itemSelected` e expoe
   `aria-disabled="true"`.

### US-002 - Recolher e expandir o rail (P1)

Como aplicacao consumidora, quero controlar a largura recolhida ou expandida do rail para
economizar espaco ou exibir labels, mantendo o estado sob meu controle.

**Por que P1**: o comportamento recolhivel e o diferencial do rail frente ao PakiSidenav;
o modelo two-way permite ao consumidor decidir persistencia.  
**Teste independente**: iniciar recolhido; acionar o controle de expansao e observar a
largura, o valor emitido em `expandedChange` e o atributo `aria-expanded`, com e sem
`prefers-reduced-motion`.

**Cenarios de aceite**:

1. `AC-001` (deriva de CA1) - **Dado** o rail recolhido (64px, padrao inicial), **quando**
   o usuario aciona o controle de expandir, **entao** o rail passa a 216px, emite
   `expandedChange=true`, o controle expoe `aria-expanded=true` e a transicao respeita
   `prefers-reduced-motion`.
2. `AC-007` (deriva de CA7) - **Dado** o rail recolhido, **quando** um item e exibido,
   **entao** mostra apenas o icone e o label fica acessivel via `aria-label` e tooltip
   (title).

### US-003 - Exibir cabecalho de marca e item de rodape (P2)

Como aplicacao consumidora, quero um cabecalho de marca e um item ancorado ao rodape para
comunicar identidade e destacar uma acao fixa (ex.: Configuracoes).

**Por que P2**: agrega valor de identidade e organizacao, mas a navegacao funciona sem
esses elementos.  
**Teste independente**: renderizar o rail com `brand` (com e sem `route`) e um item
`position="footer"`; observar a exibicao do label, a navegacao do cabecalho e a ancoragem
separada no rodape.

**Cenarios de aceite**:

1. `AC-005` (deriva de CA5) - **Dado** um item com `position="footer"`, **entao** e
   renderizado ancorado ao rodape, separado visualmente dos itens `position="main"`.
2. `AC-006` (deriva de CA6) - **Dado** um `brand` com `label`, **entao** o cabecalho de
   marca exibe o label; com `brand.route`, o cabecalho navega ao ser acionado.

### US-004 - Renderizar com dados incompletos ou vazios (P2)

Como aplicacao consumidora, quero que o rail se comporte com robustez quando faltam dados
para evitar erros de renderizacao e nomes acessiveis ausentes.

**Por que P2**: protege a experiencia em estados iniciais e de dados parciais, mas nao e o
fluxo principal.  
**Teste independente**: renderizar o rail com `items` vazio (com e sem `brand`) e com um
item sem `icon`; observar ausencia de erros, presenca do cabecalho de marca e o label como
nome acessivel.

**Cenarios de aceite**:

1. `AC-008` (deriva de CA8) - **Dado** `items` vazio, **entao** o rail renderiza sem erros
   e o cabecalho de marca ainda aparece se `brand` for fornecido.
2. `AC-009` (deriva de CA9) - **Dado** um item sem `icon`, **entao** o item e renderizado
   sem icone, mantendo o label como nome acessivel.

### US-005 - Garantir tema, acessibilidade e preservacao (P1)

Como aplicacao consumidora e mantenedor da biblioteca, quero que o rail atenda WCAG 2.1 AA
em ambos os temas e que sua adicao nao altere o PakiSidenav nem quebre o build.

**Por que P1**: acessibilidade e preservacao sao requisitos de aceite obrigatorios; a
violacao bloqueia a entrega.  
**Teste independente**: alternar tema claro e escuro; verificar foco visivel e contraste
nos controles e a coerencia dos atributos aria; rodar `npm run test`, `npm run build` e
`npm run build-storybook` e confirmar exportacao e PakiSidenav inalterado.

**Cenarios de aceite**:

1. `AC-010` (deriva de CA10) - **Dado** tema claro ou escuro (tokens de
   `pakitec-theme.scss`), **entao** o foco e visivel em links, botoes e no controle de
   expansao, o contraste atende WCAG 2.1 AA e `aria-expanded`, `aria-current` e
   `aria-disabled` refletem o estado.
2. `AC-011` (deriva de CA11) - **Dado** o build da biblioteca, **entao**
   PakiNavigationRail e exportado em `components/index.ts` e `public-api.ts`, o
   PakiSidenav permanece inalterado (API, comportamento e testes) e `npm run test`,
   `npm run build` e `npm run build-storybook` concluem sem erros.

## Requisitos funcionais

- `FR-001`: O rail expoe estado recolhido/expandido controlado pelo consumidor via two-way
  `expanded`/`expandedChange`, inicia recolhido, aplica largura 64px recolhido e 216px
  expandido e emite `expandedChange` a cada mudanca. (US-002)
- `FR-002`: O controle de expansao expoe `aria-expanded` refletindo o estado atual e a
  transicao de largura respeita `prefers-reduced-motion`. (US-002)
- `FR-003`: Item com `route` ativa a rota via RouterLink, recebe estilo ativo e
  `aria-current="page"` quando ativo e emite `itemSelected` com o `id`. (US-001)
- `FR-004`: Item sem `route` nao navega e emite apenas `itemSelected` com o `id`. (US-001)
- `FR-005`: Item `disabled` nao navega, nao emite `itemSelected` e expoe
  `aria-disabled="true"`. (US-001)
- `FR-006`: Itens com `position="footer"` sao ancorados ao rodape e separados visualmente
  dos itens `position="main"`; ausencia de `position` e tratada como `main`. (US-003)
- `FR-007`: O cabecalho de marca exibe `brand.label`; quando ha `brand.route`, o cabecalho
  navega ao ser acionado; sem `brand.route`, o cabecalho nao e navegavel. (US-003)
- `FR-008`: No estado recolhido, cada item mostra apenas o icone e o label permanece
  acessivel via `aria-label` (nome acessivel) e tooltip `title` (auxiliar). (US-002)
- `FR-009`: Com `items` vazio, o rail renderiza sem erros e mantem o cabecalho de marca se
  `brand` for fornecido. (US-004)
- `FR-010`: Item sem `icon` e renderizado sem icone e mantem `label` como nome acessivel.
  (US-004)
- `FR-011`: Em tema claro e escuro (tokens de `pakitec-theme.scss`), foco visivel em
  links, botoes e no controle de expansao; os atributos `aria-expanded`, `aria-current` e
  `aria-disabled` refletem o estado. (US-005)
- `FR-012`: O componente e standalone e exportado pela API publica em
  `components/index.ts` e `public-api.ts`, sem alterar API, comportamento nem testes do
  PakiSidenav. (US-005)
- `FR-013`: O componente nao persiste estado; a decisao de persistencia e do consumidor.
  (US-002)

## Requisitos nao funcionais

- `NFR-001`: Acessibilidade WCAG 2.1 AA em tema claro e escuro: contraste minimo 4.5:1
  para texto e 3:1 para elementos de UI e indicador de foco. (US-005)
- `NFR-002`: Foco por teclado visivel e operavel em todos os controles interativos (itens,
  cabecalho navegavel e controle de expansao). (US-005)
- `NFR-003`: A transicao recolher/expandir respeita `prefers-reduced-motion: reduce`,
  suprimindo a animacao quando solicitado. (US-002)
- `NFR-004`: A biblioteca conclui `npm run test`, `npm run build` e `npm run
  build-storybook` sem erros apos a adicao do componente. (US-005)
- `NFR-005`: Larguras fixas: 64px recolhido e 216px expandido. (US-002)

## Entidades e Dados

- `PakiNavigationRailItem`: item de navegacao. Atributos: `id` (string, identificador
  emitido em `itemSelected`), `label` (string, nome exibido e acessivel), `route`
  (string opcional, destino de navegacao), `icon` (string opcional, identificador de
  icone), `disabled` (boolean opcional), `position` (`'main' | 'footer'`, opcional, padrao
  `main`). Dados sem sensibilidade.
- `PakiNavigationRailBrand`: cabecalho de marca. Atributos: `label` (string, exibido) e
  `route` (string opcional, torna o cabecalho navegavel). Dados sem sensibilidade.
- Estado `expanded`: boolean controlado pelo consumidor (two-way), inicia `false`
  (recolhido), sem persistencia interna.
- Saidas: `expandedChange` (boolean) e `itemSelected` (id do item, string).

## Edge Cases

- Lista vazia: `items` vazio renderiza sem erros; cabecalho de marca aparece se `brand`
  fornecido (AC-008).
- Item sem icone: renderiza sem icone e mantem o label como nome acessivel (AC-009).
- Item sem rota: nao navega e apenas emite `itemSelected` (AC-003).
- Item desabilitado: nao navega, nao emite `itemSelected` e expoe `aria-disabled` (AC-004).
- Cabecalho de marca sem `route`: nao navegavel, por simetria com itens (premissa R3).
- `prefers-reduced-motion: reduce`: transicao de largura suprimida (NFR-003).

## Criterios de sucesso

- `SC-001`: 100% dos cenarios AC-001..AC-011 verificados e aprovados. (rastreia CA1..CA11)
- `SC-002`: Recolhido mede 64px e expandido mede 216px; `expandedChange` emite o novo
  valor em 100% das mudancas de estado. (AC-001)
- `SC-003`: Navegacao correta em 100% dos itens: item com `route` navega e ativa
  `aria-current`; item sem `route` e item `disabled` nao navegam. (AC-002, AC-003, AC-004)
- `SC-004`: Auditoria de contraste e foco atende WCAG 2.1 AA (>= 4.5:1 texto, >= 3:1 UI e
  foco) em tema claro e escuro, com zero violacoes bloqueantes. (AC-010)
- `SC-005`: `npm run test`, `npm run build` e `npm run build-storybook` concluem sem
  erros; PakiSidenav sem alteracao de API, comportamento ou testes. (AC-011)
- `SC-006`: Com `items` vazio nao ha erro de renderizacao; com item sem `icon` o label
  permanece como nome acessivel. (AC-008, AC-009)

## Escopo

- Componente standalone `<paki-navigation-rail>` com estados recolhido (64px) e expandido
  (216px) controlados por two-way `expanded`/`expandedChange`.
- Itens de navegacao com icone, label, rota opcional, estado desabilitado e posicao
  (`main`/`footer`); destaque da rota ativa; cabecalho de marca por label com rota
  opcional.
- Saidas `expandedChange` e `itemSelected`; nomes acessiveis, `aria-expanded`,
  `aria-current`, `aria-disabled`, foco visivel e suporte a tema claro/escuro por tokens.
- Exportacao pela API publica, stories e testes, preservando o PakiSidenav.

## Fora de escopo

- Imagens de marca `compactImageUrl`/`expandedImageUrl` no contrato publico; aparecem so
  nas stories.
- Persistencia interna do estado recolhido/expandido (decisao do consumidor).
- Responsividade e modo overlay; o rail permanece sempre visivel.
- Qualquer alteracao no PakiSidenav.

## Dependencias

- Angular Router (RouterLink e RouterLinkActive) para itens e cabecalho com rota.
- Tokens visuais de `projects/pakitec-angular-components/src/styles/pakitec-theme.scss`
  para tema claro/escuro e contraste.
- Pipeline da biblioteca: `npm run test`, `npm run build`, `npm run build-storybook`.

## Premissas

Somente premissas seguras, reversiveis e aceitas no refinement.

- `R1`: `aria-label` e a fonte do nome acessivel no estado recolhido; `title` (tooltip) e
  auxiliar.
- `R2`: O contraste WCAG 2.1 AA depende dos tokens de `pakitec-theme.scss`; ajustes
  ocorrem no consumo dos tokens durante o QA visual, sem alterar o contrato publico.
- `R3`: Cabecalho de marca sem `brand.route` nao e navegavel, por simetria com os itens.
- `R4`: Imagens de marca (`compactImageUrl`/`expandedImageUrl`) ficam fora do contrato
  publico e aparecem apenas nas stories.
- `R5`: O rail permanece sempre visivel; responsividade e modo overlay ficam fora de
  escopo.

## Rastreabilidade

| CA | AC | US | FR | SC |
|----|-----|------|----------------|----------------|
| CA1 | AC-001 | US-002 | FR-001, FR-002 | SC-002 |
| CA2 | AC-002 | US-001 | FR-003 | SC-003 |
| CA3 | AC-003 | US-001 | FR-004 | SC-003 |
| CA4 | AC-004 | US-001 | FR-005 | SC-003 |
| CA5 | AC-005 | US-003 | FR-006 | SC-001 |
| CA6 | AC-006 | US-003 | FR-007 | SC-001 |
| CA7 | AC-007 | US-002 | FR-008 | SC-001 |
| CA8 | AC-008 | US-004 | FR-009 | SC-006 |
| CA9 | AC-009 | US-004 | FR-010 | SC-006 |
| CA10 | AC-010 | US-005 | FR-011, NFR-001, NFR-002 | SC-004 |
| CA11 | AC-011 | US-005 | FR-012, NFR-004 | SC-005 |

- `FR-*` -> `US-*` -> cenarios de aceite (`AC-*`) -> `SC-*` conforme tabela acima.

## Clarificacoes

Nenhuma marcacao `[NEEDS CLARIFICATION]` permanece nesta spec. As lacunas apontadas no
PLAN_BLOCKED foram resolvidas no refinement (hash `f1fb3c6ec4c6`) e registradas como
premissas R1..R5.

## Gate da Spec

`READY` somente com `checklist.md` aprovado.
<!-- sdd:section specs.spec-template:end -->
