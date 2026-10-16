import { Filter, ChevronUp, ChevronDown, RotateCcw, Search, Loader2 } from "lucide-react";

// Enum importado ou declarado aqui se for específico desta tela
const STATUS_OPCOES = ["INCUBADA", "ASSOCIADA", "PRE_INCUBADA"];

interface StartupFiltersProps {
    isVisible: boolean;
    onToggleVisibility: () => void;
    filtros: { nome: string; area: string; status: string; dataFundacao: string };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onClear: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

export function StartupFilters({
    isVisible,
    onToggleVisibility,
    filtros,
    onInputChange,
    onClear,
    onSubmit,
    isLoading
}: StartupFiltersProps) {
    return (
        <>
            {/* BOTÃO QUE EXPANDE/RECOLHE O FILTRO */}
            <button
                onClick={onToggleVisibility}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all border ${
                    isVisible
                    ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-100"
                    : "bg-white border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-500"
                }`}
            >
                <Filter size={14} />
                <span className="hidden sm:inline">{isVisible ? "Fechar Filtros" : "Filtrar Startups/Empresas"}</span>
                {isVisible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {/* PAINEL DE FILTROS EXPANSÍVEL */}
            {isVisible && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300 shadow-lg z-20">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <form onSubmit={onSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Nome da Empresa</label>
                                    <input
                                        type="text" name="nome" value={filtros.nome} onChange={onInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all"
                                        placeholder="Ex: InovaTech..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Área de Atuação</label>
                                    <input
                                        type="text" name="area" value={filtros.area} onChange={onInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm outline-none focus:ring-2 focus:ring-red-500 transition-all"
                                        placeholder="Ex: Fintech, IA..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Status na Inova27</label>
                                    <select name="status" value={filtros.status} onChange={onInputChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm outline-none cursor-pointer">
                                        <option value="">Todos os Status</option>
                                        {STATUS_OPCOES.map(op => <option key={op} value={op}>{op}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Fundada após</label>
                                    <input 
                                        type="date" name="dataFundacao" value={filtros.dataFundacao} onChange={onInputChange} 
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm outline-none" 
                                    />
                                </div>
                            </div>
                            
                            {/* BOTÕES DE AÇÃO DO FILTRO */}
                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-50">
                                <button type="button" onClick={onClear} className="text-[10px] font-black text-gray-300 uppercase hover:text-red-500 flex items-center gap-2">
                                    <RotateCcw size={14} /> Resetar
                                </button>
                                <button type="submit" disabled={isLoading} className="px-10 py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-100 text-xs uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50">
                                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} 
                                    Aplicar Filtros
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}