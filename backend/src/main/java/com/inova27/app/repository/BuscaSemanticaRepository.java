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
                (entidade, id_origem, titulo, descricao, texto_completo, embedding)
                VALUES (:entidade, :idOrigem, :titulo, :descricao, :textoCompleto, CAST(:embedding AS vector))
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
    @Query("DELETE FROM BuscaSemantica b WHERE b.entidade = :entidade AND b.idOrigem = :idOrigem")
    void removerPorEntidadeEIdOrigem(@Param("entidade") String entidade, @Param("idOrigem") Long idOrigem);

    @Query(value = """
                WITH parametros AS (
                    SELECT 
                        CAST(:embedding AS vector) AS query_vetor,
                        LOWER(TRIM(:texto)) AS query_texto,
                        websearch_to_tsquery('portuguese', :texto) AS query_fts 
                )
                SELECT 
                    b.entidade,
                    b.id_origem,
                    b.titulo,
                    b.descricao,
                    1 - (b.embedding <=> p.query_vetor) AS similaridade
                FROM busca_semantica b
                CROSS JOIN parametros p
                WHERE
                    LOWER(b.titulo) = p.query_texto
                    OR to_tsvector('portuguese', coalesce(b.titulo, '') || ' ' || coalesce(b.texto_completo, '')) @@ p.query_fts
                    OR 1 - (b.embedding <=> p.query_vetor) > 0.70
                ORDER BY 
                    CASE WHEN LOWER(b.titulo) = p.query_texto THEN 0 ELSE 1 END,
                    b.embedding <=> p.query_vetor ASC
                LIMIT 10
            """, nativeQuery = true)
    List<Object[]> buscarCompleto(@Param("embedding") String embedding, @Param("texto") String texto);
}