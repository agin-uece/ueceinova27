package com.inova27.app.repository;

import com.inova27.app.model.Protecao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProtecaoRepository extends JpaRepository<Protecao, Long> {
    boolean existsByCodId(String codId);

    // Proteções ativas que não aparecem na busca semântica (ex.: inseridas direto por SQL)
    @Query(value = """
            SELECT p.id_protecao FROM protecoes p
            WHERE p.ativo AND NOT EXISTS (
                SELECT 1 FROM busca_semantica b WHERE b.entidade = 'protecoes' AND b.id_origem = p.id_protecao)
            ORDER BY p.id_protecao
            """, nativeQuery = true)
    List<Long> findIdsSemIndiceSemantico();
}
