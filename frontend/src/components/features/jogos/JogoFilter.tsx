import { Filter, ChevronUp, ChevronDown, RotateCcw, Search, X, Loader2 } from "lucide-react";
import { Engine, Linguagem } from "@/types";

interface JogoFiltersProps {
    isVisible: boolean;
    onToggleVisibility: () => void;
    filtros: any;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onToggleLinguagem: (id: string) => void;
    onClearSingle: (key: string) => void;
    onClearAll: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    engines: Engine[];
    linguagens: Linguagem[];
    generos: string[];
    plataformas: string[];
    tiposJogo: string[];
    estagios: string[];
    faixasEtarias: string[];
}

export function JogoFilters({
    isVisible, onToggleVisibility, filtros, onInputChange, onToggleLinguagem,
    onClearSingle, onClearAll, onSubmit, isLoading, engines, linguagens,
    generos, plataformas, tiposJogo, estagios, faixasEtarias
}: JogoFiltersProps) {
    return (
        <>
            <button onClick={onToggleVisibility} className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all border ${isVisible ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-100" : "bg-white border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500"}`}>
                <Filter size={14} /> <span className="hidden sm:inline">{isVisible ? "Fechar Filtros" : "Filtrar por..."}</span>
                {isVisible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isVisible && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300 overflow-hidden z-20 shadow-lg">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <form onSubmit={onSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="group">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Título do Jogo</label>
                                    <div className="relative">
                                        <input type="text" name="nome" value={filtros.nome} onChange={onInputChange} className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="Ex: Zelda..." />
                                        {filtros.nome && <button type="button" onClick={() => onClearSingle('nome')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"><X size={16} /></button>}
                                    </div>
                                </div>

                                {[
                                    { label: "Gênero", name: "genero", options: generos },
                                    { label: "Engine", name: "engineId", options: engines, isEntity: true },
                                    { label: "Tipo de jogo", name: "tipoJogo", options: tiposJogo },
                                    { label: "Estágio", name: "estagioDesenvolvimento", options: estagios },
                                    { label: "Plataforma", name: "plataforma", options: plataformas },
                                    { label: "Faixa Etária", name: "faixaEtaria", options: faixasEtarias },
                                ].map((f) => (
                                    <div key={f.name}>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{f.label}</label>
                                            {filtros[f.name] && <button type="button" onClick={() => onClearSingle(f.name)} className="text-[9px] font-bold text-orange-400 hover:text-orange-600 uppercase">Remover</button>}
                                        </div>
                                        <select name={f.name} value={filtros[f.name]} onChange={onInputChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm outline-none cursor-pointer appearance-none">
                                            <option value="">Não filtrar</option>
                                            {f.options.map((op: any) => (
                                                <option key={f.isEntity ? op.id : op} value={f.isEntity ? op.id : op}>{f.isEntity ? op.nome : op.replace(/_/g, " ")}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Lançado após</label>
                                    <input type="date" name="dataLancamento" value={filtros.dataLancamento} onChange={onInputChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm outline-none" />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-50">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Linguagens Disponíveis</label>
                                <div className="flex flex-wrap gap-2">
                                    {linguagens.map((ling) => (
                                        <button key={ling.id} type="button" onClick={() => onToggleLinguagem(ling.id.toString())} className={`px-4 py-2 rounded-xl text-[10px] font-black border transition-all ${filtros.linguagemId === ling.id.toString() ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-100" : "bg-gray-50 border-gray-100 text-gray-400 hover:border-orange-200"}`}>
                                            {ling.nome}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-50">
                                <button type="button" onClick={onClearAll} className="text-[10px] font-black text-gray-300 uppercase hover:text-red-500 flex items-center gap-2"><RotateCcw size={14} /> Resetar Filtros</button>
                                <button type="submit" disabled={isLoading} className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-100 text-xs uppercase tracking-widest flex items-center gap-2">
                                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />} Aplicar e buscar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}