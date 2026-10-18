package com.inova27.app.service;

import com.inova27.app.exception.OllamaIntegrationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class EmbeddingService {

    @Value("${ollama.base-url}")
    private String ollamaBaseUrl;

    private RestTemplate restTemplate = new RestTemplate();

    public List<Double> gerarEmbeddingParaBusca(String textoPesquisa) {
        String textoFormatado = "search_query: " + textoPesquisa;
        return chamarOllama(textoFormatado);
    }

    public List<Double> gerarEmbeddingParaSalvar(String textoDocumento) {
        String textoFormatado = "search_document: " + textoDocumento;
        return chamarOllama(textoFormatado);
    }

    public String expandirConsultaGlobal(String textoOriginal) {
        String url = ollamaBaseUrl + "/api/generate";

        String prompt = """
                [SYSTEM: MOTOR DE BUSCA SEMÂNTICA]

                Sua tarefa é transformar uma consulta de usuário em uma representação semântica rica para melhorar buscas por embeddings.

                ENTRADA DO USUÁRIO:
                "%s"
                """.formatted(textoOriginal);

        Map<String, Object> body = Map.of(
                "model", "phi3",
                "prompt", prompt,
                "stream", false
        );

        try {
            log.info("Expandindo consulta semântica...");

            ResponseEntity<Map<String, Object>> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            new HttpEntity<>(body),
                            new ParameterizedTypeReference<>() {}
                    );

            Map<String, Object> responseBody = response.getBody();

            if (responseBody == null || !responseBody.containsKey("response")) {
                throw new OllamaIntegrationException("Resposta inválida do Ollama");
            }

            String textoExpandido = (String) responseBody.get("response");

            log.debug("Consulta expandida: {}", textoExpandido);

            return textoExpandido.trim();

        } catch (Exception e) {
            log.warn("Falha na expansão, usando original: {}", e.getMessage());
            return textoOriginal;
        }
    }

    private List<Double> chamarOllama(String texto) {
        String url = ollamaBaseUrl + "/api/embed";

        Map<String, Object> body = Map.of(
                "model", "mxbai-embed-large",
                "input", texto
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map<String, Object>> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            request,
                            new ParameterizedTypeReference<>() {}
                    );

            Map<String, Object> responseBody = response.getBody();

            if (responseBody == null) {
                throw new OllamaIntegrationException("Resposta nula do Ollama");
            }

            if (responseBody.containsKey("error")) {
                throw new OllamaIntegrationException("Ollama recusou: " + responseBody.get("error"));
            }

            if (responseBody.containsKey("embeddings")) {
                List<List<Double>> matriz = (List<List<Double>>) responseBody.get("embeddings");
                if (matriz != null && !matriz.isEmpty() && !matriz.get(0).isEmpty()) {
                    return matriz.get(0);
                }
            }

            if (responseBody.containsKey("embedding")) {
                List<Double> vetor = (List<Double>) responseBody.get("embedding");
                if (vetor != null && !vetor.isEmpty()) {
                    return vetor;
                }
            }

            throw new OllamaIntegrationException("Formato inesperado: " + responseBody);

        } catch (Exception e) {
            throw new OllamaIntegrationException("Falha na comunicação com Ollama", e);
        }
    }
}