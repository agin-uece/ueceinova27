package com.inova27.app.specification.servico;

import com.inova27.app.dto.servico.ServicoFiltroDTO;
import com.inova27.app.model.Laboratorio;
import com.inova27.app.model.Servico;
import com.inova27.app.utils.TextoBuscaUtils;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;

public class ServicoSpecification {

    private ServicoSpecification() {
        throw new UnsupportedOperationException("Classe utilitária - não deve ser instanciada");
    }

    public static Specification<Servico> comFiltros(ServicoFiltroDTO filtro) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filtro Relacional: Prestador (ID do Laboratório)
            if (filtro.laboratorioId() != null) {
                Join<Servico, Laboratorio> joinLaboratorios = root.join("prestadores");
                predicates.add(cb.equal(joinLaboratorios.get("id"), filtro.laboratorioId()));
            }

            // Filtro de Texto: Área de Atuação (Busca parcial, ignorando maiúsculas e acentos)
            if (filtro.areaAtuacao() != null && !filtro.areaAtuacao().isBlank()) {
                predicates.add(TextoBuscaUtils.contem(cb, root.get("areaAtuacao"), filtro.areaAtuacao()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
