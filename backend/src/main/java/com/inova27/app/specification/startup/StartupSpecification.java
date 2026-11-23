package com.inova27.app.specification.startup;

import com.inova27.app.dto.startup.StartupFiltroDTO;
import com.inova27.app.model.Pessoa;
import com.inova27.app.model.Startup;
import com.inova27.app.utils.TextoBuscaUtils;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;

public class StartupSpecification {

    private StartupSpecification() {
        throw new UnsupportedOperationException("Classe utilitária - não deve ser instanciada");
    }

    public static Specification<Startup> comFiltros(StartupFiltroDTO filtro) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 🔹 Filtros de Texto (Busca parcial, ignorando maiúsculas e acentos)
            if (filtro.nome() != null && !filtro.nome().isBlank()) {
                predicates.add(TextoBuscaUtils.contem(cb, root.get("nome"), filtro.nome()));
            }
            if (filtro.area() != null && !filtro.area().isBlank()) {
                predicates.add(TextoBuscaUtils.contem(cb, root.get("area"), filtro.area()));
            }

            // 🔹 Filtros Exatos (Data e Enum)
            if (filtro.dataFundacao() != null) {
                predicates.add(cb.equal(root.get("dataFundacao"), filtro.dataFundacao()));
            }
            if (filtro.status() != null) {
                predicates.add(cb.equal(root.get("status"), filtro.status()));
            }

            // 🔹 Relacionamento ManyToMany (Pessoas)
            if (filtro.pessoaId() != null) {
                Join<Startup, Pessoa> pessoaJoin = root.join("pessoas");
                predicates.add(cb.equal(pessoaJoin.get("id"), filtro.pessoaId()));
            }

            // Fundamental: Evita resultados duplicados causados pelo Join na coleção de pessoas
            query.distinct(true);

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
