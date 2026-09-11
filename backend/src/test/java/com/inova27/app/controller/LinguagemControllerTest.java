package com.inova27.app.controller;

import com.inova27.app.dto.linguagem.LinguagemCreateDTO;
import com.inova27.app.dto.linguagem.LinguagemResponseDTO;
import com.inova27.app.dto.linguagem.LinguagemUpdateDTO;
import com.inova27.app.service.LinguagemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LinguagemControllerTest {

    @Mock
    private LinguagemService service;

    @InjectMocks
    private LinguagemController controller;

    private LinguagemResponseDTO mockResponseDTO;

    @BeforeEach
    void setUp() {
        mockResponseDTO = new LinguagemResponseDTO(1L, "Java");
    }

    // ==========================================
    // POST /linguagens (Criar)
    // ==========================================
    @Test
    @DisplayName("Deve criar linguagem com sucesso e retornar 201 Created")
    void testCriar_Sucesso() {
        LinguagemCreateDTO dto = new LinguagemCreateDTO("Java");
        when(service.criar(dto)).thenReturn(mockResponseDTO);

        ResponseEntity<Object> response = controller.criar(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getHeaders().getLocation()).hasPath("/api/linguagens/1");
        assertThat(response.getBody()).isEqualTo(mockResponseDTO);
    }

    // ==========================================
    // GET /linguagens (Listar Todos)
    // ==========================================
    @Test
    @DisplayName("Deve listar todas as linguagens com sucesso")
    void testListarTodos_Sucesso() {
        when(service.listarTodos()).thenReturn(List.of(mockResponseDTO));

        ResponseEntity<Object> response = controller.listarTodos();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(List.of(mockResponseDTO));
    }

    // ==========================================
    // GET /linguagens/{id} (Buscar por ID)
    // ==========================================
    @Test
    @DisplayName("Deve buscar linguagem por ID com sucesso")
    void testBuscarPorId_Sucesso() {
        when(service.buscarPorId(1L)).thenReturn(mockResponseDTO);

        ResponseEntity<Object> response = controller.buscarPorId(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(mockResponseDTO);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR ao falhar na busca por ID")
    void testBuscarPorId_Exception() {
        when(service.buscarPorId(1L)).thenThrow(new RuntimeException("Erro catastrófico"));

        ResponseEntity<Object> response = controller.buscarPorId(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ==========================================
    // PUT /linguagens/{id} (Atualizar)
    // ==========================================
    @Test
    @DisplayName("Deve atualizar a linguagem com sucesso")
    void testAtualizar_Sucesso() {
        LinguagemUpdateDTO dto = new LinguagemUpdateDTO("Python");
        when(service.atualizar(1L, dto)).thenReturn(new LinguagemResponseDTO(1L, "Python"));

        ResponseEntity<Object> response = controller.atualizar(1L, dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("Deve retornar NOT_FOUND ao atualizar se a mensagem contiver 'não encontrada'")
    void testAtualizar_NotFound() {
        LinguagemUpdateDTO dto = new LinguagemUpdateDTO("Python");
        when(service.atualizar(1L, dto)).thenThrow(new IllegalArgumentException("Linguagem não encontrada no sistema."));

        ResponseEntity<Object> response = controller.atualizar(1L, dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Deve retornar BAD_REQUEST ao atualizar se a mensagem não for de NotFound")
    void testAtualizar_BadRequest() {
        LinguagemUpdateDTO dto = new LinguagemUpdateDTO("Python");
        when(service.atualizar(1L, dto)).thenThrow(new IllegalArgumentException("Nome inválido ou já existente"));

        ResponseEntity<Object> response = controller.atualizar(1L, dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR na atualização")
    void testAtualizar_Exception() {
        LinguagemUpdateDTO dto = new LinguagemUpdateDTO("Python");
        when(service.atualizar(1L, dto)).thenThrow(new RuntimeException("Erro db"));

        ResponseEntity<Object> response = controller.atualizar(1L, dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ==========================================
    // DELETE /linguagens/{id}
    // ==========================================
    @Test
    @DisplayName("Deve deletar a linguagem com sucesso e retornar 204")
    void testDeletar_Sucesso() {
        // Como o serviço é void, não precisa de "when", apenas executa e verifica
        ResponseEntity<Object> response = controller.deletar(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(service, times(1)).deletar(1L);
    }

    @Test
    @DisplayName("Deve retornar NOT_FOUND ao deletar ID inexistente")
    void testDeletar_IllegalArgument() {
        doThrow(new IllegalArgumentException("Linguagem não encontrada")).when(service).deletar(1L);

        ResponseEntity<Object> response = controller.deletar(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR ao deletar com erro inesperado")
    void testDeletar_Exception() {
        doThrow(new RuntimeException("Lock do BD")).when(service).deletar(1L);

        ResponseEntity<Object> response = controller.deletar(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}