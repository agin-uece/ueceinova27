"use client";

import { useState } from "react";
import {
    Rocket, Save, Info, Globe, Mail, Phone, AtSign,
    Image as ImageIcon, Check, Layers, Loader2
} from "lucide-react";
import { FormGroup } from "@/components/ui/FormGroup";

const STATUS_OPCOES = ["INCUBADA", "ASSOCIADA", "PRE_INCUBADA"];

interface StartupFormProps {
    initialData?: any;
    onSubmit: (payload: any) => void;
    isLoading: boolean;
}

export function StartupForm({ initialData, onSubmit, isLoading }: StartupFormProps) {
    const [formData, setFormData] = useState({
        nome: initialData?.nome || "",
        descricao: initialData?.descricao || "",
        area: initialData?.area || "",
        dataFundacao: initialData?.dataFundacao || "",
        site: initialData?.site || "",
        email: initialData?.email || "",
        telefone: initialData?.telefone || "",
        logo: initialData?.logo || "",
        status: initialData?.status || "INCUBADA",
        fotosInput: initialData?.fotos ? initialData.fotos.join(", ") : "",
        cnpj: initialData?.cnpj || "",
        instagram: initialData?.instagram || "",
        pessoasIds: [] as number[]

    });



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Converte a string de fotos em Array
        const fotosArray = formData.fotosInput
            .split(",")
            .map((f: string) => f.trim())
            .filter((f: string) => f !== "");

        const payload = {
            ...formData,
            fotos: fotosArray,
            dataFundacao: formData.dataFundacao || null,
        };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

                {/* IDENTIDADE DO NEGÓCIO */}
                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                        <Info size={18} className="text-red-500" />
                        <h2 className="font-black uppercase text-xs tracking-widest text-slate-800">Identidade do Negócio</h2>
                    </div>

                    <div className="space-y-4">
                        <FormGroup label="Nome da Startup/Empresa *">
                            <input
                                type="text" name="nome" required value={formData.nome} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-medium"
                                placeholder="Ex: InovaTech Solutions"
                            />
                        </FormGroup>

                        <FormGroup label="CNPJ *">
                            <input
                                type="text" name="cnpj" required value={formData.cnpj} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all text-sm font-medium"
                                placeholder="CNPJ da Startup/Empresa..."
                            />
                        </FormGroup>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormGroup label="Área de Atuação">
                                <input type="text" name="area" value={formData.area} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none text-sm" placeholder="Ex: EdTech, Fintech..." />
                            </FormGroup>
                            <FormGroup label="Data de Fundação">
                                <input type="date" name="dataFundacao" value={formData.dataFundacao} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none text-sm" />
                            </FormGroup>
                        </div>

                        <FormGroup label="Descrição / Pitch">
                            <textarea
                                name="descricao" rows={4} value={formData.descricao} onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none text-sm"
                                placeholder="Breve descrição do modelo de negócio..."
                            />
                        </FormGroup>
                    </div>
                </section>

                {/* VÍNCULO */}
                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                        <Layers size={18} className="text-red-500" />
                        <h2 className="font-black uppercase text-xs tracking-widest text-slate-800">Vínculo com o Ecossistema</h2>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Status de Incubação</label>
                        <div className="flex flex-wrap gap-3">
                            {STATUS_OPCOES.map((st) => (
                                <button
                                    key={st} type="button" onClick={() => setFormData(p => ({ ...p, status: st }))}
                                    className={`px-6 py-2.5 rounded-full text-[10px] font-black transition-all border flex items-center gap-2 uppercase tracking-tighter ${formData.status === st ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-100" : "bg-white border-slate-200 text-slate-400 hover:border-red-400"}`}
                                >
                                    {formData.status === st && <Check size={14} />} {st}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                
            </div>

            {/* COLUNA LATERAL */}
            <div className="space-y-6">
                <section className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                        <ImageIcon size={18} className="text-red-500" />
                        <h2 className="font-black uppercase text-[10px] tracking-widest text-slate-800">Mídia Visual</h2>
                    </div>
                    <div className="space-y-4">
                        <FormGroup label="URL do Logo">
                            <input type="text" name="logo" value={formData.logo} onChange={handleChange} className="w-full px-4 py-2.5 text-xs border-b border-slate-100 outline-none bg-transparent" placeholder="https://..." />
                        </FormGroup>
                        <FormGroup label="Outras Fotos (URLs separadas por vírgula)">
                            <textarea name="fotosInput" rows={3} value={formData.fotosInput} onChange={handleChange} className="w-full px-3 py-2 text-xs border border-slate-100 rounded-xl bg-slate-50 outline-none resize-none" placeholder="url1, url2..." />
                        </FormGroup>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Globe size={18} className="text-red-500" />
                        <h2 className="font-black uppercase text-[10px] tracking-widest text-slate-800">Canais Digitais</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <Mail size={16} className="text-slate-400" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="bg-transparent outline-none text-xs w-full font-medium" placeholder="E-mail comercial" />
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <Phone size={16} className="text-slate-400" />
                            <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="bg-transparent outline-none text-xs w-full font-medium" placeholder="Telefone" />
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <AtSign size={16} className="text-slate-400" />
                            <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className="bg-transparent outline-none text-xs w-full font-medium" placeholder="instagram" />
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <Globe size={16} className="text-slate-400" />
                            <input type="url" name="site" value={formData.site} onChange={handleChange} className="bg-transparent outline-none text-xs w-full font-medium" placeholder="Website" />
                        </div>
                    </div>
                </section>

                <button
                    type="submit" disabled={isLoading}
                    className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black rounded-[24px] shadow-xl shadow-red-100 transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {initialData ? "Salvar Alterações" : "Salvar Startup"}
                </button>
            </div>
        </form>
    );
}