package com.inova27.app.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "servicos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE servicos SET ativo = false WHERE id_servico = ?")
@SQLRestriction("ativo = true")
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_servico")
    private Long id;

    @Column(nullable = false)
    private boolean ativo = true;

    @ManyToMany
    @JoinTable(
            name = "servico_prestador",
            joinColumns = @JoinColumn(name = "servico_id"),
            inverseJoinColumns = @JoinColumn(name = "pessoa_id")
    )
    private Set<Pessoa> prestadores = new HashSet<>();

    // 🔹 Área de atuação
    @Column(name = "area_atuacao", length = 150)
    private String areaAtuacao;

    // 🔹 Descrição do serviço
    @Column(length = 1000)
    private String descricao;

    // 🔹 Contato (nome ou setor)
    @Column(length = 150)
    private String contato;

    // 🔹 Email
    @Column(length = 150)
    private String email;

    // 🔹 Telefone
    @Column(length = 20)
    private String telefone;
}
