"use client";

import { useState, useEffect } from "react";
import { 
    Info, Briefcase, Users, MessageSquare, 
    Mail, Phone, Save, Loader2, Search, X 
} from "lucide-react";
import { FormGroup } from "@/components/ui/FormGroup";

interface ServicoFormProps {
    initialData?: any;
    onSubmit: (payload: any) => void;
    isLoading: boolean;
}

export function ServicoForm({ initialData, onSubmit, isLoading }: ServicoFormProps) {
    const [pessoas, setPessoas] = useState<{ id: number, nome: string }[]>([]);
    const [buscaPessoa, setBuscaPessoa] = useState("");
    const [dropdownAberto, setDropdownAberto] = useState(false);
    
    const [formData, setFormData] = useState({
        prestadoresIds: initialData?.prestadoresIds || [] as number[],
        areaAtuacao: initialData?.areaAtuacao || "",
        descricao: initialData?.descricao || "",
        contato: initialData?.contato || "",
        email: initialData?.email || "",
        telefone: initialData?.telefone || ""
    });

    useEffect(() => {
        const buscarPessoas = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pessoas`);
                if (res.ok) setPessoas(await res.json());
            } catch (error) { console.error(error); }
        };
        buscarPessoas();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePrestadorToggle = (id: number) => {
        setFormData(prev => {
            const ids = prev.prestadoresIds.includes(id)
                ? prev.prestadoresIds.filter((pid: number) => pid !== id)
                : [...prev.prestadoresIds, id];
            return { ...prev, prestadoresIds: ids };
        });
    };

    const pessoasDisponiveis = pessoas.filter((p: any) => 
        !formData.prestadoresIds.includes(p.id) && 
        p.nome.toLowerCase().includes(buscaPessoa.toLowerCase())
    );

    const pessoasSelecionadas = pessoas.filter((p: any) => formData.prestadoresIds.includes(p.id));

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 space-y-6">
                    <div className="flex items-center gap-2 border-b pb-4">
                        <Info size={18} className="text-teal-500" />
                        <h2 className="font-black uppercase text-xs tracking-widest text-slate-800">Detalhes da Oferta</h2>
                    </div>

                    <div className="space-y-4">
                        <FormGroup label="Área de Atuação *">
                            <input type="text" name="areaAtuacao" required value={formData.areaAtuacao} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-teal-500 outline-none text-sm transition-all" placeholder="Ex: Consultoria em TI" />
                        </FormGroup>
                        
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-1"><Users size={12}/> Prestadores Responsáveis *</label>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                                {pessoasSelecionadas.map((p: any) => (
                                    <div key={p.id} className="flex items-center gap-1.5 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-teal-100 animate-in zoom-in-95">
                                        {p.nome}
                                        <button type="button" onClick={() => handlePrestadorToggle(p.id)} className="p-0.5 rounded-full hover:bg-teal-200 transition-colors"><X size={14} /></button>
                                    </div>
                                ))}
                            </div>

                            <div className="relative">
                                <div className="flex items-center border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-teal-500 transition-all">
                                    <Search size={16} className="text-slate-400 mr-2" />
                                    <input type="text" placeholder="Buscar e adicionar prestador..." className="w-full bg-transparent outline-none text-sm" value={buscaPessoa} onChange={(e) => { setBuscaPessoa(e.target.value); setDropdownAberto(true); }} onFocus={() => setDropdownAberto(true)} onBlur={() => setTimeout(() => setDropdownAberto(false), 200)} />
                                </div>
                                {dropdownAberto && (
                                    <div className="absolute z-10 w-full mt-2 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl">
                                        {pessoasDisponiveis.length > 0 ? (
                                            pessoasDisponiveis.map((p: any) => (
                                                <button key={p.id} type="button" onClick={() => { handlePrestadorToggle(p.id); setBuscaPessoa(""); }} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors border-b last:border-0">{p.nome}</button>
                                            ))
                                        ) : (
                                            <div className="p-4 text-sm text-slate-400 text-center italic">Nenhum resultado encontrado.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <FormGroup label="Descrição Completa">
                            <textarea name="descricao" rows={6} value={formData.descricao} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-teal-500 outline-none resize-none text-sm transition-all" />
                        </FormGroup>
                    </div>
                </section>
            </div>

            <div className="space-y-6">
                <section className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 border-b pb-3">
                        <MessageSquare size={18} className="text-teal-500" />
                        <h2 className="font-black uppercase text-[10px] tracking-widest text-slate-800">Contatos da Oferta</h2>
                    </div>
                    <div className="space-y-3">
                        <FormGroup label="Pessoa de Contato">
                            <input type="text" name="contato" value={formData.contato} onChange={handleChange} className="w-full px-3 py-2 text-sm border-b border-slate-100 bg-transparent outline-none" />
                        </FormGroup>
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <Mail size={16} className="text-slate-400" /><input type="email" name="email" value={formData.email} onChange={handleChange} className="bg-transparent outline-none text-xs w-full" />
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <Phone size={16} className="text-slate-400" /><input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="bg-transparent outline-none text-xs w-full" />
                        </div>
                    </div>
                </section>

                <button type="submit" disabled={isLoading} className="w-full py-5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-[24px] shadow-xl shadow-teal-100 transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2 disabled:opacity-50">
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
                    {initialData ? "Salvar Alterações" : "Salvar Serviço"}
                </button>
            </div>
        </form>
    );
}