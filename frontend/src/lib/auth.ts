// Helpers de sessão: leitura do token JWT, verificação de expiração e logout.
// O backend emite tokens com validade de 2 horas (claim "exp", em segundos desde epoch).

export const TOKEN_KEY = "userToken";
export const USER_DATA_KEY = "userData";

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

/** Retorna o "exp" do token em milissegundos, ou null se o token não tiver exp ou não puder ser lido. */
export function getTokenExpiration(token: string): number | null {
    try {
        const payload = token.split(".")[1];
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const json = JSON.parse(atob(base64));
        return typeof json.exp === "number" ? json.exp * 1000 : null;
    } catch {
        return null;
    }
}

/** Token malformado conta como expirado (o backend também o rejeitaria). */
export function isTokenExpired(token: string): boolean {
    if (token.split(".").length !== 3) return true;
    const exp = getTokenExpiration(token);
    return exp !== null && Date.now() >= exp;
}

export function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
}

let redirecionando = false;

/** Limpa a sessão e manda o usuário para o login avisando que a sessão expirou. */
export function encerrarSessaoExpirada() {
    clearSession();
    if (redirecionando || window.location.pathname === "/login") return;
    redirecionando = true;
    window.location.replace("/login?sessao=expirada");
}
