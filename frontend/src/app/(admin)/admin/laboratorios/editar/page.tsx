"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Beaker, Loader2 } from "lucide-react";

import { LaboratorioForm } from "@/components/features/laboratorios/LaboratorioForm";
import { useSecureAction } from "@/hooks/useSecureAction";

function EditarLaboratorioContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const labId = searchParams.get("id");

    const [lab, setLab] = useState<any>(null);
    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const { execute, isProcessing: isSaving } = useSecureAction();

    useEffect(() => {
        if (!labId) {
            router.push("/gestao/conteudo");
            return;
        }

        const carregarLaboratorio = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const headers = new Headers();
                if (token) headers.append("Authorization", `Bearer ${token}`);

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/laboratorios/${labId}`, { headers });

                if (res.ok) {
                    const data = await res.json();
                    setLab(data);
                } else {
                    router.push("/gestao/conteudo");
                }
            } catch (error) {
                console.error("Erro ao buscar laboratório:", error);
            } finally {
                setIsLoadingPage(false);
            }
        };

        carregarLaboratorio();
    }, [labId, router]);

    const handleUpdate = async (payload: any) => {
        const result = await execute(async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            
            if (token) headers.append("Authorization", `Bearer ${token}`);
            if (pin) headers.append("X-MFA-PIN", pin); // 🛡️ Injeção do PIN caso necessário

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/laboratorios/${labId}`, {
                method: "PUT",
                headers: headers,
                body: JSON.stringify(payload)
            });
        });

        if (result.success) {
        } else if (result.error) {
        }
    };

    if (isLoadingPage) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 pb-20 text-black">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/gestao/conteudo" className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg border border-blue-200">
                                <Beaker size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-black tracking-tight leading-none">Editar Laboratório</h1>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">ID: {labId}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 mt-8">
                {/* isSaving agora é gerenciado com segurança pelo hook */}
                <LaboratorioForm 
                    initialData={lab} 
                    onSubmit={handleUpdate} 
                    isLoading={isSaving} 
                />
            </div>
        </main>
    );
}

export default function PaginaEditarLaboratorio() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        }>
            <EditarLaboratorioContent />
        </Suspense>
    );
}