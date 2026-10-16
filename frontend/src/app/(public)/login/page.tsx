"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowLeft, AlertCircle, Eye, CheckCircle2 } from "lucide-react";

const decodeJWT = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')
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

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); // 🔥 NOVO: Estado para mensagens de sucesso
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
        setSuccess(""); // 🔥 Limpa o sucesso ao digitar
    };

    const handleGuestAccess = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        router.push("/gestao/conteudo");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(""); // 🔥 Limpa mensagens antigas ao enviar
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
            // === FLUXO DE LOGIN ===
            else if (mode === "login") {
                const payload = { email: formData.email, senha: formData.senha };
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
                    if (typeof userRole === 'object' && userRole.authority) userRole = userRole.authority;

                    const finalRole = String(userRole).replace("ROLE_", "");

                    localStorage.setItem("userToken", token);
                    localStorage.setItem("userData", JSON.stringify({
                        nome: data.nome || formData.email,
                        email: formData.email,
                        role: finalRole
                    }));

                    router.push("/gestao");
                } else {
                    setError("E-mail ou senha incorretos.");
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
                    setFormData({ ...formData, senha: "" });
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

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
            <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-[32px] shadow-xl border border-gray-100 space-y-8">

                <div className="text-center">
                    <Image
                        src="/imagens/Marca_aginhorizontal_fundoazul.png"
                        alt="Marca da UECE"
                        width={200}
                        height={80}
                        className="mx-auto mb-6 bg-gray-900 p-2 rounded-lg"
                    />
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {mode === "login" ? "Bem-vindo de volta" :
                            mode === "register" ? "Crie sua conta" :
                                mode === "forgot" ? "Recuperar Senha" :
                                    "Recuperar E-mail"}
                    </h2>
                    {(mode === "forgot" || mode === "forgot-email-step1") && (
                        <p className="text-sm text-gray-500 mt-2">Enviaremos um código de segurança.</p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex p-1 bg-gray-100 rounded-xl">
                        <button
                            onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                            className={`flex-1 py-2.5 text-[11px] uppercase tracking-wider font-bold rounded-lg transition-all ${mode === "login" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
                            className={`flex-1 py-2.5 text-[11px] uppercase tracking-wider font-bold rounded-lg transition-all ${mode === "register" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Cadastrar
                        </button>
                        <button
                            onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }}
                            className={`flex-1 py-2.5 text-[11px] uppercase tracking-wider font-bold rounded-lg transition-all ${mode === "forgot" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Esqueci a senha
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => { setMode("forgot-email-step1"); setError(""); setSuccess(""); }}
                            className="text-[10px] font-bold text-gray-400 hover:text-orange-600 transition-colors uppercase tracking-widest underline decoration-dotted underline-offset-4"
                        >
                            Perdi acesso ao meu e-mail
                        </button>
                    </div>
                </div>

                {/* 🔥 NOVO: ALERTA DE ERRO */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm animate-in fade-in">
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                        <p>{error}</p>
                    </div>
                )}

                {/* 🔥 NOVO: ALERTA DE SUCESSO */}
                {success && (
                    <div className="bg-green-50 text-green-600 p-4 rounded-xl flex items-start gap-3 text-sm animate-in fade-in">
                        <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                        <p>{success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 mt-8">

                    {mode !== "forgot-email-step2" && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {mode === "forgot-email-step1" ? "E-mail Antigo (Atual)" : "E-mail Institucional"}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email" name="email" required
                                        value={formData.email} onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                        placeholder="seu.nome@uece.br"
                                    />
                                </div>
                            </div>

                            {mode === "register" && formData.email.length > 0 && !formData.email.toLowerCase().endsWith("@uece.br") && (
                                <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1">
                                    <AlertCircle size={13} /> O e-mail deve terminar com @uece.br
                                </p>
                            )}

                            {mode === "register" && (
                                <div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Secundário (Recuperação)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <Mail size={20} />
                                            </div>
                                            <input
                                                type="email" name="emailSecundario"
                                                value={formData.emailSecundario}
                                                onChange={handleChange}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                placeholder="exemplo@uece.br"
                                            />
                                        </div>
                                    </div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 mt-5">Nome Completo</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <User size={20} />
                                        </div>
                                        <input
                                            type="text" name="nome" required={mode === "register"}
                                            value={formData.nome} onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                            placeholder="João da Silva"
                                        />
                                    </div>
                                </div>
                            )}

                            {(mode === "login" || mode === "register") && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            type="password" name="senha" required
                                            value={formData.senha} onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            )}

                            {mode === "register" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <Lock size={20} />
                                            </div>
                                            <input
                                                type="password" name="confirmarSenha"
                                                value={formData.confirmarSenha} onChange={handleChange}
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    {formData.senha.length > 0 && (
                                        <ul className="space-y-1.5 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                            {[
                                                { label: "Mínimo de 6 caracteres", ok: formData.senha.length >= 6 },
                                                { label: "Letras e números", ok: /[a-zA-Z]/.test(formData.senha) && /[0-9]/.test(formData.senha) },
                                                { label: "Senhas coincidem", ok: formData.senha === formData.confirmarSenha && formData.confirmarSenha.length > 0 },
                                            ].map((r) => (
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
                                </>
                            )}
                        </>
                    )}

                    {mode === "forgot-email-step2" && (
                        <>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Código de Segurança (PIN) *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="text" name="pin" required
                                        value={formData.pin} onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none text-gray-900 font-bold focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all tracking-[0.3em]"
                                        placeholder="000000" maxLength={6}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Novo E-mail Principal *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email" name="novoEmail" required
                                        value={formData.novoEmail} onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                        placeholder="novo@uece.br"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Novo E-mail Secundário</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email" name="novoEmailSecundario"
                                        value={formData.novoEmailSecundario} onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
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
                            className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-70 transition-all uppercase tracking-wider"
                        >
                            {isLoading ? <span className="animate-pulse">Processando...</span> : (
                                mode === "login" ? "Entrar na plataforma" :
                                    mode === "register" ? "Criar conta" :
                                        mode === "forgot-email-step2" ? "Confirmar Alteração" :
                                            "Enviar Código"
                            )}
                        </button>

                        {mode === "login" && (
                            <button
                                type="button"
                                onClick={handleGuestAccess}
                                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
                            >
                                <Eye size={18} /> Explorar como visitante
                            </button>
                        )}
                    </div>
                </form>

                <div className="text-center">
                    <Link href="/" className="text-sm font-medium text-gray-500 hover:text-orange-600 flex items-center justify-center gap-2">
                        <ArrowLeft size={16} /> Voltar para o portal
                    </Link>
                </div>
            </div>
        </main>
    );
}