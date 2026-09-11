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
@Table(name = "protecoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE protecoes SET ativo = false WHERE id_protecao = ?")
@SQLRestriction("ativo = true")
public class Protecao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_protecao")
    private Long id;

    @Column(nullable = false)
    private boolean ativo = true;

    private String codId;

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(length = 1000)
    private String resumo;

    @Column(length = 150)
    private String instituicao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NaturezaProtecao natureza;

    @Column(name = "data_deposito")
    private LocalDate dataDeposito;

    @Column(name = "info_extra", length = 1000)
    private String infoExtra;

    @ElementCollection(targetClass = TipoProtecao.class)
    @CollectionTable(
            name = "protecao_tipos",
            joinColumns = @JoinColumn(name = "protecao_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private Set<TipoProtecao> tipos = new HashSet<>();

    // ==========================================
    // 🔹 CAMPOS HERDADOS DE TECNOLOGIA
    // ==========================================
    @Column(length = 100)
    private String area;

    @Column(name = "nivel_maturidade", length = 50)
    private String nivelMaturidade;

    @Column(length = 300)
    private String aplicacao;

    @Column(length = 50)
    private String status;

    private List<String> inventores;

    private String titular;

    private String diferencialTecnologico;

    private String numeroProtocolo;


    // 🔹 Relacionamento N:N (Protecao <-> Pessoa) herdado de Tecnologia
    @ManyToMany(mappedBy = "protecoes")
    private Set<Pessoa> pessoas = new HashSet<>();
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jogo_id")
    private Jogo jogo;

    private Long userInclusaoId;

}