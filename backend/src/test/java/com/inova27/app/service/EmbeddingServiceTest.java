package com.inova27.app.service;

import com.inova27.app.exception.OllamaIntegrationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("EmbeddingService - Testes Unitários")
class EmbeddingServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private EmbeddingService embeddingService;

    private final String URL_GENERATE = "http://localhost:11434/api/generate";
    private final String URL_EMBED = "http://host.docker.internal:11434/api/embed";

    // =========================================================
    // expandirConsultaGlobal
    // =========================================================

    @Nested
    @DisplayName("expandirConsultaGlobal()")
    class ExpandirConsultaGlobal {

        @Test
        @DisplayName("Deve retornar texto expandido com sucesso usando o modelo phi3")
        void deveRetornarTextoExpandido() {
            String textoOriginal = "patente software";
            String textoExpandidoEsperado = "patente de software propriedade intelectual inovacao";

            Map<String, Object> mockResponseBody = Map.of("response", textoExpandidoEsperado);
            ResponseEntity<Map<String, Object>> mockResponse = new ResponseEntity<>(mockResponseBody, HttpStatus.OK);

            when(restTemplate.exchange(
                    eq(URL_GENERATE),
                    eq(HttpMethod.POST),
                    any(HttpEntity.class),
                    any(ParameterizedTypeReference.class)
            )).thenReturn(mockResponse);

            String resultado = embeddingService.expandirConsultaGlobal(textoOriginal);

            assertThat(resultado).isEqualTo(textoExpandidoEsperado);
            verify(restTemplate, times(1)).exchange(eq(URL_GENERATE), eq(HttpMethod.POST), any(), any(ParameterizedTypeReference.class));
        }

        @Test
        @DisplayName("Deve retornar texto original quando a resposta do Ollama for nula")
        void deveRetornarTextoOriginalQuandoRespostaNula() {
            String textoOriginal = "laboratorio quimica";

            when(restTemplate.exchange(
                    eq(URL_GENERATE),
                    eq(HttpMethod.POST),
                    any(HttpEntity.class),
                    any(ParameterizedTypeReference.class)
            )).thenReturn(new ResponseEntity<>((Object) null, HttpStatus.OK));

            String resultado = embeddingService.expandirConsultaGlobal(textoOriginal);

            assertThat(resultado).isEqualTo(textoOriginal);
        }

        @Test
        @DisplayName("Deve retornar texto original quando a chave 'response' não existir")
        void deveRetornarTextoOriginalQuandoNaoTiverChaveResponse() {
            String textoOriginal = "startup educacao";
            Map<String, Object> mockResponseBody = Map.of("outra_chave", "valor");

            when(restTemplate.exchange(
                    eq(URL_GENERATE),
                    eq(HttpMethod.POST),
                    any(HttpEntity.class),
                    any(ParameterizedTypeReference.class)
            )).thenReturn(new ResponseEntity<>(mockResponseBody, HttpStatus.OK));

            String resultado = embeddingService.expandirConsultaGlobal(textoOriginal);

            assertThat(resultado).isEqualTo(textoOriginal);
        }

        @Test
        @DisplayName("Deve retornar texto original (fallback) quando RestTemplate lançar exceção")
        void deveRetornarTextoOriginalQuandoOcorrerExcecao() {
            String textoOriginal = "pesquisador CNPq";

            when(restTemplate.exchange(
                    eq(URL_GENERATE),
                    eq(HttpMethod.POST),
                    any(HttpEntity.class),
                    any(ParameterizedTypeReference.class)
            )).thenThrow(new RuntimeException("Connection refused"));

            String resultado = embeddingService.expandirConsultaGlobal(textoOriginal);

            assertThat(resultado).isEqualTo(textoOriginal);
        }
    }

    // =========================================================
    // gerarEmbeddingParaBusca e gerarEmbeddingParaSalvar (chamarOllama)
    // =========================================================

    @Nested
    @DisplayName("Geração de Embeddings (chamarOllama)")
    class GerarEmbeddings {

        @Test
        @DisplayName("Deve gerar embedding de busca (search_query) com sucesso na matriz 'embeddings'")
        void deveGerarEmbeddingParaBuscaComSucessoEmMatriz() {
            String textoPesquisa = "projeto inovacao";
            List<Double> vetorEsperado = List.of(0.1, 0.2, 0.3);
            Map<String, Object> mockResponseBody = Map.of("embeddings", List.of(vetorEsperado));

            when(restTemplate.exchange(
                    eq(URL_EMBED),
                    eq(HttpMethod.POST),
                    any(HttpEntity.class),
                    any(ParameterizedTypeReference.class)
            )).thenReturn(new ResponseEntity<>(mockResponseBody, HttpStatus.OK));

            List<Double> resultado = embeddingService.gerarEmbeddingParaBusca(textoPesquisa);

            assertThat(resultado).isEqualTo(vetorEsperado);
        }

        @Test
        @DisplayName("Deve gerar embedding de documento (search_document) com sucesso no vetor único 'embedding'")
        void deveGerarEmbeddingParaSalvarComSucessoEmVetorUnico() {
            String textoDocumento = "Artigo sobre redes neurais.";
            List<Double> vetorEsperado = List.of(0.9, 0.8, 0.7);
            Map<String, Object> mockResponseBody = Map.of("embedding", vetorEsperado);

            when(restTemplate.exchange(
                    eq(URL_EMBED),
                    eq(HttpMethod.POST),
                    any(HttpEntity.class),
                    any(ParameterizedTypeReference.class)
            )).thenReturn(new ResponseEntity<>(mockResponseBody, HttpStatus.OK));

            List<Double> resultado = embeddingService.gerarEmbeddingParaSalvar(textoDocumento);

            assertThat(resultado).isEqualTo(vetorEsperado);
        }

        @Test
        @DisplayName("Deve lançar OllamaIntegrationException quando o retorno possuir a chave 'error'")
        void deveLancarExcecaoQuandoOllamaRetornarErro() {
            Map<String, Object> mockResponseBody = Map.of("error", "Model not found");

            when(restTemplate.exchange(
                    eq(URL_EMBED),
                    eq(HttpMethod.POST),
                    any(HttpEntity.class),
                    any(ParameterizedTypeReference.class)
            )).thenReturn(new ResponseEntity<>(mockResponseBody, HttpStatus.OK));

            assertThatThrownBy(() -> embeddingService.gerarEmbeddingParaSalvar("Teste"))
                    .isInstanceOf(OllamaIntegrationException.class)
                    .hasMessageContaining("Falha na comunicação com Ollama")
                    .cause() // <--- Verificando a causa embrulhada
                    .hasMessageContaining("Ollama recusou: Model not found");
        }

        @Test
        @DisplayName("Deve lançar OllamaIntegrationException quando o response body for nulo")
        void deveLancarExcecaoQuandoResponseBodyNulo() {
            when(restTemplate.exchange(
                    eq(URL_EMBED),
                    eq(HttpMethod.POST),
                    any(HttpEntity.class),
                    any(ParameterizedTypeReference.class)
            )).thenReturn(new ResponseEntity<>((Object) null, HttpStatus.OK));

            assertThatThrownBy(() -> embeddingService.gerarEmbeddingParaBusca("Teste"))
                    .isInstanceOf(OllamaIntegrationException.class)
                    .hasMessageContaining("Falha na comunicação com Ollama")
                    .cause() // <--- Verificando a causa embrulhada
                    .hasMessageContaining("Resposta nula do Ollama");
        }

        @Test
        @DisplayName("Deve lançar OllamaIntegrationException quando o formato for inesperado (sem matriz ou vetor válidos)")
        void deveLancarExcecaoQuandoFormatoInesperado() {
            Map<String, Object> mockResponseBody = Map.of("outra_chave", "valor_qualquer");

            when(restTemplate.exchange(
                    eq(URL_EMBED),
                    eq(HttpMethod.POST),
                    any(HttpEntity.class),
                    any(ParameterizedTypeReference.class)
            )).thenReturn(new ResponseEntity<>(mockResponseBody, HttpStatus.OK));

            assertThatThrownBy(() -> embeddingService.gerarEmbeddingParaBusca("Teste"))
                    .isInstanceOf(OllamaIntegrationException.class)
                    .hasMessageContaining("Falha na comunicação com Ollama")
                    .cause() // <--- Verificando a causa embrulhada
                    .hasMessageContaining("Formato inesperado");
        }

        @Test
        @DisplayName("Deve lançar OllamaIntegrationException quando ocorrer falha na rede ou timeout")
        void deveLancarExcecaoQuandoFalhaNaComunicacao() {
            when(restTemplate.exchange(
                    eq(URL_EMBED),
                    eq(HttpMethod.POST),
                    any(HttpEntity.class),
                    any(ParameterizedTypeReference.class)
            )).thenThrow(new RuntimeException("Timeout na conexão"));

            assertThatThrownBy(() -> embeddingService.gerarEmbeddingParaSalvar("Teste"))
                    .isInstanceOf(OllamaIntegrationException.class)
                    .hasMessageContaining("Falha na comunicação com Ollama");
        }
    }
}