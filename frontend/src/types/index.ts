// Tipagem Genérica de Paginação do Spring Boot
export interface SpringPageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

// Tipagem Específica da Startup
export interface Startup {
    id?: number;
    nome: string;
    descricao: string;
    area: string;
    dataFundacao: string;
    site: string;
    email: string;
    telefone: string;
    logo: string;
    status: "INCUBADA" | "ASSOCIADA" | "INTEGRADA";
    fotos: string[];
}

// ... (tipagens anteriores de Startup)

export interface Servico {
    id: number;
    prestadoresNomes: string[];
    areaAtuacao: string;
    descricao: string;
    contato: string;
    email: string;
    telefone: string;
    urlFoto?: string | null;
}

export interface PessoaPrestador {
    id: number;
    nome: string;
}

// ... outras tipagens

export interface Protecao {
    id?: number;
    nome: string;
    resumo: string;
    instituicao: string;
    natureza: string;
    tipos: string[];
    dataDeposito: string;
    infoExtra: string;
    area: string;
    nivelMaturidade: string;
    aplicacao: string;
    status: string;
    titular: string;
    diferencialTecnologico: string;
    numeroProtocolo: string;
    jogoId: string | number | null;
    inventores?: string[];
    codId?: string;
}

// ... outras tipagens

export interface Pessoa {
    id?: number;
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
    urlFoto: string;
    matricula: string;
    laboratorioId?: number | string;
    startupIds?: number[];
    protecaoIds?: number[];
}

// Interface genérica útil para os autocompletes
export interface EntidadeBasica {
    id: number;
    nome: string;
}

// ... outras tipagens

export interface Laboratorio {
    id: number;
    nome: string;
    descricao: string;
    coordenacao: string;
    area: string;
    urlFoto: string | null;
    naturezas: string[];
    status?: string;
}

export interface Jogo {
    id: number;
    nome: string;
    descricao: string;
    genero: string;
    tipoJogo?: string;
    faixaEtaria?: string;
    plataforma: string;
    urlFoto: string | null;
    engine: string;
    status?: string;
}

// Interfaces para os auxiliares (Engines e Linguagens)
export interface Engine {
    id: number;
    nome: string;
}

export interface Linguagem {
    id: number;
    nome: string;
}

// Adicione à interface Jogo ou crie uma nova para o formulário
export interface JogoFormData {
    nome: string;
    descricao: string;
    genero: string;
    plataforma: string;
    dataLancamento: string;
    linkDownload: string;
    site: string;
    engineId: string | number;
    linguagensIds: number[];
    tipoJogo: string;
    anoDesenvolvimento: string;
    estagioDesenvolvimento: string;
    urlFoto: string;
    faixaEtaria?: string;
}

