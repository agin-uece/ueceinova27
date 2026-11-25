package com.inova27.app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Tipos de incubação/vínculo de uma startup com o ecossistema (Incubada, Associada, Inovação Aberta...).
 * Cadastrados pelo admin; os iniciais são criados pelo DatabaseSchemaFixRunner.
 */
@Entity
@Table(name = "incubacoes")
@Getter
@Setter
@NoArgsConstructor
public class Incubacao {

    public static final int TAMANHO_MAXIMO_NOME = 20;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_incubacao")
    private Long id;

    @Column(nullable = false, unique = true, length = TAMANHO_MAXIMO_NOME)
    private String nome;

    public Incubacao(String nome) {
        this.nome = nome;
    }
}
