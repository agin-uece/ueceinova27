package com.inova27.app.controller;

import com.inova27.app.dto.protecao.ProtecaoCreateDTO;
import com.inova27.app.dto.protecao.ProtecaoResponseDTO;
import com.inova27.app.dto.protecao.ProtecaoUpdateDTO;
import com.inova27.app.exception.MfaRequiredException;
import com.inova27.app.model.Usuario;
import com.inova27.app.security.MfaGuard;
import com.inova27.app.service.ProtecaoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProtecaoControllerTest {

    @Mock
    private ProtecaoService service;

    @Mock
    private MfaGuard mfaGuard;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ProtecaoController controller;

    private Usuario mockUsuario;
    private ProtecaoResponseDTO mockResponseDTO;

    @BeforeEach
    void setUp() {
        mockUsuario = new Usuario();
        mockUsuario.setId(1L);
        // Usando um mock puro para o Record, pois os detalhes não importam pro Controller
        mockResponseDTO = mock(ProtecaoResponseDTO.class);
    }

    // ==========================================
    // POST /protecoes (Criar)
    // ==========================================
    @Test
    @DisplayName("Deve criar proteção com sucesso e retornar 201 Created")
    void testCriar_Sucesso() {
        ProtecaoCreateDTO dto = mock(ProtecaoCreateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(mockResponseDTO.id()).thenReturn(10L); // Para montar a URI do Created
        when(service.criar(dto, mockUsuario.getId())).thenReturn(mockResponseDTO);

        ResponseEntity<Object> response = controller.criar(dto, authentication, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getHeaders().getLocation()).hasPath("/api/protecoes/10");
        verify(mfaGuard, times(1)).check(mockUsuario, "1234");
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao criar sem autenticação")
    void testCriar_NaoAutenticado() {
        ProtecaoCreateDTO dto = mock(ProtecaoCreateDTO.class);
        ResponseEntity<Object> response = controller.criar(dto, null, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR em erro genérico na criação")
    void testCriar_Exception() {
        ProtecaoCreateDTO dto = mock(ProtecaoCreateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.criar(dto, mockUsuario.getId())).thenThrow(new RuntimeException("Erro"));

        ResponseEntity<Object> response = controller.criar(dto, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ==========================================
    // PUT /protecoes/{id} (Atualizar)
    // ==========================================
    @Test
    @DisplayName("Deve atualizar proteção com sucesso e retornar 200 OK")
    void testAtualizar_Sucesso() {
        ProtecaoUpdateDTO dto = mock(ProtecaoUpdateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.atualizar(1L, dto, mockUsuario.getId())).thenReturn(mockResponseDTO);

        ResponseEntity<Object> response = controller.atualizar(1L, dto, authentication, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(mfaGuard, times(1)).check(mockUsuario, "1234");
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao atualizar sem autenticação")
    void testAtualizar_NaoAutenticado() {
        ProtecaoUpdateDTO dto = mock(ProtecaoUpdateDTO.class);
        ResponseEntity<Object> response = controller.atualizar(1L, dto, null, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR em erro genérico na atualização")
    void testAtualizar_Exception() {
        ProtecaoUpdateDTO dto = mock(ProtecaoUpdateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.atualizar(1L, dto, mockUsuario.getId())).thenThrow(new RuntimeException("Erro"));

        ResponseEntity<Object> response = controller.atualizar(1L, dto, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ==========================================
    // GET /protecoes (Listar Todas)
    // ==========================================
    @Test
    @DisplayName("Deve listar todas as proteções com sucesso")
    void testListarTodas_Sucesso() {
        when(service.listarTodas()).thenReturn(List.of(mockResponseDTO));

        ResponseEntity<Object> response = controller.listarTodas();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(List.of(mockResponseDTO));
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR ao falhar listarTodas")
    void testListarTodas_Exception() {
        when(service.listarTodas()).thenThrow(new RuntimeException("Erro"));

        ResponseEntity<Object> response = controller.listarTodas();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ==========================================
    // GET /protecoes/{id} (Buscar por ID)
    // ==========================================
    @Test
    @DisplayName("Deve buscar proteção por ID com sucesso")
    void testBuscarPorId_Sucesso() {
        when(service.buscarPorId(1L)).thenReturn(mockResponseDTO);

        ResponseEntity<Object> response = controller.buscarPorId(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(mockResponseDTO);
    }

    @Test
    @DisplayName("Deve retornar NOT_FOUND ao buscar por ID inexistente")
    void testBuscarPorId_NotFound() {
        when(service.buscarPorId(1L)).thenThrow(new IllegalArgumentException("Não achou"));

        ResponseEntity<Object> response = controller.buscarPorId(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR ao falhar buscarPorId")
    void testBuscarPorId_Exception() {
        when(service.buscarPorId(1L)).thenThrow(new RuntimeException("Erro"));

        ResponseEntity<Object> response = controller.buscarPorId(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ==========================================
    // DELETE /protecoes/{id} (Deletar)
    // ==========================================
    @Test
    @DisplayName("Deve deletar proteção com sucesso e retornar 204")
    void testDeletar_Sucesso() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);

        ResponseEntity<Object> response = controller.deletar(1L, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(service, times(1)).deletar(1L, mockUsuario.getId());
        verify(mfaGuard, times(1)).check(mockUsuario, "123");
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao deletar sem autenticação")
    void testDeletar_NaoAutenticado() {
        ResponseEntity<Object> response = controller.deletar(1L, null, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    @DisplayName("Deve retornar NOT_FOUND ao tentar deletar ID inexistente")
    void testDeletar_NotFound() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        doThrow(new IllegalArgumentException("Não achou")).when(service).deletar(1L, mockUsuario.getId());

        ResponseEntity<Object> response = controller.deletar(1L, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR em erro genérico ao deletar")
    void testDeletar_Exception() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        doThrow(new RuntimeException("Erro")).when(service).deletar(1L, mockUsuario.getId());

        ResponseEntity<Object> response = controller.deletar(1L, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ==========================================
    // PUT /protecoes/{id}/jogo/{jogoId} (Vincular)
    // ==========================================
    @Test
    @DisplayName("Deve vincular jogo à proteção com sucesso")
    void testVincularJogo_Sucesso() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);

        ResponseEntity<Object> response = controller.vincularJogo(1L, 2L, authentication);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(service, times(1)).vincularJogo(1L, 2L, mockUsuario.getId());
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao vincular sem estar logado")
    void testVincularJogo_NaoAutenticado() {
        ResponseEntity<Object> response = controller.vincularJogo(1L, 2L, null);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    @DisplayName("Deve retornar NOT_FOUND se proteção ou jogo não existirem ao vincular")
    void testVincularJogo_NotFound() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        doThrow(new IllegalArgumentException("Não achou")).when(service).vincularJogo(1L, 2L, mockUsuario.getId());

        ResponseEntity<Object> response = controller.vincularJogo(1L, 2L, authentication);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR em erro genérico ao vincular")
    void testVincularJogo_Exception() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        doThrow(new RuntimeException("Erro")).when(service).vincularJogo(1L, 2L, mockUsuario.getId());

        ResponseEntity<Object> response = controller.vincularJogo(1L, 2L, authentication);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ==========================================
    // DELETE /protecoes/{id}/jogo/{jogoId} (Desvincular)
    // ==========================================
    @Test
    @DisplayName("Deve desvincular jogo da proteção com sucesso")
    void testDesvincularJogo_Sucesso() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);

        ResponseEntity<Object> response = controller.desvincularJogo(1L, 2L, authentication);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(service, times(1)).desvincularJogo(1L, 2L, mockUsuario.getId());
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao desvincular sem estar logado")
    void testDesvincularJogo_NaoAutenticado() {
        ResponseEntity<Object> response = controller.desvincularJogo(1L, 2L, null);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    @DisplayName("Deve retornar NOT_FOUND se proteção ou jogo não existirem ao desvincular")
    void testDesvincularJogo_NotFound() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        doThrow(new IllegalArgumentException("Não achou")).when(service).desvincularJogo(1L, 2L, mockUsuario.getId());

        ResponseEntity<Object> response = controller.desvincularJogo(1L, 2L, authentication);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR em erro genérico ao desvincular")
    void testDesvincularJogo_Exception() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        doThrow(new RuntimeException("Erro")).when(service).desvincularJogo(1L, 2L, mockUsuario.getId());

        ResponseEntity<Object> response = controller.desvincularJogo(1L, 2L, authentication);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}