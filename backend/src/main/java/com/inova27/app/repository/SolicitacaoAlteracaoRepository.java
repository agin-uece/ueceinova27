package com.inova27.app.repository;


import com.inova27.app.model.SolicitacaoAlteracao;
import com.inova27.app.model.StatusValidacao;
import com.inova27.app.model.TipoEntidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitacaoAlteracaoRepository extends
        JpaRepository<SolicitacaoAlteracao, Long>,
        JpaSpecificationExecutor<SolicitacaoAlteracao> {

    // Para o Dashboard do Admin: Ver tudo o que precisa de aprovação
    List<SolicitacaoAlteracao> findByStatus(StatusValidacao status);

    // Para ver o histórico de uma Startup ou Jogo específico
    List<SolicitacaoAlteracao> findByEntidadeAndEntidadeId(TipoEntidade entidade, Long entidadeId);

    // Para ver as solicitações de um utilizador específico
    List<SolicitacaoAlteracao> findBySolicitanteId(Long solicitanteId);
}
