"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Target, ShieldCheck, User } from "lucide-react";

// 1. Componentes UI Reutilizáveis
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ValidateModal } from "@/components/ui/ValidateModal";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonGrid } from "@/components/ui/SkeletonGrid";
import { ResultsHeader } from "@/components/ui/ResultsHeader";
// 2. Features de Pessoas
import { PessoaCard } from "@/components/features/pessoas/PessoaCard";
import { PessoaFilters } from "@/components/features/pessoas/PessoaFilter";
import { useSecureAction } from "@/hooks/useSecureAction";

const STATUS_OPCOES = ["PENDENTE", "APROVADO", "REJEITADO"];

interface Pessoa {
    id: number;
    nome: string;
    email: string;
    papel: string;
    titulacao: string;
    instituicao: string;
    areaPesquisa: string;
    urlFoto: string | null;
    status?: string;
}

export default function PesquisarPessoasPage() {
    // --- ESTADOS ---
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [meta, setMeta] = useState({ total: 0, pages: 0, current: 0 });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [isViewingMyPessoas, setIsViewingMyPessoas] = useState(false);
    const [adminStatusFilter, setAdminStatusFilter] = useState("");
    const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

    // Listas Auxiliares (Autocompletes)
    const [startups, setStartups] = useState<{ id: number, nome: string }[]>([]);
    const [protecoes, setProtecoes] = useState<{ id: number, nome: string }[]>([]);
    const [laboratorios, setLaboratorios] = useState<{ id: number, nome: string }[]>([]);

    // Modais
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [pessoaToDelete, setPessoaToDelete] = useState<number | null>(null);

    const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
    const [pessoaToValidate, setPessoaToValidate] = useState<number | null>(null);

    const { execute: executeDelete, isProcessing: isDeleting } = useSecureAction();
    const { execute: executeValidate, isProcessing: isValidating } = useSecureAction();

    const [filtros, setFiltros] = useState({
        nome: "", areaPesquisa: "", titulacao: "", instituicao: "",
        papel: "", curso: "", anoFormacao: "",
        startupId: "", protecaoId: "", laboratorioId: ""
    });

    // --- EFEITOS ---
    useEffect(() => {
        const carregarDadosIniciais = () => {
            const token = localStorage.getItem("userToken");
            const userDataStr = localStorage.getItem("userData");
            setIsLoggedIn(!!token);
            if (userDataStr) {
                try { setUserRole(JSON.parse(userDataStr).role || ""); } catch (e) { }
            }
        };

        const carregarAuxiliares = async () => {
            try {
                const [resS, resP, resL] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/protecoes`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/laboratorios`)
                ]);
                if (resS.ok) setStartups(await resS.json());
                if (resP.ok) setProtecoes(await resP.json());
                if (resL.ok) setLaboratorios(await resL.json());
            } catch (error) { console.error("Erro ao carregar auxiliares:", error); }
        };

        carregarDadosIniciais();
        carregarAuxiliares();
        handleBuscar(0);
    }, []);

    // --- LÓGICA DE API ---
    const performFetch = async (url: string) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("userToken");
            const res = await fetch(url, {
                headers: token ? { "Authorization": `Bearer ${token}` } : {}
            });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setPessoas(data);
                    setMeta({ total: data.length, pages: 1, current: 0 });
                } else {
                    setPessoas(data.content || []);
                    setMeta({ total: data.totalElements, pages: data.totalPages, current: data.number });
                }
            } else { setPessoas([]); }
        } catch (error) {
            console.error(error);
            setPessoas([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBuscar = (page: number = 0) => {
        setIsViewingMyPessoas(false);
        setAdminStatusFilter("");
        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([key, value]) => {
            if (value !== "") params.append(key, value.toString());
        });
        params.append("page", page.toString());
        params.append("size", "8");
        performFetch(`${process.env.NEXT_PUBLIC_API_URL}/pessoas/buscar?${params.toString()}`);
    };

    const handleMinhasPessoas = (page: number = 0) => {
        setIsViewingMyPessoas(true);
        setAdminStatusFilter("");
        performFetch(`${process.env.NEXT_PUBLIC_API_URL}/pessoas/minhas?page=${page}&size=8`);
    };

    const handleBuscarAdminStatus = (status: string, page: number = 0) => {
        setIsViewingMyPessoas(false);
        setAdminStatusFilter(status);
        performFetch(`${process.env.NEXT_PUBLIC_API_URL}/pessoas/status/${status}?page=${page}&size=8`);
    };

    const mudarPagina = (novaPagina: number) => {
        if (isViewingMyPessoas) handleMinhasPessoas(novaPagina);
        else if (adminStatusFilter) handleBuscarAdminStatus(adminStatusFilter, novaPagina);
        else handleBuscar(novaPagina);
    };

    // --- AÇÕES ---
    const confirmarExclusao = async () => {
        if (!pessoaToDelete) return;

        // 1. Função que executa a requisição (aceita PIN opcional)
        const fetchDelete = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers: HeadersInit = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;
            if (pin) headers["X-MFA-PIN"] = pin;

            console.log("🔐 DELETE headers:", headers);
            console.log("🔐 PIN recebido:", pin);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pessoas/${pessoaToDelete}`, {
                method: "DELETE",
                headers
            });

            console.log("📡 Resposta DELETE status:", response.status);
            console.log("📡 Resposta DELETE body:", await response.clone().text());

            return response;
        };

        // 2. Callback de sucesso (atualiza lista e fecha modal)
        const onSucesso = () => {
            setPessoas(prev => prev.filter(p => p.id !== pessoaToDelete));
            setMeta(prev => ({ ...prev, total: prev.total - 1 }));
            setIsDeleteModalOpen(false);
        };

        // 3. Executa ação segura (hook gerencia MFA se necessário)
        const result = await executeDelete(fetchDelete, onSucesso);

        // 4. Tratamento de erro (sucesso já chamou onSucesso)
        if (!result.success && result.error) {
        }
    };

    const handleValidarPessoa = async (aprovado: boolean) => {
        if (!pessoaToValidate) return;

        // 1. Função que faz a requisição de validação
        const fetchValidar = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers: HeadersInit = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;
            if (pin) headers["X-MFA-PIN"] = pin;

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/pessoas/${pessoaToValidate}/validar?aprovado=${aprovado}`, {
                method: "PUT",
                headers
            });
        };

        // 2. Callback de sucesso (atualiza estado e fecha modal)
        const onSucesso = () => {
            const novoStatus = aprovado ? "APROVADO" : "REJEITADO";
            if (adminStatusFilter === "PENDENTE") {
                setPessoas(prev => prev.filter(p => p.id !== pessoaToValidate));
                setMeta(prev => ({ ...prev, total: prev.total - 1 }));
            } else {
                setPessoas(prev => prev.map(p => p.id === pessoaToValidate ? { ...p, status: novoStatus } : p));
            }
            setIsValidateModalOpen(false);
        };

        // 3. Executa ação segura
        const result = await executeValidate(fetchValidar, onSucesso);

        // 4. Tratamento de erro
        if (!result.success && result.error) {
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectDropdown = (campo: string, valor: string) => {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            {/* HEADER COMPLETO PADRONIZADO */}
            <header className="bg-white border-b border-gray-300 relative z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                    <div className="flex items-center gap-4">
                        <Link href="/gestao/conteudo" className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${adminStatusFilter ? "bg-red-100 text-red-600" : isViewingMyPessoas ? "bg-purple-100 text-purple-600" : "bg-indigo-100 text-indigo-600"}`}>
                                {adminStatusFilter ? <ShieldCheck size={24} /> : <Users size={24} />}
                            </div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight italic uppercase transition-all hidden sm:block">
                                {adminStatusFilter ? "Gestão Admin" : isViewingMyPessoas ? "Minhas Pessoas" : "Explorar Pessoas"}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {isLoggedIn && (
                            <div className="flex items-center gap-3">
                                <button onClick={() => isViewingMyPessoas ? handleBuscar(0) : handleMinhasPessoas(0)} className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all border ${isViewingMyPessoas ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-100" : "bg-white border-gray-200 text-gray-600 hover:border-purple-500 hover:text-purple-500"}`}>
                                    <User size={14} /> <span className="hidden sm:inline">Meus Cadastros</span>
                                </button>
                                {userRole === "ADMIN" && (
                                    <div className="relative border-l border-gray-200 pl-3">
                                        <button onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)} className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all border outline-none ${adminStatusFilter ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-100" : "bg-white border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-500"}`}>
                                            <ShieldCheck size={14} /> <span className="hidden sm:inline">{adminStatusFilter || "Filtro Admin"}</span>
                                        </button>
                                        {isAdminDropdownOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col py-2">
                                                <button onClick={() => { setAdminStatusFilter(""); handleBuscar(0); setIsAdminDropdownOpen(false); }} className="px-5 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-colors">Limpar Filtro</button>
                                                {STATUS_OPCOES.map(op => (
                                                    <button key={op} onClick={() => { setAdminStatusFilter(op); handleBuscarAdminStatus(op, 0); setIsAdminDropdownOpen(false); }} className={`px-5 py-3 text-left text-xs font-bold transition-colors ${adminStatusFilter === op ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50 hover:text-red-500"}`}>{op}</button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <PessoaFilters
                            isVisible={isFilterVisible}
                            onToggleVisibility={() => setIsFilterVisible(!isFilterVisible)}
                            filtros={filtros}
                            onInputChange={handleInputChange}
                            onSelectDropdown={handleSelectDropdown}
                            onClear={() => {
                                setFiltros({ nome: "", areaPesquisa: "", titulacao: "", instituicao: "", papel: "", curso: "", anoFormacao: "", startupId: "", protecaoId: "", laboratorioId: "" });
                                handleBuscar(0);
                            }}
                            onSubmit={(e) => { e.preventDefault(); setIsFilterVisible(false); isViewingMyPessoas ? handleMinhasPessoas(0) : handleBuscar(0); }}
                            startups={startups}
                            protecoes={protecoes}
                            laboratorios={laboratorios}
                        />
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <ResultsHeader icon={Target} iconClassName="text-indigo-600" total={meta.total} label="Total de resultados" />

                {isLoading ? (
                    <SkeletonGrid count={4} />
                ) : pessoas.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {pessoas.map((p) => (
                                <PessoaCard
                                    key={p.id}
                                    pessoa={p}
                                    userRole={userRole}
                                    showStatus={isViewingMyPessoas || adminStatusFilter !== ""}
                                    canValidate={userRole === "ADMIN" && (p.status === "PENDENTE" || adminStatusFilter === "PENDENTE")}
                                    onDelete={(id) => { setPessoaToDelete(id); setIsDeleteModalOpen(true); }}
                                    onValidate={(id) => { setPessoaToValidate(id); setIsValidateModalOpen(true); }}
                                />
                            ))}
                        </div>
                        <Pagination currentPage={meta.current} totalPages={meta.pages} onPageChange={mudarPagina} />
                    </>
                ) : (
                    <EmptyState icon={Users} title="Nenhum resultado" />
                )}
            </div>

            {/* MODAIS */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Confirmar Exclusão"
                description="Tem certeza que deseja excluir esta pessoa permanentemente?"
                onConfirm={confirmarExclusao}
                onCancel={() => setIsDeleteModalOpen(false)}
                isProcessing={isDeleting}
            />

            <ValidateModal
                isOpen={isValidateModalOpen}
                onValidate={handleValidarPessoa}
                onCancel={() => setIsValidateModalOpen(false)}
                isProcessing={isValidating}
            />
        </main>
    );
}