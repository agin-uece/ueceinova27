package com.inova27.app.repository;

import com.inova27.app.model.Linguagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LinguagemRepository  extends JpaRepository<Linguagem, Long> {
    boolean existsByNome(String nome);
}
