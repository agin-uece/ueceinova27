package com.inova27.app.controller;

import com.inova27.app.dto.jogo.JogoCreateDTO;
import com.inova27.app.dto.jogo.JogoFiltroDTO;
import com.inova27.app.dto.jogo.JogoResponseDTO;
import com.inova27.app.dto.jogo.JogoUpdateDTO;
import com.inova27.app.exception.MfaRequiredException;
import com.inova27.app.model.StatusValidacao;
import com.inova27.app.model.Usuario;
import com.inova27.app.security.MfaGuard;
import com.inova27.app.service.JogoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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
class JogoControllerTest {

    @Mock
    private JogoService service;

    @Mock
    private MfaGuard mfaGuard;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private JogoController controller;

    private Usuario mockUsuario;
    private JogoResponseDTO mockJogoResponse;

    @BeforeEach
    void setUp() {
        mockUsuario = new Usuario();
        mockUsuario.setId(1L);

        // Usando um mock para o ResponseDTO
        mockJogoResponse = mock(JogoResponseDTO.class);
    }

    // ==========================================
    // GET /jogos/buscar (buscarComFiltros)
    // ==========================================
    @Test
    @DisplayName("Deve buscar jogos com filtros e paginação com sucesso")
    void testBuscarComFiltros_Sucesso() {
        JogoFiltroDTO filtro = mock(JogoFiltroDTO.class);
        Page<JogoResponseDTO> pagina = new PageImpl<>(List.of(mockJogoResponse));

        when(service.buscarComFiltrosPaginado(eq(filtro), any(Pageable.class))).thenReturn(pagina);

        ResponseEntity<Object> response = controller.buscarComFiltros(filtro, Pageable.unpaged());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(pagina);
    }

    @Test
    @DisplayName("Deve retornar BAD_REQUEST em buscarComFiltros por argumento inválido")
    void testBuscarComFiltros_IllegalArgument() {
        when(service.buscarComFiltrosPaginado(any(), any())).thenThrow(new IllegalArgumentException("Filtro inválido"));

        ResponseEntity<Object> response = controller.buscarComFiltros(mock(JogoFiltroDTO.class), Pageable.unpaged());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR em buscarComFiltros por erro genérico")
    void testBuscarComFiltros_Exception() {
        when(service.buscarComFiltrosPaginado(any(), any())).thenThrow(new RuntimeException("Erro no banco"));

        ResponseEntity<Object> response = controller.buscarComFiltros(mock(JogoFiltroDTO.class), Pageable.unpaged());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    


    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR na criação com erro genérico")
    void testCriar_Exception() {
        JogoCreateDTO dto = mock(JogoCreateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.criar(dto, mockUsuario)).thenThrow(new RuntimeException("Falha"));

        ResponseEntity<Object> response = controller.criar(dto, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ==========================================
    // PUT /jogos/{id}/validar
    // ==========================================
    @Test
    @DisplayName("Deve validar jogo com sucesso")
    void testValidar_Sucesso() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);

        ResponseEntity<Object> response = controller.validar(1L, true, authentication, "123456");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(service, times(1)).validarJogo(1L, true, mockUsuario);
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao tentar validar sem estar logado")
    void testValidar_Unauthenticated() {
        ResponseEntity<Object> response = controller.validar(1L, true, null, null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    @DisplayName("Deve retornar NOT_FOUND ao tentar validar jogo que não existe")
    void testValidar_IllegalArgument() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        doThrow(new IllegalArgumentException("Jogo não encontrado")).when(service).validarJogo(1L, true, mockUsuario);

        ResponseEntity<Object> response = controller.validar(1L, true, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // ==========================================
    // GET /jogos/meus
    // ==========================================
    @Test
    @DisplayName("Deve listar meus jogos com status específico")
    void testListarMinhas_ComStatus() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        Page<JogoResponseDTO> pagina = new PageImpl<>(List.of(mockJogoResponse));
        when(service.listarPorUsuarioEStatus(eq(1L), eq(StatusValidacao.APROVADO), any(Pageable.class))).thenReturn(pagina);

        ResponseEntity<Object> response = controller.listarMinhas(authentication, StatusValidacao.APROVADO, 0, 5);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("Deve listar meus jogos sem status")
    void testListarMinhas_SemStatus() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        Page<JogoResponseDTO> pagina = new PageImpl<>(List.of(mockJogoResponse));
        when(service.listarPorUsuario(eq(1L), any(Pageable.class))).thenReturn(pagina);

        ResponseEntity<Object> response = controller.listarMinhas(authentication, null, 0, 5);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao buscar meus jogos sem login")
    void testListarMinhas_Unauthenticated() {
        ResponseEntity<Object> response = controller.listarMinhas(null, null, 0, 5);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR ao buscar meus jogos com erro")
    void testListarMinhas_Exception() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.listarPorUsuario(anyLong(), any())).thenThrow(new RuntimeException("Erro"));
        ResponseEntity<Object> response = controller.listarMinhas(authentication, null, 0, 5);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ==========================================
    // PUT /jogos/{id} (Atualizar)
    // ==========================================
    @Test
    @DisplayName("Deve atualizar jogo diretamente e retornar 200 OK")
    void testAtualizar_Direto_Sucesso() {
        JogoUpdateDTO dto = mock(JogoUpdateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.atualizar(1L, dto, mockUsuario)).thenReturn(mockJogoResponse);

        ResponseEntity<Object> response = controller.atualizar(1L, dto, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(mockJogoResponse);
        verify(mfaGuard, times(1)).check(mockUsuario, "123");
    }



    @Test
    @DisplayName("Deve retornar FORBIDDEN ao atualizar jogo de outra pessoa")
    void testAtualizar_SecurityException() {
        JogoUpdateDTO dto = mock(JogoUpdateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.atualizar(1L, dto, mockUsuario)).thenThrow(new SecurityException("Sem permissão"));

        ResponseEntity<Object> response = controller.atualizar(1L, dto, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    @DisplayName("Deve retornar NOT_FOUND ao atualizar id inexistente")
    void testAtualizar_IllegalArgument() {
        JogoUpdateDTO dto = mock(JogoUpdateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.atualizar(1L, dto, mockUsuario)).thenThrow(new IllegalArgumentException("Não achou"));

        ResponseEntity<Object> response = controller.atualizar(1L, dto, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR ao atualizar com erro generico")
    void testAtualizar_Exception() {
        JogoUpdateDTO dto = mock(JogoUpdateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.atualizar(1L, dto, mockUsuario)).thenThrow(new RuntimeException("Erro BD"));

        ResponseEntity<Object> response = controller.atualizar(1L, dto, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao atualizar sem login")
    void testAtualizar_Unauthenticated() {
        ResponseEntity<Object> response = controller.atualizar(1L, mock(JogoUpdateDTO.class), null, "123");
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    // ==========================================
    // DELETE /jogos/{id}
    // ==========================================
    @Test
    @DisplayName("Deve deletar jogo imediatamente e retornar 204 NO_CONTENT")
    void testDeletar_Imediato_Sucesso() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.deletar(1L, mockUsuario)).thenReturn(true);

        ResponseEntity<Object> response = controller.deletar(1L, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(mfaGuard, times(1)).check(mockUsuario, "123");
    }

    @Test
    @DisplayName("Deve solicitar exclusão e retornar 202 ACCEPTED")
    void testDeletar_AguardandoAprovacao() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.deletar(1L, mockUsuario)).thenReturn(false);

        ResponseEntity<Object> response = controller.deletar(1L, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.ACCEPTED);
    }

    @Test
    @DisplayName("Deve retornar FORBIDDEN ao deletar jogo de outra pessoa")
    void testDeletar_SecurityException() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.deletar(1L, mockUsuario)).thenThrow(new SecurityException("Sem permissão"));

        ResponseEntity<Object> response = controller.deletar(1L, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    @DisplayName("Deve retornar NOT_FOUND ao deletar id inexistente")
    void testDeletar_IllegalArgument() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.deletar(1L, mockUsuario)).thenThrow(new IllegalArgumentException("Não achou"));

        ResponseEntity<Object> response = controller.deletar(1L, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR ao deletar com erro generico")
    void testDeletar_Exception() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.deletar(1L, mockUsuario)).thenThrow(new RuntimeException("Erro BD"));

        ResponseEntity<Object> response = controller.deletar(1L, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao deletar sem login")
    void testDeletar_Unauthenticated() {
        ResponseEntity<Object> response = controller.deletar(1L, null, "123");
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    // ==========================================
    // GET Simples (listarPorStatus, listarTodos, buscarPorId)
    // ==========================================
    @Test
    @DisplayName("Deve listar por status com sucesso")
    void testListarPorStatus() {
        when(service.listarPorStatus(StatusValidacao.APROVADO)).thenReturn(List.of(mockJogoResponse));
        ResponseEntity<Object> response = controller.listarPorStatus(StatusValidacao.APROVADO);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR ao listar por status")
    void testListarPorStatus_Exception() {
        when(service.listarPorStatus(any())).thenThrow(new RuntimeException("Erro"));
        ResponseEntity<Object> response = controller.listarPorStatus(StatusValidacao.APROVADO);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    @DisplayName("Deve listar todos com sucesso")
    void testListarTodos() {
        when(service.listarTodos()).thenReturn(List.of(mockJogoResponse));
        ResponseEntity<Object> response = controller.listarTodos();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR ao listar todos")
    void testListarTodos_Exception() {
        when(service.listarTodos()).thenThrow(new RuntimeException("Erro"));
        ResponseEntity<Object> response = controller.listarTodos();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    @DisplayName("Deve buscar por ID com sucesso")
    void testBuscarPorId() {
        when(service.buscarPorId(1L)).thenReturn(mockJogoResponse);
        ResponseEntity<Object> response = controller.buscarPorId(1L);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("Deve retornar NOT_FOUND ao buscar por ID inexistente")
    void testBuscarPorId_NotFound() {
        when(service.buscarPorId(1L)).thenThrow(new IllegalArgumentException("Não achou"));
        ResponseEntity<Object> response = controller.buscarPorId(1L);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR ao buscar por ID com falha")
    void testBuscarPorId_Exception() {
        when(service.buscarPorId(1L)).thenThrow(new RuntimeException("Erro"));
        ResponseEntity<Object> response = controller.buscarPorId(1L);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}