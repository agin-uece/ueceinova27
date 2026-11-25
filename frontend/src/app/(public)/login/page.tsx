"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Mail, Lock, User, ArrowLeft, AlertCircle, Eye, EyeOff,
    CheckCircle2, ShieldCheck, X, Loader2, ArrowRight, KeyRound
} from "lucide-react";

const decodeJWT = (token: string) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erro ao decodificar token", e);
        return null;
    }
};

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<string>("login");
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        pin: "",
        novoEmail: "",
        novoEmailSecundario: "",
        emailSecundario: "",
        confirmarSenha: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Estados exclusivos do modal de MFA no login
    const [mfaModalOpen, setMfaModalOpen] = useState(false);
    const [mfaError, setMfaError] = useState("");
    const mfaInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (mfaModalOpen) {
            setTimeout(() => mfaInputRef.current?.focus(), 50);
        }
    }, [mfaModalOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const handleGuestAccess = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        router.push("/gestao/conteudo");
    };

    const fecharModalMfa = () => {
        setMfaModalOpen(false);
        setMfaError("");
        setFormData((prev) => ({ ...prev, pin: "" }));
    };

    const executarLogin = async (codigoMfa?: string) => {
        setError("");
        setMfaError("");
        setSuccess("");
        setIsLoading(true);

        try {
            const payload = {
                email: formData.email,
                senha: formData.senha,
                ...(codigoMfa ? { codigo: codigoMfa } : {})
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const data = await res.json();
                const token = data.token;
                const decodedToken = decodeJWT(token);

                let userRole = decodedToken?.role || decodedToken?.roles || decodedToken?.authorities || "PROFESSOR";
                if (Array.isArray(userRole)) userRole = userRole[0];
                if (typeof userRole === "object" && userRole.authority) userRole = userRole.authority;

                const finalRole = String(userRole).replace("ROLE_", "");

                localStorage.setItem("userToken", token);
                localStorage.setItem("userData", JSON.stringify({
                    nome: data.nome || formData.email,
                    email: formData.email,
                    role: finalRole
                }));

                setMfaModalOpen(false);
                router.push("/gestao");
            } else if (res.status !== 401) {
                const body = await res.json().catch(() => ({}));
                if (body.erro === "MFA_REQUIRED") {
                    setFormData((prev) => ({ ...prev, pin: "" }));
                    setMfaError("");
                    setMfaModalOpen(true);
                } else if (body.erro === "MFA_INVALID") {
                    setMfaError("Código inválido ou expirado. Verifique seu e-mail e tente novamente.");
                } else if (mfaModalOpen) {
                    setMfaError(body.erro || body.mensagem || "Não foi possível validar o código.");
                } else {
                    setError(body.erro || body.mensagem || "Acesso negado.");
                }
            } else {
                setMfaModalOpen(false);
                setError("E-mail ou senha incorretos.");
            }
        } catch (err) {
            console.error(err);
            if (mfaModalOpen) {
                setMfaError("Ocorreu um erro ao se conectar com o servidor.");
            } else {
                setError("Ocorreu um erro ao se conectar com o servidor.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmMfa = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.pin.trim()) {
            setMfaError("Informe o código de 6 dígitos enviado ao seu e-mail.");
            return;
        }
        await executarLogin(formData.pin.trim());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (mode === "login") {
            await executarLogin();
            return;
        }

        setIsLoading(true);

        try {
            // === FLUXO ESQUECI A SENHA ===
            if (mode === "forgot") {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: formData.email }),
                });

                if (res.ok) {
                    setSuccess("Instruções de recuperação foram enviadas para o seu e-mail.");
                } else {
                    setError("Erro ao tentar enviar o e-mail de recuperação.");
                }
            }
            // === FLUXO RECUPERAR EMAIL (PASSO 1: Solicitar PIN) ===
            else if (mode === "forgot-email-step1") {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/recuperar-email/solicitar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ emailAtual: formData.email }),
                });

                if (res.ok) {
                    setMode("forgot-email-step2");
                    setSuccess("Código PIN enviado para o seu e-mail secundário.");
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    setError(errorData.erro || "Não foi possível enviar o código. A conta possui e-mail secundário?");
                }
            }
            // === FLUXO RECUPERAR EMAIL (PASSO 2: Confirmar Troca) ===
            else if (mode === "forgot-email-step2") {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/recuperar-email/confirmar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        emailAtual: formData.email,
                        pin: formData.pin,
                        novoEmailPrincipal: formData.novoEmail,
                        novoEmailSecundario: formData.novoEmailSecundario
                    }),
                });

                if (res.ok) {
                    setMode("login");
                    setFormData({ ...formData, pin: "", novoEmail: "", novoEmailSecundario: "", senha: "" });
                    setSuccess("E-mail atualizado com sucesso! Faça login com o novo e-mail.");
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    setError(errorData.erro || "Código inválido ou erro ao atualizar.");
                }
            }
            // === FLUXO DE CADASTRO ===
            else if (mode === "register") {
                if (!formData.email.toLowerCase().endsWith("@uece.br")) {
                    setError("O e-mail deve ser institucional (@uece.br).");
                    setIsLoading(false);
                    return;
                }
                const senhaOk = formData.senha.length >= 6 &&
                    /[a-zA-Z]/.test(formData.senha) &&
                    /[0-9]/.test(formData.senha) &&
                    formData.senha === formData.confirmarSenha;

                if (!senhaOk) {
                    setError("A senha não atende aos requisitos ou as senhas não coincidem.");
                    setIsLoading(false);
                    return;
                }
                const payload = {
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha,
                    role: "PROFESSOR",
                    emailSecundario: formData.emailSecundario,
                };

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (res.ok) {
                    setMode("login");
                    setFormData({ ...formData, senha: "", confirmarSenha: "" });
                    setSuccess("Cadastro realizado com sucesso! Aguarde a aprovação de um administrador para continuar com o login.");
                } else {
                    setError("Não foi possível realizar o cadastro. Verifique os dados ou se o e-mail já existe.");
                }
            }
        } catch (err) {
            console.error(err);
            setError("Ocorreu um erro ao se conectar com o servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    const trocarModo = (novoModo: string) => {
        setMode(novoModo);
        setError("");
        setSuccess("");
        setShowPassword(false);
        setShowConfirmPassword(false);
        fecharModalMfa();
    };

    const subtituloHeader = {
        login: "Acesse o ecossistema de inovação da UECE",
        register: "Preencha seus dados institucionais para solicitar acesso",
        forgot: "Informe seu e-mail institucional para receber as instruções",
        "forgot-email-step1": "Enviaremos um PIN de confirmação ao seu e-mail secundário",
        "forgot-email-step2": "Insira o código recebido e defina o novo endereço de acesso",
    }[mode] || "";

    const inputBaseClass =
        "block w-full pl-11 pr-4 py-3.5 bg-slate-50/80 border border-slate-200/90 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all";

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50/40 px-4 py-10 relative overflow-hidden">
            {/* Elemento decorativo sutil no fundo */}
            <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[620px] h-[320px] rounded-full bg-orange-500/5 blur-3xl" />

            {/* MODAL DE VERIFICAÇÃO MFA (CÓDIGO ENVIADO POR E-MAIL) */}
            {mfaModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs px-4">
                    <div className="bg-white rounded-[32px] max-w-md w-full p-8 sm:p-9 shadow-2xl border border-slate-100 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
                        <button
                            type="button"
                            onClick={fecharModalMfa}
                            disabled={isLoading}
                            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            title="Cancelar"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-orange-200/60">
                                <ShieldCheck size={32} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                    Verificação em Duas Etapas
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Enviamos um código de 6 dígitos para{" "}
                                    <span className="font-semibold text-slate-800">{formData.email}</span>
                                </p>
                            </div>
                        </div>

                        {mfaError && (
                            <div className="bg-red-50 text-red-600 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs border border-red-100">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <p className="font-medium">{mfaError}</p>
                            </div>
                        )}

                        <form onSubmit={handleConfirmMfa} className="space-y-5">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">
                                    Código de Segurança
                                </label>
                                <input
                                    ref={mfaInputRef}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    required
                                    value={formData.pin}
                                    onChange={(e) => {
                                        const apenasDigitos = e.target.value.replace(/\D/g, "");
                                        setFormData({ ...formData, pin: apenasDigitos });
                                        setMfaError("");
                                    }}
                                    className="block w-full py-4 px-4 text-center text-2xl font-black tracking-[0.45em] bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                                    placeholder="000000"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    type="submit"
                                    disabled={isLoading || formData.pin.length < 6}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl shadow-lg shadow-orange-500/20 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:shadow-none transition-all uppercase tracking-widest"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" /> Validando...
                                        </>
                                    ) : (
                                        "Confirmar e Entrar"
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={fecharModalMfa}
                                    disabled={isLoading}
                                    className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CARD PRINCIPAL */}
            <div className="w-full max-w-[460px] bg-white/95 backdrop-blur-xs p-8 sm:p-10 rounded-[32px] shadow-xl shadow-slate-200/70 border border-slate-200/70 space-y-7 relative z-10">
                {/* Cabeçalho */}
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
                            {mode === "login"
                                ? "Bem-vindo de volta"
                                : mode === "register"
                                ? "Crie sua conta"
                                : mode === "forgot"
                                ? "Recuperar Senha"
                                : "Recuperar E-mail"}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500">{subtituloHeader}</p>
                    </div>
                </div>

                {/* Navegação por abas */}
                <div className="flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/60">
                    <button
                        type="button"
                        onClick={() => trocarModo("login")}
                        className={`flex-1 py-2.5 text-[11px] uppercase tracking-wider font-extrabold rounded-xl transition-all ${
                            mode === "login"
                                ? "bg-white text-orange-600 shadow-xs"
                                : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        Entrar
                    </button>
                    <button
                        type="button"
                        onClick={() => trocarModo("register")}
                        className={`flex-1 py-2.5 text-[11px] uppercase tracking-wider font-extrabold rounded-xl transition-all ${
                            mode === "register"
                                ? "bg-white text-orange-600 shadow-xs"
                                : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        Cadastrar
                    </button>
                    <button
                        type="button"
                        onClick={() => trocarModo("forgot")}
                        className={`flex-1 py-2.5 text-[11px] uppercase tracking-wider font-extrabold rounded-xl transition-all ${
                            mode === "forgot"
                                ? "bg-white text-orange-600 shadow-xs"
                                : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        Senha
                    </button>
                </div>

                {/* Alertas */}
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 flex items-start gap-3 text-xs sm:text-sm animate-in fade-in">
                        <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                        <p className="font-medium leading-relaxed">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-100 flex items-start gap-3 text-xs sm:text-sm animate-in fade-in">
                        <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-500" />
                        <p className="font-medium leading-relaxed">{success}</p>
                    </div>
                )}

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode !== "forgot-email-step2" && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                                    {mode === "forgot-email-step1" ? "E-mail Antigo (Atual)" : "E-mail Institucional"}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={inputBaseClass}
                                        placeholder="seu.nome@uece.br"
                                    />
                                </div>
                                {mode === "register" &&
                                    formData.email.length > 0 &&
                                    !formData.email.toLowerCase().endsWith("@uece.br") && (
                                        <p className="text-xs text-red-500 font-medium flex items-center gap-1.5 mt-1.5 ml-1">
                                            <AlertCircle size={13} /> O e-mail deve terminar com @uece.br
                                        </p>
                                    )}
                            </div>

                            {mode === "register" && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                                            Nome Completo
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <User size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                name="nome"
                                                required={mode === "register"}
                                                value={formData.nome}
                                                onChange={handleChange}
                                                className={inputBaseClass}
                                                placeholder="João da Silva"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                                            E-mail Secundário <span className="text-slate-400 font-normal">(para recuperação)</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                name="emailSecundario"
                                                value={formData.emailSecundario}
                                                onChange={handleChange}
                                                className={inputBaseClass}
                                                placeholder="exemplo@gmail.com"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {(mode === "login" || mode === "register") && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                                        Senha
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="senha"
                                            required
                                            value={formData.senha}
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
                            )}

                            {mode === "register" && (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                                            Confirmar Senha
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmarSenha"
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

                                    {formData.senha.length > 0 && (
                                        <ul className="space-y-1.5 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200/70">
                                            {[
                                                { label: "Mínimo de 6 caracteres", ok: formData.senha.length >= 6 },
                                                {
                                                    label: "Letras e números",
                                                    ok: /[a-zA-Z]/.test(formData.senha) && /[0-9]/.test(formData.senha),
                                                },
                                                {
                                                    label: "Senhas coincidem",
                                                    ok:
                                                        formData.senha === formData.confirmarSenha &&
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
                                </>
                            )}
                        </>
                    )}

                    {mode === "forgot-email-step2" && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                                    Código de Segurança (PIN) *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <KeyRound size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="pin"
                                        required
                                        maxLength={6}
                                        inputMode="numeric"
                                        value={formData.pin}
                                        onChange={handleChange}
                                        className={`${inputBaseClass} font-bold tracking-[0.3em]`}
                                        placeholder="000000"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                                    Novo E-mail Principal *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="novoEmail"
                                        required
                                        value={formData.novoEmail}
                                        onChange={handleChange}
                                        className={inputBaseClass}
                                        placeholder="novo@uece.br"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1.5 ml-1">
                                    Novo E-mail Secundário
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="novoEmailSecundario"
                                        value={formData.novoEmailSecundario}
                                        onChange={handleChange}
                                        className={inputBaseClass}
                                        placeholder="opcional@gmail.com"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="space-y-3 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl shadow-lg shadow-orange-500/20 text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 disabled:shadow-none transition-all uppercase tracking-widest"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Processando...
                                </>
                            ) : (
                                <>
                                    {mode === "login"
                                        ? "Entrar na plataforma"
                                        : mode === "register"
                                        ? "Criar conta"
                                        : mode === "forgot-email-step2"
                                        ? "Confirmar Alteração"
                                        : "Enviar Código"}
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>

                        {mode === "login" && (
                            <button
                                type="button"
                                onClick={handleGuestAccess}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 bg-slate-50/60 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 transition-all uppercase tracking-wider"
                            >
                                <Eye size={16} /> Explorar como visitante
                            </button>
                        )}
                    </div>
                </form>

                {/* Links auxiliares do rodapé */}
                <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-2.5 text-center">
                    {mode !== "forgot-email-step1" && mode !== "forgot-email-step2" && (
                        <button
                            type="button"
                            onClick={() => trocarModo("forgot-email-step1")}
                            className="text-xs font-semibold text-slate-400 hover:text-orange-600 transition-colors"
                        >
                            Perdi acesso ao meu e-mail institucional
                        </button>
                    )}

                    <Link
                        href="/"
                        className="text-xs font-bold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors"
                    >
                        <ArrowLeft size={14} /> Voltar para o portal
                    </Link>
                </div>
            </div>
        </main>
    );
}