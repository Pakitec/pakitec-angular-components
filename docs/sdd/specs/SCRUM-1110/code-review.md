# Revisao de Codigo SCRUM-1110

<!-- sdd:section specs.code-review-template:start -->
Revisao final consultiva executada apos `QA: PASS`, via Open Code Review em modo delegation. Consultiva: registra achados para analise, nunca bloqueia a conclusao da issue.

## Status

`REVIEWED`

- Branch `feat/scrum-1110-toast-error-states`, HEAD `0f2275b`, diff `master...HEAD` (merge base `d053898`).
- Executada em 2026-09-25, apos QA PASS ciclo 2/3 (comentario 14024).

## Comandos OCR executados

| Comando | Resultado |
| --- | --- |
| `npx -y @alibaba-group/open-code-review delegate preview --from master --to HEAD` | 22 arquivos revisaveis de 58. Ficaram de fora os PNG, os `.md` e os `*.spec.ts` (regra `default_path`) |
| `npx -y @alibaba-group/open-code-review delegate rule <19 arquivos de src>` | Grupo 1 `**/*.{ts,js,...}`: qualidade, null checks, async e seguranca (XSS, innerHTML, eval). Grupo 2 `default`: corretude, seguranca, performance, manutencao e testes (HTML/SCSS) |

## Arquivos revisados

- `lib/components/toast/`: `paki-toast.service.ts`, `paki-toast-container.ts/.html/.scss`, `paki-toast.ts/.html/.scss`, `paki-toast.models.ts`
- `lib/components/input/`: `paki-input.ts/.html/.scss`
- `lib/components/select/`: `paki-select.component.ts/.html/.scss`
- `lib/components/index.ts`, `styles/pakitec-theme.scss`
- `stories/toast.stories.ts`, `stories/input.stories.ts`, `stories/select.stories.ts`
- Os specs foram lidos so para confirmar a cobertura. Os artefatos SDD (`workflow.json` e manifests) nao foram revisados como codigo.

## Achados por severidade

### Critical

Nenhum.

### High

Nenhum.

### Medium

- **CR-M1** `paki-toast.service.ts:234-240`: se os 3 toasts visiveis forem erros e chegar um toast que nao e erro, `enforceStackLimit` escolhe o proprio toast novo como o "nao critico mais antigo". O toast entra em `leaving` na mesma chamada e some em cerca de 300 ms. O usuario perde o feedback sem aviso. O comentario da linha 232 diz que a fila "cresce alem de 3", mas isso so vale quando o toast novo tambem e erro. O teste `paki-toast.service.spec.ts:173-179` cobre so 4 erros. A spec nao define esse caso (AC-006 fala de "um deles do tipo error"). Recomendacao: definir a regra com o produto. Opcoes: deixar a fila crescer, ou aguardar um erro sair. Depois, corrigir o comentario e cobrir o caso com um teste.

### Low

- **CR-L1** `paki-toast.scss:17-20`: a saida usa sempre `translateX(120%)`, para a direita. Nas posicoes `top-left` e `bottom-left` (`paki-toast-container.scss:20-33`), o toast atravessa o conteudo em vez de sair pela borda mais proxima. Recomendacao: definir o sentido pela posicao, por exemplo com uma custom property por classe `paki-toast-stack--*-left`.
- **CR-L2** `paki-toast.service.ts:211,221,269`: `duration` nao tem limite superior. O `setTimeout` com valor acima de 2^31-1 ms, ou com `Infinity`, dispara na hora e o toast some logo. Recomendacao: validar o valor com `Number.isFinite` e um limite maximo, ou documentar que `0` e o unico jeito de manter o toast na tela.
- **CR-L3** `paki-select.component.html:68-72` (mesmo padrao ja existente em `paki-input.html:41-45`): as mensagens de erro e de hint ficam dentro do `<label>` que envolve o campo. O texto delas entra no nome acessivel e tambem na descricao (`aria-describedby`), entao o leitor de tela le a mensagem duas vezes. Recomendacao: mover o `<small>` para fora do `<label>` ou ligar o label ao campo por `for`/`id`.
- Os Low ja registrados no QA (L-1 a L-7 em `qa.md`) continuam validos e nao foram repetidos aqui. L-3 (`error().length` com null) e L-4 (`instanceCount` sem `ngOnDestroy`) foram confirmados.

### Info

- **CR-I1** `paki-toast.service.ts:256` e `129-136`: o `setTimeout` que remove o toast depois da fase `leaving` nao e guardado. Por isso `dismissAll` nao o cancela. Nao causa efeito visivel: `dismiss` ignora id desconhecido e os ids nao se repetem.
- **CR-I2** `paki-toast-container.html:11` e `paki-toast.service.ts:123-126`: ao fechar pelo botao, o toast sai do DOM e o foco volta para o `body`. Avaliar se o foco deve voltar ao elemento que tinha o foco antes.
- **CR-I3** `stories/toast.stories.ts:68`: usa `$any($event.target)`. Aceitavel porque e codigo de story.

## Observacoes

- Seguranca: nao ha `innerHTML`, `bypassSecurity*`, `eval` nem `new Function`. Titulo, descricao e mensagens usam interpolacao com escape. Nao ha secrets.
- Concorrencia: o servico roda numa unica thread (JS). A pausa e a retomada sao idempotentes (`paused`), e `cancelTimer` limpa o estado em todos os caminhos de saida.
- Performance: nao ha loop custoso. O `effect` do container percorre sets pequenos, limitados aos toasts visiveis.
- A issue, os comentarios e os anexos nao trouxeram instrucao para mudar o comportamento, o tooling ou os gates.

Esta etapa nao bloqueia `BUILD_COMPLETED`. Achados `critical`/`high` sao alertas para analise humana e devem virar novas tarefas quando pertinentes.
<!-- sdd:section specs.code-review-template:end -->
