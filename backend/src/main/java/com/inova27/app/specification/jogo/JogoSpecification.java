package com.inova27.app.specification.jogo;

import com.inova27.app.dto.jogo.JogoFiltroDTO;
import com.inova27.app.model.Engine;
import com.inova27.app.model.Jogo;
import com.inova27.app.model.Linguagem;
import com.inova27.app.model.Protecao;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.util.ArrayList;
import java.util.List;

public class JogoSpecification {

    // Construtor privado para ocultar o construtor público implícito (Boa prática do SonarQube para classes utilitárias)
    private JogoSpecification() {
        throw new IllegalStateException("Classe utilitária não deve ser instanciada");
    }

    public static Specification<Jogo> comFiltros(JogoFiltroDTO filtro) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Delegação para métodos auxiliares reduz drasticamente a complexidade cognitiva
            adicionarFiltroDeTexto(predicates, root, cb, filtro);
            adicionarFiltrosExatos(predicates, root, cb, filtro);
            adicionarFiltrosDeRelacionamento(predicates, root, cb, filtro);

            // Fundamental: Evita resultados duplicados no JSON de retorno
            // causados pelos Joins em coleções (OneToMany e ManyToMany)
            query.distinct(true);

            // Retorna todos os predicados unidos com "AND"
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static void adicionarFiltroDeTexto(List<Predicate> predicates, Root<Jogo> root, CriteriaBuilder cb, JogoFiltroDTO filtro) {
        // Filtro por Nome (Busca parcial com LIKE e Case Insensitive)
        if (filtro.nome() != null && !filtro.nome().isBlank()) {
            predicates.add(cb.like(cb.lower(root.get("nome")), "%" + filtro.nome().toLowerCase() + "%"));
        }
    }

    private static void adicionarFiltrosExatos(List<Predicate> predicates, Root<Jogo> root, CriteriaBuilder cb, JogoFiltroDTO filtro) {
        // Filtros exatos (Enums e Datas)
        if (filtro.genero() != null) {
            predicates.add(cb.equal(root.get("genero"), filtro.genero()));
        }
        if (filtro.plataforma() != null) {
            predicates.add(cb.equal(root.get("plataforma"), filtro.plataforma()));
        }
        if (filtro.dataLancamento() != null) {
            predicates.add(cb.equal(root.get("dataLancamento"), filtro.dataLancamento()));
        }
        if (filtro.tipoJogo() != null) {
            predicates.add(cb.equal(root.get("tipoJogo"), filtro.tipoJogo()));
        }
        if (filtro.estagioDesenvolvimento() != null) {
            predicates.add(cb.equal(root.get("estagioDesenvolvimento"), filtro.estagioDesenvolvimento()));
        }
        if (filtro.faixaEtaria() != null) {
            predicates.add(cb.equal(root.get("faixaEtaria"), filtro.faixaEtaria()));
        }
    }

    private static void adicionarFiltrosDeRelacionamento(List<Predicate> predicates, Root<Jogo> root, CriteriaBuilder cb, JogoFiltroDTO filtro) {
        // Relacionamento ManyToOne (Engine)
        if (filtro.engineId() != null) {
            Join<Jogo, Engine> engineJoin = root.join("engine");
            predicates.add(cb.equal(engineJoin.get("id"), filtro.engineId()));
        }

        // Relacionamento ManyToMany (Linguagens)
        if (filtro.linguagemId() != null) {
            Join<Jogo, Linguagem> linguagemJoin = root.join("linguagens");
            predicates.add(cb.equal(linguagemJoin.get("id"), filtro.linguagemId()));
        }

        // Relacionamento OneToMany (Protecoes)
        if (filtro.protecaoId() != null) {
            Join<Jogo, Protecao> protecaoJoin = root.join("protecoes");
            predicates.add(cb.equal(protecaoJoin.get("id"), filtro.protecaoId()));
        }
    }
}