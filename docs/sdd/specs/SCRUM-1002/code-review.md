# Revisao de Codigo SCRUM-1002

<!-- sdd:section specs.code-review-template:start -->
Revisao final consultiva executada apos `QA: PASS`, via Open Code Review em modo delegation. Consultiva: registra achados para analise, nunca bloqueia a conclusao da issue.

## Status

`REVIEWED`

## Comandos OCR executados

```bash
npx -y @alibaba-group/open-code-review delegate preview --from master --to Feature/sidenav
npx -y @alibaba-group/open-code-review delegate rule projects/pakitec-angular-components/src/lib/components/index.ts projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.html projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.scss projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.ts projects/pakitec-angular-components/src/stories/sidenav.stories.ts
```

## Arquivos revisados

- `projects/pakitec-angular-components/src/lib/components/index.ts`
- `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.ts`
- `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.html`
- `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.scss`
- `projects/pakitec-angular-components/src/stories/sidenav.stories.ts`

Arquivos de teste (`.spec.ts`) e artefatos SDD foram excluidos pela selecao deterministica do OCR.

## Achados por severidade

### Critical

Nenhum achado critical.

### High

1. **Track por `label` nao unico em `@for`**
   - **Arquivo/linha**: `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.html:3` e `:24`
   - **Evidencia**: `@for (item of items(); track item.label; let index = $index)` e `@for (child of item.children; track child.label)`
   - **Risco**: A interface `PakiSidenavItem` exige `label` como string obrigatoria, mas nao garante unicidade. Itens com labels duplicados (por exemplo, dois grupos chamados "Relatorios" ou item e grupo com mesmo nome) causam erro de runtime do Angular 22 no `@for`, pois a chave de `track` deve ser unica. Isso quebra o componente com dados validos segundo a API publica.
   - **Recomendacao**: Usar `track index` (ja disponivel no template) ou adicionar um campo opcional `id`/`key` a `PakiSidenavItem` e faze-lo obrigatorio quando houver risco de duplicidade. Se `index` for suficiente para o escopo estatico do sidenav, simplificar para `track index`.

2. **Estado de expansao de grupo indexado pela posicao do array**
   - **Arquivo/linha**: `projects/pakitec-angular-components/src/lib/components/sidenav/paki-sidenav.ts:89` e `:95`
   - **Evidencia**: `private readonly groupStates = new Map<number, WritableSignal<boolean>>();` e `groupExpanded(index: number, initial = false)`
   - **Risco**: O estado de expansao de cada grupo e vinculado ao indice do item no array. Se o input `items()` mudar de ordem, tiver itens inseridos/removidos em runtime ou receber um novo array de mesmo tamanho com conteudo diferente, o estado de expansao sera atribuido ao item errado. Isso corrompe a UI e a acessibilidade (`aria-expanded` apontara para o grupo errado). Alem disso, entradas antigas do `Map` nao sao limpas, causando crescimento de estado fantasma.
   - **Recomendacao**: Vincular o estado a um identificador estavel do item (adicionar `id`/`key` opcional a `PakiSidenavItem`) ou, se o array for imutavel, garantir documentacao clara de que alteracoes na ordem reiniciam o estado. Para arrays dinamicos, considerar limpar/recriar `groupStates` quando a referencia de `items()` mudar.

### Medium

Nenhum achado medium.

### Low

Nenhum achado low.

## Observacoes

- O componente adota corretamente `ChangeDetectionStrategy.OnPush`, Signals, standalone component e `input()`/`output()`.
- Nao foram encontrados problemas de seguranca objetivos (XSS, innerHTML, eval, injecao de SQL, exposicao de secrets).
- A exportacao em `index.ts` e `public-api.ts` esta correta e em ordem alfabetica.
- Os testes unitarios cobrem os cenarios de aceite principais, mas nao exercitam labels duplicados nem mutacao da ordem dos itens.
- O estilo usa tokens CSS do tema e mantem o foco visivel herdado do tema global, atendendo aos criterios visuais.

Esta etapa nao bloqueia `BUILD_COMPLETED`. Achados `critical`/`high` sao alertas para analise humana e devem virar novas tarefas quando pertinentes.
<!-- sdd:section specs.code-review-template:end -->
