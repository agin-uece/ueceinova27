"use client";

import { useState } from "react";
import { Info, ImageIcon, Layers, Globe, Save, Loader2, Plus, X } from "lucide-react";
import { FormGroup } from "@/components/ui/FormGroup";

const GENERO_OPCOES = ["ACAO", "AVENTURA", "RPG", "ESTRATEGIA", "ESPORTE", "SIMULACAO"];
const PLATAFORMA_OPCOES = ["PC", "MOBILE", "CONSOLE", "WEB", "JOGO_FISICO"];
const TIPO_JOGO_OPCOES = ["ELETRONICO", "FISICO", "HIBRIDO", "MECANICO", "REALIDADE_VIRTUAL", "REALIDADE_AUMENTADA"];
const ESTAGIO_OPCOES = ["EM_DESENVOLVIMENTO", "FINALIZADO", "INTERROMPIDO"];
const FAIXA_ETARIA_OPCOES = ["LIVRE", "DEZ", "DOZE", "QUATORZE", "DEZESSEIS", "DEZOITO"];

const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;

// Data de hoje no fuso local (toISOString usa UTC e adiantaria o dia à noite no Brasil)
function hojeLocal(): string {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mes}-${dia}`;
}

function formatarData(iso: string): string {
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
}

type ErrosDatas = { anoDesenvolvimento?: string; dataLancamento?: string };

// Strings YYYY-MM-DD podem ser comparadas diretamente em ordem lexicográfica
function validarDatas(inicio: string, lancamento: string, hoje: string): ErrosDatas {
    const erros: ErrosDatas = {};
    const inicioValido = DATA_ISO.test(inicio);

    if (inicioValido && inicio > hoje) {
        erros.anoDesenvolvimento =
            "O início do desenvolvimento não pode ser uma data futura. Informe uma data até hoje.";
    }
    if (inicioValido && DATA_ISO.test(lancamento) && lancamento < inicio) {
        erros.dataLancamento =
            `A data de lançamento não pode ser anterior ao início do desenvolvimento (${formatarData(inicio)}). ` +
            "Ajuste uma das datas.";
    }
    return erros;
}

interface JogoFormProps {
    initialData?: any;
    onSubmit: (data: any) => void;
    isLoading: boolean;
}

export function JogoForm({ initialData, onSubmit, isLoading }: JogoFormProps) {
    const [criadoresStr, setCriadoresStr] = useState<string>(
        initialData?.criadores?.join(", ") || ""
    );

    const [linguagens, setLinguagens] = useState<string[]>(
        Array.isArray(initialData?.linguagens) ? initialData.linguagens : []
    );
    const [linguagemInput, setLinguagemInput] = useState("");

    const [formData, setFormData] = useState({
        nome: initialData?.nome || "",
        descricao: initialData?.descricao || "",
        genero: initialData?.genero || "",
        plataforma: initialData?.plataforma || "",
        dataLancamento: initialData?.dataLancamento || "",
        linkDownload: initialData?.linkDownload || "",
        site: initialData?.site || "",
        engine: initialData?.engine || "",
        tipoJogo: initialData?.tipoJogo || "",
        anoDesenvolvimento: initialData?.anoDesenvolvimento || "",
        estagioDesenvolvimento: initialData?.estagioDesenvolvimento || "",
        urlFoto: initialData?.urlFoto || "",
        faixaEtaria: initialData?.faixaEtaria || "",
    });

    const hoje = hojeLocal();
    const errosDatas = validarDatas(formData.anoDesenvolvimento, formData.dataLancamento, hoje);
    const inicioDesenvolvimentoMin = DATA_ISO.test(formData.anoDesenvolvimento)
        ? formData.anoDesenvolvimento
        : undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const adicionarLinguagem = (valorBruto?: string) => {
        const texto = valorBruto ?? linguagemInput;
        const novas = texto
            .split(",")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);

        if (novas.length === 0) return;

        setLinguagens((prev) => {
            const existentesLower = new Set(prev.map((item) => item.toLowerCase()));
            const unicas = novas.filter((item) => !existentesLower.has(item.toLowerCase()));
            return [...prev, ...unicas];
        });
        setLinguagemInput("");
    };

    const handleLinguagemKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            adicionarLinguagem();
        }
    };

    const removerLinguagem = (lingParaRemover: string) => {
        setLinguagens((prev) => prev.filter((l) => l !== lingParaRemover));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Datas inválidas não seguem para o backend; a mensagem já aparece abaixo do campo
        if (errosDatas.anoDesenvolvimento || errosDatas.dataLancamento) {
            const campo = errosDatas.anoDesenvolvimento ? "anoDesenvolvimento" : "dataLancamento";
            const input = e.currentTarget instanceof HTMLFormElement
                ? e.currentTarget.querySelector<HTMLInputElement>(`[name="${campo}"]`)
                : null;
            input?.scrollIntoView({ behavior: "smooth", block: "center" });
            input?.focus();
            return;
        }

        // Caso o usuário tenha digitado algo no input de linguagem e clicado direto em Salvar sem dar Enter
        const pendentes = linguagemInput
            .split(",")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);

        const existentesLower = new Set(linguagens.map((item) => item.toLowerCase()));
        const linguagensFinais = [
            ...linguagens,
            ...pendentes.filter((item) => !existentesLower.has(item.toLowerCase())),
        ];

        const payloadLimpo = {
            ...Object.fromEntries(
                Object.entries(formData).map(([chave, valor]) => [
                    chave,
                    typeof valor === "string" && valor.trim() === "" ? null : valor
                ])
            ),
            linguagens: linguagensFinais,
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
                                maxLength={255}
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
                                placeholder="Conte a história ou mecânicas..."
                            />
                            <p className="text-right text-[10px] font-bold text-gray-400 mt-1">{formData.descricao.length}/255</p>
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
                        <FormGroup label="Início do Desenvolvimento" error={errosDatas.anoDesenvolvimento}>
                            <input
                                type="date"
                                name="anoDesenvolvimento"
                                value={formData.anoDesenvolvimento}
                                onChange={handleChange}
                                max={hoje}
                                aria-invalid={Boolean(errosDatas.anoDesenvolvimento)}
                                className={`w-full px-4 py-3 rounded-xl border bg-gray-50 outline-none ${errosDatas.anoDesenvolvimento ? "border-red-400 bg-red-50" : "border-gray-100"}`}
                            />
                        </FormGroup>
                        <FormGroup label="Data de Lançamento" error={errosDatas.dataLancamento}>
                            <input
                                type="date"
                                name="dataLancamento"
                                value={formData.dataLancamento}
                                onChange={handleChange}
                                min={inicioDesenvolvimentoMin}
                                aria-invalid={Boolean(errosDatas.dataLancamento)}
                                className={`w-full px-4 py-3 rounded-xl border bg-gray-50 outline-none ${errosDatas.dataLancamento ? "border-red-400 bg-red-50" : "border-gray-100"}`}
                            />
                        </FormGroup>
                        <FormGroup label="Estágio Atual">
                            <select name="estagioDesenvolvimento" value={formData.estagioDesenvolvimento} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 outline-none">
                                <option value="">Selecione...</option>
                                {ESTAGIO_OPCOES.map(op => <option key={op} value={op}>{op.replace(/_/g, " ")}</option>)}
                            </select>
                        </FormGroup>
                        <FormGroup label="Engine Utilizada">
                            <input
                                type="text"
                                name="engine"
                                maxLength={100}
                                value={formData.engine}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                placeholder="Ex: Godot, Unity, Unreal Engine..."
                            />
                        </FormGroup>
                    </div>

                    <div className="pt-4 space-y-3">
                        <label className="block text-xs font-bold text-gray-400 uppercase">
                            Linguagens de Programação
                        </label>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={linguagemInput}
                                onChange={(e) => setLinguagemInput(e.target.value)}
                                onKeyDown={handleLinguagemKeyDown}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm"
                                placeholder="Ex: GDScript, C#, C++ (pressione Enter ou vírgula)"
                            />
                            <button
                                type="button"
                                onClick={() => adicionarLinguagem()}
                                className="px-4 py-3 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-orange-200 shrink-0"
                            >
                                <Plus size={16} />
                                Adicionar
                            </button>
                        </div>

                        {linguagens.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {linguagens.map((ling) => (
                                    <span
                                        key={ling}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-orange-500 text-white shadow-xs"
                                    >
                                        {ling}
                                        <button
                                            type="button"
                                            onClick={() => removerLinguagem(ling)}
                                            className="hover:bg-orange-600 rounded-full p-0.5 transition-colors"
                                            title={`Remover ${ling}`}
                                        >
                                            <X size={13} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
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