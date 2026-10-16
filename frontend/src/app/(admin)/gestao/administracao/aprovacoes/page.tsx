"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Check, FileJson, Trash2, Edit3, Clock,
    Loader2, ArrowLeft, ShieldAlert, PlusCircle, LayoutList, User
} from "lucide-react";

// --- TIPAGENS ---
interface SolicitacaoAlteracao {
    id: number;
    entidade: string;
    entidadeId: number;
    tipoAcao: "EDICAO" | "EXCLUSAO";
    dadosNovos: string | null;
    status: string;
    dataSolicitacao: string;
    solicitanteId: number;
}

interface NovaCriacao {
    id: number;
    entidade: string;
    nomeIdentificador: string;
    payloadCompleto: any;
}

const ROTAS_API: Record<string, string> = {
    "JOGO": "jogos",
    "PESSOA": "pessoas",
    "LABORATORIO": "laboratorios",
};

export default function CentralAprovacoesPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [abaAtiva, setAbaAtiva] = useState<"CRIACOES" | "EDICOES" | "EXCLUSOES">("CRIACOES");
    const [filtroEntidade, setFiltroEntidade] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    const [solicitacoes, setSolicitacoes] = useState<SolicitacaoAlteracao[]>([]);
    const [criacoes, setCriacoes] = useState<NovaCriacao[]>([]);

    // Cache de nomes de usuários
    const [usuariosNomes, setUsuariosNomes] = useState<Record<number, string>>({});

    // 🆕 NOVOS FILTROS
    const [buscaNome, setBuscaNome] = useState("");
    const [ordenacao, setOrdenacao] = useState<"recentes" | "antigos">("recentes");

    useEffect(() => {
        const userDataStr = localStorage.getItem("userData");
        if (userDataStr) {
            const user = JSON.parse(userDataStr);
            if (user.role === "ADMIN") setIsAuthorized(true);
            else router.push("/gestao");
        } else {
            router.push("/login");
        }
    }, [router]);

    const carregarDados = async () => {
        if (!isAuthorized) return;
        setIsLoading(true);
        const token = localStorage.getItem("userToken");

        try {
            if (abaAtiva === "EDICOES" || abaAtiva === "EXCLUSOES") {
                const tipoAcao = abaAtiva === "EDICOES" ? "EDICAO" : "EXCLUSAO";
                let url = `${process.env.NEXT_PUBLIC_API_URL}/admin/solicitacoes?status=PENDENTE&acao=${tipoAcao}&size=50`;
                if (filtroEntidade) url += `&entidade=${filtroEntidade}`;

                const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
                if (res.ok) {
                    const data = await res.json();
                    setSolicitacoes(data.content || []);
                }
            }
            else if (abaAtiva === "CRIACOES") {
                const entidadesParaBuscar = filtroEntidade ? [filtroEntidade] : Object.keys(ROTAS_API);
                const promessas = entidadesParaBuscar.map(async (ent) => {
                    const rota = ROTAS_API[ent];
                    try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${rota}/status/PENDENTE`, {
                            headers: { "Authorization": `Bearer ${token}` }
                        });
                        if (res.ok) {
                            const itens = await res.json();
                            return itens.map((item: any) => ({
                                id: item.id,
                                entidade: ent,
                                nomeIdentificador: item.nome || item.titulo || item.areaAtuacao || `Item #${item.id}`,
                                payloadCompleto: item
                            }));
                        }
                        return [];
                    } catch (e) { return []; }
                });
                const resultados = await Promise.all(promessas);
                setCriacoes(resultados.flat());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthorized) carregarDados();
    }, [abaAtiva, filtroEntidade, isAuthorized]);

    // Efeito para buscar os nomes dos usuários automaticamente
    useEffect(() => {
        const idsParaBuscar = new Set<number>();

        solicitacoes.forEach(s => {
            if (s.solicitanteId && !usuariosNomes[s.solicitanteId]) {
                idsParaBuscar.add(s.solicitanteId);
            }
        });

        criacoes.forEach(c => {
            const uid = c.payloadCompleto?.userInclusaoId;
            if (uid && !usuariosNomes[uid]) {
                idsParaBuscar.add(uid);
            }
        });

        if (idsParaBuscar.size > 0) {
            const token = localStorage.getItem("userToken");
            Array.from(idsParaBuscar).forEach(async (id) => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUsuariosNomes(prev => ({ ...prev, [id]: data.nome }));
                    } else {
                        setUsuariosNomes(prev => ({ ...prev, [id]: `Desconhecido (ID: ${id})` }));
                    }
                } catch {
                    setUsuariosNomes(prev => ({ ...prev, [id]: `Erro ao carregar` }));
                }
            });
        }
    }, [solicitacoes, criacoes]);

    // 🆕 FILTRAGEM E ORDENAÇÃO APLICADAS
    const criacoesFiltradas = useMemo(() => {
        let resultado = criacoes;

        // Filtro por nome do solicitante
        if (buscaNome.trim()) {
            const termo = buscaNome.toLowerCase();
            resultado = resultado.filter(item => {
                const criadorId = item.payloadCompleto?.userInclusaoId;
                const nome = criadorId ? (usuariosNomes[criadorId] || "") : "";
                return nome.toLowerCase().includes(termo);
            });
        }

        return resultado;
    }, [criacoes, buscaNome, ordenacao, usuariosNomes]);

    const solicitacoesFiltradas = useMemo(() => {
        let resultado = solicitacoes;

        // Filtro por nome do solicitante
        if (buscaNome.trim()) {
            const termo = buscaNome.toLowerCase();
            resultado = resultado.filter(sol => {
                const nome = usuariosNomes[sol.solicitanteId] || "";
                return nome.toLowerCase().includes(termo);
            });
        }

        // Ordenação por data da solicitação
        const ordenado = [...resultado].sort((a, b) => {
            const da = new Date(a.dataSolicitacao).getTime();
            const db = new Date(b.dataSolicitacao).getTime();
            return ordenacao === "recentes" ? db - da : da - db;
        });
        return ordenado;
    }, [solicitacoes, buscaNome, ordenacao, usuariosNomes]);

    const handleIrParaAnalise = (id: number, tipo: string, entidadeNome?: string) => {
        let url = `/gestao/administracao/aprovacoes/analise?tipo=${tipo}&id=${id}`;
        if (entidadeNome) url += `&entidade=${entidadeNome}`;
        router.push(url);
    };

    if (!isAuthorized) return null;

    return (
        <main className="min-h-screen bg-slate-50 pb-20">
            {/* CABEÇALHO */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col gap-4">
                        {/* Linha superior: título e filtro de entidade */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <button onClick={() => router.push("/gestao/administracao")} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-900 text-white rounded-xl shadow-md"><ShieldAlert size={24} /></div>
                                    <div>
                                        <h1 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Central de Aprovações</h1>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Moderação</p>
                                    </div>
                                </div>
                            </div>
                            <select
                                className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-slate-900"
                                value={filtroEntidade} onChange={(e) => setFiltroEntidade(e.target.value)}
                            >
                                <option value="">Todas as Entidades</option>
                                {Object.keys(ROTAS_API).map(key => <option key={key} value={key}>{key}</option>)}
                            </select>
                        </div>

                        {/* 🆕 Linha de filtros adicionais: busca por nome e ordenação */}
                        <div className="flex flex-wrap items-center gap-3">
                            <input
                                type="text"
                                placeholder="Buscar por nome do solicitante..."
                                value={buscaNome}
                                onChange={(e) => setBuscaNome(e.target.value)}
                                className="flex-1 min-w-[200px] bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-slate-900"
                            />
                            {abaAtiva !== "CRIACOES" && (
                                <select
                                    value={ordenacao}
                                    onChange={(e) => setOrdenacao(e.target.value as "recentes" | "antigos")}
                                    className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-slate-900"
                                >
                                    <option value="recentes">Mais recentes</option>
                                    <option value="antigos">Mais antigos</option>
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Abas */}
                    <div className="flex gap-4 mt-4 border-b border-slate-100 overflow-x-auto">
                        <button onClick={() => setAbaAtiva("CRIACOES")} className={`pb-3 text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${abaAtiva === "CRIACOES" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                            <PlusCircle size={16} /> Novos Cadastros
                        </button>
                        <button onClick={() => setAbaAtiva("EDICOES")} className={`pb-3 text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${abaAtiva === "EDICOES" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                            <Edit3 size={16} /> Edições Pendentes
                        </button>
                        <button onClick={() => setAbaAtiva("EXCLUSOES")} className={`pb-3 text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${abaAtiva === "EXCLUSOES" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                            <Trash2 size={16} /> Solicitações de Exclusão
                        </button>
                    </div>
                </div>
            </header>

            {/* CONTEÚDO PRINCIPAL */}
            <div className="max-w-7xl mx-auto px-6 mt-10">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Loader2 className="animate-spin mb-4" size={40} />
                        <p className="font-bold text-sm uppercase tracking-widest">Buscando pendências...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {/* LISTA DE CRIAÇÕES */}
                        {abaAtiva === "CRIACOES" && criacoesFiltradas.length === 0 && (
                            <EmptyState mensagem="Nenhum novo cadastro aguardando aprovação (com os filtros aplicados)." />
                        )}
                        {abaAtiva === "CRIACOES" && criacoesFiltradas.map(item => {
                            const criadorId = item.payloadCompleto?.userInclusaoId;
                            const criadorNome = criadorId ? (usuariosNomes[criadorId] || "Carregando...") : "Sistema / Desconhecido";

                            return (
                                <div key={`criacao-${item.entidade}-${item.id}`} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-2xl bg-green-50 text-green-600"><PlusCircle size={24} /></div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black px-2 py-1 bg-slate-100 text-slate-600 rounded-md uppercase tracking-widest">{item.entidade} #{item.id}</span>
                                            </div>
                                            <h3 className="font-bold text-slate-800 text-lg">{item.nomeIdentificador}</h3>

                                            <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mt-1.5 bg-slate-50 inline-flex px-2 py-1 rounded-md border border-slate-100">
                                                <User size={12} className="text-blue-500" /> Criado por: <span className="text-slate-700">{criadorNome}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleIrParaAnalise(item.id, 'CRIACAO', item.entidade)} className="px-6 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-all flex items-center gap-2 justify-center shrink-0">
                                        <FileJson size={16} /> Analisar Pedido
                                    </button>
                                </div>
                            );
                        })}

                        {/* LISTA DE EDIÇÕES/EXCLUSÕES */}
                        {(abaAtiva === "EDICOES" || abaAtiva === "EXCLUSOES") && solicitacoesFiltradas.length === 0 && (
                            <EmptyState mensagem={`Nenhuma solicitação de ${abaAtiva === "EDICOES" ? "edição" : "exclusão"} pendente (com os filtros aplicados).`} />
                        )}
                        {(abaAtiva === "EDICOES" || abaAtiva === "EXCLUSOES") && solicitacoesFiltradas.map(sol => {
                            const criadorNome = usuariosNomes[sol.solicitanteId] || "Carregando...";

                            return (
                                <div key={`sol-${sol.id}`} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-2xl ${sol.tipoAcao === 'EDICAO' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                                            {sol.tipoAcao === 'EDICAO' ? <Edit3 size={24} /> : <Trash2 size={24} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black px-2 py-1 bg-slate-100 text-slate-600 rounded-md uppercase tracking-widest">{sol.entidade} #{sol.entidadeId}</span>
                                            </div>
                                            <h3 className="font-bold text-slate-800">Solicitação de {sol.tipoAcao.toLowerCase()}</h3>

                                            <div className="flex items-center gap-3 mt-1.5">
                                                <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                    <User size={12} className="text-blue-500" /> Solicitado por: <span className="text-slate-700">{criadorNome}</span>
                                                </p>
                                                <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                                    <Clock size={12} /> {new Date(sol.dataSolicitacao).toLocaleString('pt-BR')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleIrParaAnalise(sol.id, sol.tipoAcao)} className="px-6 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-all shrink-0 flex items-center gap-2 justify-center">
                                        <FileJson size={16} /> Analisar em Tela Cheia
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}

const EmptyState = ({ mensagem }: { mensagem: string }) => (
    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[32px] border-2 border-dashed border-slate-200">
        <div className="p-4 bg-green-50 text-green-500 rounded-full mb-4"><Check size={40} /></div>
        <h2 className="text-lg font-black text-slate-700 uppercase tracking-widest">Tudo Limpo!</h2>
        <p className="text-slate-400 text-sm mt-2">{mensagem}</p>
    </div>
);