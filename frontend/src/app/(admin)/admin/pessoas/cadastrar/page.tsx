"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { PessoaForm } from "@/components/features/pessoas/PessoaForm";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function CadastrarPessoaPage() {
    const router = useRouter();
    const { execute, isProcessing: isLoading } = useSecureAction();

    // Estado para exibir o banner de feedback visual na tela (sucesso ou erro)
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleCreate = async (payload: any) => {
        setFeedback(null); // Limpa feedbacks anteriores

        // 1. A requisição
        const fetchCriar = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            if (token) headers.append("Authorization", `Bearer ${token}`);
            if (pin) headers.append("X-MFA-PIN", pin);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pessoas`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.erro || errorData.message || "Erro ao cadastrar o talento.");
            }

            return response.json();
        };

        // 2. Ação de sucesso centralizada
        const onSucesso = () => {
            setFeedback({
                type: "success",
                message: "Talento cadastrado com sucesso! Redirecionando..."
            });
            setTimeout(() => {
                router.push("/gestao"); // Ajuste para a rota correta de listagem de pessoas se preferir
            }, 1500);
        };

        // 3. Executa a requisição
        const result = await execute(fetchCriar, onSucesso);

        // 4. Tratamento de erro (se o hook retornar sucesso, onSucesso já foi chamado!)
        if (!result.success && result.error) {
            let mensagem = result.error;
            try {
                const erroJson = JSON.parse(result.error);
                mensagem = erroJson.erro || erroJson.message || result.error;
            } catch (e) {}

            setFeedback({
                type: "error",
                message: typeof mensagem === "string" ? mensagem : "Ocorreu um erro ao tentar cadastrar o talento. Verifique os dados e tente novamente."
            });
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Cadastrar pessoa</h1>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 mt-8">
                {/* Banner de Feedback (Sucesso ou Erro) */}
                {feedback && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
                        feedback.type === "success" 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                            : "bg-red-50 border-red-200 text-red-800"
                    }`}>
                        {feedback.type === "success" ? (
                            <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                        ) : (
                            <AlertCircle size={22} className="text-red-600 shrink-0" />
                        )}
                        <span className="text-sm font-medium">{feedback.message}</span>
                    </div>
                )}

                <PessoaForm onSubmit={handleCreate} isLoading={isLoading} />
            </div>
        </main>
    );
}