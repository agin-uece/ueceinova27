"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Gamepad2, CheckCircle2, AlertCircle } from "lucide-react";
import { JogoForm } from "@/components/features/jogos/JogoForm";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function CadastroJogoPage() {
    const { execute, isProcessing: isSaving } = useSecureAction();
    const router = useRouter();

    // Estados para banner de erro no topo e modal de sucesso de 5s
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const handleCreate = async (formData: any) => {
        setErrorMessage(null);

        const result = await execute((pin?: string) => {
            const token = localStorage.getItem("userToken");
            const payload = { ...formData, engineId: formData?.engineId ? Number(formData.engineId) : null };
            
            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                    ...(pin && { "X-MFA-PIN": pin }),
                },
                body: JSON.stringify(payload)
            });
        });

        if (result.success) {
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
                    : "Ocorreu um erro ao tentar cadastrar o jogo. Verifique os dados e tente novamente."
            );
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Controla a contagem regressiva de 5 segundos e o redirecionamento
    useEffect(() => {
        if (!showSuccessModal) return;

        if (countdown <= 0) {
            router.push("/jogos/pesquisar");
            return;
        }

        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [showSuccessModal, countdown, router]);

    return (
        <main className="min-h-screen bg-[#F8FAFC] pb-20 relative">
            {/* MODAL DE SUCESSO (5 SEGUNDOS) */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                            <CheckCircle2 size={36} />
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">
                                Jogo Cadastrado!
                            </h2>
                            <p className="text-sm text-gray-500">
                                O jogo foi registrado com sucesso e já está disponível na plataforma.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Redirecionando em <span className="text-emerald-600 text-sm">{countdown}s</span>...
                            </p>
                        </div>

                        <button
                            onClick={() => router.push("/jogos/pesquisar")}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors"
                        >
                            Ir para listagem agora
                        </button>
                    </div>
                </div>
            )}

            {/* CABEÇALHO COM BOTÃO VOLTAR */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-all"
                        title="Voltar"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-modulo-jogos-bg text-modulo-jogos rounded-xl">
                            <Gamepad2 size={24} />
                        </div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight italic uppercase">
                            Cadastrar Jogo
                        </h1>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 mt-10">
                {/* Banner de Erro */}
                {errorMessage && (
                    <div className="mb-6 p-4 rounded-xl flex items-center gap-3 border bg-red-50 border-red-200 text-red-800">
                        <AlertCircle size={22} className="text-red-600 shrink-0" />
                        <span className="text-sm font-medium">{errorMessage}</span>
                    </div>
                )}

                <JogoForm onSubmit={handleCreate} isLoading={isSaving} />
            </div>
        </main>
    );
}