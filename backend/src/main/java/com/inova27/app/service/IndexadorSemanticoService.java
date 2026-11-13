package com.inova27.app.service;

import com.inova27.app.exception.OllamaIntegrationException;
import com.inova27.app.dto.buscasemantica.DocumentoSemantico;
import com.inova27.app.repository.BuscaSemanticaRepository;
import com.inova27.app.utils.EmbeddingUtils;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IndexadorSemanticoService {

    private final EmbeddingService embeddingService;
    private final BuscaSemanticaRepository repository;

    public IndexadorSemanticoService(
            EmbeddingService embeddingService,
            BuscaSemanticaRepository repository
    ) {
        this.embeddingService = embeddingService;
        this.repository = repository;
    }

    public void removerIndex(String tipoDocumento, Long id) {

            // Usa o seu repositório customizado para deletar o registro vetorial
        repository.removerPorEntidadeEIdOrigem(tipoDocumento, id);

    }

    /**
     * Cria ou substitui a entrada do documento no índice (no máximo uma por entidade + id).
     * O embedding é gerado antes de apagar a entrada antiga: se o Ollama falhar, o índice anterior é mantido.
     */
    public void indexar(DocumentoSemantico doc) {

        List<Double> embedding = embeddingService.gerarEmbeddingParaSalvar(doc.textoCompleto());

        if (embedding.size() != 1024) { // 🔥 Estava 768 ->> 1024
            throw new OllamaIntegrationException("Embedding inválido: " + embedding.size() + " dimensões (esperado 1024)");
        }

        String vetorFormatado = EmbeddingUtils.toPgVector(embedding);

        repository.removerPorEntidadeEIdOrigem(doc.entidade(), doc.idOrigem());

        repository.salvar(
                doc.entidade(),
                doc.idOrigem(),
                doc.titulo(),
                doc.descricao(),
                doc.textoCompleto(),
                vetorFormatado
        );
    }
}