"use client";

import { useState, useEffect } from "react";
import { Shield, Save, FileText, Loader2, Info } from "lucide-react";
import { FormGroup } from "@/components/ui/FormGroup";

const NATUREZAS = ["PATENTE", "SOFTWARE", "DESENHO_INDUSTRIAL"];

const TIPOS_PROTECAO_POR_NATUREZA: Record<string, string[]> = {
    PATENTE: ["PATENTE_MODELO_UTILIDADE", "PATENTE_INVENCAO"],
    SOFTWARE: ["PROGRAMA_COMPUTADOR"],
    DESENHO_INDUSTRIAL: ["DESENHO_INDUSTRIAL"],
};

const CAMPOS: Record<string, {
    descricao: boolean;
    diferencialTecnologico: boolean;
    inventores: boolean;
    autores: boolean;
    nivelMaturidade: boolean;
}> = {
    PATENTE: {
        descricao: true,
        diferencialTecnologico: true,
        inventores: true,
        autores: false,
        nivelMaturidade: true,
    },
    SOFTWARE: {
        descricao: true,
        diferencialTecnologico: true,
        inventores: false,
        autores: true,
        nivelMaturidade: false,
    },
    DESENHO_INDUSTRIAL: {
        descricao: false,
        diferencialTecnologico: false,
        inventores: false,
        autores: true,
        nivelMaturidade: false,
    },
};

interface ProtecaoFormProps {
    initialData?: any;
    onSubmit: (payload: any) => void;
    isLoading: boolean;
}

export function ProtecaoForm({ initialData, onSubmit, isLoading }: ProtecaoFormProps) {
    const [formData, setFormData] = useState({
        nome: initialData?.nome || "",
        resumo: initialData?.resumo || "",
        natureza: initialData?.natureza || "PATENTE",
        tipos: (initialData?.tipos || []) as string[],
        nivelMaturidade: initialData?.nivelMaturidade || "",
        status: initialData?.status || "",
        titular: initialData?.titular || "",
        diferencialTecnologico: initialData?.diferencialTecnologico || "",
        numeroProtocolo: initialData?.numeroProtocolo || "",
        // 👇 campos novos
        aplicacao: initialData?.aplicacao || "",
        area: initialData?.area || "",
        infoExtra: initialData?.infoExtra || "",
    });

    const [inventoresStr, setInventoresStr] = useState<string>(initialData?.inventores?.join(", ") || "");
    const [autoresStr, setAutoresStr] = useState<string>(initialData?.autores?.join(", ") || "");

    // Estado dos jogos disponíveis e selecionado
    const [jogos, setJogos] = useState<{ id: number; nome: string }[]>([]);
    const [jogoId, setJogoId] = useState<number | null>(initialData?.jogoId || null);

    // Busca os jogos quando natureza for SOFTWARE ou DESENHO_INDUSTRIAL
    useEffect(() => {
        if (formData.natureza === "SOFTWARE" || formData.natureza === "DESENHO_INDUSTRIAL") {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/jogos`)
                .then(res => res.json())
                .then(data => setJogos(Array.isArray(data) ? data : []))
                .catch(() => setJogos([]));
        } else {
            setJogos([]);
            setJogoId(null);
        }
    }, [formData.natureza]);

    const campos = CAMPOS[formData.natureza];
    const tiposDisponiveis = TIPOS_PROTECAO_POR_NATUREZA[formData.natureza] || [];

    const handleNaturezaChange = (natureza: string) => {
        const tiposValidos = TIPOS_PROTECAO_POR_NATUREZA[natureza] || [];
        setFormData(prev => ({
            ...prev,
            natureza,
            tipos: prev.tipos.filter((t: string) => tiposValidos.includes(t)),
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTipoToggle = (tipo: string) => {
        setFormData(prev => ({
            ...prev,
            tipos: prev.tipos.includes(tipo)
                ? prev.tipos.filter((t: string) => t !== tipo)
                : [...prev.tipos, tipo]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            inventores: campos.inventores
                ? inventoresStr.split(",").map((i: string) => i.trim()).filter((i: string) => i !== "")
                : [],
            autores: campos.autores
                ? autoresStr.split(",").map((a: string) => a.trim()).filter((a: string) => a !== "")
                : [],
            jogoId: jogoId ?? undefined,
        };
        onSubmit(payload);
    };

    const inputClass = "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all";

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-8">

            {/* NATUREZA */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                    <Shield size={20} className="text-purple-600" /> Natureza da Proteção
                </h3>
                <div className="flex flex-wrap gap-3">
                    {NATUREZAS.map(nat => (
                        <button
                            key={nat}
                            type="button"
                            onClick={() => handleNaturezaChange(nat)}
                            className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border-2 ${formData.natureza === nat
                                ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-100"
                                : "bg-gray-50 border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600"
                                }`}
                        >
                            {nat.replace(/_/g, " ")}
                        </button>
                    ))}
                </div>
            </div>

            {/* CAMPOS PRINCIPAIS */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                    <FileText size={20} className="text-purple-600" /> Informações Principais
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Título */}
                    <div className="col-span-2">
                        <FormGroup label="Título *">
                            <input
                                required
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </FormGroup>
                    </div>

                    {/* Tipo de Proteção */}
                    <div className="col-span-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                            Tipo de Proteção
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {tiposDisponiveis.map((tipo: string) => (
                                <label
                                    key={tipo}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all cursor-pointer ${formData.tipos.includes(tipo)
                                        ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-100"
                                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={formData.tipos.includes(tipo)}
                                        onChange={() => handleTipoToggle(tipo)}
                                    />
                                    <span className="text-xs font-bold uppercase tracking-tighter">
                                        {tipo.replace(/_/g, " ")}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Descrição */}
                    {campos.descricao && (
                        <div className="col-span-2">
                            <FormGroup label="Descrição">
                                <textarea
                                    name="resumo"
                                    rows={3}
                                    value={formData.resumo}
                                    onChange={handleChange}
                                    className={`${inputClass} resize-none`}
                                />
                            </FormGroup>
                        </div>
                    )}

                    {/* Diferencial Tecnológico */}
                    {campos.diferencialTecnologico && (
                        <div className="col-span-2">
                            <FormGroup label="Diferencial Tecnológico">
                                <textarea
                                    name="diferencialTecnologico"
                                    rows={3}
                                    value={formData.diferencialTecnologico}
                                    onChange={handleChange}
                                    className={`${inputClass} resize-none`}
                                />
                            </FormGroup>
                        </div>
                    )}

                    {/* Titular */}
                    <FormGroup label="Titular">
                        <input
                            type="text"
                            name="titular"
                            value={formData.titular}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </FormGroup>

                    {/* Inventores */}
                    {campos.inventores && (
                        <FormGroup label="Inventores (separados por vírgula)">
                            <input
                                type="text"
                                placeholder="Ex: João Silva, Maria Souza"
                                value={inventoresStr}
                                onChange={(e) => setInventoresStr(e.target.value)}
                                className={inputClass}
                            />
                        </FormGroup>
                    )}

                    {/* Autor(es) */}
                    {campos.autores && (
                        <FormGroup label="Autor(es) (separados por vírgula)">
                            <input
                                type="text"
                                placeholder="Ex: João Silva, Maria Souza"
                                value={autoresStr}
                                onChange={(e) => setAutoresStr(e.target.value)}
                                className={inputClass}
                            />
                        </FormGroup>
                    )}

                    {/* Jogo vinculado (SOFTWARE e DESENHO_INDUSTRIAL) */}
                    {(formData.natureza === "SOFTWARE" || formData.natureza === "DESENHO_INDUSTRIAL") && (
                        <div className="col-span-2">
                            <FormGroup label="Jogo Vinculado">
                                <select
                                    value={jogoId ?? ""}
                                    onChange={(e) => setJogoId(e.target.value ? Number(e.target.value) : null)}
                                    className={inputClass}
                                >
                                    <option value="">Selecione um jogo (opcional)</option>
                                    {jogos.map(jogo => (
                                        <option key={jogo.id} value={jogo.id}>
                                            {jogo.nome}
                                        </option>
                                    ))}
                                </select>
                            </FormGroup>
                        </div>
                    )}

                    {/* Nº do Processo */}
                    <FormGroup label="Nº do Processo">
                        <input
                            type="text"
                            name="numeroProtocolo"
                            value={formData.numeroProtocolo}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </FormGroup>

                    {/* Nível de Maturidade */}
                    {campos.nivelMaturidade && (
                        <FormGroup label="Nível de Maturidade">
                            <input
                                type="text"
                                name="nivelMaturidade"
                                value={formData.nivelMaturidade}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </FormGroup>
                    )}

                    {/* Status */}
                    <FormGroup label="Status">
                        <input
                            type="text"
                            name="status"
                            placeholder="Ex: Concedida"
                            value={formData.status}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </FormGroup>

                    {/* Área */}
                    <FormGroup label="Área">
                        <input
                            type="text"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </FormGroup>

                    {/* Aplicação */}
                    <FormGroup label="Aplicação">
                        <input
                            type="text"
                            name="aplicacao"
                            value={formData.aplicacao}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </FormGroup>

                </div>
            </div>

            {/* INFORMAÇÕES EXTRAS */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                    <Info size={20} className="text-purple-600" /> Informações Adicionais
                </h3>
                <FormGroup label="Informação Extra">
                    <textarea
                        name="infoExtra"
                        rows={3}
                        value={formData.infoExtra}
                        onChange={handleChange}
                        className={`${inputClass} resize-none`}
                    />
                </FormGroup>
            </div>

            <div className="pt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-3 bg-purple-700 hover:bg-purple-800 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-purple-100 transition-all disabled:opacity-50"
                >
                    {isLoading
                        ? <Loader2 className="animate-spin" size={20} />
                        : <><Save size={20} /> Salvar Proteção</>
                    }
                </button>
            </div>
        </form>
    );
}