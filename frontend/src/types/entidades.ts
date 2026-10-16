export interface Jogo {
    id: number; nome: string; descricao: string; genero: string; plataforma: string;
    dataLancamento: string; linkDownload: string; site: string;
    linguagens: string[]; engine: string; protecoes: string[];
    tipoJogo: string; anoDesenvolvimento: string; estagioDesenvolvimento: string; 
    faixaEtaria?: string; urlFoto: string | null; status: string;
}

export interface Laboratorio {
    id: number; nome: string; descricao: string; coordenacao: string; area: string;
    email: string; site: string; telefone: string; naturezas: string[];
    vinculado: string; horarioAbertura: string; horarioFechamento: string;
    urlFoto: string | null; localizacao: string; parcerias: string;
    infraestrutura: string; tags: string[]; pessoas: string[];
}

export interface Startup {
    id: number; nome: string; descricao: string; area: string;
    dataFundacao: string; site: string; email: string; telefone: string;
    logo: string; status: string; fotos: string[]; pessoas: string[];
}

export interface Pessoa {
    id: number; nome: string; email: string; telefone: string;
    areaPesquisa: string; titulacao: string; instituicao: string;
    papel: string; site: string; lattesURL: string; linkD: string;
    curso: string; descricao: string; anoFormacao: string;
    urlFoto: string | null; laboratorio: string; matricula: string;
    protecoes: string[]; startups: string[]; servicos: string[];
}

export interface Protecao {
    id: number; codId: string; nome: string; resumo: string;
    instituicao: string; natureza: string; dataDeposito: string;
    infoExtra: string; tipos: string[]; area: string;
    nivelMaturidade: string; aplicacao: string; status: string;
    jogoId: number | null; inventores: string[]; titular: string;
    diferencialTecnologico: string; numeroProtocolo: string;
}