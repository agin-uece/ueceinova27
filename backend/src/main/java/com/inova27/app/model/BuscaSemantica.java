package com.inova27.app.model;

import com.pgvector.PGvector;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "busca_semantica",
        uniqueConstraints = @UniqueConstraint(name = "uk_busca_semantica_entidade_origem", columnNames = {"entidade", "id_origem"}))
@Getter
@Setter
public class BuscaSemantica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String entidade;

    @Column(name = "id_origem")
    private Long idOrigem;

    // Mesmo tamanho máximo de Protecao.nome (o maior título indexado)
    @Column(length = 500)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "texto_completo", columnDefinition = "TEXT")
    private String textoCompleto;

    @Column(columnDefinition = "vector(1024)")
    private PGvector embedding;

}