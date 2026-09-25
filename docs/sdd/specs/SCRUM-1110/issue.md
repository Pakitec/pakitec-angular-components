# Snapshot da issue SCRUM-1110

<!-- sdd:section specs.issue-template:start -->
- Jira: `SCRUM-1110`
- Projeto: `SCRUM`
- Status no momento do planejamento: `Em andamento`
- Capturado em: `2026-09-25T00:55:00-03:00`
- Hash normalizado: `9711307e5dd2`

## Resumo

PakiToast e estados de erro padronizados no PakiInput e PakiSelect.

## Descricao

Ator: desenvolvedor que consome a biblioteca pakitec-angular-components.

Problema: a biblioteca nao tem feedback global temporario (toast). Os campos PakiInput e PakiSelect nao expoem uma API consistente de estado invalido com mensagem acessivel.

Resultado: um PakiToast reutilizavel e uma API de erro uniforme nos dois campos. O consumidor mostra ao mesmo tempo o toast global da operacao e o erro inline do campo.

Escopo — PakiToast:

- Cria o componente standalone PakiToast com servico e container para empilhar notificacoes.
- Suporta os tipos success, error, warning e info, com titulo e descricao.
- Permite fechamento manual e desaparecimento automatico com duracao configuravel.
- Define comportamento seguro para multiplas notificacoes (limite visivel e empilhamento).
- Usa os tokens dos temas claro e escuro da biblioteca.
- Garante acessibilidade com regiao live anunciada por tecnologia assistiva.
- Respeita prefers-reduced-motion nas animacoes.
- Exporta a API publica necessaria no public-api.ts.

Escopo — PakiInput e PakiSelect:

- Adiciona API consistente nos dois componentes: estado invalido e mensagem de erro.
- Exibe borda vermelha no estado invalido e a mensagem abaixo do campo.
- Associa a mensagem ao controle com aria-describedby e aria-invalid. O erro nao depende apenas de cor.
- Mantem compatibilidade com os usos atuais dos componentes (ambos ja sao ControlValueAccessor) e com template-driven e Reactive Forms.
- Permite mostrar simultaneamente o toast global e o erro especifico do campo.

Fora de escopo:

- Mapeamento de erros do backend aos campos. Essa responsabilidade fica no consumidor; a biblioteca apenas documenta o padrao de uso.

Padrao de uso esperado:

- Toast para feedback global e temporario da operacao.
- Mensagem inline para indicar o campo invalido e o motivo.
- Em salvamento bem-sucedido, toast de sucesso.
- Em erro de salvamento, toast de erro e destaque dos campos identificados pelo backend ou pela validacao local.

Criterios de aceite:

1. Dado um consumidor que dispara um toast do tipo success, quando o toast aparece, entao ele exibe titulo e descricao, fecha sozinho apos a duracao configurada e permite fechamento manual.
2. Dado um campo PakiInput ou PakiSelect em estado invalido, quando a mensagem de erro e definida, entao a borda fica vermelha, a mensagem aparece abaixo do campo e a tecnologia assistiva anuncia a mensagem pela associacao acessivel com o controle.
3. Dado um salvamento com erro no backend, quando a operacao falha, entao o toast de erro global e o erro inline do campo aparecem ao mesmo tempo.
4. Dado prefers-reduced-motion ativo, quando um toast entra ou sai da tela, entao nenhuma animacao de movimento e aplicada.
5. Dado o build da biblioteca, quando rodam npm run test, npm run build e npm run build-storybook, entao todos passam, com testes unitarios e stories cobrindo os novos estados nos temas claro e escuro.

Decisoes registradas:

- Mapeamento backend->campos: responsabilidade do consumidor, usando a API de erro dos componentes e/ou setErrors dos Reactive Forms. A biblioteca nao cria API utilitaria; documenta apenas o padrao de uso.
- Duracao padrao: success 5s; warning e info 7s; error sem autodismiss por padrao (fechamento manual). Todas as duracoes sao configuraveis.
- Empilhamento: maximo de 3 toasts visiveis; os mais antigos saem primeiro (FIFO, first in/first out); toast de erro visivel nunca e descartado automaticamente.
- Posicao padrao: canto superior direito, configuravel pelo consumidor.
- Autodismiss pausa quando o toast recebe hover ou foco e retoma ao sair.

## Criterios e campos personalizados

Regras de negocio (customfield_10079):

- O toast comunica o resultado global e temporario de uma operacao (sucesso, erro, aviso ou informacao). A mensagem inline identifica o campo invalido e o motivo.
- Em erro de salvamento, o sistema mostra o toast de erro e destaca os campos indicados pelo backend ou pela validacao local. Erros sem campo especifico aparecem apenas no toast. Nenhum estado de erro depende apenas de cor.

Detalhes tecnicos (customfield_10081):

- Componentes standalone com OnPush, signals e ControlValueAccessor, seguindo o padrao ja adotado na biblioteca. PakiToast expoe componente, servico de notificacoes e container unico na aplicacao consumidora; API exportada no public-api.ts.
- PakiInput ja possui input error e precisa alinhar semantica e acessibilidade; PakiSelect recebe a mesma API. Estilos usam os tokens de tema claro e escuro existentes.
- Validacao obrigatoria: npm run test, npm run build e npm run build-storybook, com testes unitarios, stories e evidencias visuais oficiais nos dois temas.

Observacao: o campo de historia do usuario (customfield_10077) contem template vazio na issue; a especificacao deriva as jornadas da descricao e das regras de negocio.

## Anexos relevantes

A issue nao possui anexos. O manifesto `assets/manifest.json` esta vazio.

## Subtarefas existentes

- `SCRUM-1111` — [SDD][SPEC] Specification (Em andamento).
- `SCRUM-1112` — [SDD][RESEARCH] Technical Research (A fazer).
- `SCRUM-1113` — [SDD][PLAN] Technical Plan (A fazer).

Este arquivo e um snapshot para rastreabilidade. A issue Jira continua sendo a fonte da demanda.
<!-- sdd:section specs.issue-template:end -->
