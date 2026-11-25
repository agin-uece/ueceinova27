"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Mail, Lock, ArrowLeft, AlertCircle, KeyRound,
    CheckCircle2, Eye, EyeOff, Loader2, ArrowRight
} from "lucide-react";

function RecuperarSenhaForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailParam = searchParams.get("email") || "";
    const tokenParam = searchParams.get("token") || "";

    const [formData, setFormData] = useState({
        email: emailParam,
        token: tokenParam,
        novaSenha: "",
        confirmarSenha: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const senhaOk =
            formData.novaSenha.length >= 6 &&
            /[a-zA-Z]/.test(formData.novaSenha) &&
            /[0-9]/.test(formData.novaSenha);

        if (!senhaOk) {
            setError("A nova senha deve ter no mínimo 6 caracteres, incluindo letras e números.");
            return;
        }

        if (formData.novaSenha !== formData.confirmarSenha) {
            setError("As senhas não coincidem. Tente novamente.");
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                token: formData.token.trim(),
                novaSenha: formData.novaSenha,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            } else {
                const body = await res.text();
                let mensagem = "Código inválido ou expirado.";
                try {
                    const json = JSON.parse(body);
                    mensagem = json.erro || json.message || json.mensagem || mensagem;
                } catch {
                    if (body && !body.startsWith("<")) mensagem = body;
                }
                setError(mensagem);
            }
        } catch (err) {
            console.error(err);
            setError("Erro ao conectar com o servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputBaseClass =
        "block w-full pl-11 pr-4 py-3.5 bg-slate-50/80 border border-slate-200/90 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all";

    if (isSuccess) {
        return (
            <div className="text-center space-y-5 py-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-200/60">
                    <CheckCircle2 size={40} />
                </div>
                <div className="space-y-1.5">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Senha Alterada!</h2>
                    <p className="text-sm text-slate-500">Sua nova senha foi cadastrada com sucesso.</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/70">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Redirecionando para o login...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-7">
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
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Redefinir Senha
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                        {tokenParam
                            ? "Defina sua nova senha de acesso abaixo."
                            : "Insira o código de validação enviado para o seu e-mail."}
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 flex items-start gap-3 text-xs sm:text-sm animate-in fade-in">
                    <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                    <p className="font-medium leading-relaxed">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Exibe o E-mail apenas se vier preenchido na URL */}
                {emailParam && (
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                            Conta Institucional
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                disabled
                                value={formData.email}
                                className="block w-full pl-11 pr-4 py-3.5 border border-slate-200/80 rounded-2xl bg-slate-100/80 text-sm text-slate-500 font-medium cursor-not-allowed outline-none"
                            />
                        </div>
                    </div>
                )}

                {/* Código Token */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                        Código de Segurança
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <KeyRound size={18} />
                        </div>
                        <input
                            type="text"
                            name="token"
                            required
                            value={formData.token}
                            onChange={handleChange}
                            className={`${inputBaseClass} font-mono font-bold tracking-widest`}
                            placeholder="EX: 123456"
                        />
                    </div>
                </div>

                {/* Nova Senha */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                        Nova Senha
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="novaSenha"
                            required
                            value={formData.novaSenha}
                            onChange={handleChange}
                            className={`${inputBaseClass} pr-11`}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Confirmar Nova Senha */}
                <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                        Confirmar Nova Senha
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmarSenha"
                            required
                            value={formData.confirmarSenha}
                            onChange={handleChange}
                            className={`${inputBaseClass} pr-11`}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Checklist de requisitos de senha */}
                {formData.novaSenha.length > 0 && (
                    <ul className="space-y-1.5 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200/70">
                        {[
                            { label: "Mínimo de 6 caracteres", ok: formData.novaSenha.length >= 6 },
                            {
                                label: "Letras e números",
                                ok: /[a-zA-Z]/.test(formData.novaSenha) && /[0-9]/.test(formData.novaSenha),
                            },
                            {
                                label: "Senhas coincidem",
                                ok:
                                    formData.novaSenha === formData.confirmarSenha &&
                                    formData.confirmarSenha.length > 0,
                            },
                        ].map((r) => (
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

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl shadow-lg shadow-orange-500/20 text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 disabled:shadow-none transition-all uppercase tracking-widest"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> Salvando...
                            </>
                        ) : (
                            <>
                                Redefinir Senha <ArrowRight size={16} />
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

export default function RecuperarSenhaPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50/40 px-4 py-10 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[620px] h-[320px] rounded-full bg-orange-500/5 blur-3xl" />
            <div className="w-full max-w-[460px] bg-white/95 backdrop-blur-xs p-8 sm:p-10 rounded-[32px] shadow-xl shadow-slate-200/70 border border-slate-200/70 relative z-10">
                <Suspense fallback={<div className="text-center py-10 text-sm text-slate-500">Carregando...</div>}>
                    <RecuperarSenhaForm />
                </Suspense>
            </div>
        </main>
    );
}