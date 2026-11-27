package com.inova27.app.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSchemaFixRunner implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(ApplicationArguments args) {
        // Usada pelas buscas (TextoBuscaUtils / BuscaSemanticaRepository). O init.sql só roda em volume novo,
        // então bancos já existentes ganham a extensão aqui. É "trusted": basta permissão CREATE no banco.
        try {
            jdbcTemplate.execute("CREATE EXTENSION IF NOT EXISTS unaccent");
        } catch (Exception e) {
            log.error("Não foi possível criar a extensão 'unaccent'; as buscas por texto vão falhar até ela existir: {}",
                    e.getMessage());
        }

        try {
            jdbcTemplate.execute("""
                ALTER TABLE IF EXISTS laboratorios
                    ALTER COLUMN horario_abertura TYPE TIME USING horario_abertura::TIME,
                    ALTER COLUMN horario_fechamento TYPE TIME USING horario_fechamento::TIME;
            """);
            log.info("Verificação/ajuste de colunas de horário em 'laboratorios' concluída.");
        } catch (Exception e) {
            log.warn("Aviso ao verificar colunas de 'laboratorios': {}", e.getMessage());
        }

        try {
            jdbcTemplate.execute(MIGRACAO_INCUBACAO_E_CURSO_CENTRO);
            log.info("Verificação/migração de incubações (startups) e curso/centro (laboratórios) concluída.");
        } catch (Exception e) {
            log.error("Falha na migração de incubações e curso/centro; nada foi alterado: {}", e.getMessage());
        }

        try {
            jdbcTemplate.execute("""
                ALTER TABLE IF EXISTS busca_semantica
                    ADD COLUMN IF NOT EXISTS indexado BOOLEAN NOT NULL DEFAULT TRUE;
            """);
            log.info("Verificação/ajuste da coluna 'indexado' em 'busca_semantica' concluída.");
        } catch (Exception e) {
            log.warn("Aviso ao verificar coluna 'indexado' em 'busca_semantica': {}", e.getMessage());
        }
    }

    /*
     * Um único bloco: roda inteiro ou não roda (atômico) e pode ser executado a cada subida (idempotente).
     * As tabelas e colunas novas já existem aqui, porque o ddl-auto roda antes dos ApplicationRunner.
     * 1. Cria as incubações iniciais só com a tabela vazia, para não recriar uma que o admin excluiu.
     * 2. Liga as startups ao tipo correspondente ao antigo enum "status" e apaga a coluna.
     * 3. Copia o antigo "vinculado" dos laboratórios para "centro" e apaga a coluna.
     * Em 2 e 3, as solicitações de alteração pendentes têm o JSON ajustado: o ObjectMapper falha com
     * propriedade desconhecida e a aprovação quebraria. "x - 'chave' <> x" testa se a chave existe
     * (o operador "?" do jsonb confundiria o driver JDBC).
     */
    private static final String MIGRACAO_INCUBACAO_E_CURSO_CENTRO = """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM incubacoes) THEN
                INSERT INTO incubacoes (nome)
                VALUES ('Incubada'), ('Associada'), ('Pré-incubada'), ('Inovação Aberta'), ('Outros');
            END IF;

            IF EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_schema = current_schema() AND table_name = 'startups' AND column_name = 'status') THEN
                UPDATE startups s SET id_incubacao = i.id_incubacao
                FROM incubacoes i
                WHERE s.id_incubacao IS NULL
                  AND i.nome = CASE s.status WHEN 'INCUBADA' THEN 'Incubada'
                                             WHEN 'ASSOCIADA' THEN 'Associada'
                                             WHEN 'PRE_INCUBADA' THEN 'Pré-incubada' END;

                UPDATE solicitacao_alteracao sa
                SET dados_novos = ((sa.dados_novos::jsonb - 'status')
                                   || jsonb_build_object('incubacaoId', i.id_incubacao))::text
                FROM incubacoes i
                WHERE sa.entidade = 'STARTUP' AND sa.status = 'PENDENTE'
                  AND i.nome = CASE sa.dados_novos::jsonb ->> 'status' WHEN 'INCUBADA' THEN 'Incubada'
                                                                       WHEN 'ASSOCIADA' THEN 'Associada'
                                                                       WHEN 'PRE_INCUBADA' THEN 'Pré-incubada' END;
                -- "status" nulo ou sem correspondência: só remove a chave
                UPDATE solicitacao_alteracao
                SET dados_novos = (dados_novos::jsonb - 'status')::text
                WHERE entidade = 'STARTUP' AND status = 'PENDENTE'
                  AND dados_novos::jsonb - 'status' <> dados_novos::jsonb;

                ALTER TABLE startups DROP COLUMN status;
            END IF;

            IF EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_schema = current_schema() AND table_name = 'laboratorios' AND column_name = 'vinculado') THEN
                UPDATE laboratorios SET centro = vinculado WHERE centro IS NULL AND vinculado IS NOT NULL;

                UPDATE solicitacao_alteracao
                SET dados_novos = ((dados_novos::jsonb - 'vinculado')
                                   || jsonb_build_object('centro', dados_novos::jsonb -> 'vinculado'))::text
                WHERE entidade = 'LABORATORIO' AND status = 'PENDENTE'
                  AND dados_novos::jsonb - 'vinculado' <> dados_novos::jsonb;

                ALTER TABLE laboratorios DROP COLUMN vinculado;
            END IF;
        END $$;
        """;
}