"use client";

import { useMfa } from "@/components/providers/MfaProvider";
import { useState } from "react";

// useSecureAction.ts — adicionar isProcessing ao retorno
export function useSecureAction() {
    const { openMfa } = useMfa();
    const [isProcessing, setIsProcessing] = useState(false); // 👈
    

    const execute = async (action: (pin?: string) => Promise<Response>,onSuccess?: () => void) => {
        setIsProcessing(true);
        try {
            const res = await action();

            if (res.status === 403) {
                openMfa(async (pin) => {
                    const retry = await action(pin);
                    if (!retry.ok) {
                        const body = await retry.text();
                        // Tenta parsear e pegar uma mensagem legível
                        try {
                            const json = JSON.parse(body);
                            throw new Error(json.erro || json.message || json.error || "Código inválido");
                        } catch {
                            throw new Error("Código inválido");
                        }
                    }
                    onSuccess?.();
                });
                return { success: false, mfaRequired: true };
            }

            if (!res.ok) {
                const err = await res.text();
                return { success: false, error: err };
            }

            const data = await res.json().catch(() => null);
            return { success: true, data };
        } catch (err: any) {
            return { success: false, error: err.message };
        } finally {
            setIsProcessing(false); 
        }
    };

    return { execute, isProcessing }; 
}