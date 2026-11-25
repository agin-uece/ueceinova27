export type UserRole = "ADMIN" | "PROFESSOR";

export interface AuthSession {
    isAuthenticated: boolean;
    role: UserRole | null;
    email: string | null;
    isAdmin: boolean;
    isProfessor: boolean;
    isVisitor: boolean;
}

const VISITOR_SESSION: AuthSession = {
    isAuthenticated: false,
    role: null,
    email: null,
    isAdmin: false,
    isProfessor: false,
    isVisitor: true,
};

export function getAuthSession(): AuthSession {
    if (typeof window === "undefined") return VISITOR_SESSION;

    const token = localStorage.getItem("userToken");
    if (!token) return VISITOR_SESSION;

    try {
        const parts = token.split(".");
        if (parts.length < 2) return VISITOR_SESSION;

        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));

        // Considera visitante se o token já expirou
        if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
            return VISITOR_SESSION;
        }

        const role: UserRole | null =
            payload.role === "ADMIN" || payload.role === "PROFESSOR"
                ? payload.role
                : null;

        if (!role) return VISITOR_SESSION;

        return {
            isAuthenticated: true,
            role,
            email: typeof payload.sub === "string" ? payload.sub : null,
            isAdmin: role === "ADMIN",
            isProfessor: role === "PROFESSOR",
            isVisitor: false,
        };
    } catch {
        return VISITOR_SESSION;
    }
}

export function isAdminUser(): boolean {
    return getAuthSession().isAdmin;
}