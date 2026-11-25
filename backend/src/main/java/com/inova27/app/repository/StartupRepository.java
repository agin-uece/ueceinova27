package com.inova27.app.repository;

import com.inova27.app.model.Startup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StartupRepository extends JpaRepository<Startup, Long>, JpaSpecificationExecutor<Startup> {
    boolean existsByNomeIgnoreCase(String nome);
    boolean existsByNomeIgnoreCaseAndIdNot(String nome, Long id);
    boolean existsByCnpj(String cnpj);
    boolean existsByCnpjAndIdNot(String cnpj, Long id);

    // SQL nativo de propósito: conta também as startups desativadas (o @SQLRestriction as esconderia),
    // que continuam apontando para a incubação no banco
    @Query(value = "SELECT EXISTS (SELECT 1 FROM startups WHERE id_incubacao = :incubacaoId)", nativeQuery = true)
    boolean existeComIncubacao(@Param("incubacaoId") Long incubacaoId);
}