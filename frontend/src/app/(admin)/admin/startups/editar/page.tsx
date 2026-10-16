"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Rocket, Loader2 } from "lucide-react";
import { StartupForm } from "@/components/features/startups/StartupForm";
import { useSecureAction } from "@/hooks/useSecureAction";

function EditarStartupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const startupId = searchParams.get("id");

    const [startup, setStartup] = useState<any>(null);
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    
    // 🔐 Hook MFA – gerencia a requisição segura com possível PIN
    const { execute, isProcessing: isSaving } = useSecureAction();

    useEffect(() => {
        if (!startupId) {
            router.push("/gestao/conteudo");
            return;
        }

        const carregarStartup = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const headers = new Headers();
                if (token) headers.append("Authorization", `Bearer ${token}`);

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups/${startupId}`, { headers });

                if (res.ok) {
                    const data = await res.json();
                    setStartup(data);
                } else {
                    
                }
            } catch (error) {
                console.error("Erro ao buscar startup:", error);
            } finally {
                setIsLoadingPage(false);
            }
        };

        carregarStartup();
    }, [startupId, router]);

    const handleUpdate = async (payload: any) => {
        // 1. Função fetch que será executada pelo hook (com possível PIN)
        const fetchEditar = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            if (token) headers.append("Authorization", `Bearer ${token}`);
            if (pin) headers.append("X-MFA-PIN", pin);

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups/${startupId}`, {
                method: "PUT",
                headers: headers,
                body: JSON.stringify(payload)
            });
        };

        // 2. Callback de sucesso
        const onSucesso = () => {
           
        };

        // 3. Executa via useSecureAction (gerencia MFA se necessário)
        const result = await execute(fetchEditar, onSucesso);

        // 4. Tratamento de erro (sucesso já disparou onSucesso)
        if (!result.success && result.error) {
            let mensagem = result.error;
            try {
                const erroJson = JSON.parse(result.error);
                mensagem = erroJson.erro || erroJson.message || result.error;
            } catch (e) {}
        }
    };

    if (isLoadingPage) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-red-600" size={48} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 text-red-600 rounded-xl border border-red-200">
                                <Rocket size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Editar Startup</h1>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">ID: {startupId}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 mt-10">
                <StartupForm 
                    initialData={startup} 
                    onSubmit={handleUpdate} 
                    isLoading={isSaving} 
                />
            </div>
        </main>
    );
}

export default function PaginaEditarStartup() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-red-600" size={48} />
            </div>
        }>
            <EditarStartupContent />
        </Suspense>
    );
}