# Feature Specification: SCRUM-1110

<!-- sdd:section specs.spec-template:start -->
**Issue**: `SCRUM-1110`  
**Status**: Draft  
**Input**: Jira validado pelo refinement gate (PASS, 2a revisao, issueHash `9711307e5dd2`)

## Objetivo

A biblioteca pakitec-angular-components nao oferece feedback global temporario (toast) nem uma API consistente de estado invalido nos campos PakiInput e PakiSelect. Quem consome a biblioteca monta feedback ad hoc e o usuario final perde informacao sobre o resultado das operacoes.

Esta spec entrega o PakiToast, um componente de notificacao global e temporaria, e uma API uniforme de erro no PakiInput e no PakiSelect. O consumidor informa o resultado de uma operacao ao mesmo tempo no toast global e no erro inline do campo. O usuario final entende o que aconteceu e onde corrigir.

Termos usados nesta spec:

- Toast: notificacao global e temporaria exibida sobre o conteudo da aplicacao.
- Mensagem inline: texto de erro exibido logo abaixo do campo invalido.
- Consumidor: desenvolvedor que usa a biblioteca em uma aplicacao Angular.

## Usuarios e Cenarios

### US-001 - Feedback global via PakiToast (P1)

O consumidor dispara um toast de sucesso, erro, aviso ou informacao apos uma operacao. O usuario final le o titulo e a descricao, fecha o toast manualmente ou espera o fechamento automatico.

**Por que P1**: a biblioteca nao tem hoje nenhum canal de feedback global. Sem ele, nenhuma outra jornada de feedback funciona.  
**Teste independente**: disparar cada tipo de toast a partir de uma pagina de demonstracao e validar conteudo, fechamento manual e autodismiss, sem depender dos campos PakiInput ou PakiSelect.

**Cenarios de aceite**:

1. `AC-001` - **Dado** um consumidor que dispara um toast do tipo success com titulo e descricao, **quando** o toast aparece, **entao** ele exibe o titulo e a descricao e fecha sozinho apos 5 segundos por padrao.
2. `AC-002` - **Dado** um toast visivel de qualquer tipo, **quando** o usuario final aciona o botao de fechar, **entao** o toast sai da tela imediatamente.
3. `AC-003` - **Dado** um consumidor que configura uma duracao personalizada, **quando** o toast aparece, **entao** o autodismiss respeita a duracao configurada em vez da duracao padrao.
4. `AC-004` - **Dado** um toast do tipo error, **quando** o toast aparece sem configuracao de duracao, **entao** ele permanece na tela ate o fechamento manual.

### US-002 - Multiplas notificacoes com empilhamento seguro (P2)

O consumidor dispara varios toasts em sequencia. O usuario final ve no maximo 3 toasts por vez, em ordem de chegada, e nunca perde um toast de erro visivel.

**Por que P2**: depois do toast basico, o empilhamento protege a legibilidade e evita perda de informacao critica.  
**Teste independente**: disparar 4 ou mais toasts de tipos variados e validar o limite visivel, a ordem FIFO (first in/first out) e a retencao de erros.

**Cenarios de aceite**:

1. `AC-005` - **Dado** 3 toasts visiveis, **quando** um quarto toast chega, **entao** o toast mais antigo sai e o quarto entra, mantendo no maximo 3 visiveis.
2. `AC-006` - **Dado** 3 toasts visiveis e um deles do tipo error, **quando** um novo toast chega, **entao** o toast de erro permanece visivel e outro toast nao critico sai primeiro.
3. `AC-007` - **Dado** um toast com autodismiss ativo, **quando** o usuario final posiciona o cursor ou move o foco para o toast, **entao** a contagem pausa e retoma ao sair o cursor ou o foco.

### US-003 - Estado invalido acessivel no PakiInput e no PakiSelect (P1)

O consumidor marca um campo como invalido e define a mensagem de erro. O usuario final ve a borda vermelha, le a mensagem abaixo do campo, e a tecnologia assistiva anuncia a mensagem.

**Por que P1**: sem erro inline acessivel, o usuario final nao sabe qual campo corrigir nem o motivo.  
**Teste independente**: alternar um PakiInput e um PakiSelect entre valido e invalido em um formulario e validar borda, mensagem e attributos de acessibilidade, sem usar o PakiToast.

**Cenarios de aceite**:

1. `AC-008` - **Dado** um PakiInput em estado valido, **quando** o consumidor marca o campo como invalido e define a mensagem, **entao** a borda fica vermelha e a mensagem aparece abaixo do campo.
2. `AC-009` - **Dado** um PakiSelect em estado valido, **quando** o consumidor marca o campo como invalido e define a mensagem, **entao** o campo segue o mesmo comportamento visual do PakiInput.
3. `AC-010` - **Dado** um campo PakiInput ou PakiSelect invalido com mensagem, **quando** a tecnologia assistiva anuncia o campo, **entao** ela tambem anuncia a mensagem, por meio da associacao acessivel com o controle.
4. `AC-011` - **Dado** um campo invalido em qualquer um dos dois temas, **quando** o usuario final observa o campo, **entao** o estado invalido usa marcadores alem da cor, como a propria mensagem de texto abaixo do campo.

### US-004 - Feedback combinado em falha de salvamento (P1)

Em erro de salvamento, o consumidor mostra ao mesmo tempo o toast de erro global e o erro inline de cada campo informado. O usuario final entende a falha e sabe onde agir.

**Por que P1**: e o cenario central das regras de negocio da issue.  
**Teste independente**: simular uma falha de salvamento com um formulario e validar a presenca simultanea do toast de erro e dos erros inline.

**Cenarios de aceite**:

1. `AC-012` - **Dado** um salvamento com erro no backend, **quando** a operacao falha, **entao** o toast de erro global e o erro inline dos campos informados aparecem ao mesmo tempo.
2. `AC-013` - **Dado** um erro sem campo especifico, **quando** a operacao falha, **entao** apenas o toast de erro aparece, sem erro inline.

### US-005 - Temas, acessibilidade de movimento e publicacao da API (P2)

O consumidor usa o PakiToast e os erros inline nos temas claro e escuro da biblioteca e importa a API pelo ponto de entrada publico. O usuario final com preferencia de movimento reduzido nao ve animacoes de deslocamento.

**Por que P2**: complementa as jornadas principais com coerencia visual, acessibilidade e disponibilidade oficial da API.  
**Teste independente**: alternar o tema, ativar prefers-reduced-motion e conferir a importacao publica da API do toast.

**Cenarios de aceite**:

1. `AC-014` - **Dado** prefers-reduced-motion ativo, **quando** um toast entra ou sai da tela, **entao** nenhuma animacao de movimento e aplicada.
2. `AC-015` - **Dado** o tema claro e o tema escuro da biblioteca, **quando** um toast ou um campo invalido aparece, **entao** os tokens de cor do tema ativo se aplicam sem quebra de contraste perceptivel.
3. `AC-016` - **Dado** uma aplicacao consumidora, **quando** o consumidor importa o PakiToast pelo ponto de entrada publico da biblioteca, **entao** o componente, o servico e o container ficam disponiveis sem import interno.

## Requisitos funcionais

PakiToast:

- `FR-001`: O PakiToast suporta os tipos success, error, warning e info. Cada tipo exibe aparencia e significado proprios.
- `FR-002`: Cada toast exibe um titulo e uma descricao fornecidos pelo consumidor.
- `FR-003`: O usuario final fecha qualquer toast por um controle de fechamento visivel e acessivel.
- `FR-004`: O toast fecha sozinho apos a duracao configurada. Duracoes padrao: success 5 segundos; warning e info 7 segundos; error sem autodismiss por padrao. Toda duracao aceita configuracao pelo consumidor.
- `FR-005`: A contagem do autodismiss pausa quando o toast recebe hover ou foco e retoma quando hover e foco saem.
- `FR-006`: No maximo 3 toasts ficam visiveis. Quando um novo toast chega com o limite cheio, o mais antigo sai primeiro (FIFO).
- `FR-007`: Um toast de erro visivel nunca sai da tela por descarte automatico de empilhamento.
- `FR-008`: A posicao padrao dos toasts e o canto superior direito da tela. O consumidor configura outra posicao quando necessario.
- `FR-009`: Os toasts vivem em uma regiao live que a tecnologia assistiva anuncia quando um toast entra.
- `FR-010`: Um unico container por aplicacao consumidora recebe e empilha os toasts.
- `FR-011`: A biblioteca exporta o componente, o servico e o container do PakiToast pelo ponto de entrada publico.

PakiInput e PakiSelect:

- `FR-012`: O PakiInput e o PakiSelect expoem a mesma API de estado invalido e de mensagem de erro.
- `FR-013`: Em estado invalido, o campo exibe borda vermelha e a mensagem de erro abaixo do campo.
- `FR-014`: O campo invalido associa a mensagem ao controle com aria-describedby e marca o controle com aria-invalid.
- `FR-015`: Nenhum estado invalido depende apenas de cor. A mensagem de texto acompanha o indicador visual.
- `FR-016`: A API de erro mantem compatibilidade com ControlValueAccessor, template-driven e Reactive Forms, sem quebrar os usos atuais dos componentes.
- `FR-017`: O consumidor mostra ao mesmo tempo um toast global e um ou mais erros inline, sem interferencia mutua.

## Requisitos nao funcionais

- `NFR-001`: O PakiToast e a API de erro usam os tokens de cor dos temas claro e escuro da biblioteca. Stories e evidencias visuais cobrem os dois temas.
- `NFR-002`: Com prefers-reduced-motion ativo, nenhuma animacao de movimento ocorre na entrada ou na saida de um toast.
- `NFR-003`: A regiao live do PakiToast e a associacao acessivel dos campos seguem as praticas da WAI-ARIA (Web Accessibility Initiative - Accessible Rich Internet Applications) para anuncio por tecnologia assistiva.
- `NFR-004`: `npm run test` passa com testes unitarios dos novos comportamentos.
- `NFR-005`: `npm run build` passa sem erros.
- `NFR-006`: `npm run build-storybook` passa, com stories dos novos estados nos temas claro e escuro.
- `NFR-007`: NAO APLICAVEL - estados de loading e offline. A issue nao define esses requisitos e eles ficam fora do escopo.
- `NFR-008`: NAO APLICAVEL - performance e observabilidade. Esta e uma biblioteca de interface de usuario; o refinement registrou o aviso e nenhuma meta mensuravel se aplica.

## Entidades e Dados

- Toast: tipo (success, error, warning, info), titulo, descricao, duracao configuravel, posicao configuravel. Nasce ao ser disparado, permanece visivel ate o fechamento manual ou automatico e morre ao sair da tela. Nao contem dado sensivel.
- Mensagem de erro inline: texto associado a um campo PakiInput ou PakiSelect em estado invalido. Vive enquanto o campo permanece invalido. Nao contem dado sensivel.

## Edge Cases

- Quatro ou mais toasts em sequencia rapida: o limite de 3 visiveis e a ordem FIFO valem, com retencao de erros (`AC-005`, `AC-006`).
- Toast de erro sem duracao configurada: permanece ate fechamento manual (`AC-004`).
- Campo invalido sem mensagem definida: o estado visual vale, mas o consumidor deve informar a mensagem; em mensagem ausente, nenhuma mensagem vazia aparece abaixo do campo.
- Mensagem de erro atualizada enquanto o campo permanece invalido: o conteudo anunciado acompanha o texto atual.
- Erro sem campo especifico: apenas o toast informa a falha (`AC-013`).
- prefers-reduced-motion ativo: o toast entra e sai sem movimento (`AC-014`).
- Troca de tema durante a exibicao: o toast e o erro inline adotam os tokens do tema ativo (`AC-015`).

## Criterios de sucesso

- `SC-001`: Uma pagina de demonstracao dispara os 4 tipos de toast e o usuario final le, fecha manualmente e aguarda o autodismiss sem intervencao adicional.
- `SC-002`: Um formulario com PakiInput e PakiSelect alterna entre valido e invalido e a tecnologia assistiva anuncia a mensagem de erro em 100% dos casos testados.
- `SC-003`: Em simulacao de falha de salvamento, o toast de erro e os erros inline aparecem ao mesmo tempo, sem atraso perceptivel entre eles.
- `SC-004`: `npm run test`, `npm run build` e `npm run build-storybook` passam na mesma revisao, com stories dos novos estados nos dois temas.

## Escopo

- Componente PakiToast com servico de notificacoes e container unico na aplicacao consumidora.
- API consistente de estado invalido e mensagem de erro no PakiInput e no PakiSelect.
- Acessibilidade: regiao live, aria-describedby, aria-invalid e prefers-reduced-motion.
- Tokens dos temas claro e escuro da biblioteca.
- Exportacao da API publica do toast.
- Testes unitarios e stories nos dois temas.

## Fora de escopo

- Mapeamento de erros do backend aos campos. Essa responsabilidade fica no consumidor, por meio da API de erro dos componentes ou de setErrors dos Reactive Forms. A biblioteca documenta o padrao de uso e nao cria API utilitaria de mapeamento.

## Dependencias

- Temas claro e escuro existentes da biblioteca e seus tokens de cor.
- PakiInput e PakiSelect atuais, ja compatíveis com ControlValueAccessor.
- Ambiente de validacao do projeto: `npm run test`, `npm run build` e `npm run build-storybook`.

## Premissas

- Premissa (aceita no refinement, 2a revisao): o consumidor ja possui os temas claro e escuro configurados na aplicacao.
- Premissa (aceita no refinement, 2a revisao): a duracao padrao de success e 5 segundos; warning e info usam 7 segundos; error nao fecha sozinho por padrao. Todas aceitam configuracao.
- Premissa (aceita no refinement, 2a revisao): o limite de toasts visiveis e 3, com descarte FIFO e retencao de erros.
- Premissa (aceita no refinement, 2a revisao): a posicao padrao e o canto superior direito.
- Premissa (aceita no refinement, 2a revisao): o autodismiss pausa em hover ou foco.
- Fato (regra de negocio registrada na issue): erros sem campo especifico aparecem apenas no toast.
- Fato (regra de negocio registrada na issue): nenhum estado de erro depende apenas de cor.

## Rastreabilidade

- `FR-001` a `FR-005` -> `US-001` -> `AC-001` a `AC-004` -> `SC-001`.
- `FR-006` e `FR-007` -> `US-002` -> `AC-005` e `AC-006` -> `SC-001`.
- `FR-005` -> `US-002` -> `AC-007` -> `SC-001`.
- `FR-012` a `FR-016` -> `US-003` -> `AC-008` a `AC-011` -> `SC-002`.
- `FR-017` -> `US-004` -> `AC-012` e `AC-013` -> `SC-003`.
- `FR-008` a `FR-011` e `NFR-001` a `NFR-003` -> `US-005` -> `AC-014` a `AC-016` -> `SC-004`.
- `NFR-004` a `NFR-006` -> todas as jornadas -> `SC-004`.

## Clarificacoes

Nenhuma marcacao `[NEEDS CLARIFICATION]` permanece nesta spec. O refinement gate aprovou a issue na 2a revisao com hash `9711307e5dd2`. Se surgir uma lacuna, volte ao Jira e execute novamente o refinement gate.

## Gate da Spec

`READY` somente com `checklist.md` aprovado.
<!-- sdd:section specs.spec-template:end -->
