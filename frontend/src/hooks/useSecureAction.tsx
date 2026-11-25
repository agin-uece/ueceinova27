"use client";

import { useMfa } from "@/components/providers/MfaProvider";
import { isAdminUser } from "@/lib/auth";
import { useState } from "react";

export interface SecureActionResult {
    success: boolean;
    data?: any;
    error?: string;
    mfaRequired?: boolean;
    isAdmin?: boolean;
    isPendingApproval?: boolean;
}

export function useSecureAction() {
    const { openMfa } = useMfa();
    const [isProcessing, setIsProcessing] = useState(false);

    const execute = async (
        action: (pin?: string) => Promise<Response>,
        onSuccess?: () => void
    ): Promise<SecureActionResult> => {
        setIsProcessing(true);
        try {
            const res = await action();

            if (!res.ok) {
                const body = await res.text();
                let json: any = null;
                try {
                    json = JSON.parse(body);
                } catch {}

                const erroCode = json?.erro || json?.error;

                // 1. Abre o modal APENAS se for 403 com {"erro": "MFA_REQUIRED"}
                if (res.status === 403 && erroCode === "MFA_REQUIRED") {
                    return new Promise<SecureActionResult>((resolve) => {
                        openMfa(async (pin) => {
                            try {
                                const retry = await action(pin);
                                if (!retry.ok) {
                                    const retryBody = await retry.text();
                                    let retryJson: any = null;
                                    try {
                                        retryJson = JSON.parse(retryBody);
                                    } catch {}

                                    const retryErro = retryJson?.erro || retryJson?.error;

                                    if (retryErro === "MFA_INVALID") {
                                        throw new Error("Código inválido ou expirado");
                                    }

                                    const fallbackMsg =
                                        retryJson?.erro ||
                                        retryJson?.message ||
                                        retryJson?.error ||
                                        "Código inválido ou expirado";
                                    throw new Error(fallbackMsg);
                                }

                                const data = await retry.json().catch(() => null);
                                const isAdmin = isAdminUser();
                                onSuccess?.();
                                resolve({ success: true, data, isAdmin, isPendingApproval: !isAdmin });
                            } catch (err: any) {
                                resolve({ success: false, error: err.message });
                                throw err;
                            } finally {
                                setIsProcessing(false);
                            }
                        });
                    });
                }

                // 2. Demais erros 403 (sem permissão) ou outros status HTTP
                const defaultForbiddenMsg =
                    res.status === 403
                        ? "Você não tem permissão para realizar esta ação."
                        : "Ocorreu um erro ao processar a solicitação.";

                const msg =
                    json?.erro ||
                    json?.message ||
                    json?.error ||
                    (body && !body.startsWith("<") ? body : defaultForbiddenMsg);

                setIsProcessing(false);
                return { success: false, error: msg };
            }

            const data = await res.json().catch(() => null);
            const isAdmin = isAdminUser();
            onSuccess?.();
            setIsProcessing(false);
            return { success: true, data, isAdmin, isPendingApproval: !isAdmin };
        } catch (err: any) {
            setIsProcessing(false);
            return { success: false, error: err.message || "Erro de conexão com o servidor." };
        }
    };

    return { execute, isProcessing };
}
