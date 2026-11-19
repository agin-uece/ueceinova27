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

    // Estados para banner de erro no topo e modal de sucesso de 5s
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [countdown, setCountdown] = useState(5);

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
        setErrorMessage(null);

        // 1. Função fetch pura que será executada pelo hook (com possível PIN)
        const fetchCriar = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };
            if (token) headers["Authorization"] = `Bearer ${token}`;
            if (pin) headers["X-MFA-PIN"] = pin;

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/protecoes`, {
                method: "POST",
                headers,
                body: JSON.stringify(payload),
            });
        };

        // 2. Callback de sucesso
        const onSucesso = () => {
            setCountdown(5);
            setShowSuccessModal(true);
        };

        // 3. Executa via useSecureAction (gerencia MFA se necessário)
        const result = await execute(fetchCriar, onSucesso);

        // 4. Tratamento de erro (caso não tenha disparado o sucesso)
        if (!result.success && result.error) {
            let mensagem = result.error;
            try {
                const erroJson = JSON.parse(result.error);
                mensagem = erroJson.erro || erroJson.message || result.error;
            } catch {}

            setErrorMessage(
                typeof mensagem === "string"
                    ? mensagem
                    : "Ocorreu um erro ao tentar cadastrar a proteção. Verifique os dados e tente novamente."
            );
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Controla a contagem regressiva de 5 segundos e o redirecionamento
    useEffect(() => {
        if (!showSuccessModal) return;

        if (countdown <= 0) {
            router.push("/protecoes/pesquisar");
            return;
        }

        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [showSuccessModal, countdown, router]);

    if (!isAuthorized) return null;

    return (
        <main className="min-h-screen bg-gray-50 py-10 px-6 lg:px-8 relative">
            {/* MODAL DE SUCESSO */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                            <CheckCircle2 size={36} />
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">
                                Proteção Cadastrada!
                            </h2>
                            <p className="text-sm text-gray-500">
                                A proteção intelectual foi registrada com sucesso e já está disponível na plataforma.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Redirecionando em <span className="text-emerald-600 text-sm">{countdown}s</span>...
                            </p>
                        </div>

                        <button
                            onClick={() => router.push("/protecoes/pesquisar")}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors"
                        >
                            Ir para listagem agora
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/gestao/conteudo" className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-colors">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2 italic uppercase">
                            <Shield className="text-purple-600" size={32} /> Cadastrar Proteção
                        </h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Painel Administrativo</p>
                    </div>
                </div>

                {/* Banner de Erro */}
                {errorMessage && (
                    <div className="p-4 rounded-2xl flex items-center gap-3 border bg-red-50 border-red-200 text-red-800">
                        <AlertCircle size={22} className="text-red-600 shrink-0" />
                        <span className="text-sm font-medium">{errorMessage}</span>
                    </div>
                )}

                <ProtecaoForm onSubmit={handleCreate} isLoading={isLoading} />
            </div>
        </main>
    );
}