package com.inova27.app.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "laboratorios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE laboratorios SET ativo = false WHERE id_laboratorio = ?")
@SQLRestriction("ativo = true")
public class Laboratorio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_laboratorio")
    private Long id;

    @Column(nullable = false)
    private boolean ativo = true;

    @Column(nullable = false, length = 150)
    private String nome;//CRIAR//OK//EDITAR//

    @Column(length = 1000)
    private String descricao;//CRIAR//OK//EDITAR//

    @Column(length = 150)
    private String coordenacao;//CRIAR//OK//EDITAR//

    @Column(length = 100)
    private String area;//CRIAR//OK//EDITAR//

    @Column(length = 150)
    private String email;//CRIAR//OK//EDITAR//

    @Column(length = 200)
    private String site;//CRIAR//OK//EDITAR//

    @Column(length = 20)
    private String telefone;//CRIAR//OK//EDITAR//

    @ElementCollection(targetClass = NaturezaLaboratorio.class)
    @CollectionTable(name = "laboratorio_natureza", joinColumns = @JoinColumn(name = "laboratorio_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "natureza")
    private Set<NaturezaLaboratorio> naturezas = new HashSet<>();//CRIAR//OK//EDITAR//

    @Column(length = 150)
    private String vinculado;//CRIAR//OK//EDITAR//

    private LocalDateTime horarioAbertura;//CRIAR//OK//EDITAR//

    private LocalDateTime horarioFechamento;//CRIAR//OK//EDITAR//

    private String urlFoto;//CRIAR//OK//EDITAR//

    private String localizacao;//CRIAR//OK//EDITAR//

    @Column(length = 500)
    private String parcerias;//CRIAR//OK//EDITAR//

    @Column(length = 1000)
    private String infraestrutura;//CRIAR//OK//EDITAR//

    private Long userInclusaoId;//CRIAR//OK//EDITAR//

    @Enumerated(EnumType.STRING)
    private StatusValidacao status;//CRIAR//OK//EDITAR//

    // 🔹 Tags (coleção simples)
    @ElementCollection
    @CollectionTable(name = "laboratorio_tags", joinColumns = @JoinColumn(name = "laboratorio_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();//CRIAR//OK//EDITAR//

    @OneToMany(mappedBy = "laboratorio", cascade = CascadeType.ALL)
    private Set<Pessoa> pessoas = new HashSet<>();//CRIAR//NAOO!!

    private String instagram;

    private String resolucao;

    private Integer qtdPessoas;

    private Integer qtdMestrando;

    private Integer qtdDoutorandos;

    private Integer qtdPosDoc;

}