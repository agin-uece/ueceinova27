import { Filter, ChevronUp, ChevronDown, RotateCcw, Search } from "lucide-react";

const NATUREZAS_OPCOES = ["PATENTE", "SOFTWARE", "MARCA", "DESENHO_INDUSTRIAL", "DIREITO_AUTORAL"];

interface ProtecaoFiltersProps {
    isVisible: boolean;
    onToggleVisibility: () => void;
    filtros: { buscaGeral: string; natureza: string; status: string; dataApos: string };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onClear: () => void;
    onClose: () => void;
}

export function ProtecaoFilters({
    isVisible, onToggleVisibility, filtros, onInputChange, onClear, onClose
}: ProtecaoFiltersProps) {
    return (
        <>
            <button
                onClick={onToggleVisibility}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all border ${
                    isVisible
                    ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-100"
                    : "bg-white border-gray-200 text-gray-600 hover:border-purple-500 hover:text-purple-500"
                }`}
            >
                <Filter size={14} />
                <span className="hidden sm:inline">{isVisible ? "Fechar Filtros" : "Filtrar Proteções"}</span>
                {isVisible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isVisible && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300 z-20 shadow-lg">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Nome ou Código</label>
                                <input
                                    type="text" name="buscaGeral" value={filtros.buscaGeral} onChange={onInputChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="Ex: Patente X..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Natureza</label>
                                <select name="natureza" value={filtros.natureza} onChange={onInputChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm outline-none cursor-pointer">
                                    <option value="">Todas</option>
                                    {NATUREZAS_OPCOES.map(op => <option key={op} value={op}>{op.replace(/_/g, " ")}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Status</label>
                                <input
                                    type="text" name="status" value={filtros.status} onChange={onInputChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    placeholder="Ex: Concedida..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Depositada após</label>
                                <input type="date" name="dataApos" value={filtros.dataApos} onChange={onInputChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-50">
                            <button onClick={onClear} className="text-[10px] font-black text-gray-300 uppercase hover:text-purple-500 flex items-center gap-2">
                                <RotateCcw size={14} /> Resetar
                            </button>
                            <button onClick={onClose} className="px-10 py-4 bg-purple-600 text-white font-black rounded-2xl shadow-xl shadow-purple-100 text-xs uppercase tracking-widest hover:bg-purple-700 transition-all flex items-center gap-2">
                                <Search size={16} /> Fechar e Aplicar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}