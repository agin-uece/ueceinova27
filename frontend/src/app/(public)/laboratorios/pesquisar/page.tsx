"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Beaker, Target, ShieldCheck, ChevronUp, ChevronDown, User } from "lucide-react";

// 1. Tipos e UI
import { Laboratorio, SpringPageResponse } from "@/types";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ValidateModal } from "@/components/ui/ValidateModal";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonGrid } from "@/components/ui/SkeletonGrid";
import { ResultsHeader } from "@/components/ui/ResultsHeader";

// 2. Features
import { LaboratorioCard } from "@/components/features/laboratorios/LaboratorioCard";
import { LaboratorioFilters } from "@/components/features/laboratorios/LaboratorioFilter";
import { useSecureAction } from "@/hooks/useSecureAction";

const STATUS_OPCOES = ["PENDENTE", "APROVADO", "REJEITADO"];

export default function PesquisarLaboratoriosPage() {
    // --- ESTADOS ---
    const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([]);
    const { execute, isProcessing: isMfaProcessing } = useSecureAction();
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [meta, setMeta] = useState({ total: 0, pages: 0, current: 0 });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [isViewingMyLabs, setIsViewingMyLabs] = useState(false);
    const [adminStatusFilter, setAdminStatusFilter] = useState("");
    const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

    // Modais
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [labToDelete, setLabToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
    const [labToValidate, setLabToValidate] = useState<number | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    const [filtros, setFiltros] = useState({
        nome: "", coordenacao: "", area: "", vinculado: "", tag: "", naturezas: "", status: ""
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
        carregarDadosIniciais();
        handleBuscar(0);
    }, []);

    // --- LÓGICA DE API (Buscar) ---
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
                    setLaboratorios(data);
                    setMeta({ total: data.length, pages: 1, current: 0 });
                } else {
                    setLaboratorios(data.content || []);
                    setMeta({ total: data.totalElements, pages: data.totalPages, current: data.number });
                }
            } else { setLaboratorios([]); }
        } catch (error) {
            console.error(error);
            setLaboratorios([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBuscar = (page: number = 0) => {
        setIsViewingMyLabs(false);
        setAdminStatusFilter("");
        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([key, value]) => {
            if (value !== "" && key !== "status") params.append(key, value.toString());
        });
        params.append("page", page.toString());
        params.append("size", "8");
        performFetch(`${process.env.NEXT_PUBLIC_API_URL}/laboratorios/buscar?${params.toString()}`);
    };

    const handleMeusLaboratorios = (page: number = 0) => {
        setIsViewingMyLabs(true);
        setAdminStatusFilter("");
        const params = new URLSearchParams({ page: page.toString(), size: "8" });
        if (filtros.status) params.append("status", filtros.status);
        performFetch(`${process.env.NEXT_PUBLIC_API_URL}/laboratorios/meus?${params.toString()}`);
    };

    const handleBuscarAdminStatus = (status: string, page: number = 0) => {
        setIsViewingMyLabs(false);
        setAdminStatusFilter(status);
        performFetch(`${process.env.NEXT_PUBLIC_API_URL}/laboratorios/status/${status}?page=${page}&size=8`);
    };

    const mudarPagina = (novaPagina: number) => {
        if (isViewingMyLabs) handleMeusLaboratorios(novaPagina);
        else if (adminStatusFilter) handleBuscarAdminStatus(adminStatusFilter, novaPagina);
        else handleBuscar(novaPagina);
    };

    // --- AÇÕES ADMIN ---
    const confirmarExclusao = async () => {
        if (!labToDelete) return;
        setIsDeleting(true);

        // 1. A requisição para a API
        const fetchDeletar = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers = new Headers();
            if (token) headers.append("Authorization", `Bearer ${token}`);
            if (pin) headers.append("X-MFA-PIN", pin);

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/laboratorios/${labToDelete}`, {
                method: "DELETE",
                headers: headers
            });
        };

        // 2. O que fazer quando der certo (fechar modal e dar refresh)
        const onSucesso = () => {
            setIsDeleteModalOpen(false);
            setLabToDelete(null);
            mudarPagina(meta.current); // O refresh da tabela!
        };

        // 3. Executa passando a requisição E a ação de sucesso
        const result = await execute(fetchDeletar, onSucesso);

        // 4. Tratamento do retorno imediato
        if (result.success) {
            onSucesso(); // Deu certo de primeira (ex: Professor sem MFA)
        } else if (result.error) {
            setIsDeleting(false);
        } else if (result.mfaRequired) {
            // Se pediu MFA, apenas tiramos o "loading" do botão do modal de baixo.
            // O modal de PIN já vai estar aberto na frente dele!
            setIsDeleting(false);
        }
    };


    const handleValidarLaboratorio = async (aprovado: boolean) => {
        if (!labToValidate) return;
        setIsValidating(true);

        // 1. A requisição para a API
        const fetchValidar = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers = new Headers();
            if (token) headers.append("Authorization", `Bearer ${token}`);
            if (pin) headers.append("X-MFA-PIN", pin);

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/laboratorios/${labToValidate}/validar?aprovado=${aprovado}`, {
                method: "PUT",
                headers: headers
            });
        };

        // 2. O que fazer quando der certo
        const onSucesso = () => {
            setIsValidateModalOpen(false);
            setLabToValidate(null);
            mudarPagina(meta.current); // O refresh da tabela!
        };

        // 3. Executa
        const result = await execute(fetchValidar, onSucesso);

        // 4. Tratamento do retorno imediato
        if (result.success) {
            onSucesso();
        } else if (result.error) {
            setIsValidating(false);
        } else if (result.mfaRequired) {
            setIsValidating(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            {/* HEADER COMPLETO */}
            <header className="bg-white border-b border-gray-300 relative z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/gestao/conteudo" className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg transition-colors ${adminStatusFilter ? "bg-red-100 text-red-600" : isViewingMyLabs ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
                                {adminStatusFilter ? <ShieldCheck size={24} /> : <Beaker size={24} />}
                            </div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight italic uppercase transition-all hidden sm:block">
                                {adminStatusFilter ? "Gestão Admin" : isViewingMyLabs ? "Meus Laboratórios" : "Explorar Laboratórios"}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Botão Dropdown Múltiplo do Admin e Meus Labs */}
                        {isLoggedIn && (
                            <div className="flex items-center gap-3">
                                <button onClick={() => isViewingMyLabs ? handleBuscar(0) : handleMeusLaboratorios(0)} className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all border ${isViewingMyLabs ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-100" : "bg-white border-gray-200 text-gray-600 hover:border-purple-500 hover:text-purple-500"}`}>
                                    <User size={14} /> <span className="hidden sm:inline">Meus Labs</span>
                                </button>
                                {userRole === "ADMIN" && (
                                    <div className="relative border-l border-gray-200 pl-3">
                                        <button onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)} className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all border outline-none ${adminStatusFilter ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-100" : "bg-white border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-500"}`}>
                                            <ShieldCheck size={14} /> <span className="hidden sm:inline">{adminStatusFilter || "Filtro Admin"}</span>
                                            {isAdminDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
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

                        <LaboratorioFilters
                            isVisible={isFilterVisible}
                            onToggleVisibility={() => setIsFilterVisible(!isFilterVisible)}
                            filtros={filtros}
                            onInputChange={(e) => setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                            onClear={() => { setFiltros({ nome: "", coordenacao: "", area: "", vinculado: "", tag: "", naturezas: "", status: "" }); handleBuscar(0); }}
                            onSubmit={(e) => { e.preventDefault(); setIsFilterVisible(false); isViewingMyLabs ? handleMeusLaboratorios(0) : handleBuscar(0); }}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </header>

            {/* CONTEÚDO PRINCIPAL */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <ResultsHeader icon={Target} iconClassName="text-blue-600" total={meta.total} label="Total de resultados" />

                {isLoading ? (
                    <SkeletonGrid count={4} />
                ) : laboratorios.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {laboratorios.map((lab) => (
                                <LaboratorioCard
                                    key={lab.id}
                                    lab={lab}
                                    userRole={userRole}
                                    showStatus={isViewingMyLabs || adminStatusFilter !== ""}
                                    canValidate={userRole === "ADMIN" && (lab.status === "PENDENTE" || adminStatusFilter === "PENDENTE")}
                                    onDelete={(id) => { setLabToDelete(id); setIsDeleteModalOpen(true); }}
                                    onValidate={(id) => { setLabToValidate(id); setIsValidateModalOpen(true); }}
                                />
                            ))}
                        </div>
                        <Pagination currentPage={meta.current} totalPages={meta.pages} onPageChange={mudarPagina} />
                    </>
                ) : (
                    <EmptyState icon={Beaker} title="Nenhum resultado" />
                )}
            </div>

            {/* MODAIS */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Confirmar Exclusão"
                description="Tem certeza que deseja excluir este laboratório permanentemente?"
                onConfirm={confirmarExclusao}
                onCancel={() => setIsDeleteModalOpen(false)}
                isProcessing={isDeleting || isMfaProcessing}
            />

            <ValidateModal
                isOpen={isValidateModalOpen}
                onValidate={handleValidarLaboratorio}
                onCancel={() => setIsValidateModalOpen(false)}
                isProcessing={isValidating || isMfaProcessing} // Corrigido de isDeleting para isValidating
            />
        </main>
    );
}