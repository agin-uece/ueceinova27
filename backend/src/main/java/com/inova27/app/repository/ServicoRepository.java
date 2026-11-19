package com.inova27.app.repository;

import com.inova27.app.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServicoRepository extends JpaRepository<Servico, Long>, JpaSpecificationExecutor<Servico> {

    @Query("""
        SELECT s FROM Servico s
        LEFT JOIN FETCH s.prestadores
        WHERE LOWER(TRIM(COALESCE(s.areaAtuacao, ''))) = LOWER(TRIM(COALESCE(:areaAtuacao, '')))
          AND LOWER(TRIM(COALESCE(s.descricao, ''))) = LOWER(TRIM(COALESCE(:descricao, '')))
          AND LOWER(TRIM(COALESCE(s.contato, ''))) = LOWER(TRIM(COALESCE(:contato, '')))
          AND LOWER(TRIM(COALESCE(s.email, ''))) = LOWER(TRIM(COALESCE(:email, '')))
          AND TRIM(COALESCE(s.telefone, '')) = TRIM(COALESCE(:telefone, ''))
    """)
    List<Servico> findCandidatosDuplicados(
            @Param("areaAtuacao") String areaAtuacao,
            @Param("descricao") String descricao,
            @Param("contato") String contato,
            @Param("email") String email,
            @Param("telefone") String telefone
    );
}