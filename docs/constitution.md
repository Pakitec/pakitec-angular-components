<!-- pakitec-sdd:start -->
## Constituição de desenvolvimento

Antes de planejar ou alterar código, leia e siga todos os padrões detectados:

- `docs/sdd/templates/angular.md`

Regras específicas do projeto escritas fora deste bloco prevalecem quando forem mais restritivas.

### Validação mínima

- `npm run test`
- `npm run build`

### Jira

Este workspace usa o perfil Jira `pakitec` e o projeto `SCRUM`.

### Evidência visual de frontend

Aplique estas regras somente quando a issue tem requisito de frontend. Issues sem frontend não dependem do servidor de navegador e mantêm o comportamento atual.

- Declare os criterios visuais no workflow antes das capturas. Bloco visual presente e invalido bloqueia o QA; somente a ausencia preserva issues sem frontend.
- Cada critério `AC-*` visual exige uma evidência oficial (`kind = official`). Captura exploratória ou de falha não aprova o critério.
- O QA não atinge `QA_PASSED` sem a evidência oficial obrigatória, nem quando o servidor de navegador está indisponível, com versão abaixo de `v0.0.78` ou com tools ausentes.
- A validação lê os arquivos por caminho seguro em `evidence/<ISSUE-KEY>/`. Rejeite caminho com `..`, symlink externo ou arquivo irregular, com motivo.
- Nenhum anexo, comentário ou retorno de tool expõe Base64, cookies, headers de autenticação, logs brutos ou dados pessoais.
- A integridade de cada arquivo usa SHA-256, base para conferência e para idempotência da publicação.
- PNG oficial acima de 10 MB permanece local, marcado para não publicação, e nunca sobe ao Jira.

### Padrão de escrita técnica (PT-BR)

Padronize a documentação técnica e os comentários de código em português brasileiro, com linguagem simples e estrutura consistente. Referências: ABNT NBR ISO 24495-1:2024 (Linguagem Simples) e ASD-STE100 (Simplified Technical English); adote um modelo inspirado no ASD-STE100 em português.

**Regras gerais**

- Escreva para humanos: prefira "Busca o usuário pelo CPF" a "Realiza a busca do usuário através do CPF informado".
- Use voz ativa: "O sistema envia o e-mail", não "O e-mail é enviado pelo sistema".
- Use frases curtas: até 25 palavras (máximo recomendado de 30) e uma ideia por frase.
- Use verbos específicos (cria, remove, busca, envia, valida, calcula, converte, autentica, atualiza, sincroniza) e evite verbos vagos (realiza, efetua, procede, executa, manipula).
- Evite palavras vazias: devidamente, corretamente, basicamente, simplesmente, supracitado, "através de" (use "por" ou "com"), "eventualmente" no sentido de "talvez", "diversos"/"vários"/"alguns" quando puder especificar.
- Seja objetivo: "Calcula o valor do imposto", não "Esta função possui a responsabilidade de realizar o cálculo...".
- Use sempre o mesmo termo para o mesmo conceito; não alterne sinônimos (usuário/cliente/operador). Escolha um termo por domínio.
- Explique cada sigla na primeira ocorrência — CPF (Cadastro de Pessoas Físicas) — e depois use só a sigla.

**Comentários**

Comentários explicam o motivo, a regra de negócio, decisões arquiteturais e limitações. Não repita o código nem documente o óbvio.

- Ruim: `i++; // incrementa i`
- Bom: `// Evita ultrapassar o limite definido pela Receita Federal.` seguido de `i++;`

**Documentação de APIs**

Use o padrão oficial da linguagem (TSDoc, JSDoc, JavaDoc, DartDoc, docstrings Python) e documente propósito, parâmetros, retorno, exceções e efeitos colaterais.

**Glossário**

Todo projeto mantém um glossário oficial (ex.: Usuário = pessoa autenticada no sistema; Cliente = empresa contratante). Nunca use sinônimos sem necessidade.

**Checklist antes de concluir**

Português brasileiro; voz ativa; frases curtas; um conceito por frase; sem redundância; não repete o código; usa termos do glossário; explica regras de negócio, exceções e efeitos colaterais; sem palavras vagas.

**Princípio**

A documentação deve responder rapidamente: o que faz; quando usar; o que recebe; o que retorna; o que pode dar errado; quais regras de negócio importantes existem; quais efeitos colaterais existem. Se alguma resposta não estiver clara, revise.
<!-- pakitec-sdd:end -->
