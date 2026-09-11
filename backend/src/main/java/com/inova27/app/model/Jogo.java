package com.inova27.app.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "jogos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE jogos SET ativo = false WHERE id_game = ?")
@SQLRestriction("ativo = true")
public class Jogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_game")
    private Long id;

    @Column(nullable = false)
    private boolean ativo = true;

    @Column(nullable = false, length = 150)
    private String nome;//criar//OK//EDITAR//OK//EXPANDIDO//OK

    @Column(length = 1000)
    private String descricao;//criar//OK//EDITAR//OK////EXPANDIDO//OK

    @Enumerated(EnumType.STRING)
    private GeneroJogo genero;//criar//OK//EDITAR//OK////EXPANDIDO//OK

    @Enumerated(EnumType.STRING)
    private Plataforma plataforma;//criar//OK//EDITAR//OK////EXPANDIDO//OK

    @Column(name = "data_lancamento")
    private LocalDate dataLancamento;//criar//OK//EDITAR//OK////EXPANDIDO//OK

    @Column(name = "link_download", length = 300)
    private String linkDownload;//criar//OK//EDITAR//OK////EXPANDIDO//OK

    @Column(length = 200)
    private String site;//criar//OK//EDITAR//OK////EXPANDIDO//OK

    private String anoDesenvolvimento;//criar//OK//EDITAR//OK////EXPANDIDO//OK

    @Enumerated(EnumType.STRING)
    private TipoJogo tipoJogo;//criar//OK//EDITAR//OK////EXPANDIDO//OK

    @Enumerated(EnumType.STRING)
    private EstagioDesenvolvimento estagioDesenvolvimento;//criar//OK//EDITAR//OK////EXPANDIDO//OK

    @ManyToOne
    @JoinColumn(name = "engine_id")
    private Engine engine;//criar//OK//EDITAR//OK////EXPANDIDO//OK

    @ManyToMany
    @JoinTable(
            name = "jogo_linguagem",
            joinColumns = @JoinColumn(name = "jogo_id"),
            inverseJoinColumns = @JoinColumn(name = "linguagem_id")
    )
    private Set<Linguagem> linguagens = new HashSet<>();//criar//OK//EDITAR//OK////EXPANDIDO//OK

    private Long userInclusaoId;//criar//OK//EDITAR//OK////EXPANDIDO//

    private String urlFoto;//criar//OK//EDITAR//OK////EXPANDIDO//OK

    @Enumerated(EnumType.STRING)
    private StatusValidacao status;//criar//OK//EDITAR//OK////EXPANDIDO//OK

    // 🔹 Relacionamento 1:N (Jogo -> Protecao)
    @OneToMany(mappedBy = "jogo", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Protecao> protecoes = new HashSet<>();//criar//NÃO//EDITAR//NÃO////EXPANDIDO//NÃO

    @Column(name = "faixa-etaria")
    private String faixaEtaria;//criar//OK//EDITAR//OK////EXPANDIDO//OK


    @Column(name = "criadores")
    private List<String> criadores;
}