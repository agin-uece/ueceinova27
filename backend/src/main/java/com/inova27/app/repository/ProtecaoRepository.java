package com.inova27.app.repository;

import com.inova27.app.model.Protecao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProtecaoRepository extends JpaRepository<Protecao, Long> {
    boolean existsByCodId(String codId);
}