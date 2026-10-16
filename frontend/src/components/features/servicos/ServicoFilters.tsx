import { useState } from "react";
import { Filter, ChevronUp, ChevronDown, RotateCcw, Search, Loader2, X } from "lucide-react";
import { PessoaPrestador } from "@/types";

interface ServicoFiltersProps {
    isVisible: boolean;
    onToggleVisibility: () => void;
    filtros: { areaAtuacao: string; pessoaId: string };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectPessoa: (id: string) => void;
    onClear: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    pessoas: PessoaPrestador[];
}

export function ServicoFilters({
    isVisible, onToggleVisibility, filtros, onInputChange, 
    onSelectPessoa, onClear, onSubmit, isLoading, pessoas
}: ServicoFiltersProps) {
    
    // Estados internos do Autocomplete (encapsulados aqui!)
    const [buscaPessoa, setBuscaPessoa] = useState("");
    const [dropdownAberto, setDropdownAberto] = useState(false);

    const pessoaSelecionada = pessoas.find(p => p.id.toString() === filtros.pessoaId);
    const pessoasSugeridas = pessoas.filter(p =>
        p.nome.toLowerCase().includes(buscaPessoa.toLowerCase()) &&
        p.id.toString() !== filtros.pessoaId
    );

    const handleClearInner = () => {
        setBuscaPessoa("");
        onClear();
    };

    return (
        <>
            <button
                onClick={onToggleVisibility}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all border ${
                    isVisible
                    ? "bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-100"
                    : "bg-white border-gray-200 text-gray-600 hover:border-teal-500 hover:text-teal-500"
                }`}
            >
                <Filter size={14} />
                <span className="hidden sm:inline">{isVisible ? "Fechar Filtros" : "Filtrar Serviços"}</span>
                {isVisible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isVisible && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300 shadow-lg z-20">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <form onSubmit={onSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Área de Atuação</label>
                                    <input
                                        type="text" name="areaAtuacao" value={filtros.areaAtuacao} onChange={onInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none text-sm outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                                        placeholder="Ex: Consultoria de TI"
                                    />
                                </div>

                                {/* LÓGICA DO AUTOCOMPLETE ISOLADA AQUI */}
                                <div className="relative">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-2 block">Prestador Responsável</label>
                                    {pessoaSelecionada ? (
                                        <div className="flex items-center justify-between bg-teal-50 border border-teal-100 px-4 py-2.5 rounded-xl">
                                            <span className="text-sm font-bold text-teal-700">{pessoaSelecionada.nome}</span>
                                            <button
                                                type="button"
                                                onClick={() => onSelectPessoa("")}
                                                className="p-1 hover:bg-teal-100 rounded-full text-teal-600 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-teal-500 transition-all">
                                                <Search size={16} className="text-gray-400 mr-2" />
                                                <input
                                                    type="text"
                                                    placeholder="Buscar prestador..."
                                                    className="w-full bg-transparent outline-none text-sm text-gray-700"
                                                    value={buscaPessoa}
                                                    onChange={(e) => {
                                                        setBuscaPessoa(e.target.value);
                                                        setDropdownAberto(true);
                                                    }}
                                                    onFocus={() => setDropdownAberto(true)}
                                                    onBlur={() => setTimeout(() => setDropdownAberto(false), 200)}
                                                />
                                            </div>

                                            {dropdownAberto && (
                                                <div className="absolute z-50 w-full mt-2 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl">
                                                    {pessoasSugeridas.length > 0 ? (
                                                        pessoasSugeridas.map(p => (
                                                            <button
                                                                key={p.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    onSelectPessoa(p.id.toString());
                                                                    setBuscaPessoa("");
                                                                    setDropdownAberto(false);
                                                                }}
                                                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors border-b border-gray-50 last:border-0"
                                                            >
                                                                {p.nome}
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-3 text-xs text-gray-400 italic">Nenhum prestador encontrado.</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-50">
                                <button type="button" onClick={handleClearInner} className="text-[10px] font-black text-gray-300 uppercase hover:text-teal-500 flex items-center gap-2">
                                    <RotateCcw size={14} /> Limpar
                                </button>
                                <button type="submit" disabled={isLoading} className="px-10 py-4 bg-teal-600 text-white font-black rounded-2xl shadow-xl shadow-teal-100 text-xs uppercase tracking-widest hover:bg-teal-700 transition-all flex items-center gap-2">
                                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} Filtrar agora
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}