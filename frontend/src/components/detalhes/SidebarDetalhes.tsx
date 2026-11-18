import Link from "next/link";
import {
    ArrowLeft, Mail, Phone, Globe, Download, AlignLeft, Link as LinkIcon,
    ShieldCheck, Calendar, Gamepad2, Rocket, Briefcase, Layers, User,
    Clock, MapPin, Wrench, CheckCircle2
} from "lucide-react";
import { InfoItem } from "../ui/SharedUI";

const temValor = (v: any) => v !== null && v !== undefined && v !== "" && v !== "null" && v !== "undefined";

// Cor do botão "Website / Portfólio" por artefato (tokens --modulo-* do globals.css).
// Jogos e pessoas mantêm o botão escuro neutro que já existia.
const COR_BOTAO_SITE: Record<string, string> = {
    startups: "bg-modulo-startups hover:brightness-90",
    jogos: "bg-gray-900 hover:bg-black",
    pessoas: "bg-gray-800 hover:bg-black",
    protecoes: "bg-modulo-protecoes hover:brightness-90",
    laboratorios: "bg-modulo-laboratorios hover:brightness-90",
    servicos: "bg-modulo-servicos hover:brightness-90",
};

// Botões de link da pessoa (Lattes e perfil profissional)
const COR_LINK_PESSOA = "bg-modulo-pessoas-bg text-modulo-pessoas border border-modulo-pessoas/20 hover:brightness-95";

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
                            {temValor(data.natureza) && <InfoItem icon={ShieldCheck} label="Natureza" value={data.natureza?.replace(/_/g, ' ')} colorClass="text-modulo-protecoes" />}
                            {temValor(data.dataDeposito) && <InfoItem icon={Calendar} label="Data Depósito" value={new Date(data.dataDeposito).toLocaleDateString('pt-BR')} colorClass="text-modulo-protecoes" />}
                            {data.jogoId && <InfoItem icon={Gamepad2} label="Jogo Vinculado" value={nomeJogoVinculado || `#${data.jogoId}`} colorClass="text-modulo-protecoes" />}
                        </>
                    )}
                    {entidade === 'startups' && (
                        <>
                            {temValor(data.status) && <InfoItem icon={Rocket} label="Status Atual" value={data.status} colorClass="text-modulo-startups" />}
                            {temValor(data.area) && <InfoItem icon={Briefcase} label="Área de Atuação" value={data.area} colorClass="text-modulo-startups" />}
                            {temValor(data.email) && <InfoItem icon={Mail} label="E-mail" value={data.email} colorClass="text-modulo-startups" />}
                            {temValor(data.telefone) && <InfoItem icon={Phone} label="Telefone" value={data.telefone} colorClass="text-modulo-startups" />}
                        </>
                    )}
                    {entidade === 'jogos' && (
                        <>
                            {temValor(data.genero) && <InfoItem icon={Gamepad2} label="Gênero Principal" value={data.genero} colorClass="text-modulo-jogos" />}
                            {temValor(data.plataforma) && <InfoItem icon={Layers} label="Plataforma Suportada" value={data.plataforma} colorClass="text-modulo-jogos" />}
                            {temValor(data.dataLancamento) && <InfoItem icon={Calendar} label="Data Lançamento" value={data.dataLancamento} colorClass="text-modulo-jogos" />}
                            {temValor(data.faixaEtaria) && <InfoItem icon={User} label="Faixa Etária" value={data.faixaEtaria?.replace(/_/g, ' ')} colorClass="text-modulo-jogos" />}
                        </>
                    )}
                    {entidade === 'laboratorios' && (
                        <>
                            {temValor(data.coordenacao) && <InfoItem icon={User} label="Coordenador(a)" value={data.coordenacao} colorClass="text-modulo-laboratorios" />}
                            {temValor(data.localizacao) && <InfoItem icon={MapPin} label="Localização" value={data.localizacao} colorClass="text-modulo-laboratorios" />}
                            {temValor(horario) && <InfoItem icon={Clock} label="Funcionamento" value={horario} colorClass="text-modulo-laboratorios" />}
                        </>
                    )}
                    {entidade === 'servicos' && (
                        <>
                            {temValor(data.areaAtuacao) && <InfoItem icon={Wrench} label="Área de Atuação" value={data.areaAtuacao} colorClass="text-modulo-servicos" />}
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
                        <a href={data.linkDownload} target="_blank" className="flex items-center justify-center gap-2 w-full py-4 bg-modulo-jogos text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-90 transition-all shadow-lg shadow-modulo-jogos-bg">
                            <Download size={18} /> Baixar Projeto
                        </a>
                    )}

                    {temValor(data.lattesURL) && (
                        <a href={data.lattesURL} target="_blank" className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold transition-all ${COR_LINK_PESSOA}`}>
                            <AlignLeft size={18} /> Currículo Lattes
                        </a>
                    )}

                    {temValor(data.linkD) && (
                        <a href={data.linkD} target="_blank" className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold transition-all ${COR_LINK_PESSOA}`}>
                            <LinkIcon size={18} /> Perfil Profissional
                        </a>
                    )}

                    {temValor(data.site) && (
                        <a href={data.site} target="_blank" className={`flex items-center justify-center gap-2 w-full py-3.5 text-white rounded-xl font-bold transition-all ${COR_BOTAO_SITE[entidade] ?? COR_BOTAO_SITE.servicos}`}>
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