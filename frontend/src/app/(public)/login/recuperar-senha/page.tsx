"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowLeft, AlertCircle, KeyRound, CheckCircle2 } from "lucide-react";

function RecuperarSenhaForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailParam = searchParams.get("email") || "";
    // CAPTURA O TOKEN DA URL (Se existir)
    const tokenParam = searchParams.get("token") || "";

    const [formData, setFormData] = useState({
        email: emailParam,
        token: tokenParam, // Já inicia preenchido com o valor da URL!
        novaSenha: "",
        confirmarSenha: "",
    });

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

        if (formData.novaSenha !== formData.confirmarSenha) {
            setError("As senhas não coincidem. Tente novamente.");
            return;
        }

        setIsLoading(true);

        try {
            // Envia para o backend. O backend só precisa de token e novaSenha pelo DTO.
            const payload = {
                token: formData.token,
                novaSenha: formData.novaSenha
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
                const errMsg = await res.text();
                setError(errMsg || "Código inválido ou expirado.");
            }
        } catch (err) {
            console.error(err);
            setError("Erro ao conectar com o servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">Senha Alterada!</h2>
                <p className="text-gray-500">Sua nova senha foi cadastrada com sucesso.</p>
                <p className="text-sm text-gray-400">Redirecionando para o login...</p>
            </div>
        );
    }

    return (
        <>
            <div className="text-center">
                <Image
                    src="/imagens/Marca_aginhorizontal_fundoazul.png"
                    alt="Marca da UECE"
                    width={200}
                    height={80}
                    className="mx-auto mb-6 bg-gray-900 p-2 rounded-lg"
                />
                <h2 className="text-3xl font-extrabold text-gray-900">Redefinir Senha</h2>
                <p className="text-sm text-gray-500 mt-2">Insira o código de validação enviado para o seu e-mail.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm animate-in fade-in mt-6">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 mt-8">
                {/* E-mail (Apenas Leitura / Informativo) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Mail size={20} />
                        </div>
                        <input
                            type="email"
                            name="email"
                            disabled
                            value={formData.email}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                        />
                    </div>
                </div>

                {/* Código Token */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código de Segurança</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <KeyRound size={20} />
                        </div>
                        <input
                            type="text"
                            name="token"
                            required
                            value={formData.token}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all font-mono tracking-widest"
                            placeholder="EX: 123456"
                        />
                    </div>
                </div>

                {/* Nova Senha */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Lock size={20} />
                        </div>
                        <input
                            type="password"
                            name="novaSenha"
                            required
                            value={formData.novaSenha}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {/* Repetir Nova Senha */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Lock size={20} />
                        </div>
                        <input
                            type="password"
                            name="confirmarSenha"
                            required
                            value={formData.confirmarSenha}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-70 transition-all uppercase tracking-wider"
                    >
                        {isLoading ? <span className="animate-pulse">Salvando...</span> : "Redefinir Senha"}
                    </button>
                </div>
            </form>

            <div className="text-center mt-8">
                <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-orange-600 flex items-center justify-center gap-2">
                    <ArrowLeft size={16} /> Voltar para o Login
                </Link>
            </div>
        </>
    );
}

export default function RecuperarSenhaPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
            <div className="w-full max-w-md bg-white p-8 sm:p-12 rounded-[32px] shadow-xl border border-gray-100">
                <Suspense fallback={<div className="text-center py-10 text-gray-500">Carregando...</div>}>
                    <RecuperarSenhaForm />
                </Suspense>
            </div>
        </main>
    );
}