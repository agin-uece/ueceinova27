package com.inova27.app.repository;

import com.inova27.app.model.Jogo;
import com.inova27.app.model.StatusValidacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JogoRepository extends JpaRepository<Jogo, Long>, JpaSpecificationExecutor<Jogo> {
    boolean existsByNome(String nome);
    List<Jogo> findByStatus(StatusValidacao status);
    Page<Jogo> findByUserInclusaoId(Long usuarioId, Pageable pageable);
}