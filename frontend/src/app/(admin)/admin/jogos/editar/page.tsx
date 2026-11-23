"use client";

import { apiFetch } from "@/lib/api";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Gamepad2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
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

    // Estado unificado para banner de sucesso ou erro
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

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
                    apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos/${jogoId}`, { headers }),
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

    const handleUpdate = async (formData: JogoFormData) => {
        setFeedback(null);

        const result = await execute((pin?: string) => {
            const token = localStorage.getItem("userToken");
            const payload = { ...formData, engineId: formData.engineId ? Number(formData.engineId) : null };
            return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos/${jogoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                    ...(pin && { "X-MFA-PIN": pin }),
                },
                body: JSON.stringify(payload)
            });
        });

        if (result.success) {
            setFeedback({
                type: "success",
                message: "Jogo atualizado com sucesso!"
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (result.error) {
            setFeedback({
                type: "error",
                message: result.error
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
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
                        <div className="p-2 bg-modulo-jogos-bg text-modulo-jogos rounded-xl">
                            <Gamepad2 size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 uppercase italic">Editar Jogo</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID do Registro: {jogoId}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Banner de Feedback (Sucesso ou Erro) */}
            {feedback && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
                    feedback.type === "success" 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                        : "bg-red-50 border-red-200 text-red-800"
                }`}>
                    {feedback.type === "success" ? (
                        <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                    ) : (
                        <AlertCircle size={22} className="text-red-600 shrink-0" />
                    )}
                    <span className="text-sm font-medium">{feedback.message}</span>
                </div>
            )}

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