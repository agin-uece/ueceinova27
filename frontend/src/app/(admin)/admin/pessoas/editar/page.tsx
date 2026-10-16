"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
    ArrowLeft, User, Save, Loader2, Info, GraduationCap, 
    Globe, Rocket, X, Search, Beaker, ShieldCheck, 
    Link as LinkIcon, BookOpen, Briefcase, Calendar, Hash, AlignLeft
} from "lucide-react";
import { useSecureAction } from "@/hooks/useSecureAction";

// Opções baseadas no Enum Papel do Backend
const PAPEL_OPCOES = ["ALUNO", "PESQUISADOR", "SERVIDOR", "PROFESSOR", "PERSONALIDADE", "EX_ALUNO"];

function EditarPessoaForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    
    const [isLoading, setIsLoading] = useState(true);
    
    // 🔐 Hook MFA – gerencia a requisição segura com possível PIN
    const { execute, isProcessing: isSaving } = useSecureAction();
    
    // Listas para Autocomplete (Populadas via endpoints)
    const [listaStartups, setStartups] = useState<{id: number, nome: string}[]>([]);
    const [listaProtecoes, setProtecoes] = useState<{id: number, nome: string}[]>([]);
    const [listaLabs, setLaboratorios] = useState<{id: number, nome: string}[]>([]);

    // Form Data Completo (Sincronizado com PessoaUpdateDTO)
    const [formData, setFormData] = useState({
        nome: "",
        telefone: "",
        areaPesquisa: "",
        titulacao: "",
        instituicao: "",
        papel: "ALUNO" as string,
        site: "",
        lattesURL: "",
        linkD: "",
        curso: "",
        descricao: "",
        anoFormacao: "",
        urlFoto: "",
        matricula: "",
        // IDs para o Backend
        startupIds: [] as number[],
        protecaoIds: [] as number[],
        laboratorioId: "" as string | number
    });

    // Estados para controle dos campos de busca
    const [buscaS, setBuscaS] = useState("");
    const [dropSAberto, setDropSAberto] = useState(false);
    const [buscaP, setBuscaP] = useState("");
    const [dropPAberto, setDropPAberto] = useState(false);
    const [buscaL, setBuscaL] = useState("");
    const [dropLAberto, setDropLAberto] = useState(false);

    useEffect(() => {
        if (!id) return;

        const carregarTudo = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const [resPessoa, resS, resP, resL] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/pessoas/${id}`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/protecoes`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/laboratorios`)
                ]);

                if (resS.ok) setStartups(await resS.json());
                if (resP.ok) setProtecoes(await resP.json());
                if (resL.ok) setLaboratorios(await resL.json());

                if (resPessoa.ok) {
                    const data = await resPessoa.json();
                    
                    setFormData({
                        nome: data.nome || "",
                        telefone: data.telefone || "",
                        areaPesquisa: data.areaPesquisa || "",
                        titulacao: data.titulacao || "",
                        instituicao: data.instituicao || "",
                        papel: data.papel || "ALUNO",
                        site: data.site || "",
                        lattesURL: data.lattesURL || "",
                        linkD: data.linkD || "",
                        curso: data.curso || "",
                        descricao: data.descricao || "",
                        anoFormacao: data.anoFormacao || "",
                        urlFoto: data.urlFoto || "",
                        matricula: data.matricula || "",
                        startupIds: data.startupIds || [],
                        protecaoIds: data.protecaoIds || [],
                        laboratorioId: data.laboratorioId || ""
                    });
                }
            } catch (e) {
                console.error("Erro ao carregar dados", e);
            } finally {
                setIsLoading(false);
            }
        };

        carregarTudo();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleToggleMulti = (key: 'startupIds' | 'protecaoIds', itemId: number) => {
        setFormData(prev => ({
            ...prev,
            [key]: prev[key].includes(itemId) ? prev[key].filter(i => i !== itemId) : [...prev[key], itemId]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Função fetch que será executada pelo hook (com possível PIN)
        const fetchEditar = async (pin?: string) => {
            const token = localStorage.getItem("userToken");
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            if (token) headers.append("Authorization", `Bearer ${token}`);
            if (pin) headers.append("X-MFA-PIN", pin);

            return fetch(`${process.env.NEXT_PUBLIC_API_URL}/pessoas/${id}`, {
                method: "PUT",
                headers: headers,
                body: JSON.stringify(formData)
            });
        };

        // 2. Callback em caso de sucesso
        const onSucesso = () => {
        };

        // 3. Executa via useSecureAction (gerencia MFA se necessário)
        const result = await execute(fetchEditar, onSucesso);

        // 4. Tratamento de erro (sucesso já disparou onSucesso)
        if (!result.success && result.error) {
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
    );

    const labAtual = listaLabs.find(l => l.id.toString() === formData.laboratorioId?.toString());

    return (
        <main className="min-h-screen bg-slate-50 pb-20 text-black">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold italic uppercase tracking-tighter">Editar Talento: {formData.nome}</h1>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* INFO PESSOAL */}
                    <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200 space-y-6">
                        <div className="flex items-center gap-2 border-b pb-4">
                            <Info size={18} className="text-indigo-500" />
                            <h2 className="font-black uppercase text-xs tracking-widest">Identificação</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nome Completo</label>
                                <input type="text" name="nome" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.nome} onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Telefone</label>
                                <input type="text" name="telefone" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" value={formData.telefone} onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Matrícula</label>
                                <input type="text" name="matricula" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" value={formData.matricula} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Biografia Profissional</label>
                            <textarea name="descricao" rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm resize-none" value={formData.descricao} onChange={handleChange} />
                        </div>
                    </section>

                    {/* ACADÊMICO */}
                    <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200 space-y-6">
                        <div className="flex items-center gap-2 border-b pb-4">
                            <GraduationCap size={18} className="text-indigo-500" />
                            <h2 className="font-black uppercase text-xs tracking-widest">Trajetória Acadêmica</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Papel</label>
                                <select name="papel" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none" value={formData.papel} onChange={handleChange}>
                                    {PAPEL_OPCOES.map(op => <option key={op} value={op}>{op}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Área de Pesquisa</label>
                                <input type="text" name="areaPesquisa" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" value={formData.areaPesquisa} onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Titulação</label>
                                <input type="text" name="titulacao" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" value={formData.titulacao} onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Instituição</label>
                                <input type="text" name="instituicao" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" value={formData.instituicao} onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Curso</label>
                                <input type="text" name="curso" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" value={formData.curso} onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Ano de Formação</label>
                                <input type="text" name="anoFormacao" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm" value={formData.anoFormacao} onChange={handleChange} />
                            </div>
                        </div>
                    </section>

                    {/* VÍNCULOS COM AUTOCOMPLETE */}
                    <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200 space-y-8">
                        <div className="flex items-center gap-2 border-b pb-4">
                            <Rocket size={18} className="text-indigo-500" />
                            <h2 className="font-black uppercase text-xs tracking-widest">Vínculos & Conexões</h2>
                        </div>
                        
                        {/* AUTOCOMPLETE LABORATÓRIO (SINGLE) */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1"><Beaker size={12}/> Laboratório Vinculado</label>
                            {labAtual ? (
                                <div className="flex items-center justify-between bg-blue-50 border border-blue-100 px-4 py-3 rounded-xl">
                                    <span className="text-sm font-bold text-blue-700">{labAtual.nome}</span>
                                    <button type="button" onClick={() => setFormData({...formData, laboratorioId: ""})} className="p-1 hover:bg-blue-200 rounded-full text-blue-600"><X size={16} /></button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="flex items-center bg-gray-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
                                        <Search size={16} className="text-slate-400 mr-2" />
                                        <input type="text" placeholder="Buscar laboratório..." className="w-full bg-transparent outline-none text-sm" value={buscaL} onChange={(e) => {setBuscaL(e.target.value); setDropLAberto(true);}} onFocus={() => setDropLAberto(true)} onBlur={() => setTimeout(() => setDropLAberto(false), 200)} />
                                    </div>
                                    {dropLAberto && (
                                        <div className="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                            {listaLabs.filter(l => l.nome.toLowerCase().includes(buscaL.toLowerCase())).map(l => (
                                                <div key={l.id} className="p-3 hover:bg-indigo-50 cursor-pointer text-sm" onClick={() => {setFormData({...formData, laboratorioId: l.id}); setBuscaL(""); setDropLAberto(false);}}>{l.nome}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* AUTOCOMPLETE STARTUPS (MULTI) */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1"><Rocket size={12}/> Startups</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.startupIds.map(id => (
                                    <span key={id} className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-[10px] font-black border border-red-100 flex items-center gap-2">
                                        {listaStartups.find(s => s.id === id)?.nome}
                                        <X size={14} className="cursor-pointer" onClick={() => handleToggleMulti('startupIds', id)} />
                                    </span>
                                ))}
                            </div>
                            <div className="relative">
                                <div className="flex items-center bg-gray-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
                                    <Search size={16} className="text-slate-400 mr-2" />
                                    <input type="text" placeholder="Adicionar startup..." className="w-full bg-transparent outline-none text-sm" value={buscaS} onChange={(e) => {setBuscaS(e.target.value); setDropSAberto(true);}} onFocus={() => setDropSAberto(true)} onBlur={() => setTimeout(() => setDropSAberto(false), 200)} />
                                </div>
                                {dropSAberto && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                        {listaStartups.filter(s => s.nome.toLowerCase().includes(buscaS.toLowerCase()) && !formData.startupIds.includes(s.id)).map(s => (
                                            <div key={s.id} className="p-3 hover:bg-red-50 cursor-pointer text-sm" onClick={() => {handleToggleMulti('startupIds', s.id); setBuscaS(""); setDropSAberto(false);}}>{s.nome}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* AUTOCOMPLETE PROTEÇÕES (MULTI) */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1"><ShieldCheck size={12}/> Proteções / PI</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.protecaoIds.map(id => (
                                    <span key={id} className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-[10px] font-black border border-purple-100 flex items-center gap-2">
                                        {listaProtecoes.find(p => p.id === id)?.nome}
                                        <X size={14} className="cursor-pointer" onClick={() => handleToggleMulti('protecaoIds', id)} />
                                    </span>
                                ))}
                            </div>
                            <div className="relative">
                                <div className="flex items-center bg-gray-50 border border-slate-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500">
                                    <Search size={16} className="text-slate-400 mr-2" />
                                    <input type="text" placeholder="Adicionar proteção..." className="w-full bg-transparent outline-none text-sm" value={buscaP} onChange={(e) => {setBuscaP(e.target.value); setDropPAberto(true);}} onFocus={() => setDropPAberto(true)} onBlur={() => setTimeout(() => setDropPAberto(false), 200)} />
                                </div>
                                {dropPAberto && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-xl max-h-40 overflow-y-auto">
                                        {listaProtecoes.filter(p => p.nome.toLowerCase().includes(buscaP.toLowerCase()) && !formData.protecaoIds.includes(p.id)).map(p => (
                                            <div key={p.id} className="p-3 hover:bg-purple-50 cursor-pointer text-sm" onClick={() => {handleToggleMulti('protecaoIds', p.id); setBuscaP(""); setDropPAberto(false);}}>{p.nome}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* SIDEBAR */}
                <div className="space-y-6">
                    <section className="bg-white p-6 rounded-[32px] shadow-sm border-2 border-gray-200 space-y-4">
                        <div className="flex items-center gap-2 border-b pb-3">
                            <Globe size={18} className="text-indigo-500" />
                            <h2 className="font-black uppercase text-[10px] tracking-widest">Mídia & Links</h2>
                        </div>
                        <div className="space-y-3">
                            <input type="text" name="urlFoto" placeholder="URL da Foto" className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50" value={formData.urlFoto} onChange={handleChange} />
                            <input type="text" name="lattesURL" placeholder="URL Lattes" className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50" value={formData.lattesURL} onChange={handleChange} />
                            <input type="text" name="site" placeholder="Site / Portfolio" className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50" value={formData.site} onChange={handleChange} />
                            <input type="text" name="linkD" placeholder="Link LinkedIn / Outro" className="w-full px-3 py-2 text-sm border rounded-lg bg-slate-50" value={formData.linkD} onChange={handleChange} />
                        </div>
                    </section>

                    <button type="submit" disabled={isSaving} className="w-full py-4 bg-indigo-900 hover:bg-indigo-600 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest">
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Salvar Alterações
                    </button>
                </div>
            </form>
        </main>
    );
}

export default function PaginaEditarPessoa() {
    return (
        <Suspense fallback={<Loader2 className="animate-spin" />}>
            <EditarPessoaForm />
        </Suspense>
    );
}