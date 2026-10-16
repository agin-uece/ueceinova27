"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    UserCheck, Search, ArrowLeft,
    ShieldAlert, CheckCircle2, AlertCircle, Loader2
} from "lucide-react";
import { useSecureAction } from "@/hooks/useSecureAction";

interface UsuarioPendente {
    id: number;
    nome: string;
    email: string;
}

export default function ValidarUsuariosPage() {
    const router = useRouter();
    const [usuarios, setUsuarios] = useState<UsuarioPendente[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [userToValidate, setUserToValidate] = useState<UsuarioPendente | null>(null);

    const { execute } = useSecureAction();

    useEffect(() => {
        const fetchPendentes = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/pendentes`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) setUsuarios(await res.json());
            } catch (err) {
                console.error("Erro ao carregar usuários:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPendentes();
    }, []);

    const handleValidarClick = (u: UsuarioPendente) => {
        setUserToValidate(u);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmarValidacao = async () => {
        if (!userToValidate) return;
        setIsConfirmModalOpen(false);
        setActionLoading(userToValidate.id);

        const result = await execute((pin?: string) => {
            const token = localStorage.getItem("userToken");
            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${userToValidate.id}/validar`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    ...(pin && { "X-MFA-PIN": pin }),
                }
            });
        });

        if (result.success) {
            setUsuarios(prev => prev.filter(u => u.id !== userToValidate.id));
            setUserToValidate(null);
        } else if (result.error) {
            setUserToValidate(null);
        }
        // se mfaRequired, o MfaProvider já abriu o modal — não faz nada

        setActionLoading(null);
    };

    const usuariosFiltrados = usuarios.filter(u =>
        u.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-[#F8FAFC] pb-20">

            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/gestao/administracao" className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                <ShieldAlert size={24} />
                            </div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight">Novos Pesquisadores</h1>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 mt-10 space-y-8">

                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="bg-white p-4 px-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 min-w-[200px]">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pendentes</p>
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-black">
                            {usuarios.length}
                        </span>
                    </div>

                    <div className="flex-1 bg-white p-2 rounded-[32px] border border-gray-100 shadow-sm flex items-center px-4 w-full">
                        <Search className="text-gray-300 ml-2" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou e-mail institucional..."
                            className="w-full pl-4 pr-4 py-3 bg-transparent border-none focus:ring-0 outline-none text-gray-600 font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Identificação</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">E-mail</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="text-orange-500 animate-spin" size={32} />
                                                <p className="text-gray-400 font-bold">Consultando banco de dados...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : usuariosFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <CheckCircle2 size={48} className="text-green-200" />
                                                <p className="text-gray-400 font-bold">Tudo em dia! Nenhuma solicitação pendente.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    usuariosFiltrados.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-black">
                                                        {u.nome.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-gray-800">{u.nome}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-gray-500 font-medium italic">{u.email}</td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    disabled={actionLoading === u.id}
                                                    onClick={() => handleValidarClick(u)}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs transition-all shadow-lg shadow-orange-100 disabled:opacity-50"
                                                >
                                                    {actionLoading === u.id
                                                        ? <Loader2 className="animate-spin" size={16} />
                                                        : <UserCheck size={16} />
                                                    }
                                                    VALIDAR ACESSO
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="bg-orange-50 p-6 rounded-[24px] border border-orange-100 flex items-start gap-4">
                    <AlertCircle className="text-orange-500 shrink-0" size={24} />
                    <div className="space-y-1">
                        <h4 className="font-black text-orange-800 text-sm uppercase">Importante</h4>
                        <p className="text-xs text-orange-700 leading-relaxed">
                            A validação de um usuário permite que ele publique dados em nome da Inova27.
                            Verifique sempre se o e-mail possui o domínio institucional <strong>@uece.br</strong> antes de conceder o acesso definitivo.
                        </p>
                    </div>
                </div>

            </div>

            {/* MODAL DE CONFIRMAÇÃO */}
            {isConfirmModalOpen && userToValidate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl overflow-hidden relative">
                        <div className="flex justify-center mb-6">
                            <img
                                src="/imagens/Marca_aginhorizontal_fundoazul.png"
                                alt="Logo AGIN"
                                className="h-12 object-contain"
                            />
                        </div>

                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                                <ShieldAlert size={32} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                Validar Pesquisador?
                            </h3>
                            <div className="text-gray-500 text-sm leading-relaxed">
                                <div className="block">Usuário: <strong>{userToValidate.nome}</strong></div>
                                <div className="block text-xs opacity-70">Email: {userToValidate.email}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-8">
                            <button
                                onClick={() => { setIsConfirmModalOpen(false); setUserToValidate(null); }}
                                className="py-4 rounded-2xl font-black text-xs uppercase text-gray-400 hover:bg-gray-50 transition-colors"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleConfirmarValidacao}
                                className="py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg shadow-orange-200 transition-all"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </main>
    );
}