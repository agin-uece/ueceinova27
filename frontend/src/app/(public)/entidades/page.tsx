import Link from "next/link";
import { ArrowLeft, AlignLeft } from "lucide-react";
import ImagemSegura from "@/components/imagens/ImagemSegura";
import { Tag, SectionHeader } from "@/components/ui/SharedUI";
import { SidebarDetalhes } from "@/components/detalhes/SidebarDetalhes";
import { SecaoPessoas, SecaoStartups, SecaoProtecoes, SecaoJogos, SecaoLaboratorios, SecaoServicos } from "@/components/detalhes/EntitySections";

// Esta página roda no servidor do Next (dentro do container): "localhost" seria o próprio container do front.
// Sem a variável, mantém o endereço usado no perfil prod.
const API_INTERNA = process.env.API_URL_INTERNA ?? "http://inova27-backend:8080";

async function getDetalhes(entidade: string, id: string) {
    try {
        const res = await fetch(`${API_INTERNA}/${entidade}/${id}`, { cache: "no-store" });
        return res.ok ? await res.json() : null;
    } catch (e) { return null; }
}

export default async function EntidadeDetailsPage({ searchParams }: { searchParams: Promise<{ tipo?: string; id?: string }>; }) {
    const { tipo: entidade, id } = await searchParams;
    if (!entidade || !id) return null;

    const data = await getDetalhes(entidade, id);
    if (!data) return <div className="p-20 text-center font-bold text-red-500 uppercase tracking-widest">Item não encontrado no Inova27.</div>;

    // Busca específica para nome de jogo em Proteções
    let nomeJogoVinculado = null;
    if (entidade === 'protecoes' && data.jogoId) {
        try {
            const resJogo = await fetch(`${API_INTERNA}/jogos/${data.jogoId}`, { cache: "no-store" });
            if (resJogo.ok) nomeJogoVinculado = (await resJogo.json()).nome;
        } catch (e) { console.error(e); }
    }

    // Busca específica para serviços prestados pelo Laboratório
    let servicosDoLaboratorio: any[] = [];
    if (entidade === 'laboratorios' && data.nome) {
        try {
            const resServicos = await fetch(`${API_INTERNA}/servicos`, { cache: "no-store" });
            if (resServicos.ok) {
                const todosServicos = await resServicos.json();
                const lista = Array.isArray(todosServicos) ? todosServicos : (todosServicos.content || []);
                servicosDoLaboratorio = lista.filter((s: any) =>
                    Array.isArray(s.prestadoresNomes) &&
                    s.prestadoresNomes.some(
                        (prestador: string) => prestador.trim().toLowerCase() === data.nome.trim().toLowerCase()
                    )
                );
            }
        } catch (e) { console.error(e); }
    }

    // Serviço não tem "nome": usa os prestadores, como no card da listagem
    const nomeServico = entidade === 'servicos' && data.prestadoresNomes?.length ? data.prestadoresNomes.join(", ") : null;
    const nome = data.nome || data.titulo || nomeServico || "Sem Nome";
    const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO1HxPlq-7dE9Qk7GSDm7CvcVHhtgaS1c5pw&s";
    const foto = data.urlFoto || (data.fotos?.[0]) || data.logo || defaultImage;
    const urlRetorno = `/${entidade}/pesquisar`;

    const corDestaque = entidade === 'startups' ? 'bg-red-50 text-red-600' : 
                        entidade === 'jogos' ? 'bg-orange-50 text-orange-600' : 
                        entidade === 'pessoas' ? 'bg-indigo-50 text-indigo-600' : 
                        entidade === 'protecoes' ? 'bg-purple-50 text-purple-600' : 
                        entidade === 'servicos' ? 'bg-teal-50 text-teal-600' :
                        'bg-blue-50 text-blue-600';

    return (
        <main className="min-h-screen bg-[#F8FAFC] pb-20">
            <div className="w-full bg-white border-b-2 border-gray-200">
                <div className="max-w-7xl mx-auto px-6 md:px-16 py-8 md:py-12">
                    <div className="flex flex-wrap items-center gap-3 mb-8">
                        <Link href={urlRetorno} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-all">
                            <ArrowLeft size={20} />
                        </Link>
                        <Tag>{entidade}</Tag>
                        {data.status && <Tag color="bg-red-50 text-red-600 border-red-100">{data.status}</Tag>}
                        {data.papel && <Tag color="bg-indigo-50 text-indigo-600 border-indigo-100">{data.papel.replace('_', ' ')}</Tag>}
                        {data.natureza && typeof data.natureza === 'string' && <Tag color="bg-purple-50 text-purple-700 border-purple-200">{data.natureza.replace(/_/g, ' ')}</Tag>}
                        
                        {/* RESTAURADO: Array de naturezas de laboratório */}
                        {data.naturezas?.map((nat: string) => <Tag key={nat} color="bg-blue-50 text-blue-700 border-blue-200">{nat.replace(/_/g, ' ')}</Tag>)}
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="w-32 h-32 bg-gray-50 rounded-[32px] border-2 border-gray-200 p-2 shadow-sm shrink-0 overflow-hidden">
                            <ImagemSegura src={foto} alt={nome} className="w-full h-full object-cover rounded-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2 italic uppercase">{nome}</h1>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                {data.instituicao || data.area || data.genero || data.areaAtuacao || "Projeto Inova27"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-16 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    
                    <section className="bg-white p-8 rounded-[32px] shadow-sm border-2 border-gray-200">
                        <SectionHeader title="Sobre / Resumo" icon={AlignLeft} colorClass={corDestaque} />
                        <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{data.descricao || data.resumo}</p>
                    </section>

                    {/* MÁGICA RESTAURADA */}
                    {entidade === 'pessoas' && <SecaoPessoas data={data} />}
                    {entidade === 'startups' && <SecaoStartups data={data} />}
                    {entidade === 'protecoes' && <SecaoProtecoes data={data} />}
                    {entidade === 'jogos' && <SecaoJogos data={data} />}
                    {entidade === 'laboratorios' && <SecaoLaboratorios data={data} servicos={servicosDoLaboratorio} />}
                    {entidade === 'servicos' && <SecaoServicos data={data} />}
                </div>

                <SidebarDetalhes 
                    entidade={entidade} 
                    data={data} 
                    urlRetorno={urlRetorno} 
                    nomeJogoVinculado={nomeJogoVinculado} 
                />
            </div>
        </main>
    );
}