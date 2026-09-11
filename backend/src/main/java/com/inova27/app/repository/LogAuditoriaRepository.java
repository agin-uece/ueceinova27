package com.inova27.app.repository;

import com.inova27.app.model.LogAuditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogAuditoriaRepository extends JpaRepository<LogAuditoria, Long> {
    // Para no futuro você poder buscar: "Mostre o histórico do Laboratório 5"
    List<LogAuditoria> findByEntidadeNomeAndEntidadeIdOrderByDataHoraDesc(String entidadeNome, Long entidadeId);
}