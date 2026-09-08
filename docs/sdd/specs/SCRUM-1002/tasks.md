# Tarefas SCRUM-1002

<!-- sdd:section specs.tasks-template:start -->

## Formato

`TASK-ID [P?] [US-ID] Descrição com path exato`

`[P]` indica execução paralela segura: arquivos diferentes e nenhuma dependência pendente.
O build só honra `[P]` quando iniciado com `--parallel`; por padrão a execução é sequencial.

## Fase 1 - Setup/Fundação

- [ ] `TASK-001 [US-001]` Criar tipos e arquivos base do sidenav em `projects/pakitec-angular-components/src/lib/components/sidenav/`
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: `FR-001`, `FR-003`, `NFR-001`, `NFR-002`
  - Critérios: `AC-001`
  - Dependências: nenhuma
  - Arquivos: `paki-sidenav.ts`, `paki-sidenav.html`, `paki-sidenav.scss`, `paki-sidenav.spec.ts`
  - Objetivo: definir `PakiSidenavItem`, `PakiSidenavState`, componente standalone vazio e teste de estrutura base.
  - Validação: `npm run test` passa para o novo componente vazio.
  - Estado: pending

## Fase 2 - US-001 - Navegar entre módulos (P1)

**Objetivo**: renderizar itens simples como links navegáveis usando `RouterLink`/`RouterLinkActive`.
**Teste independente**: renderizar `paki-sidenav` com itens de `label` e `route` e verificar links e item ativo.

### Implementação

- [ ] `TASK-002 [US-001]` Implementar itens simples com `RouterLink` e `RouterLinkActive` em `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.ts` e `.html`
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: `FR-001`, `FR-002`, `FR-003`, `NFR-001`
  - Critérios: `AC-002`, `AC-003`
  - Dependências: `TASK-001`
  - Arquivos: `paki-sidenav.ts`, `paki-sidenav.html`, `paki-sidenav.scss`
  - Objetivo: cada item com `route` vira link; item ativo recebe classe `active`.
  - Validação: story do Storybook mostra itens navegáveis.
  - Estado: pending

### Testes

- [ ] `TASK-003 [US-001]` Criar testes de itens vazios, links e item ativo em `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.spec.ts`
  - Tipo: test
  - Ownership: sdd-implementer
  - Requisitos: `FR-001`, `FR-002`, `NFR-004`
  - Critérios: `AC-001`, `AC-002`, `AC-003`, `SC-001`, `SC-002`, `SC-003`
  - Dependências: `TASK-002`
  - Arquivos: `paki-sidenav.spec.ts`
  - Objetivo: verificar renderização vazia, quantidade de links e `aria-current="page"` na rota ativa.
  - Validação: `npm run test` passa.
  - Estado: pending

**Checkpoint US-001**: itens simples renderizam e navegam; testes passam.

## Fase 3 - US-002 - Visualizar grupos e submenus (P1)

**Objetivo**: agrupar itens e permitir expandir/recolher submenu de um nível.
**Teste independente**: fornecer item com `children` e verificar que o clique alterna a visibilidade dos filhos.

### Implementação

- [ ] `TASK-004 [US-002]` Implementar grupos expansíveis com Signals independentes em `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.ts` e `.html`
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: `FR-004`, `FR-005`, `NFR-001`, `NFR-002`
  - Critérios: `AC-007`
  - Dependências: `TASK-002`
  - Arquivos: `paki-sidenav.ts`, `paki-sidenav.html`, `paki-sidenav.scss`
  - Objetivo: grupo com `children` exibe botão de expansão; clique mostra/oculta filhos; profundidade máxima de um nível.
  - Validação: story com grupo expandido/colapsado funciona no Storybook.
  - Estado: pending

### Testes

- [ ] `TASK-005 [US-002]` Criar testes de expansão e colapso de grupos em `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.spec.ts`
  - Tipo: test
  - Ownership: sdd-implementer
  - Requisitos: `FR-004`, `FR-005`, `NFR-004`
  - Critérios: `AC-007`, `SC-007`
  - Dependências: `TASK-004`
  - Arquivos: `paki-sidenav.spec.ts`
  - Objetivo: verificar que o clique no cabeçalho do grupo alterna a visibilidade dos filhos.
  - Validação: `npm run test` passa.
  - Estado: pending

**Checkpoint US-002**: grupos expandem e recolhem independentemente da largura do sidenav.

## Fase 4 - US-003 - Ajustar largura do sidenav (P2)

**Objetivo**: controlar estado expandido/colapsado e emitir eventos.
**Teste independente**: passar `expanded=true`, disparar a alternância e verificar emissão e largura.

### Implementação

- [ ] `TASK-006 [US-003]` Implementar controle de largura e eventos `toggle`, `opened` e `closed` em `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.ts`
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: `FR-006`, `FR-007`, `FR-008`, `FR-009`, `NFR-001`, `NFR-002`
  - Critérios: `AC-006`
  - Dependências: `TASK-001`
  - Arquivos: `paki-sidenav.ts`, `paki-sidenav.scss`
  - Objetivo: input `expanded` alterna largura entre 240 px e 64 px; outputs emitem conforme o estado muda.
  - Validação: story mostra sidenav expandido e colapsado.
  - Estado: pending

### Testes

- [ ] `TASK-007 [US-003]` Criar testes de alternância de largura e eventos em `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.spec.ts`
  - Tipo: test
  - Ownership: sdd-implementer
  - Requisitos: `FR-006`, `FR-007`, `FR-008`, `FR-009`, `NFR-004`
  - Critérios: `AC-006`, `SC-006`
  - Dependências: `TASK-006`
  - Arquivos: `paki-sidenav.spec.ts`
  - Objetivo: verificar que a alternância emite `toggle` com o novo valor e dispara `opened`/`closed`.
  - Validação: `npm run test` passa.
  - Estado: pending

**Checkpoint US-003**: sidenav alterna largura e emite eventos corretamente.

## Fase 5 - Transversal (exports, Storybook, acessibilidade)

- [ ] `TASK-008 [P] [transversal]` Adicionar roles ARIA, labels e foco visível em `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.ts` e `.html`
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: `NFR-006`
  - Critérios: `AC-008`, `SC-008`
  - Dependências: `TASK-002`, `TASK-004`
  - Arquivos: `paki-sidenav.ts`, `paki-sidenav.html`, `paki-sidenav.scss`
  - Objetivo: `<nav>` com `aria-label`, botões de grupo com `aria-expanded`, links com `ariaCurrentWhenActive` e foco visível reutilizando o tema.
  - Validação: testes verificam atributos ARIA; axe/lighthouse não reporta erros críticos.
  - Estado: pending

- [ ] `TASK-009 [P] [transversal]` Criar story do Storybook em `projects/pakitec-angular-components/src/stories/sidenav.stories.ts`
  - Tipo: documentation
  - Ownership: sdd-implementer
  - Requisitos: `FR-011`, `NFR-003`
  - Critérios: `AC-004`, `AC-005`
  - Dependências: `TASK-002`, `TASK-004`, `TASK-006`
  - Arquivos: `sidenav.stories.ts`
  - Objetivo: documentar variações: tema claro/escuro, expandido/colapsado, grupos abertos/fechados.
  - Validação: `npm run storybook` inicia sem erros; story renderiza.
  - Estado: pending

- [ ] `TASK-010 [transversal]` Exportar `PakiSidenav` em `projects/pakitec-angular-components/src/lib/components/index.ts`
  - Tipo: implementation
  - Ownership: sdd-implementer
  - Requisitos: `FR-010`
  - Critérios: nenhum
  - Dependências: `TASK-002`
  - Arquivos: `index.ts`
  - Objetivo: adicionar `export * from './sidenav/paki-sidenav'` e verificar `public-api.ts`.
  - Validação: `npm run build` gera tipos e bundle corretamente.
  - Estado: pending

**Checkpoint transversal**: componente exportado, documentado e acessível.

## Fase 6 - Evidência visual

- [ ] `TASK-011 [transversal]` Capturar e validar evidências visuais dos critérios `AC-004`, `AC-005` e `AC-008`
  - Tipo: qa
  - Ownership: sdd-visual-qa
  - Requisitos: `NFR-003`, `NFR-006`
  - Critérios: `AC-004`, `AC-005`, `AC-008`
  - Dependências: `TASK-009`
  - Arquivos: `evidence/SCRUM-1002/manifest.json`, `evidence/SCRUM-1002/*.png`
  - Objetivo: gerar PNGs oficiais, calcular SHA-256 e publicar metadados no Jira.
  - Validação: manifesto preenchido; critérios oficiais publicados sem Base64.
  - Estado: pending

## Fase 7 - Polish e validação final

- [ ] `TASK-012 [transversal]` Executar `npm run test` e `npm run build`
  - Tipo: qa
  - Ownership: sdd-implementer
  - Requisitos: `NFR-005`
  - Critérios: `SC-005`
  - Dependências: `TASK-003`, `TASK-005`, `TASK-007`, `TASK-010`
  - Arquivos: nenhum
  - Objetivo: garantir que todos os testes unitários passam e a biblioteca compila.
  - Validação: `npm run test` e `npm run build` finalizam com sucesso.
  - Estado: pending

- [ ] `TASK-013 [transversal]` Revisar código, documentação e evidências
  - Tipo: qa
  - Ownership: sdd-qa
  - Requisitos: todos os `FR-*`, `NFR-*`
  - Critérios: todos os `AC-*` e `SC-*`
  - Dependências: `TASK-011`, `TASK-012`
  - Arquivos: todos os arquivos criados/alterados
  - Objetivo: confirmar alinhamento com a spec, constituição, plano e ausência de overengineering.
  - Validação: `checklist.md` permanece aprovado; nenhuma regressão detectada.
  - Estado: pending

**Checkpoint final**: plano executado, build e testes verdes, evidências publicadas.

<!-- sdd:section specs.tasks-template:end -->
