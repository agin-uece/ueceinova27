import { useState } from "react";
import { Filter, ChevronUp, ChevronDown, RotateCcw, Search, Rocket, ShieldCheck, Beaker, Calendar, X } from "lucide-react";
import { EntidadeBasica } from "@/types";

const PAPEL_OPCOES = ["ALUNO", "PESQUISADOR", "SERVIDOR", "PESSOA_EXTERNA", "PERSONALIDADE"];

interface PessoaFiltersProps {
    isVisible: boolean;
    onToggleVisibility: () => void;
    filtros: any;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSelectDropdown: (campo: string, valor: string) => void;
    onClear: () => void;
    onSubmit: (e: React.FormEvent) => void;
    startups: EntidadeBasica[];
    protecoes: EntidadeBasica[];
    laboratorios: EntidadeBasica[];
}

export function PessoaFilters({
    isVisible, onToggleVisibility, filtros, onInputChange, 
    onSelectDropdown, onClear, onSubmit, startups, protecoes, laboratorios
}: PessoaFiltersProps) {

    // Estados locais para os Autocompletes
    const [buscaStartup, setBuscaStartup] = useState("");
    const [dropStartup, setDropStartup] = useState(false);

    const [buscaProtecao, setBuscaProtecao] = useState("");
    const [dropProtecao, setDropProtecao] = useState(false);

    const [buscaLaboratorio, setBuscaLaboratorio] = useState("");
    const [dropLaboratorio, setDropLaboratorio] = useState(false);

    // Auxiliares Startup
    const startupSelecionada = startups.find(s => s.id.toString() === filtros.startupId);
    const startupsSugeridas = startups.filter(s => s.nome.toLowerCase().includes(buscaStartup.toLowerCase()) && s.id.toString() !== filtros.startupId);

    // Auxiliares Proteção
    const protecaoSelecionada = protecoes.find(p => p.id.toString() === filtros.protecaoId);
    const protecoesSugeridas = protecoes.filter(p => p.nome.toLowerCase().includes(buscaProtecao.toLowerCase()) && p.id.toString() !== filtros.protecaoId);

    // Auxiliares Laboratório
    const laboratorioSelecionado = laboratorios.find(l => l.id.toString() === filtros.laboratorioId);
    const laboratoriosSugeridos = laboratorios.filter(l => l.nome.toLowerCase().includes(buscaLaboratorio.toLowerCase()) && l.id.toString() !== filtros.laboratorioId);

    const handleClearInner = () => {
        setBuscaStartup("");
        setBuscaProtecao("");
        setBuscaLaboratorio("");
        onClear();
    };

    return (
        <>
            <button onClick={onToggleVisibility} className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all border ${isVisible ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-500"}`}>
                <Filter size={14} /> <span>{isVisible ? "Fechar Filtros" : "Filtrar Resultados"}</span>
                {isVisible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isVisible && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300 z-20 shadow-lg">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <form onSubmit={onSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Campos Simples */}
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome</label>
                                    <input type="text" name="nome" placeholder="Buscar por nome..." className="w-full px-4 py-3 rounded-xl bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500 border-none transition-all" value={filtros.nome} onChange={onInputChange} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Papel / Vínculo</label>
                                    <select name="papel" className="w-full px-4 py-3 rounded-xl bg-gray-50 text-sm outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500 border-none transition-all" value={filtros.papel} onChange={onInputChange}>
                                        <option value="">Todos os Papéis</option>
                                        {PAPEL_OPCOES.map(op => <option key={op} value={op}>{op.replace(/_/g, ' ')}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Área de Pesquisa</label>
                                    <input type="text" name="areaPesquisa" placeholder="Ex: Inteligência Artificial" className="w-full px-4 py-3 rounded-xl bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500 border-none" value={filtros.areaPesquisa} onChange={onInputChange} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Instituição</label>
                                    <input type="text" name="instituicao" placeholder="Ex: UECE" className="w-full px-4 py-3 rounded-xl bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500 border-none" value={filtros.instituicao} onChange={onInputChange} />
                                </div>

                                {/* Autocomplete: Startup */}
                                <div className="relative space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Rocket size={10}/> Startup</label>
                                    {startupSelecionada ? (
                                        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-4 py-3 rounded-xl">
                                            <span className="text-sm font-bold text-indigo-700 truncate">{startupSelecionada.nome}</span>
                                            <button type="button" onClick={() => onSelectDropdown("startupId", "")} className="p-1 hover:bg-indigo-100 rounded-full text-indigo-600 transition-colors shrink-0"><X size={16} /></button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                                                <Search size={16} className="text-gray-400 mr-2 shrink-0" />
                                                <input type="text" placeholder="Buscar startup..." className="w-full bg-transparent outline-none text-sm text-gray-700" value={buscaStartup} onChange={(e) => { setBuscaStartup(e.target.value); setDropStartup(true); }} onFocus={() => setDropStartup(true)} onBlur={() => setTimeout(() => setDropStartup(false), 200)} />
                                            </div>
                                            {dropStartup && (
                                                <div className="absolute z-50 w-full mt-2 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl">
                                                    {startupsSugeridas.length > 0 ? startupsSugeridas.map(s => (
                                                        <button key={s.id} type="button" onClick={() => { onSelectDropdown("startupId", s.id.toString()); setBuscaStartup(""); setDropStartup(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors border-b border-gray-50 last:border-0 truncate">{s.nome}</button>
                                                    )) : <div className="px-4 py-3 text-xs text-gray-400 italic">Nenhuma encontrada.</div>}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Autocomplete: Proteção */}
                                <div className="relative space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1"><ShieldCheck size={10}/> Proteção (PI)</label>
                                    {protecaoSelecionada ? (
                                        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-4 py-3 rounded-xl">
                                            <span className="text-sm font-bold text-indigo-700 truncate">{protecaoSelecionada.nome}</span>
                                            <button type="button" onClick={() => onSelectDropdown("protecaoId", "")} className="p-1 hover:bg-indigo-100 rounded-full text-indigo-600 transition-colors shrink-0"><X size={16} /></button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                                                <Search size={16} className="text-gray-400 mr-2 shrink-0" />
                                                <input type="text" placeholder="Buscar proteção..." className="w-full bg-transparent outline-none text-sm text-gray-700" value={buscaProtecao} onChange={(e) => { setBuscaProtecao(e.target.value); setDropProtecao(true); }} onFocus={() => setDropProtecao(true)} onBlur={() => setTimeout(() => setDropProtecao(false), 200)} />
                                            </div>
                                            {dropProtecao && (
                                                <div className="absolute z-50 w-full mt-2 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl">
                                                    {protecoesSugeridas.length > 0 ? protecoesSugeridas.map(p => (
                                                        <button key={p.id} type="button" onClick={() => { onSelectDropdown("protecaoId", p.id.toString()); setBuscaProtecao(""); setDropProtecao(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors border-b border-gray-50 last:border-0 truncate">{p.nome}</button>
                                                    )) : <div className="px-4 py-3 text-xs text-gray-400 italic">Nenhuma encontrada.</div>}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Autocomplete: Laboratório */}
                                <div className="relative space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Beaker size={10}/> Laboratório</label>
                                    {laboratorioSelecionado ? (
                                        <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-4 py-3 rounded-xl">
                                            <span className="text-sm font-bold text-indigo-700 truncate">{laboratorioSelecionado.nome}</span>
                                            <button type="button" onClick={() => onSelectDropdown("laboratorioId", "")} className="p-1 hover:bg-indigo-100 rounded-full text-indigo-600 transition-colors shrink-0"><X size={16} /></button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                                                <Search size={16} className="text-gray-400 mr-2 shrink-0" />
                                                <input type="text" placeholder="Buscar laboratório..." className="w-full bg-transparent outline-none text-sm text-gray-700" value={buscaLaboratorio} onChange={(e) => { setBuscaLaboratorio(e.target.value); setDropLaboratorio(true); }} onFocus={() => setDropLaboratorio(true)} onBlur={() => setTimeout(() => setDropLaboratorio(false), 200)} />
                                            </div>
                                            {dropLaboratorio && (
                                                <div className="absolute z-50 w-full mt-2 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl">
                                                    {laboratoriosSugeridos.length > 0 ? laboratoriosSugeridos.map(l => (
                                                        <button key={l.id} type="button" onClick={() => { onSelectDropdown("laboratorioId", l.id.toString()); setBuscaLaboratorio(""); setDropLaboratorio(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors border-b border-gray-50 last:border-0 truncate">{l.nome}</button>
                                                    )) : <div className="px-4 py-3 text-xs text-gray-400 italic">Nenhum encontrado.</div>}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Calendar size={10}/> Ano Formação</label>
                                    <input type="text" name="anoFormacao" placeholder="Ex: 2024" className="w-full px-4 py-3 rounded-xl bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500 border-none transition-all" value={filtros.anoFormacao} onChange={onInputChange} />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-50">
                                <button type="button" onClick={handleClearInner} className="text-[10px] font-black text-gray-300 uppercase hover:text-indigo-500 flex items-center gap-2 transition-colors">
                                    <RotateCcw size={14} /> Limpar Tudo
                                </button>
                                <button type="submit" className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2">
                                    <Search size={16} /> Aplicar Filtros
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}