package com.inova27.app.service;

import java.text.Normalizer;
import com.inova27.app.dto.buscasemantica.BuscaResultadoDTO;
import com.inova27.app.repository.BuscaSemanticaRepository;
import com.inova27.app.utils.EmbeddingUtils;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BuscaService {

    private final EmbeddingService embeddingService;
    private final BuscaSemanticaRepository repository;

    public BuscaService(
            EmbeddingService embeddingService,
            BuscaSemanticaRepository repository
    ) {
        this.embeddingService = embeddingService;
        this.repository = repository;
    }

    public List<BuscaResultadoDTO> buscar(String texto) {

        // 1. Remove os acentos usando Normalização NFD e Regex
        String textoSemAcento = Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");

        String textoLimpo = textoSemAcento
                .trim()
                .toLowerCase()
                .replaceAll("\\s+", " ");


        // 3. Gera a lista de doubles do modelo (Ollama/OpenAI)
        List<Double> embedding = embeddingService.gerarEmbeddingParaBusca(textoLimpo);

        String vetorString = EmbeddingUtils.toPgVector(embedding);

        // 4. Passa a String para o repositório
        return repository.buscarCompleto(
                        vetorString,
                        textoLimpo
                )
                .stream()
                .map(r -> new BuscaResultadoDTO(
                        (String) r[0],
                        ((Number) r[1]).longValue(),
                        (String) r[2],
                        (String) r[3],
                        ((Number) r[4]).doubleValue()
                ))
                .toList();
    }
}