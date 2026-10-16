"use client";

import { useState, useEffect } from "react";
import { 
    User, Mail, Phone, Building2, Globe, GraduationCap, 
    Info, Rocket, ShieldCheck, Beaker, X, Search, 
    BookOpen, Link as LinkIcon, Save, Loader2, Check
} from "lucide-react";
import { FormGroup } from "@/components/ui/FormGroup";

const PAPEL_OPCOES = ["ALUNO", "PESQUISADOR", "SERVIDOR", "PROFESSOR", "PERSONALIDADE", "EX_ALUNO"];

interface PessoaFormProps {
    initialData?: any;
    onSubmit: (payload: any) => void;
    isLoading: boolean;
}

export function PessoaForm({ initialData, onSubmit, isLoading }: PessoaFormProps) {
    // Listas para Autocomplete
    const [listaStartups, setStartups] = useState<{id: number, nome: string}[]>([]);
    const [listaProtecoes, setProtecoes] = useState<{id: number, nome: string}[]>([]);
    const [listaLabs, setLaboratorios] = useState<{id: number, nome: string}[]>([]);

    // Form Data
    const [formData, setFormData] = useState({
        nome: initialData?.nome || "",
        email: initialData?.email || "",
        telefone: initialData?.telefone || "",
        areaPesquisa: initialData?.areaPesquisa || "",
        titulacao: initialData?.titulacao || "",
        instituicao: initialData?.instituicao || "",
        papel: initialData?.papel || "ALUNO",
        site: initialData?.site || "",
        lattesURL: initialData?.lattesURL || "",
        linkD: initialData?.linkD || "",
        curso: initialData?.curso || "",
        descricao: initialData?.descricao || "",
        anoFormacao: initialData?.anoFormacao || "",
        urlFoto: initialData?.urlFoto || "",
        matricula: initialData?.matricula || "",
        startupIds: initialData?.startupIds || [] as number[],
        protecaoIds: initialData?.protecaoIds || [] as number[],
        laboratorioId: initialData?.laboratorioId || "" as string | number
    });

    // Estados de busca
    const [buscaS, setBuscaS] = useState("");
    const [dropSAberto, setDropSAberto] = useState(false);
    const [buscaP, setBuscaP] = useState("");
    const [dropPAberto, setDropPAberto] = useState(false);
    const [buscaL, setBuscaL] = useState("");
    const [dropLAberto, setDropLAberto] = useState(false);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [resS, resP, resL] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/protecoes`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/laboratorios`)
                ]);
                if (resS.ok) setStartups(await resS.json());
                if (resP.ok) setProtecoes(await resP.json());
                if (resL.ok) setLaboratorios(await resL.json());
            } catch (e) { console.error("Erro ao carregar auxiliares", e); }
        };
        carregarDados();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleToggleMulti = (key: 'startupIds' | 'protecaoIds', id: number) => {
        setFormData(prev => ({
            ...prev,
            [key]: prev[key].includes(id) ? prev[key].filter((i: number) => i !== id) : [...prev[key], id]
        }));
    };



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            // Garante que o ID vá como número, ou null se ninguém for selecionado
            laboratorioId: formData.laboratorioId !== "" ? Number(formData.laboratorioId) : null
        };

        onSubmit(payload);
    };

    const labSelecionado = listaLabs.find((l: any) => l.id.toString() === formData.laboratorioId.toString());

    
        // ...
    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                
                {/* SEÇÃO 1: PESSOAL */}
                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-200 space-y-6">
                    <div className="flex items-center gap-2 border-b pb-4">
                        <Info size={18} className="text-indigo-500" />
                        <h2 className="font-black uppercase text-xs tracking-widest text-gray-700">Informações Pessoais</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormGroup label="Nome Completo *">
                            <input type="text" name="nome" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.nome} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup label="Email Corporativo *">
                            <input type="email" name="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.email} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup label="Telefone / WhatsApp">
                            <input type="text" name="telefone" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" value={formData.telefone} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup label="Matrícula">
                            <input type="text" name="matricula" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" value={formData.matricula} onChange={handleChange} />
                        </FormGroup>
                    </div>
                    <FormGroup label="Biografia Profissional">
                        <textarea name="descricao" rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" value={formData.descricao} onChange={handleChange} />
                    </FormGroup>
                </section>

                {/* SEÇÃO 2: ACADÊMICO */}
                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-200 space-y-6">
                    <div className="flex items-center gap-2 border-b pb-4">
                        <GraduationCap size={18} className="text-indigo-500" />
                        <h2 className="font-black uppercase text-xs tracking-widest text-gray-700">Acadêmico & Pesquisa</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormGroup label="Papel na Instituição">
                            <select name="papel" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none cursor-pointer" value={formData.papel} onChange={handleChange}>
                                {PAPEL_OPCOES.map(op => <option key={op} value={op}>{op}</option>)}
                            </select>
                        </FormGroup>
                        <FormGroup label="Área de Pesquisa Principal">
                            <input type="text" name="areaPesquisa" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" value={formData.areaPesquisa} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup label="Titulação Máxima">
                            <input type="text" name="titulacao" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" value={formData.titulacao} onChange={handleChange} />
                        </FormGroup>
                        <FormGroup label="Instituição de Origem">
                            <input type="text" name="instituicao" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" value={formData.instituicao} onChange={handleChange} />
                        </FormGroup>
                    </div>
                </section>

                {/* SEÇÃO 3: RELACIONAMENTOS */}
                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-200 space-y-8">
                    <div className="flex items-center gap-2 border-b pb-4">
                        <Rocket size={18} className="text-indigo-500" />
                        <h2 className="font-black uppercase text-xs tracking-widest text-gray-700">Conexões no Ecossistema</h2>
                    </div>
                    
                    {/* AUTOCOMPLETE LABORATÓRIO */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Beaker size={12}/> Laboratório Vinculado</label>
                        {labSelecionado ? (
                            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 px-4 py-3 rounded-xl">
                                <span className="text-sm font-bold text-blue-700">{labSelecionado.nome}</span>
                                <button type="button" onClick={() => setFormData({...formData, laboratorioId: ""})} className="p-1 hover:bg-blue-200 rounded-full text-blue-600"><X size={16} /></button>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="flex items-center bg-gray-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
                                    <Search size={16} className="text-slate-400 mr-2" />
                                    <input type="text" placeholder="Buscar laboratório..." className="w-full bg-transparent outline-none text-sm" value={buscaL} onChange={(e) => {setBuscaL(e.target.value); setDropLAberto(true);}} onFocus={() => setDropLAberto(true)} onBlur={() => setTimeout(() => setDropLAberto(false), 200)} />
                                </div>
                                {dropLAberto && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                        {listaLabs.filter((l: any) => l.nome.toLowerCase().includes(buscaL.toLowerCase())).map((l: any) => (
                                            <div key={l.id} className="p-3 hover:bg-indigo-50 cursor-pointer text-sm border-b last:border-0" onClick={() => {setFormData({...formData, laboratorioId: l.id}); setBuscaL(""); setDropLAberto(false);}}>{l.nome}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* AUTOCOMPLETE STARTUPS */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Rocket size={12}/> Startups (Sócio/Membro)</label>
                        <div className="flex flex-wrap gap-2">
                            {formData.startupIds.map((id: number) => (
                                <span key={id} className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-[10px] font-black border border-red-100 flex items-center gap-2">
                                    {listaStartups.find((s: any) => s.id === id)?.nome}
                                    <X size={14} className="cursor-pointer" onClick={() => handleToggleMulti('startupIds', id)} />
                                </span>
                            ))}
                        </div>
                        <div className="relative">
                            <div className="flex items-center bg-gray-50 border border-slate-200 rounded-xl px-4 py-3">
                                <Search size={16} className="text-slate-400 mr-2" />
                                <input type="text" placeholder="Adicionar startup..." className="w-full bg-transparent outline-none text-sm" value={buscaS} onChange={(e) => {setBuscaS(e.target.value); setDropSAberto(true);}} onFocus={() => setDropSAberto(true)} onBlur={() => setTimeout(() => setDropSAberto(false), 200)} />
                            </div>
                            {dropSAberto && (
                                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                    {listaStartups.filter((s: any) => s.nome.toLowerCase().includes(buscaS.toLowerCase()) && !formData.startupIds.includes(s.id)).map((s: any) => (
                                        <div key={s.id} className="p-3 hover:bg-red-50 cursor-pointer text-sm border-b last:border-0" onClick={() => {handleToggleMulti('startupIds', s.id); setBuscaS(""); setDropSAberto(false);}}>{s.nome}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AUTOCOMPLETE PROTEÇÕES */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><ShieldCheck size={12}/> Proteções / Patentes</label>
                        <div className="flex flex-wrap gap-2">
                            {formData.protecaoIds.map((id: number) => (
                                <span key={id} className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-[10px] font-black border border-purple-100 flex items-center gap-2">
                                    {listaProtecoes.find((p: any) => p.id === id)?.nome}
                                    <X size={14} className="cursor-pointer" onClick={() => handleToggleMulti('protecaoIds', id)} />
                                </span>
                            ))}
                        </div>
                        <div className="relative">
                            <div className="flex items-center bg-gray-50 border border-slate-200 rounded-xl px-4 py-3">
                                <Search size={16} className="text-slate-400 mr-2" />
                                <input type="text" placeholder="Adicionar proteção..." className="w-full bg-transparent outline-none text-sm" value={buscaP} onChange={(e) => {setBuscaP(e.target.value); setDropPAberto(true);}} onFocus={() => setDropPAberto(true)} onBlur={() => setTimeout(() => setDropPAberto(false), 200)} />
                            </div>
                            {dropPAberto && (
                                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                    {listaProtecoes.filter((p: any) => p.nome.toLowerCase().includes(buscaP.toLowerCase()) && !formData.protecaoIds.includes(p.id)).map((p: any) => (
                                        <div key={p.id} className="p-3 hover:bg-purple-50 cursor-pointer text-sm border-b last:border-0" onClick={() => {handleToggleMulti('protecaoIds', p.id); setBuscaP(""); setDropPAberto(false);}}>{p.nome}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* SIDEBAR */}
            <div className="space-y-6">
                <section className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-200 space-y-4">
                    <div className="flex items-center gap-2 border-b pb-3"><Globe size={18} className="text-indigo-500" /><h2 className="font-black uppercase text-[10px] tracking-widest text-gray-700">Links & Mídia</h2></div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <User size={16} className="text-slate-400" /><input type="text" name="urlFoto" placeholder="URL da Foto" className="bg-transparent outline-none text-xs w-full" value={formData.urlFoto} onChange={handleChange} />
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <BookOpen size={16} className="text-slate-400" /><input type="text" name="lattesURL" placeholder="Currículo Lattes" className="bg-transparent outline-none text-xs w-full" value={formData.lattesURL} onChange={handleChange} />
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <LinkIcon size={16} className="text-slate-400" /><input type="text" name="site" placeholder="Website / Portfolio" className="bg-transparent outline-none text-xs w-full" value={formData.site} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                <button type="submit" disabled={isLoading} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[24px] shadow-xl shadow-indigo-100 transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2 disabled:opacity-50">
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {initialData ? "Atualizar Talento" : "Finalizar Cadastro"}
                </button>
            </div>
        </form>
    );
}