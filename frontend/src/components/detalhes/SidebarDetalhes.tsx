import Link from "next/link";
import {
    ArrowLeft, Mail, Phone, Globe, Download, AlignLeft, Link as LinkIcon,
    ShieldCheck, Calendar, Gamepad2, Rocket, Briefcase, Layers, User,
    Clock, MapPin, Wrench, CheckCircle2
} from "lucide-react";
import { InfoItem } from "../ui/SharedUI";

const temValor = (v: any) => v !== null && v !== undefined && v !== "" && v !== "null" && v !== "undefined";

interface SidebarProps {
    entidade: string;
    data: any;
    urlRetorno: string;
    nomeJogoVinculado?: string | null;
}

export const SidebarDetalhes = ({ entidade, data, urlRetorno, nomeJogoVinculado }: SidebarProps) => {
    const getHorario = () => {
        if (data.horarioAbertura && data.horarioFechamento) {
            return `${data.horarioAbertura.split('T')[1]?.substring(0, 5)} às ${data.horarioFechamento.split('T')[1]?.substring(0, 5)}`;
        }
        return null;
    };

    const horario = getHorario();

    const temResumoGeral =
        (entidade === 'protecoes' && (temValor(data.natureza) || temValor(data.dataDeposito) || data.jogoId)) ||
        (entidade === 'startups' && (temValor(data.status) || temValor(data.area) || temValor(data.email) || temValor(data.telefone))) ||
        (entidade === 'jogos' && (temValor(data.genero) || temValor(data.plataforma) || temValor(data.dataLancamento) || temValor(data.faixaEtaria))) ||
        (entidade === 'laboratorios' && (temValor(data.coordenacao) || temValor(data.localizacao) || temValor(horario))) ||
        (entidade === 'servicos' && temValor(data.areaAtuacao));

    const temContatos = temValor(data.linkDownload) || temValor(data.lattesURL) || temValor(data.linkD) ||
        temValor(data.site) || temValor(data.email) || temValor(data.telefone) || temValor(data.contato) || temValor(data.instagram);

    return (
        <div className="space-y-6">
            {entidade !== 'pessoas' && temResumoGeral && (
                <div className="bg-white p-6 rounded-[32px] shadow-sm border-2 border-gray-200 space-y-2">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 px-2">Resumo Geral</h3>

                    {entidade === 'protecoes' && (
                        <>
                            {temValor(data.natureza) && <InfoItem icon={ShieldCheck} label="Natureza" value={data.natureza?.replace(/_/g, ' ')} colorClass="text-purple-600" />}
                            {temValor(data.dataDeposito) && <InfoItem icon={Calendar} label="Data Depósito" value={new Date(data.dataDeposito).toLocaleDateString('pt-BR')} colorClass="text-purple-600" />}
                            {data.jogoId && <InfoItem icon={Gamepad2} label="Jogo Vinculado" value={nomeJogoVinculado || `#${data.jogoId}`} colorClass="text-purple-600" />}
                        </>
                    )}
                    {entidade === 'startups' && (
                        <>
                            {temValor(data.status) && <InfoItem icon={Rocket} label="Status Atual" value={data.status} colorClass="text-red-600" />}
                            {temValor(data.area) && <InfoItem icon={Briefcase} label="Área de Atuação" value={data.area} colorClass="text-red-600" />}
                            {temValor(data.email) && <InfoItem icon={Mail} label="E-mail" value={data.email} colorClass="text-red-600" />}
                            {temValor(data.telefone) && <InfoItem icon={Phone} label="Telefone" value={data.telefone} colorClass="text-red-600" />}
                        </>
                    )}
                    {entidade === 'jogos' && (
                        <>
                            {temValor(data.genero) && <InfoItem icon={Gamepad2} label="Gênero Principal" value={data.genero} colorClass="text-orange-600" />}
                            {temValor(data.plataforma) && <InfoItem icon={Layers} label="Plataforma Suportada" value={data.plataforma} colorClass="text-orange-600" />}
                            {temValor(data.dataLancamento) && <InfoItem icon={Calendar} label="Data Lançamento" value={data.dataLancamento} colorClass="text-orange-600" />}
                            {temValor(data.faixaEtaria) && <InfoItem icon={User} label="Faixa Etária" value={data.faixaEtaria?.replace(/_/g, ' ')} colorClass="text-orange-600" />}
                        </>
                    )}
                    {entidade === 'laboratorios' && (
                        <>
                            {temValor(data.coordenacao) && <InfoItem icon={User} label="Coordenador(a)" value={data.coordenacao} colorClass="text-blue-600" />}
                            {temValor(data.localizacao) && <InfoItem icon={MapPin} label="Localização" value={data.localizacao} colorClass="text-blue-600" />}
                            {temValor(horario) && <InfoItem icon={Clock} label="Funcionamento" value={horario} colorClass="text-blue-600" />}
                        </>
                    )}
                    {entidade === 'servicos' && (
                        <>
                            {temValor(data.areaAtuacao) && <InfoItem icon={Wrench} label="Área de Atuação" value={data.areaAtuacao} colorClass="text-teal-600" />}
                        </>
                    )}
                </div>
            )}

            {temContatos && (
                <div className="bg-white p-6 rounded-[32px] shadow-sm border-2 border-gray-200 space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 px-2">Canais de Contato</h3>

                    {temValor(data.contato) && entidade !== 'servicos' && (
                        <InfoItem icon={User} label="Pessoa de Contato" value={data.contato} colorClass="text-gray-500" />
                    )}

                    {entidade === 'jogos' && temValor(data.linkDownload) && (
                        <a href={data.linkDownload} target="_blank" className="flex items-center justify-center gap-2 w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-orange-100">
                            <Download size={18} /> Baixar Projeto
                        </a>
                    )}

                    {temValor(data.lattesURL) && (
                        <a href={data.lattesURL} target="_blank" className="flex items-center justify-center gap-2 w-full py-3.5 bg-indigo-50 text-indigo-700 rounded-xl font-bold border border-indigo-100 hover:bg-indigo-100 transition-all">
                            <AlignLeft size={18} /> Currículo Lattes
                        </a>
                    )}

                    {temValor(data.linkD) && (
                        <a href={data.linkD} target="_blank" className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-50 text-blue-700 rounded-xl font-bold border border-blue-100 hover:bg-blue-100 transition-all">
                            <LinkIcon size={18} /> Perfil Profissional
                        </a>
                    )}

                    {temValor(data.site) && (
                        <a href={data.site} target="_blank" className={`flex items-center justify-center gap-2 w-full py-3.5 text-white rounded-xl font-bold transition-all ${entidade === 'startups' ? 'bg-red-600 hover:bg-red-700' :
                            entidade === 'jogos' ? 'bg-gray-900 hover:bg-black' :
                                entidade === 'pessoas' ? 'bg-gray-800 hover:bg-black' :
                                    entidade === 'protecoes' ? 'bg-purple-600 hover:bg-purple-700' :
                                        entidade === 'laboratorios' ? 'bg-blue-600 hover:bg-blue-700' :
                                            'bg-teal-600 hover:bg-teal-700'
                            }`}>
                            <Globe size={18} /> Website / Portfólio

                        </a>


                    )}

                    {temValor(data.instagram) && (
                        <a href={data.instagram} target="_blank" className="flex items-center justify-center gap-2 w-full py-3.5 bg-pink-50 text-pink-700 rounded-xl font-bold border border-pink-100 hover:bg-pink-100 transition-all">
                            <Globe size={18} /> Instagram
                        </a>
                    )}



                    {temValor(data.email) && !['startups', 'servicos'].includes(entidade) && (
                        <InfoItem icon={Mail} label="E-mail" value={data.email} colorClass="text-gray-500" />
                    )}

                    {temValor(data.telefone) && !['startups', 'servicos'].includes(entidade) && (
                        <InfoItem icon={Phone} label="Telefone" value={data.telefone} colorClass="text-gray-500" />
                    )}
                </div>
            )}

            <Link href={urlRetorno} className="flex items-center justify-center gap-2 w-full py-4 bg-white border-2 border-gray-200 text-gray-500 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all">
                <ArrowLeft size={16} /> Ver todas as {entidade}
            </Link>
        </div>
    );
};