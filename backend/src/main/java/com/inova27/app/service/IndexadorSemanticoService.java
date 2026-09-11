package com.inova27.app.service;

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

    public void indexar(DocumentoSemantico doc) {

        List<Double> embedding = embeddingService.gerarEmbeddingParaSalvar(doc.textoCompleto());

        if (embedding.size() != 1024) { // 🔥 Estava 768 ->> 1024
            throw new IllegalStateException("Embedding inválido: " + embedding.size());
        }

        String vetorFormatado = EmbeddingUtils.toPgVector(embedding);

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