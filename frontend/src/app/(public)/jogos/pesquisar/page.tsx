"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Gamepad2, Target, ShieldCheck, ChevronUp, ChevronDown, User } from "lucide-react";
import Link from "next/link";

import { Jogo, Engine, Linguagem } from "@/types";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ValidateModal } from "@/components/ui/ValidateModal";
import { Pagination } from "@/components/ui/Pagination";
import { JogoCard } from "@/components/features/jogos/JogoCard";
import { JogoFilters } from "@/components/features/jogos/JogoFilter";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonGrid } from "@/components/ui/SkeletonGrid";
import { ResultsHeader } from "@/components/ui/ResultsHeader";
import { useSecureAction } from "@/hooks/useSecureAction"; // 👈 importa o hook

const STATUS_OPCOES = ["PENDENTE", "APROVADO", "REJEITADO"];

export default function PesquisarJogosPage() {
    const [jogos, setJogos] = useState<Jogo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [meta, setMeta] = useState({ total: 0, pages: 0, current: 0 });

    const [engines, setEngines] = useState<Engine[]>([]);
    const [linguagens, setLinguagens] = useState<Linguagem[]>([]);
    const [generos, setGeneros] = useState<string[]>([]);
    const [plataformas, setPlataformas] = useState<string[]>([]);
    const [tiposJogo, setTiposJogo] = useState<string[]>([]);
    const [estagios, setEstagios] = useState<string[]>([]);
    const [faixasEtarias, setFaixasEtarias] = useState<string[]>([]);

    const [userRole, setUserRole] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isViewingMyGames, setIsViewingMyGames] = useState(false);
    const [adminStatusFilter, setAdminStatusFilter] = useState("");
    const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [jogoToDelete, setJogoToDelete] = useState<number | null>(null);

    const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
    const [jogoToValidate, setJogoToValidate] = useState<number | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    // ✅ isProcessing vem do hook agora, não é estado manual
    const { execute, isProcessing: isDeletingMfa } = useSecureAction();

    const [filtros, setFiltros] = useState({
        nome: "", genero: "", plataforma: "", dataLancamento: "",
        tipoJogo: "", estagioDesenvolvimento: "", engineId: "", linguagemId: "",
        status: "", faixaEtaria: ""
    });

    useEffect(() => {
        const carregarSessao = () => {
            const token = localStorage.getItem("userToken");
            const userDataStr = localStorage.getItem("userData");
            setIsLoggedIn(!!token);
            if (userDataStr) try { setUserRole(JSON.parse(userDataStr).role || ""); } catch (e) { }
        };

        const carregarDadosIniciais = async () => {
            try {
                const [resE, resL, resG, resP, resT, resEs, resF] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/engines`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/linguagens`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enums/generos`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enums/plataformas`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enums/tipos-jogo`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enums/estagios`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/enums/faixas-etarias`)
                ]);
                if (resE.ok) setEngines(await resE.json());
                if (resL.ok) setLinguagens(await resL.json());
                if (resG.ok) setGeneros(await resG.json());
                if (resP.ok) setPlataformas(await resP.json());
                if (resT.ok) setTiposJogo(await resT.json());
                if (resEs.ok) setEstagios(await resEs.json());
                if (resF.ok) setFaixasEtarias(await resF.json());
            } catch (e) { console.error(e); }
        };

        carregarSessao();
        carregarDadosIniciais();
        handleBuscar(0);
    }, []);

    const performFetch = async (url: string) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("userToken");
            const res = await fetch(url, { headers: token ? { "Authorization": `Bearer ${token}` } : {} });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setJogos(data);
                    setMeta({ total: data.length, pages: 1, current: 0 });
                } else {
                    setJogos(data.content || []);
                    setMeta({ total: data.totalElements, pages: data.totalPages, current: data.number });
                }
            }
        } catch (e) { console.error(e); } finally { setIsLoading(false); }
    };

    const handleBuscar = (page = 0) => {
        setIsViewingMyGames(false); setAdminStatusFilter("");
        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([k, v]) => { if (v && k !== "status") params.append(k, v.toString()); });
        params.append("page", page.toString()); params.append("size", "8");
        performFetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos/buscar?${params.toString()}`);
    };

    const handleMeusJogos = (page = 0) => {
        setIsViewingMyGames(true); setAdminStatusFilter("");
        const params = new URLSearchParams({ page: page.toString(), size: "8" });
        if (filtros.status) params.append("status", filtros.status);
        performFetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos/meus?${params.toString()}`);
    };

    const handleBuscarAdminStatus = (status: string, page = 0) => {
        setIsViewingMyGames(false); setAdminStatusFilter(status);
        performFetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos/status/${status}?page=${page}&size=8`);
    };

    // =========================================================================
    // ✅ LÓGICA DE EXCLUSÃO — usa useSecureAction
    // =========================================================================

    // 1. Função pura que retorna uma Promise<Response> (aceita pin opcional)
    const fetchDeletarJogo = (pin?: string): Promise<Response> => {
        if (!jogoToDelete) return Promise.reject(new Error("Nenhum jogo selecionado."));
        const token = localStorage.getItem("userToken");
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos/${jogoToDelete}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` }),
                ...(pin && { "X-MFA-PIN": pin }),
            },
        });
    };

    // 2. Confirmação: fecha o modal de aviso e delega ao hook
    const confirmarExclusao = async () => {
        setIsDeleteModalOpen(false);

        const result = await execute(fetchDeletarJogo);

        if (result.success) {
            // Remove da lista local sem recarregar a página
            setJogos(prev => prev.filter(j => j.id !== jogoToDelete));
            setMeta(prev => ({ ...prev, total: prev.total - 1 }));
            setJogoToDelete(null);
        } else if (result.error) {
            setJogoToDelete(null);
        }
        // Se result.mfaRequired === true, o MfaProvider já abriu o modal — não faz nada aqui
    };

    // =========================================================================

    const handleValidarJogo = async (aprovado: boolean) => {
        if (!jogoToValidate) return;
        setIsValidating(true);
        try {
            const token = localStorage.getItem("userToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos/${jogoToValidate}/validar?aprovado=${aprovado}`, {
                method: "PUT", headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                if (adminStatusFilter === "PENDENTE") {
                    setJogos(prev => prev.filter(j => j.id !== jogoToValidate));
                    setMeta(prev => ({ ...prev, total: prev.total - 1 }));
                } else {
                    setJogos(prev => prev.map(j => j.id === jogoToValidate
                        ? { ...j, status: aprovado ? "APROVADO" : "REJEITADO" }
                        : j
                    ));
                }
                setIsValidateModalOpen(false);
            }
        } catch (e) { console.error(e); } finally { setIsValidating(false); }
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <header className="bg-white border-b border-gray-300 relative z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/gestao/conteudo" className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${adminStatusFilter ? "bg-red-100 text-red-600" : isViewingMyGames ? "bg-purple-100 text-purple-600" : "bg-orange-100 text-orange-600"}`}>
                                {adminStatusFilter ? <ShieldCheck size={24} /> : <Gamepad2 size={24} />}
                            </div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight italic uppercase hidden sm:block">
                                {adminStatusFilter ? "Gestão Admin" : isViewingMyGames ? "Meus Jogos" : "Explorar Acervo"}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isLoggedIn && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => isViewingMyGames ? handleBuscar(0) : handleMeusJogos(0)}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all border ${isViewingMyGames ? "bg-purple-600 border-purple-600 text-white" : "bg-white border-gray-200 text-gray-600 hover:text-purple-500"}`}
                                >
                                    <User size={14} /> <span className="hidden sm:inline">Meus Jogos</span>
                                </button>
                                {userRole === "ADMIN" && (
                                    <div className="relative border-l border-gray-200 pl-3">
                                        <button
                                            onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all border outline-none ${adminStatusFilter ? "bg-red-500 border-red-500 text-white" : "bg-white border-gray-200 text-gray-600"}`}
                                        >
                                            <ShieldCheck size={14} />
                                            <span className="hidden sm:inline">{adminStatusFilter || "Admin"}</span>
                                            {isAdminDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </button>
                                        {isAdminDropdownOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col py-2">
                                                <button
                                                    onClick={() => { setAdminStatusFilter(""); handleBuscar(0); setIsAdminDropdownOpen(false); }}
                                                    className="px-5 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-colors"
                                                >
                                                    Limpar Filtro
                                                </button>
                                                {STATUS_OPCOES.map(op => (
                                                    <button
                                                        key={op}
                                                        onClick={() => { setAdminStatusFilter(op); handleBuscarAdminStatus(op, 0); setIsAdminDropdownOpen(false); }}
                                                        className={`px-5 py-3 text-left text-xs font-bold transition-colors ${adminStatusFilter === op ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50 hover:text-red-500"}`}
                                                    >
                                                        {op}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        <JogoFilters
                            isVisible={isFilterVisible}
                            onToggleVisibility={() => setIsFilterVisible(!isFilterVisible)}
                            filtros={filtros}
                            onInputChange={(e) => setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                            onToggleLinguagem={(id) => setFiltros(prev => ({ ...prev, linguagemId: prev.linguagemId === id ? "" : id }))}
                            onClearSingle={(key) => setFiltros(prev => ({ ...prev, [key]: "" }))}
                            onClearAll={() => { setFiltros({ nome: "", genero: "", plataforma: "", dataLancamento: "", tipoJogo: "", estagioDesenvolvimento: "", engineId: "", linguagemId: "", status: "", faixaEtaria: "" }); handleBuscar(0); }}
                            onSubmit={(e) => { e.preventDefault(); setIsFilterVisible(false); isViewingMyGames ? handleMeusJogos(0) : handleBuscar(0); }}
                            isLoading={isLoading}
                            engines={engines} linguagens={linguagens} generos={generos}
                            plataformas={plataformas} tiposJogo={tiposJogo} estagios={estagios} faixasEtarias={faixasEtarias}
                        />
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
                <ResultsHeader
                    icon={Target}
                    iconClassName={adminStatusFilter ? "text-red-600" : "text-orange-500"}
                    total={meta.total}
                    label="Total"
                />
                {isLoading ? (
                    <SkeletonGrid count={4} />
                ) : jogos.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {jogos.map((jogo) => (
                                <JogoCard
                                    key={jogo.id}
                                    jogo={jogo}
                                    userRole={userRole}
                                    isViewingMyGames={isViewingMyGames}
                                    adminStatusFilter={adminStatusFilter}
                                    onDelete={(id) => { setJogoToDelete(id); setIsDeleteModalOpen(true); }}
                                    onValidate={(id) => { setJogoToValidate(id); setIsValidateModalOpen(true); }}
                                />
                            ))}
                        </div>
                        <Pagination
                            currentPage={meta.current}
                            totalPages={meta.pages}
                            onPageChange={(p) => isViewingMyGames ? handleMeusJogos(p) : adminStatusFilter ? handleBuscarAdminStatus(adminStatusFilter, p) : handleBuscar(p)}
                        />
                    </>
                ) : (
                    <EmptyState icon={Gamepad2} title="Nenhum resultado" />
                )}
            </div>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Confirmar Exclusão"
                description="Deseja excluir este projeto permanentemente?"
                onConfirm={confirmarExclusao}
                onCancel={() => setIsDeleteModalOpen(false)}
                isProcessing={isDeletingMfa} // ✅ vem do hook
            />

            <ValidateModal
                isOpen={isValidateModalOpen}
                onValidate={handleValidarJogo}
                onCancel={() => setIsValidateModalOpen(false)}
                isProcessing={isValidating}
            />
        </main>
    );
}