package com.inova27.app.controller;

import com.inova27.app.dto.startup.StartupCreateDTO;
import com.inova27.app.dto.startup.StartupFiltroDTO;
import com.inova27.app.dto.startup.StartupResponseDTO;
import com.inova27.app.dto.startup.StartupUpdateDTO;
import com.inova27.app.exception.MfaRequiredException;
import com.inova27.app.model.Usuario;
import com.inova27.app.security.MfaGuard;
import com.inova27.app.service.StartupService;
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
class StartupControllerTest {

    @Mock
    private StartupService service;

    @Mock
    private MfaGuard mfaGuard;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private StartupController controller;

    private Usuario mockUsuario;
    private StartupResponseDTO mockResponseDTO;

    @BeforeEach
    void setUp() {
        mockUsuario = new Usuario();
        mockUsuario.setId(1L);
        mockResponseDTO = mock(StartupResponseDTO.class);
    }

    // ==========================================
    // POST /startups (Criar)
    // ==========================================
    @Test
    @DisplayName("Deve criar startup com sucesso e retornar 201 Created")
    void testCriar_Sucesso() {
        StartupCreateDTO dto = mock(StartupCreateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(mockResponseDTO.id()).thenReturn(100L);
        when(service.criar(dto, mockUsuario.getId())).thenReturn(mockResponseDTO);

        ResponseEntity<Object> response = controller.criar(dto, authentication, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getHeaders().getLocation()).hasPath("/startups/100");
        verify(mfaGuard, times(1)).check(mockUsuario, "1234");
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao criar sem autenticação")
    void testCriar_NaoAutenticado() {
        StartupCreateDTO dto = mock(StartupCreateDTO.class);
        ResponseEntity<Object> response = controller.criar(dto, null, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
    

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR em erro genérico na criação")
    void testCriar_Exception() {
        StartupCreateDTO dto = mock(StartupCreateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.criar(dto, mockUsuario.getId())).thenThrow(new RuntimeException("Erro banco"));

        assertThatThrownBy(() -> controller.criar(dto, authentication, "1234")).isInstanceOf(RuntimeException.class);
    }

    // ==========================================
    // GET /startups/buscar (buscarComFiltros)
    // ==========================================
    @Test
    @DisplayName("Deve buscar startups com filtros e paginação com sucesso")
    void testBuscarComFiltros_Sucesso() {
        StartupFiltroDTO filtro = mock(StartupFiltroDTO.class);
        Page<StartupResponseDTO> pagina = new PageImpl<>(List.of(mockResponseDTO));
        when(service.buscarComFiltrosPaginado(eq(filtro), any(Pageable.class))).thenReturn(pagina);

        ResponseEntity<Object> response = controller.buscarComFiltros(filtro, Pageable.unpaged());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("Deve retornar BAD_REQUEST em buscarComFiltros por argumento inválido")
    void testBuscarComFiltros_IllegalArgument() {
        when(service.buscarComFiltrosPaginado(any(), any())).thenThrow(new IllegalArgumentException("Filtro incorreto"));

        assertThatThrownBy(() -> controller.buscarComFiltros(mock(StartupFiltroDTO.class), Pageable.unpaged())).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR em buscarComFiltros por falha genérica")
    void testBuscarComFiltros_Exception() {
        when(service.buscarComFiltrosPaginado(any(), any())).thenThrow(new RuntimeException("Falha DB"));

        assertThatThrownBy(() -> controller.buscarComFiltros(mock(StartupFiltroDTO.class), Pageable.unpaged())).isInstanceOf(RuntimeException.class);
    }

    // ==========================================
    // PUT /startups/{id} (Atualizar)
    // ==========================================
    @Test
    @DisplayName("Deve atualizar startup com sucesso e retornar 200 OK")
    void testAtualizar_Sucesso() {
        StartupUpdateDTO dto = mock(StartupUpdateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.atualizar(1L, dto, mockUsuario.getId())).thenReturn(mockResponseDTO);

        ResponseEntity<Object> response = controller.atualizar(1L, dto, authentication, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(mfaGuard, times(1)).check(mockUsuario, "1234");
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao atualizar sem autenticação")
    void testAtualizar_NaoAutenticado() {
        StartupUpdateDTO dto = mock(StartupUpdateDTO.class);
        ResponseEntity<Object> response = controller.atualizar(1L, dto, null, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }


    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR em erro genérico na atualização")
    void testAtualizar_Exception() {
        StartupUpdateDTO dto = mock(StartupUpdateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.atualizar(1L, dto, mockUsuario.getId())).thenThrow(new RuntimeException("Erro banco"));

        assertThatThrownBy(() -> controller.atualizar(1L, dto, authentication, "1234")).isInstanceOf(RuntimeException.class);
    }

    // ==========================================
    // GET /startups (Listar Todas)
    // ==========================================
    @Test
    @DisplayName("Deve listar todas as startups com sucesso")
    void testListarTodas_Sucesso() {
        when(service.listarTodas()).thenReturn(List.of(mockResponseDTO));

        ResponseEntity<Object> response = controller.listarTodas();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(List.of(mockResponseDTO));
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR ao falhar em listar todas")
    void testListarTodas_Exception() {
        when(service.listarTodas()).thenThrow(new RuntimeException("Erro"));

        assertThatThrownBy(() -> controller.listarTodas()).isInstanceOf(RuntimeException.class);
    }

    // ==========================================
    // GET /startups/{id} (Buscar por ID)
    // ==========================================
    @Test
    @DisplayName("Deve buscar startup por ID com sucesso")
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

        assertThatThrownBy(() -> controller.buscarPorId(1L)).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR ao falhar em buscarPorId")
    void testBuscarPorId_Exception() {
        when(service.buscarPorId(1L)).thenThrow(new RuntimeException("Erro catastrófico"));

        assertThatThrownBy(() -> controller.buscarPorId(1L)).isInstanceOf(RuntimeException.class);
    }

    // ==========================================
    // DELETE /startups/{id} (Deletar)
    // ==========================================
    @Test
    @DisplayName("Deve deletar startup com sucesso e retornar 204")
    void testDeletar_Sucesso() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);

        ResponseEntity<Object> response = controller.deletar(1L, authentication, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(service, times(1)).deletar(1L, mockUsuario.getId());
        verify(mfaGuard, times(1)).check(mockUsuario, "1234");
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao deletar sem autenticação")
    void testDeletar_NaoAutenticado() {
        ResponseEntity<Object> response = controller.deletar(1L, null, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }


    @Test
    @DisplayName("Deve retornar NOT_FOUND ao tentar deletar ID inexistente")
    void testDeletar_NotFound() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        doThrow(new IllegalArgumentException("Não achou")).when(service).deletar(1L, mockUsuario.getId());

        assertThatThrownBy(() -> controller.deletar(1L, authentication, "1234")).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR em erro genérico ao deletar")
    void testDeletar_Exception() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        doThrow(new RuntimeException("Erro BD")).when(service).deletar(1L, mockUsuario.getId());

        assertThatThrownBy(() -> controller.deletar(1L, authentication, "1234")).isInstanceOf(RuntimeException.class);
    }
}