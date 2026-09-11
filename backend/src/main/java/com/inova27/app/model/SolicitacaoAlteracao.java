package com.inova27.app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "solicitacao_alteracao")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitacaoAlteracao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TipoEntidade entidade;

    // O ID da Startup, do Jogo, etc. que está sendo alterado
    @Column(nullable = false)
    private Long entidadeId;

    // EDICAO ou EXCLUSAO
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoAcao tipoAcao;

    // Guarda o JSON completo com os novos dados
    // columnDefinition = "TEXT" permite salvar strings gigantes
    @Column(columnDefinition = "TEXT")
    private String dadosNovos;

    // PENDENTE, APROVADA, REJEITADA
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusValidacao status;

    // ID do usuário que fez a edição lá no front-end
    @Column(nullable = false)
    private Long solicitanteId;

    // ID do admin que clicou em aprovar/rejeitar
    private Long avaliadorId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataSolicitacao;

    // Quando o admin tomou a decisão
    private LocalDateTime dataAvaliacao;

    // Opcional: Se o admin rejeitar, ele pode escrever o motivo
    @Column(columnDefinition = "TEXT")
    private String justificativaRecusa;

    @Column(columnDefinition = "TEXT")
    private String justificativaAlteracao;

    // Método executado automaticamente antes de salvar no banco pela primeira vez
    @PrePersist
    protected void onCreate() {
        this.dataSolicitacao = LocalDateTime.now();
        if (this.status == null) {
            this.status = StatusValidacao.PENDENTE;
        }
    }
}
