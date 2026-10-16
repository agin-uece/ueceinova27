"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, UserPlus, Save, XCircle, Info,
    User, Mail, Lock, Shield, Loader2, AlertCircle, CheckCircle, ChevronDown, ChevronUp
} from "lucide-react";
import { useSecureAction } from "@/hooks/useSecureAction";

const ROLE_OPCOES = ["ADMIN", "PROFESSOR"];

export default function CadastrarAdminPage() {
    const { execute, isProcessing: isSaving } = useSecureAction();
    const router = useRouter();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        emailSecundario: "",
        senha: "",
        role: "ADMIN"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };





    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        const result = await execute((pin?: string) => {
            const token = localStorage.getItem("userToken");
            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` }),
                    ...(pin && { "X-MFA-PIN": pin }),
                },
                body: JSON.stringify(formData)
            });
        });

        if (result.success) tratarSucesso();
        else if (result.error) setError(`Erro ao cadastrar: ${result.error}`);
    };



    const tratarSucesso = () => {
        setSuccess(true);
        setTimeout(() => {
            router.push("/gestao");
        }, 2000);
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* HEADER */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/gestao/administracao" className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                <UserPlus size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Novo Usuário</h1>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Gestão de Acessos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 mt-10">

                {/* ALERTA DE SUCESSO */}
                {success && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-700 animate-in fade-in slide-in-from-top-4">
                        <CheckCircle className="text-green-500 shrink-0" size={24} />
                        <div>
                            <p className="font-black uppercase text-sm">Usuário Cadastrado!</p>
                            <p className="text-xs font-medium opacity-80">Redirecionando de volta ao painel de gestão...</p>
                        </div>
                    </div>
                )}

                {/* ALERTA DE ERRO */}
                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-4 text-sm">
                        <AlertCircle className="shrink-0 mt-0.5" size={20} />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* SESSÃO DO FORMULÁRIO */}
                    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
                            <Info size={18} className="text-red-500" />
                            <h2 className="font-bold text-gray-800 uppercase text-sm tracking-widest">Credenciais de Acesso</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Nome Completo */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nome Completo *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text" name="nome" required
                                        value={formData.nome} onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                        placeholder="Digite o nome completo"
                                    />
                                </div>
                            </div>

                            {/* E-mail */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">E-mail *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email" name="email" required
                                        value={formData.email} onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                        placeholder="usuario@uece.br"
                                    />
                                </div>
                            </div>

                            {/* E-mail Secundário*/}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">E-mail Secundário *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="emailSecundario" name="emailSecundario" required
                                        value={formData.emailSecundario} onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                        placeholder="emailSecundario@uece.br"
                                    />
                                </div>
                            </div>


                            {/* Perfil (Role) */}
                            <div className="md:col-span-2 pt-2 border-t border-gray-50">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nível de Permissão (Role) *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-red-400 z-10">
                                        <Shield size={18} />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all flex items-center justify-between text-gray-700 font-bold"
                                    >
                                        <span>{formData.role || "Selecione a permissão..."}</span>
                                        {isRoleDropdownOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                    </button>

                                    {isRoleDropdownOpen && (
                                        <div className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col py-2 animate-in fade-in slide-in-from-top-2">
                                            {ROLE_OPCOES.map(op => (
                                                <button
                                                    key={op}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, role: op }));
                                                        setIsRoleDropdownOpen(false);
                                                    }}
                                                    className={`px-5 py-3 text-left text-sm font-bold transition-colors ${formData.role === op
                                                            ? "bg-red-50 text-red-600"
                                                            : "text-gray-600 hover:bg-gray-50 hover:text-red-500"
                                                        }`}
                                                >
                                                    {op}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 mt-2 ml-1 uppercase">
                                    Atenção: Administradores têm acesso total ao painel.
                                </p>
                            </div>

                        </div>
                    </section>

                    {/* BOTÕES DE AÇÃO */}
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
                        <Link
                            href="/gestao"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <XCircle size={16} /> Cancelar
                        </Link>

                        <button
                            type="submit" disabled={isSaving}
                            className="w-full sm:w-auto px-10 py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-100 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            {isSaving ? "Salvando..." : "Cadastrar Usuário"}
                        </button>
                    </div>

                </form>
            </div>


        </main>
    );
}