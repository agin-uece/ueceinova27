package com.inova27.app.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "startups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE startups SET ativo = false WHERE id_startup = ?")
@SQLRestriction("ativo = true")
public class Startup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_startup")
    private Long id;

    @Column(nullable = false)
    private boolean ativo = true;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(length = 500)
    private String descricao;

    @Column(length = 100)
    private String area;

    @Column(name = "data_fundacao")
    private LocalDate dataFundacao;

    @Column(length = 200)
    private String site;

    @Column(length = 150)
    private String email;

    @Column(length = 20)
    private String telefone;

    @Column(length = 255)
    private String logo;

    private Long userInclusaoId;


    @ElementCollection
    @CollectionTable(name = "startup_fotos", joinColumns = @JoinColumn(name = "startup_id"))
    @Column(name = "foto_url")
    private Set<String> fotos = new HashSet<>();


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusStartup status;

    // 🔹 Relacionamento N:N (Startup <-> Pessoa)
    @ManyToMany(mappedBy = "startups")
    private Set<Pessoa> pessoas = new HashSet<>();

    private String cnpj;

    private String instagram;
}