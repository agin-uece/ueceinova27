package com.inova27.app.model;

import com.pgvector.PGvector;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "busca_semantica")
@Getter
@Setter
public class BuscaSemantica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String entidade;

    @Column(name = "id_origem")
    private Long idOrigem;

    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "texto_completo", columnDefinition = "TEXT")
    private String textoCompleto;

    @Column(columnDefinition = "vector(1024)")
    private PGvector embedding;

}