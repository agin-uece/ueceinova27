"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wrench, Loader2 } from "lucide-react";
import { ServicoForm } from "@/components/features/servicos/ServicoForm";
import { useSecureAction } from "@/hooks/useSecureAction";

function EditarServicoContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const servicoId = searchParams.get("id");

    const [servico, setServico] = useState<any>(null);
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    
    // 🔐 Hook MFA – gerencia a requisição segura com possível PIN
    const { execute, isProcessing: isSaving } = useSecureAction();

    useEffect(() => {
        if (!servicoId) {
            router.push("/gestao/conteudo");
            return;
        }

        const carregarDados = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const headers = new Headers();
                if (token) headers.append("Authorization", `Bearer ${token}`);

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicos/${servicoId}`, { headers });

                if (res.ok) {
                    const data = await res.json();
                    setServico(data);
                } else {
                    
                }
            } catch (error) {
                console.error("Erro ao carregar serviço:", error);
            } finally {
                setIsLoadingPage(false);
            }
        };

        carregarDados();
    }, [servicoId, router]);

    const handleUpdate = async (payload: any) => {
        // 1. Função fetch que será executada pelo hook (com possível PIN)
        const fetchEditar = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            if (token) headers.append("Authorization", `Bearer ${token}`);
            if (pin) headers.append("X-MFA-PIN", pin);

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicos/${servicoId}`, {
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
                <Loader2 className="animate-spin text-teal-600" size={48} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 text-teal-600 rounded-xl border border-teal-200">
                            <Wrench size={24} />
                        </div>
                        <h1 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Editar Serviço</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 mt-10">
                <ServicoForm 
                    initialData={servico} 
                    onSubmit={handleUpdate} 
                    isLoading={isSaving} 
                />
            </div>
        </main>
    );
}

export default function PaginaEditarServico() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="animate-spin text-teal-600" size={48} /></div>}>
            <EditarServicoContent />
        </Suspense>
    );
}