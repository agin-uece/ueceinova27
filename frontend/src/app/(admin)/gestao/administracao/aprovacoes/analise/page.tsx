"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, X, ArrowLeft, Loader2, AlertCircle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useSecureAction } from "@/hooks/useSecureAction";

const ROTAS_API: Record<string, string> = {
    "JOGO": "jogos",
    "PESSOA": "pessoas",
    "LABORATORIO": "laboratorios",
};

function AnaliseDetalhadaContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const tipo = searchParams.get("tipo");
    const id = searchParams.get("id");
    const entidadeQuery = searchParams.get("entidade");

    const [isLoading, setIsLoading] = useState(true);
    const [dadosOriginais, setDadosOriginais] = useState<any>(null);
    const [dadosNovos, setDadosNovos] = useState<any>(null);
    const [infoBase, setInfoBase] = useState({ entidade: "", id: "" });
    const [concluido, setConcluido] = useState<"aprovado" | "rejeitado" | null>(null);
    const [acaoAtual, setAcaoAtual] = useState<"aprovando" | "rejeitando" | null>(null);

    const avaliacaoRef = useRef<boolean | null>(null);
    const { execute } = useSecureAction();

    useEffect(() => {
        carregarAnalise();
    }, [id, tipo]);

    const carregarAnalise = async () => {
        if (!id || !tipo) return;
        setIsLoading(true);
        const token = localStorage.getItem("userToken");

        try {
            if (tipo === "CRIACAO" && entidadeQuery) {
                const rota = ROTAS_API[entidadeQuery];
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${rota}/${id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    setDadosNovos(await res.json());
                    setInfoBase({ entidade: entidadeQuery, id });
                }
            } else if (tipo === "EDICAO" || tipo === "EXCLUSAO") {
                const resSol = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/solicitacoes?size=100`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const jsonSol = await resSol.json();
                const solicitacao = jsonSol.content.find((s: any) => s.id === Number(id));

                if (solicitacao) {
                    setInfoBase({ entidade: solicitacao.entidade, id: solicitacao.entidadeId });
                    if (tipo === "EDICAO") setDadosNovos(JSON.parse(solicitacao.dadosNovos));

                    const rota = ROTAS_API[solicitacao.entidade];
                    const resOrig = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${rota}/${solicitacao.entidadeId}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    if (resOrig.ok) setDadosOriginais(await resOrig.json());
                }
            }
        } catch (error) {
            console.error("Erro ao buscar dados", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvaliar = async (aprovado: boolean) => {
        avaliacaoRef.current = aprovado;
        setAcaoAtual(aprovado ? "aprovando" : "rejeitando");

        await execute(
            (pin?: string) => {
                const aprovadoAtual = avaliacaoRef.current;
                const token = localStorage.getItem("userToken");

                const headers: Record<string, string> = {
                    Authorization: `Bearer ${token}`,
                    ...(pin && { "X-MFA-PIN": pin }),
                };

                if (tipo === "CRIACAO") {
                    const rota = ROTAS_API[infoBase.entidade];
                    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/${rota}/${id}/validar?aprovado=${aprovadoAtual}`, {
                        method: "PUT",
                        headers,
                    });
                } else {
                    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/solicitacoes/${id}/avaliar`, {
                        method: "PUT",
                        headers: { ...headers, "Content-Type": "application/json" },
                        body: JSON.stringify({ aprovado: aprovadoAtual }),
                    });
                }
            },
            // 🔥 CALLBACK DE SUCESSO (resolve seu problema)
            () => {
                setConcluido(aprovado ? "aprovado" : "rejeitado");

                setTimeout(() => {
                    router.push('/gestao/administracao/aprovacoes');
                }, 2500);
            }
        );

        setAcaoAtual(null);
    };

    const renderTabelaDiff = () => {
        const chaves = Array.from(new Set([
            ...Object.keys(dadosOriginais || {}),
            ...Object.keys(dadosNovos || {})
        ])).filter(k => k !== "id");

        return (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="text-white" style={{ backgroundColor: "#f97316" }}>
                        <tr>
                            <th className="py-4 px-6 font-bold uppercase tracking-widest text-[10px] w-1/4">Campo</th>
                            {tipo !== "CRIACAO" && <th className="py-4 px-6 font-bold uppercase tracking-widest text-[10px] border-l border-orange-400 w-1/3">Valor Atual</th>}
                            {tipo !== "EXCLUSAO" && <th className="py-4 px-6 font-bold uppercase tracking-widest text-[10px] border-l border-orange-400">Valor Proposto</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-slate-50 font-mono text-xs">
                        {chaves.map((key) => {
                            const valOrig = dadosOriginais?.[key];
                            const valNovo = dadosNovos?.[key];
                            const strOrig = typeof valOrig === "object" ? JSON.stringify(valOrig) : String(valOrig ?? "-");
                            const strNovo = typeof valNovo === "object" ? JSON.stringify(valNovo) : String(valNovo ?? "-");
                            const mudou = strOrig !== strNovo;
                            const labelCampo = key.replace(/([A-Z])/g, " $1").trim();

                            if ((!valOrig || valOrig === "") && (!valNovo || valNovo === "")) return null;

                            return (
                                <tr key={key} className="border-b border-slate-200 hover:bg-slate-100 transition-colors">
                                    <td className="py-4 px-6 font-bold text-slate-700 capitalize align-top bg-white/50">{labelCampo}</td>
                                    {tipo !== "CRIACAO" && (
                                        <td className={`py-4 px-6 break-words whitespace-pre-wrap align-top border-l border-slate-200 ${mudou && tipo === "EDICAO" ? "bg-red-50 text-red-700 line-through opacity-70" : "text-slate-600"}`}>
                                            {strOrig}
                                        </td>
                                    )}
                                    {tipo !== "EXCLUSAO" && (
                                        <td className={`py-4 px-6 break-words whitespace-pre-wrap align-top border-l border-slate-200 ${mudou && tipo === "EDICAO" ? "bg-green-50 text-green-800 font-bold border-l-4 border-l-green-500" : "text-slate-600"}`}>
                                            {strNovo}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center text-slate-400">
            <Loader2 className="animate-spin" size={40} />
        </div>
    );

    // Tela de conclusão
    if (concluido) return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center space-y-6">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${concluido === "aprovado" ? "bg-green-100" : "bg-red-100"}`}>
                    {concluido === "aprovado"
                        ? <CheckCircle2 size={40} className="text-green-500" />
                        : <X size={40} className="text-red-500" />
                    }
                </div>
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">
                        {concluido === "aprovado" ? "Aprovado!" : "Rejeitado!"}
                    </h2>
                    <p className="text-slate-400 text-sm font-medium mt-2">
                        {concluido === "aprovado"
                            ? "A solicitação foi aprovada e aplicada com sucesso."
                            : "A solicitação foi rejeitada."}
                    </p>
                    <p className="text-slate-300 text-xs mt-4">Redirecionando...</p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                    <div
                        className={`h-1 rounded-full ${concluido === "aprovado" ? "bg-green-400" : "bg-red-400"}`}
                        style={{ animation: "progress 2.5s linear forwards" }}
                    />
                </div>
            </div>
            <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
        </div>
    );

    return (
        <main className="min-h-screen bg-slate-100 pb-20">
            <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
                <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-all">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-black text-slate-800 uppercase flex items-center gap-2">
                        {tipo === "CRIACAO" ? <span className="text-blue-500">Novo Cadastro</span> :
                            tipo === "EDICAO" ? <span className="text-orange-500">Revisão de Edição</span> :
                                <span className="text-red-500">Pedido de Exclusão</span>}
                    </h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Entidade: {infoBase.entidade} (ID: {infoBase.id})
                    </p>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-8 mt-10 space-y-8">

                {tipo === "EXCLUSAO" && (
                    <div className="p-5 bg-red-100 border border-red-200 rounded-2xl flex gap-4 text-red-800 shadow-sm">
                        <AlertCircle className="shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold uppercase tracking-widest text-sm mb-1">Atenção Crítica</h3>
                            <p className="text-sm font-medium">Você está prestes a avaliar a exclusão permanente dos dados listados abaixo.</p>
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ShieldCheck size={18} /> Detalhamento dos Dados
                    </h2>
                    {renderTabelaDiff()}
                </div>

                <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => handleAvaliar(false)}
                            disabled={acaoAtual !== null}
                            className="flex-1 py-4 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 font-black rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs transition-all disabled:opacity-50"
                        >
                            {acaoAtual === "rejeitando"
                                ? <Loader2 className="animate-spin" size={18} />
                                : <X size={20} />
                            }
                            Rejeitar Pedido
                        </button>
                        <button
                            onClick={() => handleAvaliar(true)}
                            disabled={acaoAtual !== null}
                            className="flex-[2] py-4 text-white font-black rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs shadow-lg transition-all disabled:opacity-50"
                            style={{ backgroundColor: "#16a34a" }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#15803d")}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#16a34a")}
                        >
                            {acaoAtual === "aprovando"
                                ? <Loader2 className="animate-spin" size={18} />
                                : <Check size={20} />
                            }
                            Confirmar Aprovação
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function AnaliseDetalhadaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center text-slate-400">
                <Loader2 className="animate-spin" size={40} />
            </div>
        }>
            <AnaliseDetalhadaContent />
        </Suspense>
    );
}