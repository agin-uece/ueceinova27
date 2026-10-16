"use client";

import { useState, useEffect } from "react";
import { Info, ImageIcon, Layers, Globe, Save, Loader2 } from "lucide-react";
import { Engine, Linguagem } from "@/types";
import { FormGroup } from "@/components/ui/FormGroup";

const GENERO_OPCOES = ["ACAO", "AVENTURA", "RPG", "ESTRATEGIA", "ESPORTE", "SIMULACAO"];
const PLATAFORMA_OPCOES = ["PC", "MOBILE", "CONSOLE", "WEB", "JOGO_FISICO"];
const TIPO_JOGO_OPCOES = ["ELETRONICO", "FISICO", "HIBRIDO", "MECANICO", "REALIDADE_VIRTUAL", "REALIDADE_AUMENTADA"];
const ESTAGIO_OPCOES = ["EM_DESENVOLVIMENTO", "FINALIZADO", "INTERROMPIDO"];
const FAIXA_ETARIA_OPCOES = ["LIVRE", "DEZ", "DOZE", "QUATORZE", "DEZESSEIS", "DEZOITO"];

interface JogoFormProps {
    initialData?: any;
    onSubmit: (data: any) => void;
    isLoading: boolean;
}

export function JogoForm({ initialData, onSubmit, isLoading }: JogoFormProps) {
    const [engines, setEngines] = useState<Engine[]>([]);
    const [linguagens, setLinguagens] = useState<Linguagem[]>([]);
    const [criadoresStr, setCriadoresStr] = useState<string>(
        initialData?.criadores?.join(", ") || ""
    );

    const [formData, setFormData] = useState({
        nome: initialData?.nome || "",
        descricao: initialData?.descricao || "",
        genero: initialData?.genero || "",
        plataforma: initialData?.plataforma || "",
        dataLancamento: initialData?.dataLancamento || "",
        linkDownload: initialData?.linkDownload || "",
        site: initialData?.site || "",
        engineId: initialData?.engineId || "",
        linguagensIds: initialData?.linguagensIds || [] as number[],
        tipoJogo: initialData?.tipoJogo || "",
        anoDesenvolvimento: initialData?.anoDesenvolvimento || "",
        estagioDesenvolvimento: initialData?.estagioDesenvolvimento || "",
        urlFoto: initialData?.urlFoto || "",
        faixaEtaria: initialData?.faixaEtaria || "",
    });

    useEffect(() => {
        const carregarAuxiliares = async () => {
            const [resE, resL] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/engines`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/linguagens`)
            ]);
            if (resE.ok) setEngines(await resE.json());
            if (resL.ok) setLinguagens(await resL.json());
        };
        carregarAuxiliares();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleLinguagem = (id: number) => {
        const selecionados = formData.linguagensIds.includes(id)
            ? formData.linguagensIds.filter((item: number) => item !== id)
            : [...formData.linguagensIds, id];
        setFormData({ ...formData, linguagensIds: selecionados });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payloadLimpo = {
            ...Object.fromEntries(
                Object.entries(formData).map(([chave, valor]) => [
                    chave,
                    valor === "" ? null : valor
                ])
            ),
            criadores: criadoresStr
                .split(",")
                .map((c: string) => c.trim())
                .filter((c: string) => c !== ""),
        };

        onSubmit(payloadLimpo);
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {/* Seção 1: Identidade */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-2 border-b pb-4">
                        <Info size={18} className="text-orange-500" />
                        <h2 className="font-bold text-gray-800 uppercase text-sm tracking-widest">Identidade do Projeto</h2>
                    </div>

                    <div className="space-y-4">
                        <FormGroup label="Nome do Jogo *">
                            <input
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                placeholder="Título oficial"
                            />
                        </FormGroup>

                        <FormGroup label="Criadores (separados por vírgula)">
                            <input
                                type="text"
                                value={criadoresStr}
                                onChange={(e) => setCriadoresStr(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                placeholder="Ex: João Silva, Maria Souza"
                            />
                        </FormGroup>

                        <FormGroup label="Resumo/Descrição">
                            <textarea
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
                                placeholder="Conte a história ou mecânicas..."
                            />
                        </FormGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormGroup label="Gênero">
                            <select name="genero" value={formData.genero} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none">
                                <option value="">Selecione...</option>
                                {GENERO_OPCOES.map(op => <option key={op} value={op}>{op}</option>)}
                            </select>
                        </FormGroup>
                        <FormGroup label="Tipo">
                            <select name="tipoJogo" value={formData.tipoJogo} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none">
                                <option value="">Selecione...</option>
                                {TIPO_JOGO_OPCOES.map(op => <option key={op} value={op}>{op.replace(/_/g, " ")}</option>)}
                            </select>
                        </FormGroup>
                        <FormGroup label="Faixa Etária">
                            <select name="faixaEtaria" value={formData.faixaEtaria} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none">
                                <option value="">Selecione...</option>
                                {FAIXA_ETARIA_OPCOES.map(op => <option key={op} value={op}>{op}</option>)}
                            </select>
                        </FormGroup>
                    </div>
                </section>

                {/* Seção 2: Técnica */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-2 border-b pb-4">
                        <Layers size={18} className="text-orange-500" />
                        <h2 className="font-bold text-gray-800 uppercase text-sm tracking-widest">Cronograma e Engenharia</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormGroup label="Início do Desenvolvimento">
                            <input type="date" name="anoDesenvolvimento" value={formData.anoDesenvolvimento} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none" />
                        </FormGroup>
                        <FormGroup label="Data de Lançamento">
                            <input type="date" name="dataLancamento" value={formData.dataLancamento} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none" />
                        </FormGroup>
                        <FormGroup label="Estágio Atual">
                            <select name="estagioDesenvolvimento" value={formData.estagioDesenvolvimento} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none">
                                <option value="">Selecione...</option>
                                {ESTAGIO_OPCOES.map(op => <option key={op} value={op}>{op.replace(/_/g, " ")}</option>)}
                            </select>
                        </FormGroup>
                        <FormGroup label="Engine Utilizada">
                            <select name="engineId" value={formData.engineId} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none">
                                <option value="">Selecione...</option>
                                {engines.map(eng => <option key={eng.id} value={eng.id}>{eng.nome}</option>)}
                            </select>
                        </FormGroup>
                    </div>

                    <div className="pt-4">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-3">Linguagens de Programação</label>
                        <div className="flex flex-wrap gap-2">
                            {linguagens.map((ling) => {
                                const selected = formData.linguagensIds.includes(ling.id);
                                return (
                                    <button
                                        key={ling.id}
                                        type="button"
                                        onClick={() => toggleLinguagem(ling.id)}
                                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter border transition-all ${selected ? "bg-orange-500 border-orange-500 text-white" : "bg-gray-50 border-gray-100 text-gray-400 hover:border-orange-200"}`}
                                    >
                                        {selected && "✓ "}{ling.nome}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>

            {/* Coluna Lateral */}
            <div className="space-y-8">
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-2 border-b pb-4">
                        <ImageIcon size={18} className="text-orange-500" />
                        <h2 className="font-bold text-gray-800 uppercase text-sm tracking-widest">Mídia</h2>
                    </div>
                    <FormGroup label="URL da Capa">
                        <input
                            type="text"
                            name="urlFoto"
                            value={formData.urlFoto}
                            onChange={handleChange}
                            className="w-full px-4 py-2 text-xs border-b border-gray-100 outline-none bg-transparent"
                            placeholder="https://imagem.com/link.jpg"
                        />
                        {formData.urlFoto && (
                            <div className="mt-4 rounded-2xl overflow-hidden aspect-video bg-gray-100 shadow-inner">
                                <img src={formData.urlFoto} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </FormGroup>
                </section>

                <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-2 border-b pb-4">
                        <Globe size={18} className="text-orange-500" />
                        <h2 className="font-bold text-gray-800 uppercase text-sm tracking-widest">Acesso</h2>
                    </div>
                    <div className="space-y-5">
                        <FormGroup label="Plataforma">
                            <select name="plataforma" value={formData.plataforma} onChange={handleChange} className="w-full py-2 border-b border-gray-100 outline-none font-medium">
                                <option value="">Selecione</option>
                                {PLATAFORMA_OPCOES.map(op => <option key={op} value={op}>{op.replace(/_/g, " ")}</option>)}
                            </select>
                        </FormGroup>
                        <FormGroup label="Link Download">
                            <input type="url" name="linkDownload" value={formData.linkDownload} onChange={handleChange} className="w-full py-2 border-b border-gray-100 outline-none text-sm" />
                        </FormGroup>
                        <FormGroup label="Site Oficial">
                            <input type="url" name="site" value={formData.site} onChange={handleChange} className="w-full py-2 border-b border-gray-100 outline-none text-sm" />
                        </FormGroup>
                    </div>
                </section>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-3xl shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                    {initialData ? "Atualizar Jogo" : "Cadastrar Jogo"}
                </button>
            </div>
        </form>
    );
}