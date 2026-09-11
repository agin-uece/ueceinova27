package com.inova27.app.specification.servico;

import com.inova27.app.dto.servico.ServicoFiltroDTO;
import com.inova27.app.model.Pessoa;
import com.inova27.app.model.Servico;
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

            // 🔹 Filtro Relacional: Prestador (ID da Pessoa)
            if (filtro.pessoaId() != null) {
                Join<Servico, Pessoa> joinPessoas = root.join("prestadores");
                predicates.add(cb.equal(joinPessoas.get("id"), filtro.pessoaId()));
            }

            // 🔹 Filtro de Texto: Área de Atuação (Busca parcial com LIKE e Case Insensitive)
            if (filtro.areaAtuacao() != null && !filtro.areaAtuacao().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("areaAtuacao")), "%" + filtro.areaAtuacao().toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
