"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Target } from "lucide-react";

import { Protecao } from "@/types";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Pagination } from "@/components/ui/Pagination";
import { ProtecaoCard } from "@/components/features/protecoes/ProtecaoCard";
import { ProtecaoFilters } from "@/components/features/protecoes/ProtecaoFilter";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonGrid } from "@/components/ui/SkeletonGrid";
import { ResultsHeader } from "@/components/ui/ResultsHeader";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function PesquisarProtecoesPage() {
    const [todasProtecoes, setTodasProtecoes] = useState<Protecao[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const [userRole, setUserRole] = useState("");

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [protecaoToDelete, setProtecaoToDelete] = useState<number | null>(null);

    // 🔐 Hook MFA para exclusão
    const { execute: executeDelete, isProcessing: isDeleting } = useSecureAction();

    const [filtros, setFiltros] = useState({
        buscaGeral: "", natureza: "", status: "", dataApos: ""
    });

    const [paginaAtual, setPaginaAtual] = useState(0);
    const itensPorPagina = 8;

    useEffect(() => {
        const userDataStr = localStorage.getItem("userData");
        if (userDataStr) {
            try { setUserRole(JSON.parse(userDataStr).role || ""); } catch (e) { }
        }

        const fetchProtecoes = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/protecoes`);
                if (res.ok) {
                    const data = await res.json();
                    setTodasProtecoes(data);
                }
            } catch (error) { console.error("Erro:", error); }
            finally { setIsLoading(false); }
        };

        fetchProtecoes();
    }, []);

    // --- FILTRAGEM LOCAL (usando useMemo para performance) ---
    const protecoesFiltradas = useMemo(() => {
        return todasProtecoes.filter(p => {
            const bateBusca = !filtros.buscaGeral ||
                p.nome.toLowerCase().includes(filtros.buscaGeral.toLowerCase()) ||
                (p.codId && p.codId.toLowerCase().includes(filtros.buscaGeral.toLowerCase()));

            const bateNatureza = !filtros.natureza || p.natureza === filtros.natureza;
            const bateStatus = !filtros.status || (p.status && p.status.toLowerCase().includes(filtros.status.toLowerCase()));
            const bateData = !filtros.dataApos || (p.dataDeposito && new Date(p.dataDeposito) >= new Date(filtros.dataApos));

            return bateBusca && bateNatureza && bateStatus && bateData;
        });
    }, [todasProtecoes, filtros]);

    const totalPages = Math.ceil(protecoesFiltradas.length / itensPorPagina);
    const protecoesExibidas = protecoesFiltradas.slice(
        paginaAtual * itensPorPagina,
        (paginaAtual + 1) * itensPorPagina
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
        setPaginaAtual(0);
    };

    const resetarFiltros = () => {
        setFiltros({ buscaGeral: "", natureza: "", status: "", dataApos: "" });
        setPaginaAtual(0);
    };

    const confirmarExclusao = async () => {
        if (!protecaoToDelete) return;

        // 1. Função fetch que aceita PIN opcional para MFA
        const fetchDelete = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers: HeadersInit = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;
            if (pin) headers["X-MFA-PIN"] = pin;

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/protecoes/${protecaoToDelete}`, {
                method: "DELETE",
                headers
            });
        };

        // 2. Callback de sucesso
        const onSucesso = () => {
            setTodasProtecoes(prev => prev.filter(p => p.id !== protecaoToDelete));
            setIsDeleteModalOpen(false);
            setProtecaoToDelete(null);
        };

        // 3. Executa via useSecureAction (gerencia MFA se necessário)
        const result = await executeDelete(fetchDelete, onSucesso);

        // 4. Tratamento de erro (sucesso já disparou onSucesso)
        if (!result.success && result.error) {
        }
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
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                <Shield size={24} />
                            </div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight italic uppercase hidden sm:block">
                                Catálogo de Proteções
                            </h1>
                        </div>
                    </div>

                    <ProtecaoFilters
                        isVisible={isFilterVisible}
                        onToggleVisibility={() => setIsFilterVisible(!isFilterVisible)}
                        filtros={filtros}
                        onInputChange={handleInputChange}
                        onClear={resetarFiltros}
                        onClose={() => setIsFilterVisible(false)}
                    />
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <ResultsHeader icon={Target} iconClassName="text-purple-600" total={protecoesFiltradas.length} label="Total de Proteções encontradas" />

                {isLoading ? (
                    <SkeletonGrid count={4} />
                ) : protecoesExibidas.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {protecoesExibidas.map((protecao) => (
                                <ProtecaoCard
                                    key={protecao.id}
                                    protecao={protecao}
                                    userRole={userRole}
                                    onDelete={(id) => { setProtecaoToDelete(id); setIsDeleteModalOpen(true); }}
                                />
                            ))}
                        </div>
                        <Pagination currentPage={paginaAtual} totalPages={totalPages} onPageChange={setPaginaAtual} />
                    </>
                ) : (
                    <EmptyState
                        icon={Shield}
                        title="Nenhuma Proteção"
                        description="Nenhum registro encontrado para estes filtros."
                    />
                )}
            </div>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Confirmar Exclusão"
                description="Esta ação removerá a proteção e todos os seus vínculos permanentemente."
                confirmText="Excluir"
                cancelText="Cancelar"
                onConfirm={confirmarExclusao}
                onCancel={() => setIsDeleteModalOpen(false)}
                isProcessing={isDeleting}
            />
        </main>
    );
}