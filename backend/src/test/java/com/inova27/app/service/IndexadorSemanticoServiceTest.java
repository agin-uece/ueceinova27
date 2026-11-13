package com.inova27.app.service;

import com.inova27.app.dto.buscasemantica.DocumentoSemantico;
import com.inova27.app.exception.OllamaIntegrationException;
import com.inova27.app.repository.BuscaSemanticaRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("IndexadorSemanticoService - uma entrada por item na busca")
class IndexadorSemanticoServiceTest {

    @Mock
    private EmbeddingService embeddingService;

    @Mock
    private BuscaSemanticaRepository repository;

    @InjectMocks
    private IndexadorSemanticoService indexador;

    private final DocumentoSemantico doc = new DocumentoSemantico("jogos", 10L, "Xadrez", "desc", "texto");

    @Test
    @DisplayName("Indexar substitui a entrada existente (remove antes de inserir): validar duas vezes não duplica")
    void indexarSubstituiEntradaExistente() {
        when(embeddingService.gerarEmbeddingParaSalvar("texto")).thenReturn(Collections.nCopies(1024, 0.1));

        indexador.indexar(doc);

        InOrder ordem = inOrder(repository);
        ordem.verify(repository).removerPorEntidadeEIdOrigem("jogos", 10L);
        ordem.verify(repository).salvar(eq("jogos"), eq(10L), eq("Xadrez"), eq("desc"), eq("texto"), anyString());
    }

    @Test
    @DisplayName("Se o Ollama falhar, a entrada antiga permanece no índice")
    void falhaNoOllamaPreservaIndiceAntigo() {
        when(embeddingService.gerarEmbeddingParaSalvar("texto")).thenThrow(new OllamaIntegrationException("down"));

        assertThatThrownBy(() -> indexador.indexar(doc)).isInstanceOf(OllamaIntegrationException.class);
        verifyNoInteractions(repository);
    }

    @Test
    @DisplayName("Embedding com dimensão errada não altera o índice")
    void dimensaoErradaNaoAlteraIndice() {
        when(embeddingService.gerarEmbeddingParaSalvar("texto")).thenReturn(List.of(0.1, 0.2));

        assertThatThrownBy(() -> indexador.indexar(doc)).isInstanceOf(OllamaIntegrationException.class);
        verifyNoInteractions(repository);
    }
}
