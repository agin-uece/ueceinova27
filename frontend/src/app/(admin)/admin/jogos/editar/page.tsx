"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Gamepad2, Loader2 } from "lucide-react";
import Link from "next/link";
import { JogoForm } from "@/components/features/jogos/JogoForm";
import { Jogo } from "@/types";
import { useSecureAction } from "@/hooks/useSecureAction";

function EditarJogoForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const jogoId = searchParams.get("id");
    const { execute, isProcessing: isSaving } = useSecureAction();
    const [jogo, setJogo] = useState<any>(null);
    const [isLoadingPage, setIsLoadingPage] = useState(true);



    useEffect(() => {
        if (!jogoId) {
            router.push("/gestao");
            return;
        }

        const carregarJogoEConverterIds = async () => {
            try {
                const token = localStorage.getItem("userToken");

                const headers = new Headers();
                if (token) {
                    headers.append("Authorization", `Bearer ${token}`);
                }

                const [resJogo, resLinguagens, resEngines] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos/${jogoId}`, { headers }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/linguagens`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/engines`)
                ]);

                if (resJogo.ok) {
                    const dadosJogo = await resJogo.json();
                    const listaLinguagens = await resLinguagens.json();
                    const listaEngines = await resEngines.json();

                    let linguagensIds: number[] = [];
                    if (dadosJogo.linguagens) {
                        linguagensIds = dadosJogo.linguagens.map((item: any) => {
                            if (typeof item === 'string') {
                                const found = listaLinguagens.find((l: any) => l.nome.toUpperCase() === item.toUpperCase());
                                return found ? found.id : null;
                            }
                            return item.id || item;
                        }).filter(Boolean);
                    }

                    let engineId = dadosJogo.engineId || "";
                    if (!engineId && dadosJogo.engine && typeof dadosJogo.engine === 'string') {
                        const foundEng = listaEngines.find((e: any) => e.nome.toUpperCase() === dadosJogo.engine.toUpperCase());
                        if (foundEng) engineId = foundEng.id;
                    }

                    setJogo({
                        ...dadosJogo,
                        linguagensIds,
                        engineId
                    });
                }
            } catch (error) {
                console.error("Erro ao carregar:", error);
            } finally {
                setIsLoadingPage(false);
            }
        };

        carregarJogoEConverterIds();
    }, [jogoId, router]);





    const tratarSucesso = () => {
    };

    const handleUpdate = async (formData: any) => {
        const result = await execute((pin?: string) => {
            const token = localStorage.getItem("userToken");
            const payload = { ...formData, engineId: formData.engineId ? Number(formData.engineId) : null };
            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos/${jogoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                    ...(pin && { "X-MFA-PIN": pin }),
                },
                body: JSON.stringify(payload)
            });
        });

        if (result.success) tratarSucesso();
        else if (result.error) alert(`Erro ao atualizar: ${result.error}`);
    };



    if (isLoadingPage) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-orange-500" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 relative">
            <header className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-all">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                            <Gamepad2 size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 uppercase italic">Editar Jogo</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID do Registro: {jogoId}</p>
                        </div>
                    </div>
                </div>
            </header>

            <JogoForm
                initialData={jogo}
                onSubmit={handleUpdate}
                isLoading={isSaving}
            />


        </div>
    );
}

export default function EditarJogoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-orange-500" size={48} />
            </div>
        }>
            <EditarJogoForm />
        </Suspense>
    );
}