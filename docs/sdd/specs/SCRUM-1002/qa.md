# Revisao QA SCRUM-1002

<!-- sdd:section specs.qa-template:start -->
## Veredito

`FAIL`

O build atende a maioria dos criterios, mas AC-007 (grupos e submenus) nao e cumprido visualmente: os itens filhos de um grupo sempre sao renderizados, mesmo quando `aria-expanded="false"`. Isso quebra o comportamento de expandir/recolher e afeta a acessibilidade. A correcao e dentro do escopo aprovado.

## Criterios verificados

| Criterio | Jornada | Resultado | Observacao |
| --- | --- | --- | --- |
| AC-001 | US-001 | PASS | Componente monta sem itens e sem erros. |
| AC-002 | US-001 | PASS | Itens com `route` renderizam como links `RouterLink`. |
| AC-003 | US-001 | PASS | Item ativo recebe `aria-current="page"` e classe `active`. |
| AC-004 | Transversal | PASS | Evidencia oficial publicada (tema claro expandido). |
| AC-005 | Transversal | PASS | Evidencia oficial publicada (tema escuro expandido). |
| AC-006 | US-003 | PASS | Alternancia emite `toggle`, `opened` e `closed`; larguras 64px/240px aplicadas. |
| AC-007 | US-002 | FAIL | Grupo nao oculta os filhos ao recolher. |
| AC-008 | Transversal | PASS | Evidencia oficial publicada; roles ARIA e foco visivel presentes. |

## Comandos executados

```text
CI=true npm run test
  -> Test Files 12 passed (12), Tests 45 passed (45), Duration 3.04s

npm run build
  -> Built pakitec-angular-components successfully (FESM and DTS bundles)

npm run build-storybook
  -> Storybook build completed successfully
```

## Evidencias

- `npm run test` passou com 45 testes.
- `npm run build` gerou a biblioteca sem erros.
- `npm run build-storybook` gerou a documentacao visual sem erros.

## Gate de evidencia visual

| Criterio | Jornada | Resultado | Evidencia (anexo Jira) |
| --- | --- | --- | --- |
| AC-004 | Transversal | PASS | SCRUM-1002-AC-004-desktop.png |
| AC-005 | Transversal | PASS | SCRUM-1002-AC-005-desktop.png |
| AC-008 | Transversal | PASS | SCRUM-1002-AC-008-desktop.png |

Manifesto validado em `evidence/SCRUM-1002/manifest.json`. Todos os criterios visuais oficiais estao com `status: pass`, `kind: official`, sem dados sensiveis e abaixo de 10 MB.

## Problemas bloqueantes

| Severidade | Descricao | InScope | Correcao minima |
| --- | --- | --- | --- |
| high | AC-07: o `<ul class="paki-sidenav__group-children">` sempre e renderizado, independentemente do valor de `aria-expanded`. O clique no cabecalho do grupo atualiza apenas `aria-expanded`; os itens filhos nunca sao ocultados. Isso tambem compromete a semantica ARIA, pois leitores de tela podem continuar navegando pelos filhos mesmo com `aria-expanded="false"`. | true | No template `paki-sidenav.html`, envolver a lista de filhos com `@if (groupExpanded(index, item.expanded ?? false)())`. No SCSS, adicionar `.paki-sidenav__group-children[hidden] { display: none; }` ou aplicar `hidden` via binding quando o grupo estiver colapsado. Atualizar os testes para verificar `hidden`/`display` da lista de filhos. |

## Problemas nao bloqueantes

| Severidade | Descricao | InScope | Observacao |
| --- | --- | --- | --- |
| low | AC-07 (profundidade): netos alem de um nivel sao renderizados como texto simples dentro do segundo nivel, nao sao estritamente "ignorados". | true | Comportamento aceitavel dentro da redacao "ignorados ou renderizados apenas no primeiro nivel", mas pode ser tornado explicito na spec. |
| low | NFR-004: o teste de filhos ocultos nao existe; a suite so verifica `aria-expanded`. | true | Incluir assert de visibilidade apos corrigir o template. |

## Riscos residuais

- Nenhum dado sensivel ou estado persistente foi introduzido.
- Rollback continua valido pela remocao do export em `index.ts`.
- Nenhum impacto em componentes existentes.

Somente `PASS` autoriza conclusao da issue principal.
<!-- sdd:section specs.qa-template:end -->
