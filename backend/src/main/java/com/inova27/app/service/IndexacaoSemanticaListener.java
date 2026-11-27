package com.inova27.app.service;

import com.inova27.app.config.AsyncConfig;
import com.inova27.app.dto.buscasemantica.DocumentoSemantico;
import com.inova27.app.dto.buscasemantica.IndexacaoSemanticaEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@Slf4j
@RequiredArgsConstructor
public class IndexacaoSemanticaListener {

    private final IndexadorSemanticoService indexador;

    @Async(AsyncConfig.INDEXACAO_SEMANTICA_EXECUTOR)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void aoIndexarDocumento(IndexacaoSemanticaEvent event) {
        DocumentoSemantico doc = event.documento();
        if (doc == null) {
            return;
        }
        try {
            indexador.indexar(doc);
        } catch (Exception e) {
            log.error("Falha na indexação semântica assíncrona (entidade={}, id={}). Marcando como não indexado para retentativa: {}",
                    doc.entidade(), doc.idOrigem(), e.getMessage(), e);
            try {
                indexador.marcarNaoIndexado(doc);
            } catch (Exception ex) {
                log.error("Falha ao marcar documento como não indexado (entidade={}, id={}): {}",
                        doc.entidade(), doc.idOrigem(), ex.getMessage(), ex);
            }
        }
    }
}
