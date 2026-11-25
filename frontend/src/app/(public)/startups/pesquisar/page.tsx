"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Rocket, Target } from "lucide-react";

import { Startup, Incubacao } from "@/types/entidades";
import { SpringPageResponse } from "@/types";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Pagination } from "@/components/ui/Pagination";
import { StartupCard } from "@/components/features/startups/StartupCard";
import { StartupFilters } from "@/components/features/startups/StartupFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonGrid } from "@/components/ui/SkeletonGrid";
import { ResultsHeader } from "@/components/ui/ResultsHeader";
import { useSecureAction } from "@/hooks/useSecureAction";

const FILTROS_INICIAIS = {
    nome: "",
    area: "",
    incubacaoId: "",
    dataFundacao: ""
};

export default function PesquisarStartupsPage() {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [incubacoes, setIncubacoes] = useState<Incubacao[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [meta, setMeta] = useState({ total: 0, pages: 0, current: 0 });

    const [userRole, setUserRole] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [startupToDelete, setStartupToDelete] = useState<number | null>(null);

    const { execute: executeDelete, isProcessing: isDeleting } = useSecureAction();
    const [filtros, setFiltros] = useState(FILTROS_INICIAIS);

    useEffect(() => {
        const userDataStr = localStorage.getItem("userData");
        if (userDataStr) {
            try {
                const userObj = JSON.parse(userDataStr);
                setUserRole(userObj.role || "");
            } catch {
                console.error("Erro ao ler userData");
            }
        }

        const carregarIncubacoes = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incubacoes`);
                if (res.ok) {
                    const data: Incubacao[] = await res.json();
                    setIncubacoes(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Erro ao buscar opções de incubação:", error);
            }
        };

        carregarIncubacoes();
        handleBuscar(0);
    }, []);

    const handleBuscar = async (page: number = 0, filtrosAtivos = filtros) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filtrosAtivos).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            params.append("page", page.toString());
            params.append("size", "8");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups/buscar?${params.toString()}`);
            if (res.ok) {
                const data: SpringPageResponse<Startup> = await res.json();
                setStartups(data.content || []);
                setMeta({
                    total: data.totalElements,
                    pages: data.totalPages,
                    current: data.number
                });
            }
        } catch (error) {
            console.error(error);
            setStartups([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => {
        setFiltros(FILTROS_INICIAIS);
        handleBuscar(0, FILTROS_INICIAIS);
    };

    const handleSubmitFilters = (e: React.FormEvent) => {
        e.preventDefault();
        setIsFilterVisible(false);
        handleBuscar(0);
    };

    const openDeleteModal = (id: number) => {
        setStartupToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setStartupToDelete(null);
    };

    const confirmarExclusao = async () => {
        if (!startupToDelete) return;

        const fetchDelete = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers: HeadersInit = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;
            if (pin) headers["X-MFA-PIN"] = pin;

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups/${startupToDelete}`, {
                method: "DELETE",
                headers
            });
        };

        const onSucesso = () => {
            setStartups(prev => prev.filter(s => s.id !== startupToDelete));
            setMeta(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
            closeDeleteModal();
        };

        await executeDelete(fetchDelete, onSucesso);
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
                            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                <Rocket size={24} />
                            </div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight italic uppercase hidden sm:block">
                                Ecossistema de Startups/Empresas
                            </h1>
                        </div>
                    </div>

                    <StartupFilters
                        isVisible={isFilterVisible}
                        onToggleVisibility={() => setIsFilterVisible(!isFilterVisible)}
                        filtros={filtros}
                        onInputChange={handleInputChange}
                        onClear={handleClearFilters}
                        onSubmit={handleSubmitFilters}
                        isLoading={isLoading}
                        incubacoes={incubacoes}
                    />
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <ResultsHeader icon={Target} iconClassName="text-modulo-startups" total={meta.total} label="Total de Startups encontradas" />

                {isLoading ? (
                    <SkeletonGrid count={4} />
                ) : startups.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {startups.map((startup) => (
                                <StartupCard
                                    key={startup.id}
                                    startup={startup}
                                    userRole={userRole}
                                    onDelete={openDeleteModal}
                                />
                            ))}
                        </div>
                        <Pagination currentPage={meta.current} totalPages={meta.pages} onPageChange={handleBuscar} />
                    </>
                ) : (
                    <EmptyState
                        icon={Rocket}
                        title="Nenhuma Startup/Empresas"
                        description="Nenhum projeto encontrado para estes filtros."
                    />
                )}
            </div>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Confirmar Exclusão"
                description="Esta ação removerá a startup e todos os seus vínculos permanentemente."
                confirmText="Excluir"
                cancelText="Cancelar"
                onConfirm={confirmarExclusao}
                onCancel={closeDeleteModal}
                isProcessing={isDeleting}
            />
        </main>
    );
}