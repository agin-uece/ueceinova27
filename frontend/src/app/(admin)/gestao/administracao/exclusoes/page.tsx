"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, ArrowLeft, Loader2, Search, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSecureAction } from "@/hooks/useSecureAction";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

const ENTIDADES = [
    { label: "Jogos", value: "jogos" },
    { label: "Pessoas", value: "pessoas" },
    { label: "Laboratórios", value: "laboratorios" },
    { label: "Startups", value: "startups" },
    { label: "Serviços", value: "servicos" },
    { label: "Proteções", value: "protecoes" },
];

export default function ExclusaoRegistrosPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [entidadeSelecionada, setEntidadeSelecionada] = useState("");
    const [registros, setRegistros] = useState<any[]>([]);
    const [isLoadingLista, setIsLoadingLista] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [idParaDeletar, setIdParaDeletar] = useState<number | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const { execute, isProcessing } = useSecureAction();

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

    const carregarRegistros = async (entidade: string) => {
        setIsLoadingLista(true);
        setRegistros([]);
        setSearchQuery("");
        try {
            const token = localStorage.getItem("userToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${entidade}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRegistros(Array.isArray(data) ? data : data.content || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingLista(false);
        }
    };

    const handleEntidadeChange = (entidade: string) => {
        setEntidadeSelecionada(entidade);
        carregarRegistros(entidade);
    };

    const handleDeletarClick = (id: number) => {
        setIdParaDeletar(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmarDelecao = async () => {
        if (!idParaDeletar || !entidadeSelecionada) return;
        setIsConfirmOpen(false);

        await execute(
            (pin?: string) => {
                const token = localStorage.getItem("userToken");
                return fetch(`${process.env.NEXT_PUBLIC_API_URL}/${entidadeSelecionada}/${idParaDeletar}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        ...(pin && { "X-MFA-PIN": pin }),
                    }
                });
            },
            () => {
                setRegistros(prev => prev.filter(r => r.id !== idParaDeletar));
                setIdParaDeletar(null);
            }
        );
    };

    const registrosFiltrados = registros.filter(r => {
        const nome = r.nome || r.titulo || r.name || r.areaAtuacao || "";
        return nome.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (!isAuthorized) return null;

    return (
        <main className="min-h-screen bg-[#F8FAFC] pb-20">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/gestao/administracao" className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <Trash2 size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Exclusão de Registros</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Painel Administrativo</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 mt-10 space-y-8">

                {/* Aviso */}
                <div className="p-5 bg-red-50 border border-red-200 rounded-2xl flex gap-4 text-red-800">
                    <AlertCircle className="shrink-0 mt-0.5" size={20} />
                    <p className="text-sm font-medium">Esta operação é permanente e irreversível. Selecione a entidade e o registro com atenção antes de confirmar.</p>
                </div>

                {/* Seleção de entidade */}
                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                    <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Selecione a Entidade</h2>
                    <div className="flex flex-wrap gap-3">
                        {ENTIDADES.map(e => (
                            <button
                                key={e.value}
                                onClick={() => handleEntidadeChange(e.value)}
                                className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border-2 ${entidadeSelecionada === e.value
                                        ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-100"
                                        : "bg-gray-50 border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600"
                                    }`}
                            >
                                {e.label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Lista de registros */}
                {entidadeSelecionada && (
                    <section className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">

                        {/* Barra de busca */}
                        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                            <Search size={18} className="text-gray-300" />
                            <input
                                type="text"
                                placeholder="Filtrar por nome..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-sm text-gray-600 font-medium"
                            />
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                {registrosFiltrados.length} registros
                            </span>
                        </div>

                        {isLoadingLista ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <Loader2 className="animate-spin text-red-400" size={32} />
                                <p className="text-sm font-bold text-gray-400">Carregando registros...</p>
                            </div>
                        ) : registrosFiltrados.length === 0 ? (
                            <div className="py-20 text-center">
                                <p className="text-sm font-bold text-gray-400">Nenhum registro encontrado.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50/50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ID</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nome / Título</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {registrosFiltrados.map((r: any) => (
                                            <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-4 text-xs font-mono text-gray-400">#{r.id}</td>
                                                <td className="px-8 py-4 font-bold text-gray-800">
                                                    {r.nome || r.titulo || r.name || r.areaAtuacao || `Registro #${r.id}`}                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDeletarClick(r.id)}
                                                        disabled={isProcessing}
                                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                                                    >
                                                        <Trash2 size={14} /> Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                title="Confirmar Exclusão"
                description="Esta ação é permanente e não pode ser desfeita. Deseja continuar?"
                onConfirm={handleConfirmarDelecao}
                onCancel={() => { setIsConfirmOpen(false); setIdParaDeletar(null); }}
                isProcessing={isProcessing}
            />
        </main>
    );
}