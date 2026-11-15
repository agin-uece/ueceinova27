"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ProtecaoForm } from "@/components/features/protecoes/ProtecaoForm";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function CadastrarProtecaoPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    
    // Estado para exibir o banner de feedback visual na tela (sucesso ou erro)
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const { execute, isProcessing: isLoading } = useSecureAction();

    useEffect(() => {
        const userDataStr = localStorage.getItem("userData");
        if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            if (userData.role === "ADMIN") setIsAuthorized(true);
            else router.push("/gestao");
        } else {
            router.push("/login");
        }
    }, [router]);

    const handleCreate = async (payload: any) => {
        setFeedback(null); // Limpa feedbacks anteriores

        // 1. Função fetch que será executada pelo hook (com possível PIN)
        const fetchCriar = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };
            if (token) headers["Authorization"] = `Bearer ${token}`;
            if (pin) headers["X-MFA-PIN"] = pin;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/protecoes`, {
                method: "POST",
                headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.erro || errorData.message || "Erro ao cadastrar proteção.");
            }

            return response.json();
        };

        // 2. Callback de sucesso
        const onSucesso = () => {
            setFeedback({
                type: "success",
                message: "Proteção cadastrada com sucesso! Redirecionando..."
            });
            setTimeout(() => {
                router.push("/gestao/conteudo"); // Ajuste a rota de destino se preferir
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
                message: typeof mensagem === "string" ? mensagem : "Ocorreu um erro ao tentar cadastrar a proteção. Verifique os dados e tente novamente."
            });
        }
    };

    if (!isAuthorized) return null;

    return (
        <main className="min-h-screen bg-gray-50 py-10 px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/gestao/conteudo" className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-colors">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2 italic uppercase">
                            <Shield className="text-purple-600" size={32} /> Nova Proteção
                        </h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Painel Administrativo</p>
                    </div>
                </div>

                {/* Banner de Feedback (Sucesso ou Erro) */}
                {feedback && (
                    <div className={`p-4 rounded-2xl flex items-center gap-3 border ${
                        feedback.type === "success" 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                            : "bg-red-50 border-red-200 text-red-800"
                    }`}>
                        {feedback.type === "success" ? (
                            <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                        ) : (
                            <AlertCircle size={22} className="text-red-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold uppercase tracking-tight">{feedback.message}</span>
                    </div>
                )}

                <ProtecaoForm onSubmit={handleCreate} isLoading={isLoading} />
            </div>
        </main>
    );
}