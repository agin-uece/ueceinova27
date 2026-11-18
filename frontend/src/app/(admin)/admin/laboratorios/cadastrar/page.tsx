"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Beaker, XCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { LaboratorioForm } from "@/components/features/laboratorios/LaboratorioForm";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function CadastrarLaboratorioPage() {
    const router = useRouter();
    const { execute, isProcessing: isLoading } = useSecureAction();
    
    // Estados para feedback visual na tela
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleCreate = async (payload: any) => {
        setFeedback((sum: any) => null); // Limpa feedbacks anteriores

        const result = await execute(async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            if (token) headers.append("Authorization", `Bearer ${token}`);
            if (pin) headers.append("X-MFA-PIN", pin); 

            // Retorna o fetch puro (Response) sem dar .json() ou throw aqui dentro!
            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/laboratorios`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(payload)
            });
        });

        if (result.success) {
            setFeedback({ type: "success", message: "Laboratório cadastrado com sucesso!" });
            setTimeout(() => router.push("/laboratorios/pesquisar"), 1500);
        } else if (result.error) {
            setFeedback({ type: "error", message: result.error });
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
                {/* Banner de Feedback (Sucesso ou Erro) */}
                {feedback && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
                        feedback.type === "success" 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                            : "bg-red-50 border-red-200 text-red-800"
                    }`}>
                        {feedback.type === "success" ? <CheckCircle2 size={22} className="text-emerald-600 shrink-0" /> : <AlertCircle size={22} className="text-red-600 shrink-0" />}
                        <span className="text-sm font-medium">{feedback.message}</span>
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