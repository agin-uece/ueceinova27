"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Target, Wrench } from "lucide-react";

// 1. Tipagens globais
import { Servico, SpringPageResponse, PessoaPrestador } from "@/types";

// 2. Componentes Genéricos
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Pagination } from "@/components/ui/Pagination";

// 3. Componentes da Feature de Serviços
import { ServicoCard } from "@/components/features/servicos/ServicoCard";
import { ServicoFilters } from "@/components/features/servicos/ServicoFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonGrid } from "@/components/ui/SkeletonGrid";
import { ResultsHeader } from "@/components/ui/ResultsHeader";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function PesquisarServicosPage() {
    // --- ESTADOS ---
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [meta, setMeta] = useState({ total: 0, pages: 0, current: 0 });

    const [pessoas, setPessoas] = useState<PessoaPrestador[]>([]);
    const [userRole, setUserRole] = useState("");

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [servicoToDelete, setServicoToDelete] = useState<number | null>(null);

    // 🔐 Hook MFA para exclusão
    const { execute: executeDelete, isProcessing: isDeleting } = useSecureAction();

    const [filtros, setFiltros] = useState({
        areaAtuacao: "", pessoaId: ""
    });

    // --- EFEITOS ---
    useEffect(() => {
        const userDataStr = localStorage.getItem("userData");
        if (userDataStr) {
            try { setUserRole(JSON.parse(userDataStr).role || ""); } catch (e) { }
        }

        const carregarPessoas = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pessoas/prestadores`);
                if (res.ok) {
                    const data = await res.json();
                    setPessoas(data);
                }
            } catch (error) { console.error("Erro ao buscar pessoas:", error); }
        };

        carregarPessoas();
        handleBuscar(0);
    }, []);

    // --- LÓGICA DA API ---
    const handleBuscar = async (page: number = 0) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filtros.areaAtuacao) params.append("areaAtuacao", filtros.areaAtuacao);
            if (filtros.pessoaId) params.append("pessoaId", filtros.pessoaId);
            params.append("page", page.toString());
            params.append("size", "8");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicos/buscar?${params.toString()}`);
            if (res.ok) {
                const data: SpringPageResponse<Servico> = await res.json();
                setServicos(data.content || []);
                setMeta({
                    total: data.totalElements,
                    pages: data.totalPages,
                    current: data.number
                });
            }
        } catch (error) {
            console.error(error);
            setServicos([]);
        } finally {
            setIsLoading(false);
        }
    };

    const confirmarExclusao = async () => {
        if (!servicoToDelete) return;

        // 1. Função fetch que aceita PIN opcional para MFA
        const fetchDelete = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers: HeadersInit = {};
            if (token) headers["Authorization"] = `Bearer ${token}`;
            if (pin) headers["X-MFA-PIN"] = pin;

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicos/${servicoToDelete}`, {
                method: "DELETE",
                headers
            });
        };

        // 2. Callback de sucesso
        const onSucesso = () => {
            setServicos(prev => prev.filter(s => s.id !== servicoToDelete));
            setMeta(prev => ({ ...prev, total: prev.total - 1 }));
            closeDeleteModal();
        };

        // 3. Executa via useSecureAction (gerencia MFA se necessário)
        const result = await executeDelete(fetchDelete, onSucesso);

        // 4. Tratamento de erro (sucesso já disparou onSucesso)
        if (!result.success && result.error) {
        }
    };

    // --- HANDLERS E FUNÇÕES AUXILIARES ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectPessoa = (id: string) => {
        setFiltros(prev => ({ ...prev, pessoaId: id }));
    };

    const handleClearFilters = () => {
        setFiltros({ areaAtuacao: "", pessoaId: "" });
        handleBuscar(0);
    };

    const handleSubmitFilters = (e: React.FormEvent) => {
        e.preventDefault();
        setIsFilterVisible(false);
        handleBuscar(0);
    };

    const openDeleteModal = (id: number) => {
        setServicoToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setServicoToDelete(null);
    };

    // ==========================================
    // RENDERIZAÇÃO
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
                            <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                                <Wrench size={24} />
                            </div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight italic uppercase hidden sm:block">
                                Catálogo de Serviços
                            </h1>
                        </div>
                    </div>

                    {/* COMPONENTE DE FILTROS COM AUTOCOMPLETE ENCAPSULADO */}
                    <ServicoFilters
                        isVisible={isFilterVisible}
                        onToggleVisibility={() => setIsFilterVisible(!isFilterVisible)}
                        filtros={filtros}
                        onInputChange={handleInputChange}
                        onSelectPessoa={handleSelectPessoa}
                        onClear={handleClearFilters}
                        onSubmit={handleSubmitFilters}
                        isLoading={isLoading}
                        pessoas={pessoas}
                    />
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <ResultsHeader icon={Target} iconClassName="text-teal-600" total={meta.total} label="Total de Serviços encontrados" />

                {isLoading ? (
                    <SkeletonGrid count={4} />
                ) : servicos.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {servicos.map((servico) => (
                                <ServicoCard
                                    key={servico.id}
                                    servico={servico}
                                    userRole={userRole}
                                    onDelete={openDeleteModal}
                                />
                            ))}
                        </div>
                        <Pagination currentPage={meta.current} totalPages={meta.pages} onPageChange={handleBuscar} />
                    </>
                ) : (
                    <EmptyState
                        icon={Wrench}
                        title="Nenhum Serviço"
                        description="Nenhum registro encontrado para estes filtros."
                    />
                )}
            </div>

            {/* COMPONENTE DO MODAL DE EXCLUSÃO */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Confirmar Exclusão"
                description="Deseja remover este serviço permanentemente? Esta ação não poderá ser desfeita."
                confirmText="Excluir"
                cancelText="Cancelar"
                onConfirm={confirmarExclusao}
                onCancel={closeDeleteModal}
                isProcessing={isDeleting}
            />
        </main>
    );
}