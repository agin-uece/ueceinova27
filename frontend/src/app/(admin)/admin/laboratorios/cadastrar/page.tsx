"use client";

import { apiFetch } from "@/lib/api";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Beaker, XCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { LaboratorioForm } from "@/components/features/laboratorios/LaboratorioForm";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function CadastrarLaboratorioPage() {
    const router = useRouter();
    const { execute, isProcessing: isLoading } = useSecureAction();
    
    // Estado para banner de erro no topo e modal de sucesso centralizado
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const handleCreate = async (payload: any) => {
        setErrorMessage(null);

        const result = await execute(async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            if (token) headers.append("Authorization", `Bearer ${token}`);
            if (pin) headers.append("X-MFA-PIN", pin); 

            return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/laboratorios`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(payload)
            });
        });

        if (result.success) {
            setCountdown(5);
            setShowSuccessModal(true);
        } else if (result.error) {
            setErrorMessage(result.error);
            window.scrollTo({ top: 0, behavior: "smooth" }); // Sobe a tela para garantir que o erro seja visto
        }
    };

    // Controla a contagem regressiva de 5 segundos e o redirecionamento
    useEffect(() => {
        if (!showSuccessModal) return;

        if (countdown <= 0) {
            router.push("/laboratorios/pesquisar");
            return;
        }

        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [showSuccessModal, countdown, router]);

    return (
        <main className="min-h-screen bg-[#F8FAFC] pb-20 relative">
            {/* MODAL DE SUCESSO*/}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                            <CheckCircle2 size={36} />
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">
                                Laboratório Cadastrado!
                            </h2>
                            <p className="text-sm text-gray-500">
                                O laboratório foi criado com sucesso e já está disponível na plataforma.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Redirecionando em <span className="text-emerald-600 text-sm">{countdown}s</span>...
                            </p>
                        </div>

                        <button
                            onClick={() => router.push("/laboratorios/pesquisar")}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors"
                        >
                            Ir para listagem agora
                        </button>
                    </div>
                </div>
            )}

            <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/gestao/conteudo" className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                                <Beaker size={24} />
                            </div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight italic uppercase">Cadastrar Laboratório</h1>
                        </div>
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

                <LaboratorioForm onSubmit={handleCreate} isLoading={isLoading} />

                <div className="mt-8 flex justify-center">
                    <Link href="/gestao/conteudo" className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase hover:text-red-500 transition-colors">
                        <XCircle size={16} /> Cancelar Operação
                    </Link>
                </div>
            </div>
        </main>
    );
}