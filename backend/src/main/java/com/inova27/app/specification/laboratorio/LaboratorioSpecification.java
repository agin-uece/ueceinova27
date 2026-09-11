package com.inova27.app.specification.laboratorio;

import com.inova27.app.dto.laboratorio.LaboratorioFiltroDTO;
import com.inova27.app.model.Laboratorio;
import com.inova27.app.model.NaturezaLaboratorio;
import com.inova27.app.model.Pessoa;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.util.ArrayList;
import java.util.List;

public class LaboratorioSpecification {

    // Construtor privado para ocultar o construtor público implícito (Boa prática para classes utilitárias)
    private LaboratorioSpecification() {
        throw new IllegalStateException("Classe utilitária não deve ser instanciada");
    }

    public static Specification<Laboratorio> comFiltros(LaboratorioFiltroDTO filtro) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Delegação para métodos auxiliares reduz drasticamente a complexidade cognitiva
            adicionarFiltrosDeTexto(predicates, root, cb, filtro);
            adicionarFiltrosDeColecao(predicates, root, cb, filtro);
            adicionarFiltrosDeRelacionamento(predicates, root, cb, filtro);

            // Fundamental: Evita resultados duplicados causados pelos Joins (tags e pessoas)
            query.distinct(true);

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static void adicionarFiltrosDeTexto(List<Predicate> predicates, Root<Laboratorio> root, CriteriaBuilder cb, LaboratorioFiltroDTO filtro) {
        // Textos (Busca parcial com LIKE e Case Insensitive)
        if (filtro.nome() != null && !filtro.nome().isBlank()) {
            predicates.add(cb.like(cb.lower(root.get("nome")), "%" + filtro.nome().toLowerCase() + "%"));
        }
        if (filtro.coordenacao() != null && !filtro.coordenacao().isBlank()) {
            predicates.add(cb.like(cb.lower(root.get("coordenacao")), "%" + filtro.coordenacao().toLowerCase() + "%"));
        }
        if (filtro.area() != null && !filtro.area().isBlank()) {
            predicates.add(cb.like(cb.lower(root.get("area")), "%" + filtro.area().toLowerCase() + "%"));
        }
        if (filtro.vinculado() != null && !filtro.vinculado().isBlank()) {
            predicates.add(cb.like(cb.lower(root.get("vinculado")), "%" + filtro.vinculado().toLowerCase() + "%"));
        }
    }

    private static void adicionarFiltrosDeColecao(List<Predicate> predicates, Root<Laboratorio> root, CriteriaBuilder cb, LaboratorioFiltroDTO filtro) {
        if (filtro.naturezas() != null && !filtro.naturezas().isEmpty()) {
            Join<Laboratorio, NaturezaLaboratorio> joinNaturezas = root.join("naturezas");
            predicates.add(joinNaturezas.in(filtro.naturezas()));
        }

        // ElementCollection (Tags) - Busca parcial dentro da coleção de tags
        if (filtro.tag() != null && !filtro.tag().isBlank()) {
            Join<Laboratorio, String> tagsJoin = root.join("tags");
            predicates.add(cb.like(cb.lower(tagsJoin), "%" + filtro.tag().toLowerCase() + "%"));
        }
    }

    private static void adicionarFiltrosDeRelacionamento(List<Predicate> predicates, Root<Laboratorio> root, CriteriaBuilder cb, LaboratorioFiltroDTO filtro) {
        // Relacionamento OneToMany (Pessoas vinculadas ao laboratório)
        if (filtro.pessoaId() != null) {
            Join<Laboratorio, Pessoa> pessoaJoin = root.join("pessoas");
            predicates.add(cb.equal(pessoaJoin.get("id"), filtro.pessoaId()));
        }
    }
}