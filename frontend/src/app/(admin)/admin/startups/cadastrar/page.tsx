"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Rocket, XCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { StartupForm } from "@/components/features/startups/StartupForm";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function CadastrarStartupPage() {
    const router = useRouter();
    // 🔐 Hook MFA – gerencia a requisição segura com possível PIN
    const { execute, isProcessing: isLoading } = useSecureAction();

    // Estado para exibir o banner de feedback visual na tela (sucesso ou erro)
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleCreate = async (payload: any) => {
        setFeedback(null); // Limpa feedbacks anteriores

        // 1. Função fetch que será executada pelo hook (com possível PIN)
        const fetchCriar = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            if (token) headers.append("Authorization", `Bearer ${token}`);
            if (pin) headers.append("X-MFA-PIN", pin);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.erro || errorData.message || "Erro ao cadastrar a startup.");
            }

            return response.json();
        };

        // 2. Callback de sucesso
        const onSucesso = () => {
            setFeedback({
                type: "success",
                message: "Startup cadastrada com sucesso! Redirecionando..."
            });
            setTimeout(() => {
                router.push("/gestao"); // Ajuste a rota de redirecionamento se preferir outra tela
            }, 1500);
        };

        // 3. Executa via useSecureAction (gerencia MFA se necessário)
        const result = await execute(fetchCriar, onSucesso);

        // 4. Tratamento de erro (caso não tenha disparado o sucesso)
        if (!result.success && result.error) {
            let mensagem = result.error;
            try {
                const erroJson = JSON.parse(result.error);
                mensagem = erroJson.erro || erroJson.message || result.error;
            } catch (e) {}

            setFeedback({
                type: "error",
                message: typeof mensagem === "string" ? mensagem : "Ocorreu um erro ao tentar cadastrar a startup. Verifique os dados e tente novamente."
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
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 text-red-600 rounded-xl border border-red-200">
                            <Rocket size={24} />
                        </div>
                        <h1 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Nova Startup/Empresa</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 mt-10">
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

                <StartupForm onSubmit={handleCreate} isLoading={isLoading} />
                
                <div className="mt-8 flex justify-center">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase hover:text-red-500 transition-colors">
                        <XCircle size={16} /> Cancelar Operação
                    </button>
                </div>
            </div>
        </main>
    );
}