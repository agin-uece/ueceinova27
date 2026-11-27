package com.inova27.app.service;

import com.inova27.app.dto.buscasemantica.DocumentoSemantico;
import com.inova27.app.exception.OllamaIntegrationException;
import com.inova27.app.model.BuscaSemantica;
import com.inova27.app.repository.BuscaSemanticaRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ReindexacaoSemanticaJob - reindexação periódica a cada 24h")
class ReindexacaoSemanticaJobTest {

    @Mock
    private BuscaSemanticaRepository buscaSemanticaRepository;

    @Mock
    private IndexadorSemanticoService indexador;

    @InjectMocks
    private ReindexacaoSemanticaJob job;

    private BuscaSemantica pendente(String entidade, Long id, String titulo) {
        BuscaSemantica b = new BuscaSemantica();
        b.setEntidade(entidade);
        b.setIdOrigem(id);
        b.setTitulo(titulo);
        b.setDescricao("desc " + titulo);
        b.setTextoCompleto("texto " + titulo);
        b.setIndexado(false);
        return b;
    }

    @Test
    @DisplayName("Não aciona o indexador quando não há documentos pendentes")
    void nadaAFazerQuandoSemPendentes() {
        when(buscaSemanticaRepository.findByIndexadoFalse()).thenReturn(List.of());

        job.reindexarPendentes();

        verifyNoInteractions(indexador);
    }

    @Test
    @DisplayName("Reindexa todos os documentos marcados como não indexados")
    void reindexaTodosOsPendentes() {
        BuscaSemantica item1 = pendente("jogos", 1L, "Xadrez");
        BuscaSemantica item2 = pendente("startups", 2L, "InovaTech");
        when(buscaSemanticaRepository.findByIndexadoFalse()).thenReturn(List.of(item1, item2));

        job.reindexarPendentes();

        verify(indexador).indexar(new DocumentoSemantico("jogos", 1L, "Xadrez", "desc Xadrez", "texto Xadrez"));
        verify(indexador).indexar(new DocumentoSemantico("startups", 2L, "InovaTech", "desc InovaTech", "texto InovaTech"));
    }

    @Test
    @DisplayName("Interrompe o lote se o Ollama estiver indisponível")
    void interrompeLoteQuandoOllamaIndisponivel() {
        BuscaSemantica item1 = pendente("jogos", 1L, "Xadrez");
        BuscaSemantica item2 = pendente("startups", 2L, "InovaTech");
        when(buscaSemanticaRepository.findByIndexadoFalse()).thenReturn(List.of(item1, item2));
        doThrow(new OllamaIntegrationException("Ollama offline"))
                .when(indexador).indexar(new DocumentoSemantico("jogos", 1L, "Xadrez", "desc Xadrez", "texto Xadrez"));

        job.reindexarPendentes();

        verify(indexador, times(1)).indexar(any());
    }

    @Test
    @DisplayName("Continua processando os próximos documentos se ocorrer erro pontual não relacionado ao Ollama")
    void continuaNoProximoEmErroPontual() {
        BuscaSemantica item1 = pendente("jogos", 1L, "Xadrez");
        BuscaSemantica item2 = pendente("startups", 2L, "InovaTech");
        when(buscaSemanticaRepository.findByIndexadoFalse()).thenReturn(List.of(item1, item2));
        doThrow(new IllegalStateException("Erro inesperado"))
                .when(indexador).indexar(new DocumentoSemantico("jogos", 1L, "Xadrez", "desc Xadrez", "texto Xadrez"));

        job.reindexarPendentes();

        verify(indexador).indexar(new DocumentoSemantico("jogos", 1L, "Xadrez", "desc Xadrez", "texto Xadrez"));
        verify(indexador).indexar(new DocumentoSemantico("startups", 2L, "InovaTech", "desc InovaTech", "texto InovaTech"));
    }
}
