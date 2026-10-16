"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, KeyRound, CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error" | "expired";

// ── Componente interno que usa useSearchParams ───────────────────────────────
function PrimeiroAcessoForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
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

    const tudo_ok = requisitos.every((r) => r.ok);

    const handleSubmit = async () => {
        if (!tudo_ok || !token) return;

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
                const msg = await res.text();
                if (msg.toLowerCase().includes("expir")) {
                    setStatus("expired");
                } else {
                    setStatus("error");
                    setErro(msg || "Erro ao ativar conta. Tente novamente.");
                }
            }
        } catch {
            setStatus("error");
            setErro("Erro de conexão. Verifique sua internet e tente novamente.");
        }
    };

    // ── Tela de sucesso ──────────────────────────────────────────────────────
    if (status === "success") {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-10 max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-green-100 rounded-full">
                        <CheckCircle2 size={48} className="text-green-500" />
                    </div>
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tight">
                    Conta Ativada!
                </h1>
                <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                    Sua senha foi definida com sucesso. Você já pode fazer login no sistema.
                </p>
                <button
                    onClick={() => router.push("/login")}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors"
                >
                    Ir para o Login
                </button>
            </div>
        );
    }

    // ── Tela de token expirado ───────────────────────────────────────────────
    if (status === "expired") {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-10 max-w-md w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-amber-100 rounded-full">
                        <XCircle size={48} className="text-amber-500" />
                    </div>
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tight">
                    Link Expirado
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Este link de ativação expirou (validade de 7 dias). Solicite ao administrador
                    que gere um novo convite para você.
                </p>
            </div>
        );
    }

    // ── Tela principal ───────────────────────────────────────────────────────
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-10 max-w-md w-full">

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-blue-100 rounded-xl">
                    <ShieldCheck size={28} className="text-blue-600" />
                </div>
                <div>
                    <h1 className="text-xl font-black uppercase tracking-tight text-gray-900 leading-none">
                        Primeiro Acesso
                    </h1>
                    <p className="text-slate-400 text-xs mt-1">Defina sua senha para ativar sua conta</p>
                </div>
            </div>

            {/* Erro de link inválido */}
            {status === "error" && !novaSenha && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6 flex items-center gap-2">
                    <XCircle size={16} className="shrink-0" />
                    {erro}
                </div>
            )}

            {/* Campos */}
            <div className="space-y-5">
                {/* Nova senha */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Nova Senha
                    </label>
                    <div className="relative">
                        <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type={mostrarSenha ? "text" : "password"}
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            placeholder="Digite sua nova senha"
                            className="w-full pl-9 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            disabled={status === "loading"}
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Confirmar senha */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Confirmar Senha
                    </label>
                    <div className="relative">
                        <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type={mostrarSenha ? "text" : "password"}
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            placeholder="Repita a senha"
                            className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            disabled={status === "loading"}
                        />
                    </div>
                </div>

                {/* Checklist de requisitos */}
                {novaSenha.length > 0 && (
                    <ul className="space-y-1.5 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                        {requisitos.map((r) => (
                            <li key={r.label} className="flex items-center gap-2 text-xs">
                                <CheckCircle2
                                    size={14}
                                    className={r.ok ? "text-green-500" : "text-slate-300"}
                                />
                                <span className={r.ok ? "text-green-700 font-medium" : "text-slate-400"}>
                                    {r.label}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Erro de submit */}
                {status === "error" && novaSenha && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                        <XCircle size={16} className="shrink-0" />
                        {erro}
                    </div>
                )}

                {/* Botão */}
                <button
                    onClick={handleSubmit}
                    disabled={!tudo_ok || status === "loading"}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                    {status === "loading" ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Ativando conta...
                        </>
                    ) : (
                        "Ativar Minha Conta"
                    )}
                </button>
            </div>
        </div>
    );
}

// ── Loading fallback enquanto o Suspense resolve ─────────────────────────────
function LoadingCard() {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-10 max-w-md w-full flex items-center justify-center gap-3 text-slate-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm font-medium">Carregando...</span>
        </div>
    );
}

// ── Página exportada — envolve o form em Suspense (obrigatório no Next.js) ───
export default function PrimeiroAcessoPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <Suspense fallback={<LoadingCard />}>
                <PrimeiroAcessoForm />
            </Suspense>
        </div>
    );
}
