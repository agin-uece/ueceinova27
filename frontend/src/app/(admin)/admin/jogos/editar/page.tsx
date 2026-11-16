"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Gamepad2, Loader2 } from "lucide-react";
import { JogoForm } from "@/components/features/jogos/JogoForm";
import { Engine, Jogo, Linguagem } from "@/types";
import { useSecureAction } from "@/hooks/useSecureAction";

type JogoApi = Omit<Jogo, "engineId" | "linguagens" | "engine"> & {
    linguagens?: (string | number | Linguagem)[];
    engineId?: number | null;
    engine?: string;
};

type JogoEdicao = Omit<JogoApi, "engineId"> & {
    linguagensIds: number[];
    engineId: number | string;
};

type JogoFormData = {
    engineId?: number | string | null;
    [campo: string]: unknown;
};

function EditarJogoForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const jogoId = searchParams.get("id");
    const { execute, isProcessing: isSaving } = useSecureAction();
    const [jogo, setJogo] = useState<JogoEdicao | null>(null);
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
                    const dadosJogo: JogoApi = await resJogo.json();
                    const listaLinguagens: Linguagem[] = await resLinguagens.json();
                    const listaEngines: Engine[] = await resEngines.json();

                    let linguagensIds: number[] = [];
                    if (dadosJogo.linguagens) {
                        linguagensIds = (dadosJogo.linguagens as (string | number | Linguagem)[])
                            .map((item) => {
                                if (typeof item === "string") {
                                    const found = listaLinguagens.find(
                                        (l) => l.nome.toUpperCase() === item.toUpperCase()
                                    );
                                    return found ? found.id : null;
                                }
                                if (typeof item === "number") return item;
                                return item.id;
                            })
                            .filter((id): id is number => Boolean(id));
                    }

                    let engineId: number | string = dadosJogo.engineId || "";
                    const nomeEngine: unknown = dadosJogo.engine;
                    if (!engineId && typeof nomeEngine === "string") {
                        const foundEng = listaEngines.find(
                            (e) => e.nome.toUpperCase() === nomeEngine.toUpperCase()
                        );
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

    const handleUpdate = async (formData: JogoFormData) => {
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