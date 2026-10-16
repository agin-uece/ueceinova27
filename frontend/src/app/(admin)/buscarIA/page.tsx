import Image from "next/image";
import Link from "next/link";

// ==========================================
// 1. Tipagens do Backend (Mapeamento dos DTOs Java)
// ==========================================

// O que a busca semântica principal retorna
interface ResultadoBusca {
    entidade: "jogos" | "laboratorios" | "pessoas" | string;
    idOrigem: number;
    titulo: string;
    descricao: string;
    similaridade: number;
}

// DTO: JogoResponseDTO
interface Jogo {
    id: number;
    nome: string;
    descricao: string;
    genero: string;
    plataforma: string;
    dataLancamento: string; // LocalDate no Java vira string (ISO) no JSON
    linkDownload: string;
    site: string;
    linguagens: string[]; // Set<String> vira Array no JSON
    engine: string;
    protecoes: string[];
    tipoJogo: string;
    anoDesenvolvimento: string;
    estagioDesenvolvimento: string;
    urlFoto: string | null;
}

// DTO: LaboratorioResponseDTO
interface Laboratorio {
    id: number;
    nome: string;
    descricao: string;
    coordenacao: string;
    area: string;
    email: string;
    site: string;
    telefone: string;
    naturezas: string[];
    vinculado: string;
    horarioAbertura: string; // LocalDateTime vira string (ISO)
    horarioFechamento: string;
    urlFoto: string | null;
    localizacao: string;
    parcerias: string;
    infraestrutura: string;
    tags: string[];
    pessoas: string[];
}

// DTO: PessoaResponseDTO
interface Pessoa {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    areaPesquisa: string;
    titulacao: string;
    instituicao: string;
    papel: string;
    site: string;
    lattesURL: string;
    linkD: string;
    curso: string;
    descricao: string;
    anoFormacao: string;
    urlFoto: string | null;
    laboratorio: string;
    protecoes: string[];
    startups: string[];
    matricula: string;
}

// O detalhe pode ser QUALQUER UMA das três entidades
type DetalhesEntidade = Jogo | Laboratorio | Pessoa;

// O objeto final que junta a busca + detalhes
interface ResultadoCompleto extends ResultadoBusca {
    detalhes: DetalhesEntidade | null;
}

// ==========================================
// 2. Funções de Chamada (Fetch)
// ==========================================

async function fetchResultadosBusca(query: string): Promise<ResultadoBusca[]> {
    try {
        const res = await fetch(`http://inova27-backend:8080/busca?q=${query}`, {
            cache: "no-store",
        });
        if (!res.ok) return [];

        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Erro na busca inicial:", error);
        return [];
    }
}

async function fetchDetalhes(entidade: string, id: number): Promise<DetalhesEntidade | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${entidade}/${id}`, {
            cache: "no-store",
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error(`Erro ao buscar detalhes de ${entidade}/${id}:`, error);
        return null;
    }
}

// ==========================================
// 3. Componente da Página Principal (Async)
// ==========================================
export default async function buscaSemanticaPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const resolvedParams = await searchParams;
    const query = resolvedParams.q || "";

    if (!query) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-gray-500">Por favor, digite um termo para buscar.</p>
            </div>
        );
    }

    const resultadosBase = await fetchResultadosBusca(query);

    const resultadosCompletos: ResultadoCompleto[] = await Promise.all(
        resultadosBase.slice(0, 4).map(async (item) => {
            const detalhes = await fetchDetalhes(item.entidade, item.idOrigem);
            return { ...item, detalhes };
        })
    );

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Esses são os resultados da sua busca.
                    </h1>
                    <p className="text-gray-600">
                        Mostrando resultados para: <span className="font-semibold italic">"{query}"</span>
                    </p>
                </div>

                {resultadosCompletos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {resultadosCompletos.map((resultado, index) => {

                            // Como Jogos, Laboratorios e Pessoas têm 'urlFoto', o TS e o JS conseguem acessar!
                            const foto = resultado.detalhes?.urlFoto || "/imagens/purple.jpg";
                            const linkDestino = `/entidades?tipo=${resultado.entidade}&id=${resultado.idOrigem}`;

                            // Mapeando cores/tags por entidade para ficar visualmente bonito
                            const corTag =
                                resultado.entidade === "jogos" ? "bg-purple-500" :
                                    resultado.entidade === "laboratorios" ? "bg-blue-500" :
                                        "bg-green-500"; // pessoas

                            return (
                                <div
                                    key={`${resultado.entidade}-${resultado.idOrigem}-${index}`}
                                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 relative"
                                >
                                    {/* Tag da Entidade */}
                                    <span className={`absolute top-3 left-3 ${corTag} text-white text-xs font-bold px-3 py-1 rounded-full z-10 uppercase tracking-wider`}>
                                        {resultado.entidade}
                                    </span>

                                    <div className="relative h-48 w-full bg-gray-200">
                                        <img
                                            src={foto}
                                            alt={resultado.titulo}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                                            {resultado.titulo}
                                        </h2>

                                        <p className="text-sm text-gray-600 mb-6 flex-1 line-clamp-4">
                                            {resultado.descricao}
                                        </p>

                                        <Link
                                            href={linkDestino}
                                            className="mt-auto block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                                        >
                                            Ver Detalhes
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">Nenhum resultado encontrado para "{query}".</p>
                    </div>
                )}
            </div>
        </main>
    );
}