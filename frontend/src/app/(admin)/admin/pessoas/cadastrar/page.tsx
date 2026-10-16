"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PessoaForm } from "@/components/features/pessoas/PessoaForm";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function CadastrarPessoaPage() {
    const router = useRouter();
    const { execute, isProcessing: isLoading } = useSecureAction();

    const handleCreate = async (payload: any) => {
        // 1. A requisição
        const fetchCriar = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            if (token) headers.append("Authorization", `Bearer ${token}`);
            if (pin) headers.append("X-MFA-PIN", pin);

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/pessoas`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(payload)
            });
        };

        // 2. Ação de sucesso centralizada
        const onSucesso = () => {
        };

        // 3. Executa a requisição
        // O hook se encarrega de chamar o onSucesso caso o PIN seja validado
        const result = await execute(fetchCriar, onSucesso);

        // 4. Tratamento de erro (se o hook retornar sucesso, onSucesso já foi chamado!)
        if (!result.success && result.error) {
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Novo Talento</h1>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 mt-8">
                <PessoaForm onSubmit={handleCreate} isLoading={isLoading} />
            </div>
        </main>
    );
}