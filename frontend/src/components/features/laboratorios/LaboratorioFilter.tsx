import { Filter, ChevronUp, ChevronDown, RotateCcw, Search, X, Loader2 } from "lucide-react";

const NATUREZA_OPCOES = ["ENSINO", "PESQUISA", "EXTENSAO"];

interface LaboratorioFiltersProps {
    isVisible: boolean;
    onToggleVisibility: () => void;
    filtros: any;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onClear: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

export function LaboratorioFilters({
    isVisible, onToggleVisibility, filtros, onInputChange, onClear, onSubmit, isLoading
}: LaboratorioFiltersProps) {

    // Função interna para limpar um campo individual sem precisar do parent
    const clearField = (field: string) => {
        onInputChange({ target: { name: field, value: "" } } as any);
    };

    return (
        <>
            <button onClick={onToggleVisibility} className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all border ${isVisible ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-500"}`}>
                <Filter size={14} /> <span className="hidden sm:inline">{isVisible ? "Fechar Filtros" : "Filtrar por..."}</span>
                {isVisible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isVisible && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300 overflow-hidden z-20 shadow-lg">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <form onSubmit={onSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Nome */}
                                <div className="group">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Nome do Laboratório</label>
                                    </div>
                                    <div className="relative">
                                        <input type="text" name="nome" value={filtros.nome} onChange={onInputChange} className="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ex: Lab. de Redes..." />
                                        {filtros.nome && (
                                            <button type="button" onClick={() => clearField('nome')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"><X size={16} /></button>
                                        )}
                                    </div>
                                </div>
                                {/* Coordenação */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Coordenação</label>
                                        {filtros.coordenacao && <button type="button" onClick={() => clearField('coordenacao')} className="text-[9px] font-bold text-blue-400 hover:text-blue-600 uppercase">Limpar</button>}
                                    </div>
                                    <input type="text" name="coordenacao" value={filtros.coordenacao} onChange={onInputChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Nome do coordenador" />
                                </div>
                                {/* Área */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Área</label>
                                        {filtros.area && <button type="button" onClick={() => clearField('area')} className="text-[9px] font-bold text-blue-400 hover:text-blue-600 uppercase">Limpar</button>}
                                    </div>
                                    <input type="text" name="area" value={filtros.area} onChange={onInputChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ex: Computação" />
                                </div>
                                {/* Natureza */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Natureza</label>
                                        {filtros.naturezas && <button type="button" onClick={() => clearField('naturezas')} className="text-[9px] font-bold text-blue-400 hover:text-blue-600 uppercase">Remover</button>}
                                    </div>
                                    <select name="naturezas" value={filtros.naturezas} onChange={onInputChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm outline-none cursor-pointer appearance-none">
                                        <option value="">Todas as Naturezas</option>
                                        {NATUREZA_OPCOES.map((op) => <option key={op} value={op}>{op}</option>)}
                                    </select>
                                </div>
                                {/* Vinculado */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Vinculado a (Centro/Curso)</label>
                                        {filtros.vinculado && <button type="button" onClick={() => clearField('vinculado')} className="text-[9px] font-bold text-blue-400 hover:text-blue-600 uppercase">Limpar</button>}
                                    </div>
                                    <input type="text" name="vinculado" value={filtros.vinculado} onChange={onInputChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ex: CCT" />
                                </div>
                                {/* Tag */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Tag</label>
                                        {filtros.tag && <button type="button" onClick={() => clearField('tag')} className="text-[9px] font-bold text-blue-400 hover:text-blue-600 uppercase">Limpar</button>}
                                    </div>
                                    <input type="text" name="tag" value={filtros.tag} onChange={onInputChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ex: Inovação" />
                                </div>
                            </div>

                            <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-50">
                                <button type="button" onClick={onClear} className="text-[10px] font-black text-gray-300 uppercase hover:text-red-500 transition-colors flex items-center gap-2">
                                    <RotateCcw size={14} /> Resetar Filtros
                                </button>
                                <button type="submit" disabled={isLoading} className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center gap-2 uppercase text-xs tracking-widest">
                                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                                    Aplicar filtros e buscar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}