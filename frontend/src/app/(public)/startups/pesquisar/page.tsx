"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Rocket, Target } from "lucide-react";

// 1. Tipagens importadas da nossa pasta 'types'
import { Startup, SpringPageResponse } from "@/types";

// 2. Componentes UI Genéricos importados
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Pagination } from "@/components/ui/Pagination";

// 3. Componentes da Feature de Startups importados
import { StartupCard } from "@/components/features/startups/StartupCard";
import { StartupFilters } from "@/components/features/startups/StartupFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonGrid } from "@/components/ui/SkeletonGrid";
import { ResultsHeader } from "@/components/ui/ResultsHeader";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function PesquisarStartupsPage() {
    // --- ESTADOS ---
    const [startups, setStartups] = useState<Startup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [meta, setMeta] = useState({ total: 0, pages: 0, current: 0 });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState("");

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [startupToDelete, setStartupToDelete] = useState<number | null>(null);

    // 🔐 Hook MFA para exclusão
    const { execute: executeDelete, isProcessing: isDeleting } = useSecureAction();

    const [filtros, setFiltros] = useState({
        nome: "", area: "", status: "", dataFundacao: ""
    });

    // --- EFEITOS E REQUISIÇÕES ---
    useEffect(() => {
        const carregarSessao = () => {
            const token = localStorage.getItem("userToken");
            const userDataStr = localStorage.getItem("userData");
            setIsLoggedIn(!!token);
            if (userDataStr) {
                try {
                    const userObj = JSON.parse(userDataStr);
                    setUserRole(userObj.role || "");
                } catch (e) { console.error("Erro ao ler userData"); }
            }
        };
        carregarSessao();
        handleBuscar(0);
    }, []);

    const handleBuscar = async (page: number = 0) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filtros).forEach(([key, value]) => {
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

    // --- HANDLERS DO FILTRO ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handleClearFilters = () => {
        setFiltros({ nome: "", area: "", status: "", dataFundacao: "" });
        handleBuscar(0);
    };

    const handleSubmitFilters = (e: React.FormEvent) => {
        e.preventDefault();
        setIsFilterVisible(false);
        handleBuscar(0);
    };

    // --- HANDLERS DO MODAL DE EXCLUSÃO (COM MFA) ---
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

        // 1. Função fetch que aceita PIN opcional para MFA
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

        // 2. Callback de sucesso
        const onSucesso = () => {
            setStartups(prev => prev.filter(s => s.id !== startupToDelete));
            setMeta(prev => ({ ...prev, total: prev.total - 1 }));
            closeDeleteModal();
        };

        // 3. Executa via useSecureAction (gerencia MFA se necessário)
        const result = await executeDelete(fetchDelete, onSucesso);

        // 4. Tratamento de erro (sucesso já disparou onSucesso)
        if (!result.success && result.error) {
        }
    };

    // ==========================================
    // RENDERIZAÇÃO DA PÁGINA (Muito mais enxuta)
    // ==========================================
    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            {/* HEADER */}
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

                    {/* COMPONENTE DE FILTROS */}
                    <StartupFilters
                        isVisible={isFilterVisible}
                        onToggleVisibility={() => setIsFilterVisible(!isFilterVisible)}
                        filtros={filtros}
                        onInputChange={handleInputChange}
                        onClear={handleClearFilters}
                        onSubmit={handleSubmitFilters}
                        isLoading={isLoading}
                    />
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <ResultsHeader icon={Target} iconClassName="text-red-600" total={meta.total} label="Total de Startups encontradas" />

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

            {/* COMPONENTE DO MODAL DE EXCLUSÃO */}
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