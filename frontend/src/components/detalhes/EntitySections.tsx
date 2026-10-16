import {
    GraduationCap, Briefcase, Building2, Calendar, Hash, Rocket,
    CalendarDays, ImageIcon, ShieldCheck, Lightbulb, Cpu,
    Layers3, User, Code2, Users, Network, TestTube, Tags, Wrench, Handshake, AtSign,
    Beaker, Mail, Phone, CheckCircle2
} from "lucide-react";
import { InfoItem, SectionHeader, Tag } from "../ui/SharedUI";
import ImagemSegura from "@/components/imagens/ImagemSegura";

// Helper: retorna true se o valor é considerado vazio
const temValor = (v: any) => v !== null && v !== undefined && v !== "" && v !== "null" && v !== "undefined";

export const SecaoPessoas = ({ data }: { data: any }) => {
    const temDadosAcademicos = temValor(data.areaPesquisa) || temValor(data.titulacao) || temValor(data.instituicao) ||
        temValor(data.anoFormacao) || temValor(data.curso) || temValor(data.matricula) || temValor(data.laboratorio);

    return (
        <div className="space-y-10">
            {temDadosAcademicos && (
                <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200">
                    <SectionHeader title="Trajetória Acadêmica & Profissional" icon={GraduationCap} colorClass="bg-indigo-50 text-indigo-600" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {temValor(data.areaPesquisa) && <InfoItem icon={Briefcase} label="Área de Pesquisa" value={data.areaPesquisa} colorClass="text-indigo-600" />}
                        {temValor(data.titulacao) && <InfoItem icon={GraduationCap} label="Titulação" value={data.titulacao} colorClass="text-indigo-600" />}
                        {temValor(data.instituicao) && <InfoItem icon={Building2} label="Instituição" value={data.instituicao} colorClass="text-indigo-600" />}
                        {temValor(data.anoFormacao) && <InfoItem icon={Calendar} label="Ano de Formação" value={data.anoFormacao} colorClass="text-indigo-600" />}
                        {temValor(data.curso) && <InfoItem icon={Hash} label="Curso / Departamento" value={data.curso} colorClass="text-indigo-600" />}
                        {temValor(data.matricula) && <InfoItem icon={Hash} label="Matrícula" value={data.matricula} colorClass="text-indigo-600" />}
                        {temValor(data.laboratorio) && <InfoItem icon={Beaker} label="Laboratório Principal" value={data.laboratorio} colorClass="text-indigo-600" />}
                    </div>
                </section>
            )}

            {(data.startups?.length > 0 || data.protecoes?.length > 0 || data.servicos?.length > 0) && (
                <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200 space-y-6">
                    <SectionHeader title="Atividades no Ecossistema" icon={Network} colorClass="bg-indigo-50 text-indigo-600" />
                    {data.startups?.length > 0 && (
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase mb-3 tracking-widest">Startups Vinculadas</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.startups.map((s: string) => <Tag key={s} color="bg-red-50 text-red-700 border-red-200"><Rocket size={12} className="inline mr-1" />{s}</Tag>)}
                            </div>
                        </div>
                    )}
                    {data.protecoes?.length > 0 && (
                        <div className="pt-2">
                            <h3 className="text-xs font-black text-gray-400 uppercase mb-3 tracking-widest">Propriedade Intelectual</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.protecoes.map((p: string) => <Tag key={p} color="bg-purple-50 text-purple-700 border-purple-200"><ShieldCheck size={12} className="inline mr-1" />{p}</Tag>)}
                            </div>
                        </div>
                    )}
                    {data.servicos?.length > 0 && (
                        <div className="pt-2">
                            <h3 className="text-xs font-black text-gray-400 uppercase mb-3 tracking-widest">Serviços que Oferece</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.servicos.map((s: string) => <Tag key={s} color="bg-teal-50 text-teal-700 border-teal-200"><Wrench size={12} className="inline mr-1" />{s}</Tag>)}
                            </div>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export const SecaoStartups = ({ data }: { data: any }) => {
    const temDadosNegocio = temValor(data.area) || temValor(data.dataFundacao) || temValor(data.email) || temValor(data.telefone) || temValor(data.cnpj) || temValor(data.instagram);

    return (
        <div className="space-y-10">
            {temDadosNegocio && (
                <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200">
                    <SectionHeader title="Dados do Negócio" icon={Rocket} colorClass="bg-red-50 text-red-600" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {temValor(data.cnpj) && <InfoItem icon={Hash} label="CNPJ" value={data.cnpj} colorClass="text-red-600" />}
                        {temValor(data.area) && <InfoItem icon={Briefcase} label="Setor / Área" value={data.area} colorClass="text-red-600" />}
                        {temValor(data.dataFundacao) && <InfoItem icon={CalendarDays} label="Data de Fundação" value={new Date(data.dataFundacao).toLocaleDateString('pt-BR')} colorClass="text-red-600" />}
                        {temValor(data.email) && <InfoItem icon={Mail} label="E-mail" value={data.email} colorClass="text-red-600" />}
                        {temValor(data.telefone) && <InfoItem icon={Phone} label="Telefone" value={data.telefone} colorClass="text-red-600" />}
                        {temValor(data.instagram) && <InfoItem icon={AtSign} label="Instagram" value={data.instagram} colorClass="text-red-600" />}
                    </div>
                </section>
            )}

            {data.pessoas?.length > 0 && (
                <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200">
                    <SectionHeader title="Equipe Responsável" icon={Users} colorClass="bg-red-50 text-red-600" />
                    <div className="flex flex-wrap gap-2">
                        {data.pessoas.map((pessoa: string) => (
                            <Tag key={pessoa} color="bg-gray-50 text-gray-700 border-gray-200">
                                <User size={12} className="inline mr-1" />
                                {pessoa}
                            </Tag>
                        ))}
                    </div>
                </section>
            )}

            {data.fotos?.length > 0 && (
                <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200">
                    <SectionHeader title="Galeria" icon={ImageIcon} colorClass="bg-red-50 text-red-600" />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {data.fotos.map((url: string, i: number) => (
                            <div key={i} className="aspect-video rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm">
                                <ImagemSegura src={url} alt={`Foto ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export const SecaoProtecoes = ({ data }: { data: any }) => {
    const temDadosRegistro = temValor(data.titular) || temValor(data.instituicao) || temValor(data.numeroProtocolo) || temValor(data.codId) || temValor(data.status);
    const temInfoTecnicas = temValor(data.area) || temValor(data.aplicacao) || temValor(data.nivelMaturidade) || temValor(data.diferencialTecnologico) || temValor(data.infoExtra) || data.tipos?.length > 0;

    return (
        <div className="space-y-10">
            {temDadosRegistro && (
                <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200">
                    <SectionHeader title="Dados do Registro" icon={ShieldCheck} colorClass="bg-purple-50 text-purple-600" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {temValor(data.titular) && <InfoItem icon={Building2} label="Titular" value={data.titular} colorClass="text-purple-600" />}
                        {temValor(data.instituicao) && <InfoItem icon={Building2} label="Instituição" value={data.instituicao} colorClass="text-purple-600" />}
                        {temValor(data.numeroProtocolo) && <InfoItem icon={Hash} label="Nº Protocolo" value={data.numeroProtocolo} colorClass="text-purple-600" />}
                        {temValor(data.codId) && <InfoItem icon={Hash} label="Código ID" value={data.codId} colorClass="text-purple-600" />}
                        {temValor(data.status) && <InfoItem icon={CheckCircle2} label="Status" value={data.status} colorClass="text-purple-600" />}
                    </div>
                </section>
            )}

            {temInfoTecnicas && (
                <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200">
                    <SectionHeader title="Informações Técnicas" icon={Lightbulb} colorClass="bg-purple-50 text-purple-600" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(temValor(data.area) || temValor(data.aplicacao)) && (
                            <div>
                                <h3 className="text-xs font-black text-gray-400 uppercase mb-1 tracking-widest">Área / Aplicação</h3>
                                <p className="text-gray-800 text-sm font-medium">
                                    {data.area}
                                    {temValor(data.area) && temValor(data.aplicacao) && <span className="text-gray-400 font-normal"> / </span>}
                                    {temValor(data.aplicacao) && <span className="text-gray-400 font-normal">{data.aplicacao}</span>}
                                </p>
                            </div>
                        )}
                        {temValor(data.nivelMaturidade) && (
                            <div>
                                <h3 className="text-xs font-black text-gray-400 uppercase mb-1 tracking-widest">Nível de Maturidade</h3>
                                <p className="text-gray-800 text-sm font-medium">{data.nivelMaturidade}</p>
                            </div>
                        )}
                        {temValor(data.diferencialTecnologico) && (
                            <div className="col-span-1 md:col-span-2 mt-2">
                                <h3 className="text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Diferencial Tecnológico</h3>
                                <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl text-sm text-gray-700">
                                    {data.diferencialTecnologico}
                                </div>
                            </div>
                        )}
                        {temValor(data.infoExtra) && (
                            <div className="col-span-1 md:col-span-2 mt-2">
                                <h3 className="text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Informações Adicionais</h3>
                                <p className="text-sm text-gray-600">{data.infoExtra}</p>
                            </div>
                        )}
                    </div>
                    {data.tipos?.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase mb-3 tracking-widest">Classificação PI</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.tipos.map((t: string) => <Tag key={t} color="bg-purple-50 text-purple-700 border-purple-200">{t.replace(/_/g, ' ')}</Tag>)}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {data.inventores?.length > 0 && (
                <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200">
                    <SectionHeader title="Equipe de Inventores" icon={Users} colorClass="bg-purple-50 text-purple-600" />
                    <div className="flex flex-wrap gap-2">
                        {data.inventores.map((inv: string) => <Tag key={inv} color="bg-gray-50 text-gray-700 border-gray-200">{inv}</Tag>)}
                    </div>
                </section>
            )}
        </div>
    );
};

export const SecaoJogos = ({ data }: { data: any }) => {
    const temFichaTecnica = temValor(data.engine) || temValor(data.anoDesenvolvimento) || temValor(data.tipoJogo) ||
        temValor(data.estagioDesenvolvimento) || temValor(data.faixaEtaria);
    const temStack = data.linguagens?.length > 0 || data.protecoes?.length > 0;

    return (
        <div className="space-y-10">
            {temFichaTecnica && (
                <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200">
                    <SectionHeader title="Ficha Técnica" icon={Cpu} colorClass="bg-orange-50 text-orange-600" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {temValor(data.engine) && <InfoItem icon={Rocket} label="Engine / Motor" value={data.engine} colorClass="text-orange-600" />}
                        {temValor(data.anoDesenvolvimento) && <InfoItem icon={Calendar} label="Ano do Projeto" value={data.anoDesenvolvimento} colorClass="text-orange-600" />}
                        {temValor(data.tipoJogo) && <InfoItem icon={Layers3} label="Tipo de Experiência" value={data.tipoJogo?.replace(/_/g, ' ')} colorClass="text-orange-600" />}
                        {temValor(data.estagioDesenvolvimento) && <InfoItem icon={Rocket} label="Estágio Atual" value={data.estagioDesenvolvimento?.replace(/_/g, ' ')} colorClass="text-orange-600" />}
                        {temValor(data.faixaEtaria) && <InfoItem icon={User} label="Faixa Etária" value={data.faixaEtaria?.replace(/_/g, ' ')} colorClass="text-orange-600" />}
                    </div>
                </section>
            )}

            {data.criadores?.length > 0 && (
                <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200">
                    <SectionHeader title="Criadores" icon={Users} colorClass="bg-orange-50 text-orange-600" />
                    <div className="flex flex-wrap gap-2">
                        {data.criadores.map((c: string) => (
                            <Tag key={c} color="bg-orange-50 text-orange-700 border-orange-100">
                                <User size={12} className="inline mr-1" />{c}
                            </Tag>
                        ))}
                    </div>
                </section>
            )}

            {temStack && (
                <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200">
                    <SectionHeader title="Stack e Propriedade Intelectual" icon={Code2} colorClass="bg-orange-50 text-orange-600" />
                    {data.linguagens?.length > 0 && (
                        <div className="mb-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Linguagens</p>
                            <div className="flex flex-wrap gap-2">
                                {data.linguagens.map((l: string) => <Tag key={l} color="bg-orange-50 text-orange-700 border-orange-100">{l}</Tag>)}
                            </div>
                        </div>
                    )}
                    {data.protecoes?.length > 0 && (
                        <div className={data.linguagens?.length > 0 ? "pt-4 border-t border-gray-100" : ""}>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Proteções Vinculadas</p>
                            <div className="flex flex-wrap gap-2">
                                {data.protecoes.map((p: string) => <Tag key={p} color="bg-purple-50 text-purple-700 border-purple-200"><ShieldCheck size={12} className="inline mr-1" />{p}</Tag>)}
                            </div>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export const SecaoLaboratorios = ({ data }: { data: any }) => {
    const temClassificacao =
        temValor(data.area) ||
        temValor(data.vinculado) ||
        data.qtdPessoas > 0 ||
        data.qtdMestrando > 0 ||
        data.qtdDoutorando > 0 ||
        data.qtdPosDoc > 0;

    return (
        <div className="space-y-10">
            {temClassificacao && (
                <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200">
                    <SectionHeader title="Classificação Institucional" icon={TestTube} colorClass="bg-blue-50 text-blue-600" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {temValor(data.area) && <InfoItem icon={TestTube} label="Área de Atuação" value={data.area} colorClass="text-blue-600" />}
                        {temValor(data.vinculado) && <InfoItem icon={Building2} label="Unidade Vinculada" value={data.vinculado} colorClass="text-blue-600" />}
                        {data.qtdPessoas > 0 && (
                            <InfoItem
                                icon={Users}
                                label="Qtd. Pessoas"
                                value={data.qtdPessoas}
                                colorClass="text-blue-600"
                            />
                        )}

                        {data.qtdMestrando > 0 && (
                            <InfoItem
                                icon={GraduationCap}
                                label="Mestrandos"
                                value={data.qtdMestrando}
                                colorClass="text-blue-600"
                            />
                        )}

                        {data.qtdDoutorando > 0 && (
                            <InfoItem
                                icon={GraduationCap}
                                label="Doutorandos"
                                value={data.qtdDoutorando}
                                colorClass="text-blue-600"
                            />
                        )}

                        {data.qtdPosDoc > 0 && (
                            <InfoItem
                                icon={Beaker}
                                label="Pós-Doutorandos"
                                value={data.qtdPosDoc}
                                colorClass="text-blue-600"
                            />
                        )}
                    </div>
                </section>
            )}

            {(temValor(data.resolucao) || temValor(data.parcerias) || temValor(data.infraestrutura) || data.tags?.length > 0) && (<section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200">
                <SectionHeader title="Estrutura e Rede" icon={Network} colorClass="bg-blue-50 text-blue-600" />
                <div className="space-y-4">
                    {temValor(data.resolucao) && (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Resolução</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.resolucao}</p>
                        </div>
                    )}
                    {temValor(data.parcerias) && (
                        <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-50">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Handshake size={14} /> Parcerias</p>
                            <p className="text-sm text-gray-700">{data.parcerias}</p>
                        </div>
                    )}
                    {temValor(data.infraestrutura) && (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Building2 size={14} /> Infraestrutura</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.infraestrutura}</p>
                        </div>
                    )}
                    {data.tags?.length > 0 && (
                        <div className="pt-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Tags size={14} /> Tags de Pesquisa</p>
                            <div className="flex flex-wrap gap-2">
                                {data.tags.map((t: string) => <Tag key={t} color="bg-gray-100 text-gray-600 border-gray-200">{t}</Tag>)}
                            </div>
                        </div>
                    )}
                </div>
            </section>
            )}

            {data.pessoas?.length > 0 && (
                <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200">
                    <SectionHeader title="Membros do Laboratório" icon={Users} colorClass="bg-blue-50 text-blue-600" />
                    <div className="flex flex-wrap gap-2">
                        {data.pessoas.map((pessoa: string) => <Tag key={pessoa} color="bg-blue-50 text-blue-700 border-blue-100">{pessoa}</Tag>)}
                    </div>
                </section>
            )}
        </div>
    );
};

export const SecaoServicos = ({ data }: { data: any }) => (
    <div className="space-y-10">
        {data.prestadoresNomes?.length > 0 && (
            <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200">
                <SectionHeader title="Responsáveis pelo Serviço" icon={Users} colorClass="bg-teal-50 text-teal-600" />
                <div className="flex flex-wrap gap-2">
                    {data.prestadoresNomes.map((nome: string) => (
                        <Tag key={nome} color="bg-teal-50 text-teal-700 border-teal-200"><User size={12} className="inline mr-1" />{nome}</Tag>
                    ))}
                </div>
            </section>
        )}

        {(temValor(data.contato) || temValor(data.email) || temValor(data.telefone)) && (
            <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200">
                <SectionHeader title="Contato do Serviço" icon={Mail} colorClass="bg-teal-50 text-teal-600" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {temValor(data.contato) && <InfoItem icon={User} label="Pessoa de Contato" value={data.contato} colorClass="text-teal-600" />}
                    {temValor(data.email) && <InfoItem icon={Mail} label="E-mail" value={data.email} colorClass="text-teal-600" />}
                    {temValor(data.telefone) && <InfoItem icon={Phone} label="Telefone" value={data.telefone} colorClass="text-teal-600" />}
                </div>
            </section>
        )}
    </div>
);