package com.inova27.app.specification.pessoa;

import com.inova27.app.dto.pessoa.PessoaFiltroDTO;
import com.inova27.app.model.Laboratorio;
import com.inova27.app.model.Pessoa;
import com.inova27.app.model.Protecao;
import com.inova27.app.model.Startup;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.util.ArrayList;
import java.util.List;

public class PessoaSpecification {

    // Construtor privado para ocultar o construtor público implícito (Boa prática para classes utilitárias)
    private PessoaSpecification() {
        throw new IllegalStateException("Classe utilitária não deve ser instanciada");
    }

    public static Specification<Pessoa> comFiltros(PessoaFiltroDTO filtro) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Delegação para métodos auxiliares reduz drasticamente a complexidade cognitiva
            adicionarFiltrosDeTextoParcial(predicates, root, cb, filtro);
            adicionarFiltrosExatos(predicates, root, cb, filtro);
            adicionarFiltrosDeRelacionamento(predicates, root, cb, filtro);

            // Fundamental: Evita resultados duplicados no JSON de retorno
            query.distinct(true);

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static void adicionarFiltrosDeTextoParcial(List<Predicate> predicates, Root<Pessoa> root, CriteriaBuilder cb, PessoaFiltroDTO filtro) {
        // 🔹 Textos (Busca parcial com LIKE e Case Insensitive)
        if (filtro.nome() != null && !filtro.nome().isBlank()) {
            predicates.add(cb.like(cb.lower(root.get("nome")), "%" + filtro.nome().toLowerCase() + "%"));
        }
        if (filtro.areaPesquisa() != null && !filtro.areaPesquisa().isBlank()) {
            predicates.add(cb.like(cb.lower(root.get("areaPesquisa")), "%" + filtro.areaPesquisa().toLowerCase() + "%"));
        }
        if (filtro.titulacao() != null && !filtro.titulacao().isBlank()) {
            predicates.add(cb.like(cb.lower(root.get("titulacao")), "%" + filtro.titulacao().toLowerCase() + "%"));
        }
        if (filtro.instituicao() != null && !filtro.instituicao().isBlank()) {
            predicates.add(cb.like(cb.lower(root.get("instituicao")), "%" + filtro.instituicao().toLowerCase() + "%"));
        }
        if (filtro.curso() != null && !filtro.curso().isBlank()) {
            predicates.add(cb.like(cb.lower(root.get("curso")), "%" + filtro.curso().toLowerCase() + "%"));
        }
    }

    private static void adicionarFiltrosExatos(List<Predicate> predicates, Root<Pessoa> root, CriteriaBuilder cb, PessoaFiltroDTO filtro) {
        // 🔹 Textos Exatos ou Enums
        if (filtro.anoFormacao() != null && !filtro.anoFormacao().isBlank()) {
            predicates.add(cb.equal(root.get("anoFormacao"), filtro.anoFormacao()));
        }
        if (filtro.papel() != null) {
            predicates.add(cb.equal(root.get("papel"), filtro.papel()));
        }
    }

    private static void adicionarFiltrosDeRelacionamento(List<Predicate> predicates, Root<Pessoa> root, CriteriaBuilder cb, PessoaFiltroDTO filtro) {
        // 🔹 Relacionamentos
        if (filtro.startupId() != null) {
            Join<Pessoa, Startup> startupJoin = root.join("startups");
            predicates.add(cb.equal(startupJoin.get("id"), filtro.startupId()));
        }
        if (filtro.protecaoId() != null) {
            Join<Pessoa, Protecao> protecaoJoin = root.join("protecoes");
            predicates.add(cb.equal(protecaoJoin.get("id"), filtro.protecaoId()));
        }
        if (filtro.laboratorioId() != null) {
            Join<Pessoa, Laboratorio> labJoin = root.join("laboratorio");
            predicates.add(cb.equal(labJoin.get("id"), filtro.laboratorioId()));
        }
    }
}