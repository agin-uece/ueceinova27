import { encerrarSessaoExpirada, clearSession, getToken, isTokenExpired } from "./auth";

/**
 * Wrapper do fetch para chamadas ao backend.
 *
 * - Aceita URL completa ou caminho relativo ("/jogos"), que é prefixado com NEXT_PUBLIC_API_URL.
 * - Anexa "Authorization: Bearer <token>" se houver token e o chamador não tiver passado o header.
 * - Token já expirado: limpa a sessão e envia a requisição como anônima (rotas públicas seguem funcionando).
 * - 401 em requisição que deveria ser autenticada: limpa a sessão e redireciona para /login.
 */
export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
    const url = /^https?:\/\//.test(input) ? input : `${process.env.NEXT_PUBLIC_API_URL}${input}`;
    const headers = new Headers(init.headers);
    const token = getToken();

    if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const autenticada = headers.has("Authorization");

    if (token && isTokenExpired(token)) {
        clearSession();
        headers.delete("Authorization");
    }

    const res = await fetch(url, { ...init, headers });

    if (res.status === 401 && autenticada) {
        encerrarSessaoExpirada();
    }

    // MELHORIA 16: o tratamento de 429 (Retry-After) entra aqui.

    return res;
}
