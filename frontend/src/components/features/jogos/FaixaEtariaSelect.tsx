"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// Cores e rótulos no padrão da Classificação Indicativa brasileira (ClassInd).
// O valor continua sendo o enum do backend; só a apresentação muda.
export const FAIXAS_ETARIAS = [
    { valor: "LIVRE", selo: "L", descricao: "Livre para todos os públicos", cor: "bg-[#0c9447]" },
    { valor: "DEZ", selo: "10", descricao: "Não recomendado para menores de 10 anos", cor: "bg-[#0f7dc2]" },
    { valor: "DOZE", selo: "12", descricao: "Não recomendado para menores de 12 anos", cor: "bg-[#f8c411]" },
    { valor: "QUATORZE", selo: "14", descricao: "Não recomendado para menores de 14 anos", cor: "bg-[#e67824]" },
    { valor: "DEZESSEIS", selo: "16", descricao: "Não recomendado para menores de 16 anos", cor: "bg-[#db2827]" },
    { valor: "DEZOITO", selo: "18", descricao: "Não recomendado para menores de 18 anos", cor: "bg-[#1d1815]" },
] as const;

export function SeloFaixaEtaria({ valor, tamanho = "md" }: { valor: string; tamanho?: "sm" | "md" }) {
    const faixa = FAIXAS_ETARIAS.find((f) => f.valor === valor);
    if (!faixa) return null;
    const dimensao = tamanho === "sm" ? "w-6 h-6 text-[11px]" : "w-8 h-8 text-sm";
    return (
        <span
            aria-hidden="true"
            className={`${faixa.cor} ${dimensao} inline-flex items-center justify-center rounded-md font-black text-white shrink-0 shadow-sm`}
        >
            {faixa.selo}
        </span>
    );
}

interface FaixaEtariaSelectProps {
    name?: string;
    value: string;
    onChange: (valor: string) => void;
}

export function FaixaEtariaSelect({ name = "faixaEtaria", value, onChange }: FaixaEtariaSelectProps) {
    const [aberto, setAberto] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const listaId = useId();
    const selecionada = FAIXAS_ETARIAS.find((f) => f.valor === value);

    // Fecha ao clicar fora
    useEffect(() => {
        if (!aberto) return;
        const fecharSeFora = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) setAberto(false);
        };
        document.addEventListener("mousedown", fecharSeFora);
        return () => document.removeEventListener("mousedown", fecharSeFora);
    }, [aberto]);

    const escolher = (valor: string) => {
        onChange(valor);
        setAberto(false);
    };

    return (
        <div ref={containerRef} className="relative" onKeyDown={(e) => e.key === "Escape" && setAberto(false)}>
            <input type="hidden" name={name} value={value} />

            <button
                type="button"
                onClick={() => setAberto((a) => !a)}
                aria-haspopup="listbox"
                aria-expanded={aberto}
                aria-controls={listaId}
                aria-label={selecionada ? `Faixa etária: ${selecionada.descricao}` : "Faixa etária: selecione"}
                className="w-full min-h-[50px] px-4 py-2 rounded-xl border border-gray-100 bg-gray-50 outline-none flex items-center justify-between gap-2 focus:ring-2 focus:ring-orange-500"
            >
                {selecionada ? (
                    <SeloFaixaEtaria valor={selecionada.valor} />
                ) : (
                    <span className="text-sm text-gray-500">Selecione...</span>
                )}
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${aberto ? "rotate-180" : ""}`} />
            </button>

            {aberto && (
                <ul
                    id={listaId}
                    role="listbox"
                    className="absolute z-20 mt-2 w-full min-w-[220px] bg-white border border-gray-100 rounded-xl shadow-xl py-1"
                >
                    <li role="option" aria-selected={!value}>
                        <button
                            type="button"
                            onClick={() => escolher("")}
                            className="w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-50"
                        >
                            Nenhuma
                        </button>
                    </li>
                    {FAIXAS_ETARIAS.map((f) => (
                        <li key={f.valor} role="option" aria-selected={f.valor === value}>
                            <button
                                type="button"
                                onClick={() => escolher(f.valor)}
                                title={f.descricao}
                                className={`w-full px-4 py-2 flex items-center gap-3 text-left hover:bg-orange-50 ${f.valor === value ? "bg-orange-50" : ""}`}
                            >
                                <SeloFaixaEtaria valor={f.valor} />
                                <span className="text-xs text-gray-600">{f.descricao}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
