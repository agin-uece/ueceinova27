"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wrench, XCircle } from "lucide-react";
import { ServicoForm } from "@/components/features/servicos/ServicoForm";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function CadastrarServicoPage() {
    const router = useRouter();
    // 🔐 Hook MFA – gerencia a requisição segura com possível PIN
    const { execute, isProcessing: isLoading } = useSecureAction();

    const handleCreate = async (payload: any) => {
        // 1. Função fetch que será executada pelo hook (com possível PIN)
        const fetchCriar = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            if (token) headers.append("Authorization", `Bearer ${token}`);
            if (pin) headers.append("X-MFA-PIN", pin);

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicos`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(payload)
            });
        };

        // 2. Callback de sucesso
        const onSucesso = () => {
            
        };

        // 3. Executa via useSecureAction (gerencia MFA se necessário)
        const result = await execute(fetchCriar, onSucesso);

        // 4. Tratamento de erro (sucesso já disparou onSucesso)
        if (!result.success && result.error) {
            let mensagem = result.error;
            try {
                const erroJson = JSON.parse(result.error);
                mensagem = erroJson.erro || erroJson.message || result.error;
            } catch (e) {}
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 text-teal-600 rounded-xl border border-teal-200">
                            <Wrench size={24} />
                        </div>
                        <h1 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Novo Serviço</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 mt-10">
                <ServicoForm onSubmit={handleCreate} isLoading={isLoading} />
                
                <div className="mt-8 flex justify-center">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase hover:text-red-500 transition-colors">
                        <XCircle size={16} /> Cancelar Operação
                    </button>
                </div>
            </div>
        </main>
    );
}