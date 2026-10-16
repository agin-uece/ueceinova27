"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProtecaoForm } from "@/components/features/protecoes/ProtecaoForm";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function CadastrarProtecaoPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [erro, setErro] = useState("");

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
        setErro("");

        // 1. Função fetch que será executada pelo hook (com possível PIN)
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
            setErro(mensagem);
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

                {erro && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 font-bold text-xs uppercase tracking-tight">
                        {erro}
                    </div>
                )}

                <ProtecaoForm onSubmit={handleCreate} isLoading={isLoading} />
            </div>
        </main>
    );
}