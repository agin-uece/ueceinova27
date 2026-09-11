package com.inova27.app.repository;

import com.inova27.app.model.Laboratorio;
import com.inova27.app.model.StatusValidacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LaboratorioRepository extends JpaRepository<Laboratorio, Long>, JpaSpecificationExecutor<Laboratorio> {

    boolean existsByNome(String nome);

    List<Laboratorio> findByStatus(StatusValidacao status);

    List<Laboratorio> findByUserInclusaoId(Long userInclusaoId);


}