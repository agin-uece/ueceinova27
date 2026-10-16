"use client";

import { useRef } from "react"; // 🔥 Adicionado useRef
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { JogoForm } from "@/components/features/jogos/JogoForm";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function CadastroJogoPage() {
    const { execute, isProcessing: isSaving } = useSecureAction();
    const router = useRouter();


    // 🔥 4. Nova função de sucesso para evitar repetição
    const tratarSucesso = () => {
        router.push("/gestao");
    };

    const handleCreate = async (formData: any) => {
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

        if (result.success) tratarSucesso();
        else if (result.error) alert(`Erro ao cadastrar: ${result.error}`);
    };



    return (
        <main className="min-h-screen bg-[#F8FAFC] pb-20">
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
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                            <Gamepad2 size={24} />
                        </div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight italic uppercase">
                            Cadastrar Jogo
                        </h1>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 mt-10">
                {/* O formulário agora usa o isSaving do hook MFA como isLoading */}
                <JogoForm onSubmit={handleCreate} isLoading={isSaving} />
            </div>


        </main>
    );
}