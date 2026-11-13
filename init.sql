-- 1. Garante que a extensão existe
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Cria a tabela exatamente como o seu Entity espera
CREATE TABLE IF NOT EXISTS busca_semantica (
    id BIGSERIAL PRIMARY KEY,
    entidade VARCHAR(255),
    id_origem BIGINT,
    titulo VARCHAR(500),
    descricao TEXT,
    texto_completo TEXT,
    embedding vector(1024),
    CONSTRAINT uk_busca_semantica_entidade_origem UNIQUE (entidade, id_origem)
);