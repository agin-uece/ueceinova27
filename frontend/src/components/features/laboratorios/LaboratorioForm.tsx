"use client";

import { useState } from "react";
import { Info, MapPin, ImageIcon, Clock, Check, Save, Loader2, Globe, Layers } from "lucide-react";
import { FormGroup } from "@/components/ui/FormGroup";

const NATUREZA_OPCOES = ["ENSINO", "PESQUISA", "EXTENSAO"];

const CAMPUS_OPCOES = [
    "Campus do Itaperi: Av. Dr. Silas Munguba, 1700 - Itaperi, Fortaleza - CE",
    "Campus de Fátima: Av. Luciano Carneiro, 345 - Fátima, Fortaleza - CE",
    "Campus 25 de Março: Rua 25 de Março, 780 - Centro, Fortaleza - CE",
    "FECLESC (Quixadá): Rua José Queiroz Pessoa, 2554 - Planalto Universitário",
    "FAFIDAM (Limoeiro do Norte): Av. Dom Aureliano Matos, 2058 - Centro",
    "FACEDI (Itapipoca): Av. Monsenhor Tabosa, s/n - Coqueiros",
    "FECLI (Iguatu): Av. Dário Rabelo, s/n - Vila Santo Antônio",
    "FAEC (Crateús): Av. Gov. Beni Veras, 6217 - Veremos",
    "CECITEC (Tauá): Rua Sólon Medeiros, s/n - BR 020",
    "FECLI (Mombaça): Fazenda Amontada, s/n - Centro",
    "FECISC (Canindé): Av. Dr. Aramis Paiva, 460 - Centro",
    "FACISC (Quixeramobim): Av. Dr. Joaquim Fernandes, 382 - Centro",
    "FECIL (Aracati): Rua do Aterro, s/n",
    "CAMPUS DE PACOTI: Rua Divino Salvador, 225 - Centro",
    "Fazenda Experimental (Guaiúba): Estrada do Tamboatá, s/n - Centro"
];

interface LaboratorioFormProps {
    initialData?: any;
    onSubmit: (payload: any) => void;
    isLoading: boolean;
}

export function LaboratorioForm({ initialData, onSubmit, isLoading }: LaboratorioFormProps) {
    // Se vier do initialData, desmembra a localização e as tags para os inputs
    const baseLocalizacao = initialData?.localizacao ? initialData.localizacao.split(" | Complemento: ")[0] : "";
    const compLocalizacao = initialData?.localizacao && initialData.localizacao.includes(" | Complemento: ")
        ? initialData.localizacao.split(" | Complemento: ")[1]
        : "";

    const tagsIniciais = initialData?.tags ? initialData.tags.join(", ") : "";

    // Como o datetime-local espera o formato YYYY-MM-DDTHH:mm, precisamos limpar o :00 final se vier do BD
    const formatDateTimeForInput = (dateStr: string) => {
        if (!dateStr) return "";
        return dateStr.length === 19 ? dateStr.substring(0, 16) : dateStr;
    };

    const [formData, setFormData] = useState({
        nome: initialData?.nome || "",
        descricao: initialData?.descricao || "",
        coordenacao: initialData?.coordenacao || "",
        area: initialData?.area || "",
        email: initialData?.email || "",
        site: initialData?.site || "",
        instagram: initialData?.instagram || "",
        resolucao: initialData?.resolucao || "",
        telefone: initialData?.telefone || "",
        naturezas: initialData?.naturezas || [] as string[],
        vinculado: initialData?.vinculado || "",
        horarioAbertura: formatDateTimeForInput(initialData?.horarioAbertura),
        horarioFechamento: formatDateTimeForInput(initialData?.horarioFechamento),
        urlFoto: initialData?.urlFoto || "",
        localizacaoBase: baseLocalizacao,
        localizacaoComplemento: compLocalizacao,
        parcerias: initialData?.parcerias || "",
        infraestrutura: initialData?.infraestrutura || "",
        tagsInput: tagsIniciais,
        qtdPessoas: initialData?.qtdPessoas ?? 0,
        qtdMestrando: initialData?.qtdMestrando ?? 0,
        qtdDoutorando: initialData?.qtdDoutorando ?? 0,
        qtdPosDoc: initialData?.qtdPosDoc ?? 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value
        }));
    };

    const toggleNatureza = (natureza: string) => {
        setFormData(prev => {
            const selecionados = prev.naturezas.includes(natureza)
                ? prev.naturezas.filter((item: string) => item !== natureza)
                : [...prev.naturezas, natureza];
            return { ...prev, naturezas: selecionados };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Monta a localização e as tags
        let localizacaoFinal = formData.localizacaoBase;
        if (formData.localizacaoComplemento.trim() !== "") {
            localizacaoFinal += ` | Complemento: ${formData.localizacaoComplemento}`;
        }

        const tagsArray = formData.tagsInput
            .split(",")
            .map((tag: string) => tag.trim()) // Adicionado : string
            .filter((tag: string) => tag.length > 0); // Adicionado : string

        const formatarData = (dataStr: string) => {
            if (!dataStr) return null;
            return dataStr.length === 16 ? `${dataStr}:00` : dataStr;
        };

        const payload = {
            ...formData,
            localizacao: localizacaoFinal,
            tags: tagsArray,
            horarioAbertura: formatarData(formData.horarioAbertura),
            horarioFechamento: formatarData(formData.horarioFechamento),
        };

        // Envia para a Page
        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

                {/* IDENTIDADE */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-2 border-b pb-4">
                        <Info size={18} className="text-blue-500" />
                        <h2 className="font-bold text-gray-800 uppercase text-sm tracking-widest">Identidade do Laboratório</h2>
                    </div>

                    <div className="space-y-4">
                        <FormGroup label="Nome do Laboratório *">
                            <input type="text" name="nome" required maxLength={150} value={formData.nome} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ex: Laboratório de Pesquisa em IA" />
                        </FormGroup>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormGroup label="Coordenador(a)">
                                <input type="text" name="coordenacao" value={formData.coordenacao} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nome do responsável" />
                            </FormGroup>
                            <FormGroup label="Área de Atuação">
                                <input type="text" name="area" value={formData.area} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Ciência da Computação" />
                            </FormGroup>
                        </div>

                        <FormGroup label="Vinculação (Curso/Centro)">
                            <input type="text" name="vinculado" value={formData.vinculado} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: CCT - Centro de Ciências e Tecnologia" />
                        </FormGroup>

                        <FormGroup label="Descrição / Sobre">
                            <textarea name="descricao" rows={4} maxLength={1000} value={formData.descricao} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" placeholder="Descreva o propósito, estudos e atividades do laboratório..." />
                        </FormGroup>
                    </div>
                </section>

                {/* LOCALIZAÇÃO E CONTATOS */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-2 border-b pb-4">
                        <MapPin size={18} className="text-blue-500" />
                        <h2 className="font-bold text-gray-800 uppercase text-sm tracking-widest">Localização e Contatos</h2>
                    </div>

                    <div className="space-y-4">
                        <FormGroup label="Campus / Base *">
                            <select name="localizacaoBase" required value={formData.localizacaoBase} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                                <option value="">Selecione a unidade...</option>
                                <optgroup label="Capital">
                                    {CAMPUS_OPCOES.slice(0, 3).map(op => <option key={op} value={op}>{op}</option>)}
                                </optgroup>
                                <optgroup label="Interior e Litoral">
                                    {CAMPUS_OPCOES.slice(3, 14).map(op => <option key={op} value={op}>{op}</option>)}
                                </optgroup>
                                <optgroup label="Unidades Experimentais">
                                    <option value={CAMPUS_OPCOES[14]}>{CAMPUS_OPCOES[14]}</option>
                                </optgroup>
                            </select>
                        </FormGroup>

                        <FormGroup label="Complemento da Localização (Opcional)">
                            <input type="text" name="localizacaoComplemento" value={formData.localizacaoComplemento} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Bloco H, 2º Andar, Sala 14" />
                        </FormGroup>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormGroup label="E-mail">
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="contato@lab.uece.br" />
                            </FormGroup>
                            <FormGroup label="Telefone">
                                <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="(85) 3101-0000" />
                            </FormGroup>
                        </div>

                        <FormGroup label="Website / Link Oficial">
                            <div className="relative">
                                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="url" name="site" value={formData.site} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="https://www.uece.br/lab" />
                            </div>
                        </FormGroup>

                        <FormGroup label="Instagram">
                            <div className="relative">
                                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="url"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="https://instagram.com/seu_lab"
                                />
                            </div>
                        </FormGroup>
                    </div>
                </section>

                {/* ESTRUTURA E FOCO */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-2 border-b pb-4">
                        <Layers size={18} className="text-blue-500" />
                        <h2 className="font-bold text-gray-800 uppercase text-sm tracking-widest">Estrutura e Foco</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Natureza do Laboratório</label>
                            <div className="flex flex-wrap gap-2">
                                {NATUREZA_OPCOES.map((nat) => {
                                    const selected = formData.naturezas.includes(nat);
                                    return (
                                        <button key={nat} type="button" onClick={() => toggleNatureza(nat)} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all border flex items-center gap-2 ${selected ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-50 border-gray-100 text-gray-400 hover:border-blue-400"}`}>
                                            {selected && <Check size={14} />} {nat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormGroup label="Infraestrutura">
                                <textarea name="infraestrutura" rows={3} value={formData.infraestrutura} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Descreva equipamentos, máquinas, etc..." />
                            </FormGroup>
                            <FormGroup label="Parcerias">
                                <textarea name="parcerias" rows={3} value={formData.parcerias} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Instituições ou empresas parceiras..." />
                            </FormGroup>

                            <div className="grid grid-cols-2 gap-4">
                                <FormGroup label="Qtd. Pessoas">
                                    <input
                                        type="number"
                                        name="qtdPessoas"
                                        value={formData.qtdPessoas}
                                        onChange={handleChange}
                                        min={0}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Ex: 10"
                                    />
                                </FormGroup>

                                <FormGroup label="Qtd. Mestrandos">
                                    <input
                                        type="number"
                                        name="qtdMestrando"
                                        value={formData.qtdMestrando}
                                        onChange={handleChange}
                                        min={0}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Ex: 5"
                                    />
                                </FormGroup>

                                <FormGroup label="Qtd. Doutorandos">
                                    <input
                                        type="number"
                                        name="qtdDoutorando"
                                        value={formData.qtdDoutorando}
                                        onChange={handleChange}
                                        min={0}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Ex: 3"
                                    />
                                </FormGroup>

                                <FormGroup label="Qtd. Pós-Doc">
                                    <input
                                        type="number"
                                        name="qtdPosDoc"
                                        value={formData.qtdPosDoc}
                                        onChange={handleChange}
                                        min={0}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Ex: 2"
                                    />
                                </FormGroup>
                            </div>


                            <FormGroup label="Resolução">
                                <textarea
                                    name="resolucao"
                                    rows={3}
                                    value={formData.resolucao}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="Resolução ou normativa que rege o laboratório..."
                                />
                            </FormGroup>
                        </div>

                        <FormGroup label="Tags de Pesquisa (Separe por vírgulas)">
                            <input type="text" name="tagsInput" value={formData.tagsInput} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ex: IA, Machine Learning, Biologia Estrutural..." />
                        </FormGroup>
                    </div>
                </section>
            </div>

            {/* Coluna Lateral */}
            <div className="space-y-6">
                <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex items-center gap-2 border-b pb-3">
                        <ImageIcon size={18} className="text-blue-500" />
                        <h2 className="font-bold text-gray-800 uppercase text-xs tracking-widest">Mídia</h2>
                    </div>
                    <FormGroup label="URL da Foto do Laboratório">
                        <input type="text" name="urlFoto" value={formData.urlFoto} onChange={handleChange} className="w-full px-4 py-2.5 text-xs border-b border-gray-100 outline-none bg-transparent" placeholder="https://imgur.com/foto.jpg" />
                        {formData.urlFoto && (
                            <div className="mt-4 rounded-xl overflow-hidden aspect-video bg-gray-100 border border-gray-100">
                                <img src={formData.urlFoto} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO1HxPlq-7dE9Qk7GSDm7CvcVHhtgaS1c5pw&s'} />
                            </div>
                        )}
                    </FormGroup>
                </section>

                <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex items-center gap-2 border-b pb-3">
                        <Clock size={18} className="text-blue-500" />
                        <h2 className="font-bold text-gray-800 uppercase text-xs tracking-widest">Disponibilidade</h2>
                    </div>
                    <div className="space-y-4">
                        <FormGroup label="Horário de Abertura">
                            <input type="datetime-local" name="horarioAbertura" value={formData.horarioAbertura} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 outline-none text-sm text-gray-700" />
                        </FormGroup>
                        <FormGroup label="Horário de Fechamento">
                            <input type="datetime-local" name="horarioFechamento" value={formData.horarioFechamento} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 outline-none text-sm text-gray-700" />
                        </FormGroup>
                    </div>
                </section>

                <button type="submit" disabled={isLoading} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs border border-transparent disabled:opacity-50">
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {initialData ? "Atualizar Laboratório" : "Salvar Laboratório"}
                </button>
            </div>
        </form>
    );
}