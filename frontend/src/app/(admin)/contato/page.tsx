"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft, MapPin, Mail, Phone, Globe,
    AtSign, Clock, Send, Headset, CheckCircle2,
    MessageSquare, Loader2
} from "lucide-react";

export default function ContatoPage() {
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        assunto: "",
        mensagem: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [erro, setErro] = useState(""); // Novo estado para exibir erros reais do backend

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErro(""); // Limpa erros anteriores

        try {
            // Chamada real para o seu endpoint Spring Boot
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contato`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Sucesso!
                setSucesso(true);
                setFormData({ nome: "", email: "", assunto: "", mensagem: "" });

                // Esconde a mensagem de sucesso após 5 segundos
                setTimeout(() => setSucesso(false), 5000);
            } else {
                // Se o backend retornar 400 ou 500, tentamos ler a mensagem de erro
                let errorMessage = "Ocorreu um erro ao enviar a mensagem. Verifique os campos e tente novamente.";
                try {
                    const errorData = await response.json();
                    if (errorData.erro) errorMessage = errorData.erro;
                } catch (e) {
                    // Ignora se não vier um JSON de erro válido
                }
                setErro(errorMessage);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            setErro("Não foi possível conectar ao servidor. Verifique sua conexão de internet.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC] flex flex-col pb-20">

            {/* CABEÇALHO */}
            <header className="bg-white border-b border-gray-300 relative z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/gestao" className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <Headset size={24} />
                            </div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight italic uppercase hidden sm:block">
                                Contato e Suporte
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* CONTEÚDO PRINCIPAL */}
            <div className="max-w-7xl mx-auto px-6 py-12 w-full flex-1">

                {/* TEXTO INICIAL CENTRALIZADO COM DIVISOR */}
                <div className="mb-12 text-center flex flex-col items-center">
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
                        Fale com a AGIN
                    </h2>
                    <p className="text-gray-500 text-lg max-w-2xl">
                        Tem alguma dúvida sobre o ecossistema Inova27, quer propor uma parceria ou precisa de suporte? Estamos à disposição.
                    </p>
                    {/* Divisor */}
                    <div className="h-px w-full max-w-4xl bg-gray-200 mt-10" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* COLUNA ESQUERDA: INFORMAÇÕES DE CONTATO */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Cartão de Contato Direto */}
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">E-mail Oficial</p>
                                    <a href="mailto:agin@uece.br" className="text-gray-900 font-bold hover:text-blue-600 transition-colors text-lg">
                                        agin@uece.br
                                    </a>
                                </div>
                            </div>

                            <div className="h-px w-full bg-gray-50" />

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-2xl shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Telefone</p>
                                    <a href="tel:+558531019978" className="text-gray-900 font-bold hover:text-green-600 transition-colors text-lg">
                                        (85) 3101.9978
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Cartão de Endereço */}
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow">
                            <div className="p-3 bg-red-50 text-red-600 rounded-2xl shrink-0 h-fit">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Onde estamos</p>
                                <p className="text-gray-900 font-bold leading-relaxed">
                                    Av. Dr. Silas Munguba, 1700<br />
                                    Campus do Itaperi<br />
                                    Fortaleza, CE<br />
                                    <span className="text-gray-500 font-medium text-sm mt-1 block">CEP: 60.714.903</span>
                                </p>
                            </div>
                        </div>

                        {/* Cartão de Redes e Horários */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-4">
                                <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl w-fit">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Atendimento</p>
                                    <p className="text-gray-900 font-bold text-sm">Segunda a Sexta<br />08h às 17h</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col gap-3 justify-center">
                                <a
                                    href="https://www.instagram.com/agin.uece/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-colors font-bold text-sm"
                                >
                                    <AtSign size={20} /> Instagram
                                </a>
                                <a
                                    href="https://www.uece.br/agin/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors font-bold text-sm"
                                >
                                    <Globe size={20} /> Site Oficial
                                </a>
                            </div>
                        </div>

                    </div>

                    {/* COLUNA DIREITA: FORMULÁRIO */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden h-full">

                            {/* Efeito visual de fundo */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <MessageSquare className="text-indigo-500" size={24} />
                                    <h3 className="text-2xl font-black text-gray-900">Envie uma Mensagem</h3>
                                </div>

                                {erro && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                                        {erro}
                                    </div>
                                )}

                                {sucesso ? (
                                    <div className="bg-green-50 border border-green-200 rounded-3xl p-10 flex flex-col items-center text-center animate-in zoom-in duration-300">
                                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                            <CheckCircle2 size={40} />
                                        </div>
                                        <h4 className="text-xl font-black text-gray-900 mb-2">Mensagem Enviada!</h4>
                                        <p className="text-gray-600">Agradecemos o seu contato. Nossa equipe retornará o mais breve possível.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Seu Nome</label>
                                                <input
                                                    required type="text" name="nome" value={formData.nome} onChange={handleInputChange}
                                                    className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                                    placeholder="Como devemos te chamar?"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Seu E-mail</label>
                                                <input
                                                    required type="email" name="email" value={formData.email} onChange={handleInputChange}
                                                    className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                                    placeholder="exemplo@email.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Assunto</label>
                                            <input
                                                required type="text" name="assunto" value={formData.assunto} onChange={handleInputChange}
                                                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                                placeholder="Qual o motivo do contato?"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Mensagem</label>
                                            <textarea
                                                required name="mensagem" rows={5} value={formData.mensagem} onChange={handleInputChange}
                                                className="w-full px-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
                                                placeholder="Escreva sua mensagem aqui..."
                                            />
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 text-xs uppercase tracking-widest hover:bg-indigo-700 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 transition-all flex items-center gap-2"
                                            >
                                                {isSubmitting ? (
                                                    <><Loader2 size={16} className="animate-spin" /> Enviando...</>
                                                ) : (
                                                    <><Send size={16} /> Enviar Mensagem</>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </main>
    );
}