package com.inova27.app.repository;

import com.inova27.app.model.Engine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EngineRepository extends JpaRepository<Engine, Long> {
    boolean existsByNome(String nome);
}

