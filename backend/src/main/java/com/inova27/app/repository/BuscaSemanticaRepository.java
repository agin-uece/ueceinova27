package com.inova27.app.repository;

import com.inova27.app.model.BuscaSemantica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BuscaSemanticaRepository extends JpaRepository<BuscaSemantica, Long> {

    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    @Query(value = """
                INSERT INTO busca_semantica 
                (entidade, id_origem, titulo, descricao, texto_completo, embedding, indexado)
                VALUES (:entidade, :idOrigem, :titulo, :descricao, :textoCompleto, CAST(:embedding AS vector), TRUE)
            """, nativeQuery = true)
    void salvar(
            @Param("entidade") String entidade,
            @Param("idOrigem") Long idOrigem,
            @Param("titulo") String titulo,
            @Param("descricao") String descricao,
            @Param("textoCompleto") String textoCompleto,
            @Param("embedding") String  embedding
    );

    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    @Query(value = """
                INSERT INTO busca_semantica
                (entidade, id_origem, titulo, descricao, texto_completo, embedding, indexado)
                VALUES (:entidade, :idOrigem, :titulo, :descricao, :textoCompleto, NULL, FALSE)
                ON CONFLICT (entidade, id_origem) DO UPDATE SET
                    titulo = EXCLUDED.titulo,
                    descricao = EXCLUDED.descricao,
                    texto_completo = EXCLUDED.texto_completo,
                    indexado = FALSE
            """, nativeQuery = true)
    void marcarNaoIndexado(
            @Param("entidade") String entidade,
            @Param("idOrigem") Long idOrigem,
            @Param("titulo") String titulo,
            @Param("descricao") String descricao,
            @Param("textoCompleto") String textoCompleto
    );

    List<BuscaSemantica> findByIndexadoFalse();

    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    @Query("DELETE FROM BuscaSemantica b WHERE b.entidade = :entidade AND b.idOrigem = :idOrigem")
    void removerPorEntidadeEIdOrigem(@Param("entidade") String entidade, @Param("idOrigem") Long idOrigem);

    /**
     * Busca híbrida. Um documento entra se:
     * - o título for igual ao termo;
     * - todas as palavras do termo aparecerem no título/texto, mesmo como pedaço de palavra ("chalc" acha "chalcona");
     * - casar na busca textual do Postgres (palavra inteira, com radical: "diabetico" acha "diabetes");
     * - ou for semanticamente parecido (embedding).
     * Título e texto passam por unaccent, porque o termo chega sem acentos (TextoBuscaUtils.normalizar).
     * Ordem: título exato; título com palavras começando pelos termos ("vira" -> "ViraVolta");
     * título contendo os termos ("vira" -> "antiviral"); busca textual; texto contendo os termos; só semântica.
     */
    // ponytail: unaccent/to_tsvector calculados por linha (seq scan); com dezenas de milhares de linhas,
    // guardar o texto normalizado em coluna com índice GIN (pg_trgm / tsvector)
    @Query(value = """
                WITH parametros AS (
                    SELECT
                        CAST(:embedding AS vector) AS query_vetor,
                        :texto AS query_texto,
                        string_to_array(:texto, ' ') AS query_palavras,
                        websearch_to_tsquery('portuguese', :texto) AS query_fts
                ),
                documentos AS (
                    SELECT
                        b.*,
                        unaccent(LOWER(coalesce(b.titulo, ''))) AS titulo_norm,
                        unaccent(LOWER(coalesce(b.titulo, '') || ' ' || coalesce(b.texto_completo, ''))) AS texto_norm
                    FROM busca_semantica b
                ),
                avaliados AS (
                    SELECT
                        d.*,
                        p.query_vetor,
                        d.titulo_norm = p.query_texto AS titulo_igual,
                        (SELECT bool_and(strpos(' ' || regexp_replace(d.titulo_norm, '[^a-z0-9]+', ' ', 'g'), ' ' || w) > 0)
                            FROM unnest(p.query_palavras) w) IS TRUE AS titulo_inicio_palavra,
                        (SELECT bool_and(strpos(d.titulo_norm, w) > 0) FROM unnest(p.query_palavras) w) IS TRUE AS titulo_contem,
                        (SELECT bool_and(strpos(d.texto_norm, w) > 0) FROM unnest(p.query_palavras) w) IS TRUE AS texto_contem,
                        to_tsvector('portuguese', d.texto_norm) @@ p.query_fts AS fts
                    FROM documentos d
                    CROSS JOIN parametros p
                )
                SELECT
                    a.entidade,
                    a.id_origem,
                    a.titulo,
                    a.descricao,
                    COALESCE(1 - (a.embedding <=> a.query_vetor), 0.0) AS similaridade
                FROM avaliados a
                WHERE
                    a.titulo_igual
                    OR a.texto_contem
                    OR a.fts
                    OR (a.embedding IS NOT NULL AND 1 - (a.embedding <=> a.query_vetor) > 0.70)
                ORDER BY
                    CASE
                        WHEN a.titulo_igual THEN 0
                        WHEN a.titulo_inicio_palavra THEN 1
                        WHEN a.titulo_contem THEN 2
                        WHEN a.fts THEN 3
                        WHEN a.texto_contem THEN 4
                        ELSE 5
                    END,
                    a.embedding <=> a.query_vetor ASC NULLS LAST
                LIMIT 10
            """, nativeQuery = true)
    List<Object[]> buscarCompleto(@Param("embedding") String embedding, @Param("texto") String texto);
}