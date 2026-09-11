package com.inova27.app.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "pessoas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE pessoas SET ativo = false WHERE id = ?")
@SQLRestriction("ativo = true")
public class Pessoa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private boolean ativo = true;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(length = 20)
    private String telefone;

    @Column(name = "area_pesquisa", length = 150)
    private String areaPesquisa;

    @Column(length = 100)
    private String titulacao;

    @Column(length = 150)
    private String instituicao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Papel papel;

    private String site;

    private String lattesURL;

    private String linkD;

    private String curso;

    private Long userInclusaoId;

    private String anoFormacao;

    private String urlFoto;

    private String descricao;

    private String matricula;

    @Enumerated(EnumType.STRING)
    private StatusValidacao status;


    // 🔹 Relacionamento N:N (Pessoa <-> Startup)
    @ManyToMany
    @JoinTable(
            name = "pessoa_startup",
            joinColumns = @JoinColumn(name = "pessoa_id"),
            inverseJoinColumns = @JoinColumn(name = "startup_id")
    )
    private Set<Startup> startups = new HashSet<>();

    // 🔹 Relacionamento N:N (Pessoa <-> Protecao)
    @ManyToMany
    @JoinTable(
            name = "pessoa_protecao",
            joinColumns = @JoinColumn(name = "pessoa_id"),
            inverseJoinColumns = @JoinColumn(name = "protecao_id")
    )
    private Set<Protecao> protecoes = new HashSet<>();

    // 🔹 NOVO: Relacionamento N:N (Pessoa <-> Servico) mapeado pela tabela servicos
    @ManyToMany(mappedBy = "prestadores")
    private Set<Servico> servicos = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "laboratorio_id")
    private Laboratorio laboratorio;
}