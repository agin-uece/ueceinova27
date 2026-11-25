"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { PessoaForm } from "@/components/features/pessoas/PessoaForm";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function CadastrarPessoaPage() {
    const router = useRouter();
    const { execute, isProcessing: isLoading } = useSecureAction();

    // Estados para banner de erro no topo e modal de sucesso de 5s
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isPendingApproval, setIsPendingApproval] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const handleCreate = async (payload: any) => {
        setErrorMessage(null);

        const result = await execute(async (pin?: string) => {
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
        });

        if (result.success) {
            setIsPendingApproval(Boolean(result.isPendingApproval));
            setCountdown(5);
            setShowSuccessModal(true);
        } else if (result.error) {
            let mensagem = result.error;
            try {
                const erroJson = JSON.parse(result.error);
                mensagem = erroJson.erro || erroJson.message || result.error;
            } catch {}

            setErrorMessage(
                typeof mensagem === "string"
                    ? mensagem
                    : "Ocorreu um erro ao tentar cadastrar o talento. Verifique os dados e tente novamente."
            );
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Controla a contagem regressiva de 5 segundos e o redirecionamento
    useEffect(() => {
        if (!showSuccessModal) return;

        if (countdown <= 0) {
            router.push("/pessoas/pesquisar");
            return;
        }

        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [showSuccessModal, countdown, router]);

    return (
        <main className="min-h-screen bg-slate-50 pb-20 relative">
            {/* MODAL DE SUCESSO / ANÁLISE (5 SEGUNDOS) */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
                            isPendingApproval
                                ? "bg-amber-100 text-amber-600"
                                : "bg-emerald-100 text-emerald-600"
                        }`}>
                            {isPendingApproval ? <Clock size={36} /> : <CheckCircle2 size={36} />}
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">
                                {isPendingApproval ? "Aguarde a análise do Administrador" : "Talento Cadastrado!"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {isPendingApproval
                                    ? "Seu cadastro foi enviado e ficará disponível na plataforma após a aprovação do administrador."
                                    : "O cadastro foi realizado com sucesso e já está disponível na plataforma."}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Redirecionando em{" "}
                                <span className={`text-sm ${isPendingApproval ? "text-amber-600" : "text-emerald-600"}`}>
                                    {countdown}s
                                </span>...
                            </p>
                        </div>

                        <button
                            onClick={() => router.push("/pessoas/pesquisar")}
                            className={`w-full py-3 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors ${
                                isPendingApproval
                                    ? "bg-amber-600 hover:bg-amber-700"
                                    : "bg-emerald-600 hover:bg-emerald-700"
                            }`}
                        >
                            Ir para listagem agora
                        </button>
                    </div>
                </div>
            )}

            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Cadastrar pessoa</h1>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 mt-8">
                {/* Banner de Erro */}
                {errorMessage && (
                    <div className="mb-6 p-4 rounded-xl flex items-center gap-3 border bg-red-50 border-red-200 text-red-800">
                        <AlertCircle size={22} className="text-red-600 shrink-0" />
                        <span className="text-sm font-medium">{errorMessage}</span>
                    </div>
                )}

                <PessoaForm onSubmit={handleCreate} isLoading={isLoading} />
            </div>
        </main>
    );
}