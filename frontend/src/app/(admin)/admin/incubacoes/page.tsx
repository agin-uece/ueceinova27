"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Layers,
    Plus,
    Edit,
    Trash2,
    Check,
    X,
    Loader2,
    AlertCircle,
    CheckCircle2,
    ArrowLeft
} from "lucide-react";
import { Incubacao } from "@/types";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useSecureAction } from "@/hooks/useSecureAction";

const MAX_NOME = 20;

const extrairMensagemErro = (rawError: string | undefined, fallback: string) => {
    if (!rawError) return fallback;
    try {
        const parsed = JSON.parse(rawError);
        return parsed.erro || parsed.message || rawError;
    } catch {
        return rawError;
    }
};

export default function GerenciarIncubacoesPage() {
    const router = useRouter();
    const { execute, isProcessing } = useSecureAction();

    const [incubacoes, setIncubacoes] = useState<Incubacao[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    // Criação
    const [novoNome, setNovoNome] = useState("");

    // Edição inline
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingNome, setEditingNome] = useState("");

    // Exclusão
    const [deleteTarget, setDeleteTarget] = useState<Incubacao | null>(null);

    // Feedback global
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const carregarIncubacoes = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/incubacoes`);
            if (res.ok) {
                const data: Incubacao[] = await res.json();
                setIncubacoes(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Erro ao carregar incubações:", error);
            setFeedback({ type: "error", message: "Não foi possível carregar as opções de incubação." });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const userDataStr = localStorage.getItem("userData");
        let role = "";
        if (userDataStr) {
            try {
                role = (JSON.parse(userDataStr).role || "").toUpperCase();
            } catch {
                role = "";
            }
        }

        if (role !== "ADMIN") {
            router.replace("/gestao/conteudo");
            return;
        }

        setAuthorized(true);
        carregarIncubacoes();
    }, [router]);

    // --- CRIAR ---
    const handleCriar = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedback(null);

        const nomeLimpo = novoNome.trim();
        if (!nomeLimpo) {
            setFeedback({ type: "error", message: "Informe o nome da opção de incubação." });
            return;
        }
        if (nomeLimpo.length > MAX_NOME) {
            setFeedback({ type: "error", message: `O nome deve ter no máximo ${MAX_NOME} caracteres.` });
            return;
        }

        const fetchCriar = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers = new Headers({ "Content-Type": "application/json" });
            if (token) headers.append("Authorization", `Bearer ${token}`);
            if (pin) headers.append("X-MFA-PIN", pin);

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/incubacoes`, {
                method: "POST",
                headers,
                body: JSON.stringify({ nome: nomeLimpo })
            });
        };

        const onSucesso = () => {
            setNovoNome("");
            setFeedback({ type: "success", message: `Opção "${nomeLimpo}" criada com sucesso!` });
            carregarIncubacoes();
        };

        const result = await execute(fetchCriar, onSucesso);

        if (!result.success && result.error) {
            setFeedback({
                type: "error",
                message: extrairMensagemErro(
                    result.error,
                    "Não foi possível criar. Verifique se o nome já existe ou ultrapassa 20 caracteres."
                )
            });
        }
    };

    // --- EDITAR ---
    const iniciarEdicao = (item: Incubacao) => {
        setFeedback(null);
        setEditingId(item.id);
        setEditingNome(item.nome);
    };

    const cancelarEdicao = () => {
        setEditingId(null);
        setEditingNome("");
    };

    const handleSalvarEdicao = async (id: number) => {
        setFeedback(null);

        const nomeLimpo = editingNome.trim();
        if (!nomeLimpo) {
            setFeedback({ type: "error", message: "O nome não pode ficar vazio." });
            return;
        }
        if (nomeLimpo.length > MAX_NOME) {
            setFeedback({ type: "error", message: `O nome deve ter no máximo ${MAX_NOME} caracteres.` });
            return;
        }

        const fetchEditar = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers = new Headers({ "Content-Type": "application/json" });
            if (token) headers.append("Authorization", `Bearer ${token}`);
            if (pin) headers.append("X-MFA-PIN", pin);

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/incubacoes/${id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({ nome: nomeLimpo })
            });
        };

        const onSucesso = () => {
            setEditingId(null);
            setEditingNome("");
            setFeedback({ type: "success", message: "Opção atualizada com sucesso!" });
            carregarIncubacoes();
        };

        const result = await execute(fetchEditar, onSucesso);

        if (!result.success && result.error) {
            setFeedback({
                type: "error",
                message: extrairMensagemErro(
                    result.error,
                    "Não foi possível atualizar. Verifique se já existe outra opção com este nome."
                )
            });
        }
    };

    // --- EXCLUIR ---
    const handleConfirmarExclusao = async () => {
        if (!deleteTarget) return;
        setFeedback(null);

        const alvo = deleteTarget;

        const fetchExcluir = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers = new Headers();
            if (token) headers.append("Authorization", `Bearer ${token}`);
            if (pin) headers.append("X-MFA-PIN", pin);

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/incubacoes/${alvo.id}`, {
                method: "DELETE",
                headers
            });
        };

        const onSucesso = () => {
            setDeleteTarget(null);
            setIncubacoes(prev => prev.filter(item => item.id !== alvo.id));
            setFeedback({ type: "success", message: `Opção "${alvo.nome}" removida com sucesso!` });
        };

        const result = await execute(fetchExcluir, onSucesso);

        if (!result.success && result.error) {
            setDeleteTarget(null);
            setFeedback({
                type: "error",
                message: extrairMensagemErro(
                    result.error,
                    "Não é possível excluir esta opção porque ela está vinculada a uma ou mais startups."
                )
            });
        }
    };

    if (!authorized) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-red-600" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-4 space-y-8">
            {/* Cabeçalho */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-200 rounded-xl text-gray-500 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                    <Layers size={26} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight">
                        Opções de Incubação
                    </h1>
                    <p className="text-sm text-gray-500">
                        Gerencie as modalidades de incubação disponíveis para as startups.
                    </p>
                </div>
            </div>

            {/* Banner de Feedback */}
            {feedback && (
                <div
                    className={`p-4 rounded-2xl flex items-center justify-between gap-3 border ${
                        feedback.type === "success"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-red-50 border-red-200 text-red-800"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        {feedback.type === "success" ? (
                            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                        ) : (
                            <AlertCircle size={20} className="text-red-600 shrink-0" />
                        )}
                        <span className="text-sm font-medium">{feedback.message}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFeedback(null)}
                        className="p-1 rounded-lg hover:bg-black/5 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Formulário de Criação */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">
                    Nova Opção
                </h2>
                <form onSubmit={handleCriar} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={novoNome}
                            onChange={(e) => setNovoNome(e.target.value)}
                            maxLength={MAX_NOME}
                            placeholder="Ex: Graduada, Pré-incubada..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none text-sm font-medium transition-all"
                        />
                        <p className="text-right text-[10px] font-bold text-gray-400 mt-1">
                            {novoNome.length}/{MAX_NOME} caracteres
                        </p>
                    </div>
                    <button
                        type="submit"
                        disabled={isProcessing || !novoNome.trim()}
                        className="h-[46px] px-6 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md shadow-red-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                        Adicionar
                    </button>
                </form>
            </section>

            {/* Listagem */}
            <section className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-widest text-gray-500">
                        Opções Cadastradas
                    </h2>
                    <span className="text-xs font-bold text-gray-400">
                        {incubacoes.length} {incubacoes.length === 1 ? "item" : "itens"}
                    </span>
                </div>

                {isLoading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="animate-spin text-red-600" size={32} />
                    </div>
                ) : incubacoes.length === 0 ? (
                    <div className="p-12 text-center text-sm text-gray-400 italic">
                        Nenhuma opção de incubação cadastrada.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {incubacoes.map((item) => {
                            const isEditing = editingId === item.id;

                            return (
                                <li
                                    key={item.id}
                                    className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors"
                                >
                                    {isEditing ? (
                                        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={editingNome}
                                                    onChange={(e) => setEditingNome(e.target.value)}
                                                    maxLength={MAX_NOME}
                                                    autoFocus
                                                    className="w-full px-3 py-2 rounded-xl border border-red-300 bg-white focus:ring-2 focus:ring-red-500 outline-none text-sm font-semibold"
                                                />
                                                <p className="text-right text-[10px] font-bold text-gray-400 mt-0.5">
                                                    {editingNome.length}/{MAX_NOME}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    disabled={isProcessing || !editingNome.trim()}
                                                    onClick={() => handleSalvarEdicao(item.id)}
                                                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-50"
                                                    title="Salvar"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={cancelarEdicao}
                                                    className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors"
                                                    title="Cancelar"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-black uppercase tracking-tight">
                                                    {item.nome}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => iniciarEdicao(item)}
                                                    className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                                                    title="Editar"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteTarget(item)}
                                                    className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>

            {/* Modal de Confirmação de Exclusão */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Excluir Opção de Incubação"
                description={`Deseja remover "${deleteTarget?.nome}"? Opções vinculadas a startups não podem ser excluídas.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                onConfirm={handleConfirmarExclusao}
                onCancel={() => setDeleteTarget(null)}
                isProcessing={isProcessing}
            />
        </div>
    );
}