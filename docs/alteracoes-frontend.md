# Ajustes necessários no frontend

**Data:** 12/11/2026 · **Motivo:** correções de segurança e de tratamento de erros no backend (detalhes em [`alteracoes-backend.md`](alteracoes-backend.md))

O backend mudou alguns status HTTP e o formato de algumas respostas, e ganhou um passo novo na recuperação de e-mail. A lista abaixo está em ordem de prioridade. Os itens marcados como **Obrigatório** quebram ou degradam uma funcionalidade se não forem feitos.

| # | Prioridade | O que | Onde |
|---|---|---|---|
| 1 | **Obrigatório** | Recuperação de e-mail agora tem 3 passos | `src/app/(public)/login/page.tsx` |
| 2 | **Obrigatório** | Tratar token expirado (o JWT agora vale 2 horas) | Global: `layout.tsx` / `Header.tsx` / helper de fetch |
| 3 | **Obrigatório** | Abrir o modal de MFA só quando a resposta for `MFA_REQUIRED` | `src/hooks/useSecureAction.tsx` |
| 4 | Importante | Ler os erros como JSON `{"erro": ...}` nas rotas `/auth/*` | `primeiro-acesso`, `login/recuperar-senha`, `gestao/usuarios/novo-admin` |
| 5 | Importante | Enviar o token no `GET /pessoas/{id}` da tela de edição | `src/app/(admin)/admin/pessoas/editar/page.tsx` |
| 6 | Importante | Laboratório: tratar 202 (solicitação enviada) na edição e na exclusão | `admin/laboratorios/editar`, `laboratorios/pesquisar` |
| 7 | Ajuste fino | Novos status: 404, 401, 409, 503 | Telas que tratam erro por status |

---

## 1. Recuperação de e-mail em 3 passos (Obrigatório)

**Arquivo:** `src/app/(public)/login/page.tsx`, modos `forgot-email-step1` e `forgot-email-step2`

**Antes:** o passo 2 (`/confirmar`) já trocava o e-mail.
**Agora:** o passo 2 só valida o PIN e envia um código ao **novo e-mail principal**. A troca acontece no passo 3, num endpoint novo.

| Passo | Endpoint | Corpo | Resposta de sucesso |
|---|---|---|---|
| 1 | `POST /usuarios/recuperar-email/solicitar` | `{ emailAtual }` | **200 sempre**, mesmo se a conta não existir |
| 2 | `POST /usuarios/recuperar-email/confirmar` | `{ emailAtual, pin, novoEmailPrincipal, novoEmailSecundario }` | **202**: a troca ainda **não** foi feita |
| 3 (novo) | `POST /usuarios/recuperar-email/concluir` | `{ emailAtual, codigo, novoEmailPrincipal, novoEmailSecundario }` | 200 |

**O que mudar:**

1. **Passo 1.** A resposta é sempre 200, para não revelar se a conta existe. Troque a mensagem de sucesso por: *"Se a conta possuir um e-mail secundário cadastrado, um código foi enviado para ele."* O ramo de erro só acontece em falha real (400 de validação, 503 de e-mail).
2. **Passo 2.** Em caso de sucesso (202), **não** volte para o login. Vá para um novo modo, `forgot-email-step3`, com a mensagem *"Enviamos um código para o novo e-mail principal."*
3. **Passo 3 (novo).** Mostre um campo para o código e chame `/concluir`. Os campos `novoEmailPrincipal` e `novoEmailSecundario` precisam ser **exatamente** os enviados no passo 2. Mantenha-os no estado e não deixe o usuário editá-los nesse passo.

```tsx
// === FLUXO RECUPERAR EMAIL (PASSO 2: valida PIN e envia código ao novo e-mail) ===
else if (mode === "forgot-email-step2") {
    const res = await fetch(`${API}/usuarios/recuperar-email/confirmar`, { /* mesmo corpo de hoje */ });
    if (res.ok) {                       // 202
        setMode("forgot-email-step3");
        setSuccess("Enviamos um código de confirmação para o novo e-mail principal.");
    } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.erro || "Código inválido ou expirado.");
    }
}
// === PASSO 3 (NOVO): confirma o código recebido no novo e-mail ===
else if (mode === "forgot-email-step3") {
    const res = await fetch(`${API}/usuarios/recuperar-email/concluir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            emailAtual: formData.email,
            codigo: formData.codigoNovoEmail,          // novo campo no formulário
            novoEmailPrincipal: formData.novoEmail,     // mesmos valores do passo 2
            novoEmailSecundario: formData.novoEmailSecundario,
        }),
    });
    if (res.ok) {
        setMode("login");
        setSuccess("E-mail atualizado com sucesso! Faça login com o novo e-mail.");
    } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.erro || "Código inválido ou expirado.");
    }
}
```

**Regras de negócio que a tela deve comunicar:**
- Os códigos valem **10 minutos**.
- Após **5 tentativas erradas**, o código é descartado e é preciso pedir outro (voltar ao passo 1).
- Só é possível pedir um novo PIN a cada **60 segundos**. Pedidos mais frequentes são ignorados em silêncio, e a resposta continua sendo 200.

## 2. Token expirado (Obrigatório)

**Antes:** o JWT praticamente não expirava. **Agora:** ele expira em **2 horas**.

Hoje só a tela `gestao/perfil` trata 401. Nas demais telas protegidas, depois de 2 horas as requisições começam a falhar com 401 e a tela fica quebrada, sem levar o usuário de volta ao login.

**O que fazer:**

1. **Ao carregar a área logada** (por exemplo em `src/app/(admin)/layout.tsx` ou no `Header.tsx`), verifique o `exp` do token, que já é decodificado no login com `decodeJWT`. Se já tiver passado, faça logout.
2. **Em qualquer resposta 401 de rota protegida**, apague `userToken` e `userData` do `localStorage` e redirecione para `/login`. O ideal é centralizar isso num helper de fetch usado por todas as telas.

```ts
// exemplo de helper (src/lib/api.ts)
export async function apiFetch(input: string, init: RequestInit = {}) {
    const token = localStorage.getItem("userToken");
    const headers = new Headers(init.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${input}`, { ...init, headers });
    if (res.status === 401 && token) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        window.location.href = "/login";
    }
    return res;
}

export function tokenExpirado(token: string | null): boolean {
    const exp = token ? decodeJWT(token)?.exp : undefined;
    return !exp || exp * 1000 <= Date.now();
}
```

> Token inválido ou expirado **não** bloqueia mais as rotas públicas: elas respondem 200, tratando o usuário como visitante. Só as rotas protegidas respondem 401.

## 3. Modal de MFA só para `MFA_REQUIRED` (Obrigatório)

**Arquivo:** `src/hooks/useSecureAction.tsx`

Hoje o hook abre o modal de PIN para **qualquer** 403. Com o backend corrigido, 403 também significa "sem permissão": por exemplo, um professor tentando alterar o registro de outra pessoa (antes isso voltava como 500). Nesses casos o modal de PIN abriria sem motivo.

```tsx
const res = await action();

if (res.status === 403) {
    const body = await res.clone().json().catch(() => ({}));
    if (body.erro === "MFA_REQUIRED") {
        openMfa(async (pin) => { /* ...igual a hoje... */ });
        return { success: false, mfaRequired: true };
    }
    return { success: false, error: body.erro || "Você não tem permissão para realizar esta ação." };
}
```

Dentro do retry com PIN, o backend responde `403 {"erro":"MFA_INVALID"}` para PIN errado ou expirado. O código atual já mostra "Código inválido", mas vale trocar a mensagem por *"Código inválido ou expirado"*, porque agora o PIN vale 10 minutos e é descartado após 5 erros.

## 4. Erros das rotas `/auth/*` agora vêm em JSON (Importante)

Antes, as rotas `/auth/primeiro-acesso`, `/auth/reset-password`, `/auth/register` e `/auth/login` devolviam erros em **texto puro**. Agora devolvem `{"erro": "mensagem"}`, como o resto da API. As telas que fazem `res.text()` e mostram o texto direto passariam a exibir o JSON cru para o usuário.

| Tela | Trecho atual | Ajuste |
|---|---|---|
| `src/app/(public)/primeiro-acesso/page.tsx` | `const msg = await res.text()` | `const msg = (await res.json().catch(() => ({}))).erro ?? ""`. A detecção de `"expir"` continua funcionando |
| `src/app/(public)/login/recuperar-senha/page.tsx` | `const errMsg = await res.text()` | Ler `.erro` do JSON |
| `src/app/(admin)/gestao/usuarios/novo-admin/page.tsx` | `setError(\`Erro ao cadastrar: ${result.error}\`)`, com `result.error` vindo de `res.text()` no hook | Ler `.erro` no `useSecureAction` (no ramo `!res.ok`) e repassar só a mensagem |

O ideal é ajustar o `useSecureAction` no ramo `!res.ok` para extrair `json.erro` uma única vez:

```tsx
if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { success: false, error: body.erro || "Não foi possível concluir a operação." };
}
```

**Login:**
- Quando o usuário ainda não foi validado por um admin, a resposta é `403 {"erro": "Usuário ainda não foi validado por um administrador."}`. Hoje a tela mostra "E-mail ou senha incorretos." para qualquer erro. Vale mostrar `erro` quando o status for 403.
- O campo `nome` da resposta agora traz o **nome** do usuário (antes trazia o e-mail). A tela já usa `data.nome || formData.email`, então não é preciso mudar nada.

## 5. Tela de edição de pessoa precisa enviar o token (Importante)

**Arquivo:** `src/app/(admin)/admin/pessoas/editar/page.tsx`, linha ~67

```ts
fetch(`${process.env.NEXT_PUBLIC_API_URL}/pessoas/${id}`)   // sem Authorization
```

Uma pessoa **pendente** só é visível para o admin e para quem a cadastrou. Sem o header `Authorization`, o backend responde **404**, e a tela não carrega o registro que o próprio usuário quer editar. Envie o token, como já fazem as telas de edição de jogo e laboratório.

O mesmo vale para `GET /jogos/{id}` e `GET /laboratorios/{id}`: itens pendentes ou rejeitados agora respondem 404 sem token, ou com token de quem não é dono nem admin. As telas de edição desses dois já enviam o token. Se alguma página pública de detalhe abrir itens não aprovados, ela vai receber 404.

## 6. Laboratório: edição e exclusão por professor respondem 202 (Importante)

Quando um professor edita ou exclui o **próprio** laboratório, o backend cria uma solicitação para o admin aprovar. Antes, a resposta era **200 com corpo vazio** (edição) ou **204** (exclusão), e a tela dava a entender que a alteração já tinha sido aplicada. Agora a resposta é **202** com `{"mensagem": "Solicitação de ... enviada com sucesso. Aguardando aprovação do administrador."}`, igual a jogos e pessoas.

| Tela | Ajuste |
|---|---|
| `src/app/(admin)/admin/laboratorios/editar/page.tsx` (`handleUpdate`) | Os ramos `if (result.success) {}` e `else if (result.error) {}` estão **vazios**. Mostre `result.data.mensagem` quando houver (202) e o erro quando falhar |
| `src/app/(public)/laboratorios/pesquisar/page.tsx` (exclusão) | Com 202, mostre a mensagem de "solicitação enviada" em vez de tratar o registro como excluído |

## 7. Novos status HTTP (ajuste fino)

| Situação | Antes | Agora |
|---|---|---|
| Registro inexistente | 500 | **404** |
| Rota protegida sem login ou com token expirado | 403 | **401** (ver item 2) |
| Sem permissão | 500 | **403** (ver item 3) |
| Nome ou código duplicado | 500 | **409** |
| Falha ao enviar e-mail / busca semântica indisponível | 500 | **503** |
| Dados inválidos (`@Valid`) | 400 em formato do Spring | 400 `{"erro": "campo: motivo"}` |

Todas as respostas de erro trazem `{"erro": "mensagem legível"}`, que pode ser exibida direto ao usuário. Erros 500 trazem só `"Erro interno no servidor."`.

## Não muda nada

- Os caminhos das rotas existentes. A única rota nova é `/usuarios/recuperar-email/concluir`.
- O formato das respostas de sucesso, exceto os itens 1 e 6.
- O fluxo de MFA do admin (`403 MFA_REQUIRED`, reenvio com o header `X-MFA-PIN`).
- O formulário de "esqueci a senha": a resposta já era tratada como sucesso, e agora é 200 também para e-mail não cadastrado.
