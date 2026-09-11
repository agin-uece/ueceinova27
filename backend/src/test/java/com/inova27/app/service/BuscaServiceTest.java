package com.inova27.app.service;

import com.inova27.app.dto.buscasemantica.BuscaResultadoDTO;
import com.inova27.app.repository.BuscaSemanticaRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BuscaServiceTest {

    @Mock
    private EmbeddingService embeddingService;

    @Mock
    private BuscaSemanticaRepository repository;

    @InjectMocks
    private BuscaService buscaService;


    @Test
    @DisplayName("Deve retornar uma lista vazia quando o repositório não encontrar semelhanças")
    void testBuscar_SemResultados() {
        // Cenário
        String textoEntrada = "java";

        when(embeddingService.gerarEmbeddingParaBusca("java")).thenReturn(List.of(0.5, 0.6));
        when(repository.buscarCompleto(anyString(), eq("java"))).thenReturn(Collections.emptyList());

        // Ação
        List<BuscaResultadoDTO> resultados = buscaService.buscar(textoEntrada);

        // Verificação
        assertThat(resultados).isEmpty();
        verify(embeddingService, times(1)).gerarEmbeddingParaBusca("java");
    }
}