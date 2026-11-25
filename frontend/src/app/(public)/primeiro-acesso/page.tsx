"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Eye, EyeOff, KeyRound, CheckCircle2, XCircle,
    Loader2, ShieldCheck, ArrowRight, ArrowLeft, AlertCircle
} from "lucide-react";

type Status = "idle" | "loading" | "success" | "error" | "expired";

function PrimeiroAcessoForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
    const [status, setStatus] = useState<Status>("idle");
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setErro("Link inválido. Solicite um novo convite ao administrador.");
        }
    }, [token]);

    const requisitos = [
        { label: "Mínimo de 6 caracteres", ok: novaSenha.length >= 6 },
        { label: "Letras e números", ok: /[a-zA-Z]/.test(novaSenha) && /[0-9]/.test(novaSenha) },
        { label: "Senhas coincidem", ok: novaSenha === confirmarSenha && confirmarSenha.length > 0 },
    ];

    const tudoOk = requisitos.every((r) => r.ok);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tudoOk || !token) return;

        setStatus("loading");
        setErro("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/primeiro-acesso`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, novaSenha }),
            });

            if (res.ok) {
                setStatus("success");
            } else {
                const body = await res.text();
                let mensagem = "Erro ao ativar conta. Tente novamente.";
                try {
                    const json = JSON.parse(body);
                    mensagem = json.erro || json.message || json.mensagem || mensagem;
                } catch {
                    if (body && !body.startsWith("<")) mensagem = body;
                }

                if (mensagem.toLowerCase().includes("expir")) {
                    setStatus("expired");
                } else {
                    setStatus("error");
                    setErro(mensagem);
                }
            }
        } catch {
            setStatus("error");
            setErro("Erro de conexão. Verifique sua internet e tente novamente.");
        }
    };

    const inputBaseClass =
        "block w-full pl-11 pr-11 py-3.5 bg-slate-50/80 border border-slate-200/90 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60 disabled:cursor-not-allowed outline-none transition-all";

    // ── Tela de sucesso ──────────────────────────────────────────────────────
    if (status === "success") {
        return (
            <div className="bg-white/95 backdrop-blur-xs rounded-[32px] shadow-xl shadow-slate-200/70 border border-slate-200/70 p-8 sm:p-10 max-w-[460px] w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-200/60">
                    <CheckCircle2 size={40} />
                </div>
                <div className="space-y-1.5">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Conta Ativada!
                    </h1>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Sua senha foi definida com sucesso. Você já pode acessar a plataforma.
                    </p>
                </div>
                <button
                    onClick={() => router.push("/login")}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl shadow-lg shadow-orange-500/20 text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all uppercase tracking-widest"
                >
                    Ir para o Login <ArrowRight size={16} />
                </button>
            </div>
        );
    }

    // ── Tela de token expirado ───────────────────────────────────────────────
    if (status === "expired") {
        return (
            <div className="bg-white/95 backdrop-blur-xs rounded-[32px] shadow-xl shadow-slate-200/70 border border-slate-200/70 p-8 sm:p-10 max-w-[460px] w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto border border-amber-200/60">
                    <XCircle size={40} />
                </div>
                <div className="space-y-1.5">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Link Expirado
                    </h1>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Este link de ativação expirou (validade de 7 dias). Solicite ao administrador
                        que gere um novo convite para você.
                    </p>
                </div>
                <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all uppercase tracking-wider"
                >
                    <ArrowLeft size={15} /> Voltar para o Login
                </Link>
            </div>
        );
    }

    // ── Tela principal ───────────────────────────────────────────────────────
    return (
        <div className="bg-white/95 backdrop-blur-xs rounded-[32px] shadow-xl shadow-slate-200/70 border border-slate-200/70 p-8 sm:p-10 max-w-[460px] w-full space-y-7">
            {/* Header institucional */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center bg-slate-900 px-5 py-3 rounded-2xl shadow-md shadow-slate-900/10">
                    <Image
                        src="/imagens/Marca_aginhorizontal_fundoazul.png"
                        alt="Marca da AGIN / UECE"
                        width={185}
                        height={70}
                        className="h-auto w-auto object-contain"
                        priority
                    />
                </div>

                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60 text-[11px] font-bold uppercase tracking-wider mb-1">
                        <ShieldCheck size={13} /> Ativação de Conta
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Primeiro Acesso
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Defina uma senha segura para concluir seu cadastro
                    </p>
                </div>
            </div>

            {/* Alerta de erro */}
            {status === "error" && erro && (
                <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 flex items-start gap-3 text-xs sm:text-sm animate-in fade-in">
                    <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                    <p className="font-medium leading-relaxed">{erro}</p>
                </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nova senha */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                        Nova Senha
                    </label>
                    <div className="relative">
                        <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type={mostrarSenha ? "text" : "password"}
                            value={novaSenha}
                            onChange={(e) => {
                                setNovaSenha(e.target.value);
                                if (status === "error" && token) {
                                    setStatus("idle");
                                    setErro("");
                                }
                            }}
                            placeholder="Digite sua nova senha"
                            className={inputBaseClass}
                            disabled={status === "loading" || !token}
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenha((prev) => !prev)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            tabIndex={-1}
                        >
                            {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Confirmar senha */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                        Confirmar Senha
                    </label>
                    <div className="relative">
                        <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type={mostrarConfirmarSenha ? "text" : "password"}
                            value={confirmarSenha}
                            onChange={(e) => {
                                setConfirmarSenha(e.target.value);
                                if (status === "error" && token) {
                                    setStatus("idle");
                                    setErro("");
                                }
                            }}
                            placeholder="Repita a senha"
                            className={inputBaseClass}
                            disabled={status === "loading" || !token}
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarConfirmarSenha((prev) => !prev)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            tabIndex={-1}
                        >
                            {mostrarConfirmarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Checklist de requisitos */}
                {novaSenha.length > 0 && (
                    <ul className="space-y-1.5 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200/70">
                        {requisitos.map((r) => (
                            <li key={r.label} className="flex items-center gap-2 text-xs">
                                <CheckCircle2
                                    size={14}
                                    className={r.ok ? "text-emerald-500" : "text-slate-300"}
                                />
                                <span className={r.ok ? "text-emerald-700 font-semibold" : "text-slate-400"}>
                                    {r.label}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Botão */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={!tudoOk || status === "loading"}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl shadow-lg shadow-orange-500/20 text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all uppercase tracking-widest"
                    >
                        {status === "loading" ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Ativando conta...
                            </>
                        ) : (
                            <>
                                Ativar Minha Conta <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="pt-2 border-t border-slate-100 text-center">
                <Link
                    href="/login"
                    className="text-xs font-bold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors"
                >
                    <ArrowLeft size={14} /> Voltar para o Login
                </Link>
            </div>
        </div>
    );
}

function LoadingCard() {
    return (
        <div className="bg-white/95 rounded-[32px] shadow-xl shadow-slate-200/70 border border-slate-200/70 p-10 max-w-[460px] w-full flex items-center justify-center gap-3 text-slate-500">
            <Loader2 size={20} className="animate-spin text-orange-500" />
            <span className="text-sm font-medium">Carregando...</span>
        </div>
    );
}

export default function PrimeiroAcessoPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50/40 px-4 py-10 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[620px] h-[320px] rounded-full bg-orange-500/5 blur-3xl" />
            <div className="relative z-10 w-full flex justify-center">
                <Suspense fallback={<LoadingCard />}>
                    <PrimeiroAcessoForm />
                </Suspense>
            </div>
        </main>
    );
}
