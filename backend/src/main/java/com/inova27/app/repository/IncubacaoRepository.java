package com.inova27.app.repository;

import com.inova27.app.model.Incubacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncubacaoRepository extends JpaRepository<Incubacao, Long> {
    boolean existsByNomeIgnoreCase(String nome);
    boolean existsByNomeIgnoreCaseAndIdNot(String nome, Long id);
    List<Incubacao> findAllByOrderByNomeAsc();
}
