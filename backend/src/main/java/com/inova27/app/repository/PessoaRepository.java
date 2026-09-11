package com.inova27.app.repository;

import com.inova27.app.model.Pessoa;
import com.inova27.app.model.StatusValidacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PessoaRepository extends JpaRepository<Pessoa, Long>, JpaSpecificationExecutor<Pessoa> {
    Optional<Pessoa> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Pessoa> findByStatus(StatusValidacao status);
    List<Pessoa> findByUserInclusaoId(Long userInclusaoId);
    List<Pessoa> findByStatusAndServicosIsNotEmpty(StatusValidacao status);
}