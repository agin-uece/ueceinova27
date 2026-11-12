# Alterações no backend — correções de segurança e tratamento de erros

**Data:** 12/11/2026 · **Branch:** `desenvolvimento` (alterações ainda não commitadas)

Este documento descreve as cinco correções aplicadas no backend (Spring Boot) a partir da análise do código, o que muda no contrato da API e como as mudanças foram verificadas. As alterações que o **frontend precisa acompanhar** estão em [`alteracoes-frontend.md`](alteracoes-frontend.md).

## Resumo

| # | Problema | Correção |
|---|---|---|
| 1 | O JWT expirava em ~2.283 anos (`plusHours(20000000)`) | O token passa a expirar em **2 horas** |
| 2 | A recuperação de e-mail permitia tomar a conta de outro usuário: o PIN não expirava, aceitava tentativas ilimitadas e a troca de e-mail não era confirmada | PIN com validade de 10 min, máximo de 5 tentativas, intervalo de 60 s entre reenvios, códigos separados por finalidade e **confirmação obrigatória no novo e-mail** |
| 3 | `GET /pessoas/pendentes` expunha dados pessoais sem login | Rotas `/{id}` passam a aceitar só números. Pendentes de jogos e laboratórios só são visíveis para o admin e para quem os cadastrou |
| 4 | Excluir um laboratório apagava as pessoas vinculadas, e excluir um jogo apagava as proteções (PI) | `cascade ALL` removido. A exclusão apenas desvincula os registros filhos |
| 5 | Cada controller tinha `try/catch` próprio, com status HTTP errados (por exemplo, 500 para "não encontrado") | Um único `GlobalExceptionHandler`, com status corretos e corpo sempre no formato `{"erro": "..."}` |

**Testes:** 335 executados, 0 falhas. Antes das mudanças eram 316 testes, com 6 falhas.

---

## 1. Expiração do JWT

**Arquivo:** `service/TokenService.java`

- `gerarDataExpiracao()` agora retorna `Instant.now().plus(2h)`. O claim `exp` é um instante UTC, então não depende do fuso do servidor; o offset fixo `-03:00` foi removido.
- Teste novo em `TokenServiceTest`: o token expira em 2 horas.

> **Impacto:** quem estiver logado precisa refazer o login a cada 2 horas. Hoje o frontend não trata token expirado de forma global (veja o item 2 do relatório do front).

## 2. Códigos de verificação e recuperação de e-mail

### 2.1 `MfaService` (códigos de uso único)

**Arquivo:** `service/MfaService.java`

| Regra | Valor |
|---|---|
| Validade do código | 10 minutos |
| Tentativas erradas até descartar o código | 5 |
| Intervalo mínimo entre envios (recuperação) | 60 segundos |
| Comparação | tempo constante (`MessageDigest.isEqual`) |

- Os códigos são separados por **finalidade**: `MFA` (ações de admin), `RECUPERACAO_EMAIL` e `CONFIRMACAO_NOVO_EMAIL`. O PIN de uma finalidade não vale para outra. Antes, todos dividiam o mesmo mapa por id de usuário.
- A API usada pelo MFA de admin (`gerarCodigoMfa` / `validarCodigoMfa`) não mudou.
- **Limitação conhecida:** os códigos continuam em memória. Eles se perdem ao reiniciar o backend e não funcionam com mais de uma réplica. Se o sistema for escalado, devem ir para o banco ou para o Redis. A limitação está marcada com um comentário `ponytail:` no código.

### 2.2 Recuperação de e-mail: agora em 3 passos

**Arquivos:** `service/UsuarioService.java`, `controller/UsuarioController.java`, `dto/usuarios/ConcluirRecuperacaoEmailDTO.java` (novo), `dto/usuarios/ConfirmarRecuperacaoEmailDTO.java`, `config/SecurityConfig.java`

| Passo | Endpoint | O que faz | Resposta |
|---|---|---|---|
| 1 | `POST /usuarios/recuperar-email/solicitar` `{emailAtual}` | Envia um PIN ao **e-mail secundário** | **Sempre 200**, exista a conta ou não |
| 2 | `POST /usuarios/recuperar-email/confirmar` `{emailAtual, pin, novoEmailPrincipal, novoEmailSecundario}` | Valida o PIN e os novos e-mails, depois envia um código ao **novo e-mail principal**. **Ainda não altera a conta** | **202** (antes era 200 já com a troca feita) |
| 3 (novo) | `POST /usuarios/recuperar-email/concluir` `{emailAtual, codigo, novoEmailPrincipal, novoEmailSecundario}` | Valida o código do novo e-mail e aplica a troca | 200 |

- O código do passo 3 só vale para **exatamente** os e-mails informados no passo 2.
- Conta inexistente e código errado devolvem a mesma mensagem (`"Código de segurança inválido ou expirado."`). Assim a resposta não revela quais contas existem.
- `novoEmailPrincipal` e `novoEmailSecundario` agora são validados com `@Email`.

### 2.3 Enumeração de contas no "esqueci a senha"

**Arquivo:** `service/PasswordResetService.java`

`POST /auth/forgot-password` passa a responder 200 também para e-mail não cadastrado. Antes respondia 400 com "Usuário não encontrado", o que revelava quais contas existem.

## 3. Rotas que expunham dados

**Arquivos:** `resources/application.properties`, `config/SecurityConfig.java`, `service/JogoService.java`, `service/LaboratorioService.java`, `service/PessoaService.java`

- **Causa:** a regra `GET /pessoas/{id} → permitAll` também casava com `/pessoas/pendentes`.
- **Correção:**
  - As regras `/{id}` de todas as entidades agora aceitam apenas números (`{id:[0-9]+}`).
  - As rotas nomeadas (`/buscar`, `/prestadores`, `/meus`, `/minhas`) ganharam regras explícitas.
  - Qualquer rota nova que não estiver liberada cai em `anyRequest().hasRole(ADMIN)`. Ou seja, o padrão agora é fechado.
- `GET /jogos/{id}` e `GET /laboratorios/{id}` passam a seguir a mesma regra que já existia para pessoas: um item **não aprovado** responde **404**, exceto para o admin e para quem o cadastrou. `GET /pessoas/{id}` pendente também passou a responder 404 (antes respondia 500).

## 4. Remoção dos `cascade ALL`

**Arquivos:** `model/Laboratorio.java`, `model/Jogo.java`, `service/LaboratorioService.java`, `service/JogoService.java`

| Relação | Antes | Agora |
|---|---|---|
| `Laboratorio.pessoas` | `cascade = ALL`: excluir o laboratório excluía as pessoas | Sem cascade. A exclusão define `pessoa.laboratorio = null` |
| `Jogo.protecoes` | `cascade = ALL, orphanRemoval = true`: excluir o jogo excluía as proteções | Sem cascade. A exclusão define `protecao.jogo = null` |

Isso vale tanto para a exclusão direta pelo admin quanto para a exclusão aprovada a partir de uma solicitação. Há testes novos cobrindo os dois casos.

## 5. Tratamento de erros centralizado

### 5.1 O que mudou

| Arquivo | Mudança |
|---|---|
| `exception/GlobalExceptionHandler.java` (novo) | Único `@RestControllerAdvice`. Estende `ResponseEntityExceptionHandler`, então também cobre JSON malformado, `@Valid`, tipo de parâmetro inválido, 404 e 405 |
| `config/SecurityErrorHandler.java` (novo) | Respostas do Spring Security: 401 (não autenticado) e 403 (sem permissão), em JSON UTF-8 |
| `config/SecurityFilter.java` | Token inválido ou expirado não bloqueia mais a requisição: ela segue como anônima. Rotas públicas funcionam, e as protegidas recebem 401 |
| `security/GlobalSecurityHandler.java` | Removido. A lógica de MFA foi para o handler novo |
| `config/CustomAccessDeniedHandler.java` | Removido. Nunca tinha sido registrado; foi substituído pelo `SecurityErrorHandler` |
| `exception/JogoServiceException.java`, `EngineServiceException.java` | Removidos. Só serviam para embrulhar outras exceções |
| Todos os controllers | `try/catch` removidos. Assinaturas e checagens de autenticação foram mantidas |
| Todos os services | Os `catch (Exception)` que embrulhavam o erro original foram removidos. "Não encontrado" passa a usar `ResourceNotFoundException` |

### 5.2 Exceção → status HTTP

O corpo é sempre `{"erro": "mensagem"}`. Erros inesperados (500) não expõem detalhes internos e são registrados no log.

| Exceção | Status | Observação |
|---|---|---|
| `ResourceNotFoundException`, `JogoNaoEncontradoException`, `EngineNaoEncontradaException` | 404 | |
| `JogoJaExisteException`, `EngineJaExisteException`, `DataIntegrityViolationException` | 409 | A mensagem do banco não é exposta |
| `PermissaoNegadaException`, `UnauthorizedActionException`, `SecurityException`, `AccessDeniedException` | 403 | |
| `MfaRequiredException` | 403 `{"erro":"MFA_REQUIRED"}` | Envia o PIN por e-mail (igual a antes) |
| `MfaInvalidoException` | 403 `{"erro":"MFA_INVALID"}` | |
| `BadCredentialsException` / `AuthenticationException` | 401 | |
| `UsuarioNaoAutenticadoException` | 401 | |
| `BusinessException`, `IllegalArgumentException`, `TokenInvalidoException`, `TokenExpiradoException` | 400 | |
| `@Valid` falhou | 400 | Mensagem no formato `"campo: motivo; ..."` |
| JSON malformado / enum ou tipo inválido na URL | 400 | `"Requisição inválida."` |
| `EmailEnvioException`, `OllamaIntegrationException` | 503 | |
| Qualquer outra | 500 | `"Erro interno no servidor."` |

### 5.3 Mudanças visíveis no contrato da API

| Situação | Antes | Agora |
|---|---|---|
| Recurso inexistente (`GET /jogos/999`, `/pessoas/999`) | 500 | **404** |
| Rota protegida sem login ou com token expirado | 403 sem corpo | **401** `{"erro": ...}` |
| Token inválido em rota pública | 401 | **200** (tratado como anônimo) |
| Sem permissão (não é dono nem admin) | 500 | **403** |
| Nome/código duplicado (jogo, engine, banco) | 500 | **409** |
| Usuário não validado no login | 403 em texto puro | 403 `{"erro": ...}` |
| Erros de `/auth/primeiro-acesso`, `/auth/reset-password`, `/auth/register`, `/auth/login` | Texto puro | JSON `{"erro": ...}` |
| Professor edita ou exclui laboratório (vira solicitação) | 200 vazio / 204 | **202** `{"mensagem": ...}`, igual a jogos e pessoas |
| `POST /auth/login`, campo `nome` | E-mail do usuário | **Nome** do usuário |
| Header `Location` ao criar engine, linguagem, laboratório, proteção ou startup | `/api/...` (rota inexistente) | `/<entidade>/{id}` |

## Correções feitas junto

Estes problemas estavam nas linhas reescritas e foram corrigidos no mesmo passo:

- **MFA na edição de jogo.** `PUT /jogos/{id}`: a checagem de MFA acontecia **depois** de gravar a alteração, então um admin editava jogos sem PIN. Agora ela acontece antes.
- **Nome no login.** `POST /auth/login` passa a devolver o nome no campo `nome`. O `assert` (que não roda em produção) foi removido.
- **Testes do Ollama.** O `EmbeddingServiceTest` falhava porque a URL base do Ollama (`@Value`) não era injetada no teste. Os 6 testes que falhavam antes agora passam.
- **Embedding com tamanho errado.** Um embedding com dimensão diferente da esperada passa a lançar `OllamaIntegrationException` (503), e não mais `IllegalStateException`.

## Verificação

- **Testes:** 335, com 0 falhas. Há testes novos para:
  - expiração do JWT;
  - expiração, limite de tentativas, intervalo de reenvio e isolamento por finalidade dos códigos;
  - os 3 passos da recuperação de e-mail;
  - a visibilidade de jogos pendentes;
  - o desvínculo de pessoas e proteções na exclusão;
  - o mapeamento exceção → status (`GlobalExceptionHandlerTest`).
- **Aplicação rodando (perfil `dev`), conferido com `curl`:**
  - JWT com `exp` 2 h à frente.
  - `/pessoas/pendentes` responde 401 sem login e 200 para admin.
  - `/pessoas/buscar` continua público.
  - `/jogos/999` e `/pessoas/999` respondem 404.
  - Token inválido em rota pública responde 200.
  - Senha errada responde 401.
  - JSON malformado e `@Valid` respondem 400.
  - `forgot-password` e `recuperar-email/solicitar` respondem 200 para conta inexistente.
  - `confirmar` e `concluir` respondem 400 com mensagem genérica.
- **Não testado ao vivo:** fluxos que disparam e-mail real (MFA de admin, cadastro anônimo, troca de e-mail completa). Eles estão cobertos por testes unitários.

## Pendências fora deste escopo

Itens da análise que **não** foram tratados nesta rodada:

- Segredos reais versionados (`.env.example`, `application.properties_`). Mantidos por decisão do time; os segredos de produção serão outros.
- Exclusão lógica em conflito com colunas `unique` (recadastrar o e-mail ou nome de um registro excluído falha; se o admin for excluído, a aplicação não sobe).
- Índice de busca semântica dessincronizado: rejeitar um item aprovado não o remove da busca, e validar duas vezes duplica a entrada.
- MFA aplicado de forma desigual (validar pessoa ou laboratório não pede PIN), sem limite de requisições nos endpoints públicos e HTML sem escape nos e-mails.
- Os códigos de MFA e de recuperação continuam em memória (ver 2.1).
