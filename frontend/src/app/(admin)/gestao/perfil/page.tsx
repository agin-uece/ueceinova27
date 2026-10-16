"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    User, Mail, ShieldCheck, CheckCircle2,
    AlertCircle, Save, Loader2, ArrowLeft, Clock, Pencil
} from "lucide-react";
import Link from "next/link";
import { useSecureAction } from "@/hooks/useSecureAction";

export default function MeuPerfilPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro", texto: string } | null>(null);

    const [dados, setDados] = useState({ nome: "", email: "", emailSecundario: "" });
    const [original, setOriginal] = useState({ nome: "", email: "", emailSecundario: "" });
    const [infoFixa, setInfoFixa] = useState({ role: "", validado: false });

    const { execute, isProcessing: isSaving } = useSecureAction();

    useEffect(() => {
        const carregarPerfil = async () => {
            const token = localStorage.getItem("userToken");
            if (!token) { router.push("/login"); return; }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/meus-dados`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    const inicial = {
                        nome: data.nome || "",
                        email: data.email || "",
                        emailSecundario: data.emailSecundario || ""
                    };
                    setDados(inicial);
                    setOriginal(inicial);
                    setInfoFixa({ role: data.role || "", validado: data.validado || false });
                } else if (res.status === 401) {
                    router.push("/login");
                } else {
                    setMensagem({ tipo: "erro", texto: "Não foi possível carregar os seus dados." });
                }
            } catch {
                setMensagem({ tipo: "erro", texto: "Erro de conexão com o servidor." });
            } finally {
                setIsLoading(false);
            }
        };

        carregarPerfil();
    }, [router]);

    const processarSucesso = (usuarioAtualizado: any) => {
        const userDataStr = localStorage.getItem("userData");
        if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            userData.nome = usuarioAtualizado.nome;
            userData.email = usuarioAtualizado.email;
            localStorage.setItem("userData", JSON.stringify(userData));
            window.dispatchEvent(new Event("storage"));
        }
        setOriginal(dados);
        setMensagem({ tipo: "sucesso", texto: "Perfil atualizado com sucesso!" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem(null);

        if (!dados.email.toLowerCase().endsWith("@uece.br")) {
            setMensagem({ tipo: "erro", texto: "O e-mail principal deve ser institucional (@uece.br)." });
            return;
        }

        const result = await execute((pin?: string) => {
            const token = localStorage.getItem("userToken");
            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/meus-dados`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    ...(pin && { "X-MFA-PIN": pin }),
                },
                body: JSON.stringify(dados)
            });
        });

        if (result.success) processarSucesso(result.data);
        else if (result.error) setMensagem({ tipo: "erro", texto: result.error });
    };

    // Detecta campos que foram alterados em relação ao valor original
    const campoAlterado = (campo: keyof typeof dados) => dados[campo] !== original[campo];

    const inputClass = (campo: keyof typeof dados) =>
        `w-full p-4 rounded-2xl transition-all outline-none text-slate-800 font-medium border-2 ${
            campoAlterado(campo)
                ? "bg-amber-50 border-amber-400 focus:border-amber-500"
                : "bg-slate-50 border-transparent focus:border-indigo-400"
        }`;

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="font-bold text-sm uppercase tracking-widest">Carregando perfil...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen pb-20">

            <div className="mb-10 flex items-center gap-4">
                <Link href="/gestao" className="p-3 bg-white rounded-2xl hover:bg-slate-100 text-slate-500 transition-all shadow-sm border border-slate-100">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Meu Perfil</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Gerencie os seus dados de acesso</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">

                        <h2 className="text-lg font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-2">
                            <User size={20} className="text-indigo-500" /> Dados Pessoais
                        </h2>

                        {mensagem && (
                            <div className={`p-4 rounded-2xl mb-8 flex items-start gap-3 border ${mensagem.tipo === "sucesso" ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"}`}>
                                {mensagem.tipo === "sucesso"
                                    ? <CheckCircle2 size={20} />
                                    : <AlertCircle size={20} />}
                                <span className="text-sm font-bold">{mensagem.texto}</span>
                            </div>
                        )}

                        <div className="space-y-5">

                            {/* Nome */}
                            <div>
                                <label className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    <span className="flex items-center gap-1.5"><User size={12} /> Nome Completo</span>
                                    {campoAlterado("nome") && (
                                        <span className="flex items-center gap-1 text-amber-600 font-black">
                                            <Pencil size={11} /> Alterado
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="text"
                                    value={dados.nome}
                                    onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                                    className={inputClass("nome")}
                                />
                            </div>

                            {/* E-mail principal */}
                            <div>
                                <label className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    <span className="flex items-center gap-1.5"><Mail size={12} /> E-mail Institucional</span>
                                    {campoAlterado("email") && (
                                        <span className="flex items-center gap-1 text-amber-600 font-black">
                                            <Pencil size={11} /> Alterado
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="email"
                                    value={dados.email}
                                    onChange={(e) => setDados({ ...dados, email: e.target.value })}
                                    className={inputClass("email")}
                                />
                                {campoAlterado("email") && dados.email.length > 0 && !dados.email.toLowerCase().endsWith("@uece.br") && (
                                    <p className="text-xs text-red-500 flex items-center gap-1.5 mt-2">
                                        <AlertCircle size={12} /> O e-mail deve terminar com @uece.br
                                    </p>
                                )}
                            </div>

                            {/* E-mail secundário */}
                            <div>
                                <label className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    <span className="flex items-center gap-1.5"><Mail size={12} /> E-mail Secundário (Recuperação)</span>
                                    {campoAlterado("emailSecundario") && (
                                        <span className="flex items-center gap-1 text-amber-600 font-black">
                                            <Pencil size={11} /> Alterado
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="email"
                                    value={dados.emailSecundario}
                                    onChange={(e) => setDados({ ...dados, emailSecundario: e.target.value })}
                                    placeholder="opcional — usado para recuperação de acesso"
                                    className={inputClass("emailSecundario")}
                                />
                            </div>

                        </div>

                        {/* Aviso de campos alterados */}
                        {(campoAlterado("nome") || campoAlterado("email") || campoAlterado("emailSecundario")) && (
                            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 text-amber-700 text-xs font-bold">
                                <Pencil size={14} />
                                Você tem alterações não salvas.
                            </div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center gap-2 font-bold transition-colors disabled:opacity-60"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 h-fit">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Status da Conta</h2>
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nível de Acesso</p>
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-2xl ${infoFixa.role === "ADMIN" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
                                    <ShieldCheck size={24} />
                                </div>
                                <p className="font-black text-slate-800 uppercase tracking-widest">
                                    {infoFixa.role === "ADMIN" ? "Administrador" : "Professor / Usuário"}
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Validação no Sistema</p>
                            {infoFixa.validado ? (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-100">
                                    <CheckCircle2 size={16} />
                                    <span className="text-xs font-black uppercase tracking-widest">Conta Aprovada</span>
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-xl border border-orange-100">
                                    <Clock size={16} />
                                    <span className="text-xs font-black uppercase tracking-widest">Aprovação Pendente</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
}
