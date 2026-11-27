package com.inova27.app.service;

import com.inova27.app.dto.buscasemantica.DocumentoSemantico;
import com.inova27.app.exception.OllamaIntegrationException;
import com.inova27.app.model.BuscaSemantica;
import com.inova27.app.repository.BuscaSemanticaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class ReindexacaoSemanticaJob {

    private final BuscaSemanticaRepository buscaSemanticaRepository;
    private final IndexadorSemanticoService indexador;

    /**
     * A cada 24 horas tenta indexar novamente todos os documentos marcados como não indexados.
     */
    @Scheduled(
            fixedDelayString = "${indexacao.reindexar-intervalo-ms:86400000}",
            initialDelayString = "${indexacao.reindexar-delay-inicial-ms:86400000}"
    )
    public void reindexarPendentes() {
        List<BuscaSemantica> pendentes = buscaSemanticaRepository.findByIndexadoFalse();
        if (pendentes.isEmpty()) {
            return;
        }

        log.info("Iniciando reindexação periódica de {} documento(s) não indexado(s)...", pendentes.size());
        int indexados = 0;

        for (BuscaSemantica item : pendentes) {
            DocumentoSemantico doc = new DocumentoSemantico(
                    item.getEntidade(),
                    item.getIdOrigem(),
                    item.getTitulo(),
                    item.getDescricao(),
                    item.getTextoCompleto()
            );
            try {
                indexador.indexar(doc);
                indexados++;
            } catch (OllamaIntegrationException e) {
                log.warn("Ollama indisponível durante reindexação periódica; {} de {} documento(s) indexado(s). Nova tentativa em 24h.",
                        indexados, pendentes.size());
                return;
            } catch (Exception e) {
                log.error("Falha ao reindexar documento (entidade={}, id={}): {}",
                        doc.entidade(), doc.idOrigem(), e.getMessage(), e);
            }
        }

        log.info("Reindexação periódica concluída: {} de {} documento(s) indexado(s).", indexados, pendentes.size());
    }
}
