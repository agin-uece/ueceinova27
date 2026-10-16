"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Beaker, XCircle } from "lucide-react";
import { LaboratorioForm } from "@/components/features/laboratorios/LaboratorioForm";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function CadastrarLaboratorioPage() {
    const router = useRouter();
    const { execute, isProcessing: isLoading } = useSecureAction();

    const handleCreate = async (payload: any) => {
        const result = await execute(async (pin?: string) => {
            const token = localStorage.getItem("userToken");

            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            if (token) headers.append("Authorization", `Bearer ${token}`);
            if (pin) headers.append("X-MFA-PIN", pin); 

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/laboratorios`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(payload)
            });
        });

        if (result.success) {
            router.push("/laboratorios/pesquisar");
        } else if (result.error) {
        }
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC] pb-20">
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