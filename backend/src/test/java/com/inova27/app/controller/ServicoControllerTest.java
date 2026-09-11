package com.inova27.app.controller;

import com.inova27.app.dto.servico.ServicoCreateDTO;
import com.inova27.app.dto.servico.ServicoFiltroDTO;
import com.inova27.app.dto.servico.ServicoResponseDTO;
import com.inova27.app.dto.servico.ServicoUpdateDTO;
import com.inova27.app.exception.MfaRequiredException;
import com.inova27.app.model.Usuario;
import com.inova27.app.security.MfaGuard;
import com.inova27.app.service.ServicoService;
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
class ServicoControllerTest {

    @Mock
    private ServicoService service;

    @Mock
    private MfaGuard mfaGuard;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ServicoController controller;

    private Usuario mockUsuario;
    private ServicoResponseDTO mockResponseDTO;

    @BeforeEach
    void setUp() {
        mockUsuario = new Usuario();
        mockUsuario.setId(1L);
        // O mock() serve perfeitamente para Records aqui
        mockResponseDTO = mock(ServicoResponseDTO.class);
    }

    // ==========================================
    // POST /servicos (Criar)
    // ==========================================
    @Test
    @DisplayName("Deve criar serviço com sucesso e retornar 201 Created")
    void testCriar_Sucesso() {
        ServicoCreateDTO dto = mock(ServicoCreateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(mockResponseDTO.id()).thenReturn(50L);
        when(service.criar(dto, mockUsuario.getId())).thenReturn(mockResponseDTO);

        ResponseEntity<Object> response = controller.criar(dto, authentication, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getHeaders().getLocation()).hasPath("/servicos/50");
        verify(mfaGuard, times(1)).check(mockUsuario, "1234");
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao criar serviço sem autenticação")
    void testCriar_NaoAutenticado() {
        ServicoCreateDTO dto = mock(ServicoCreateDTO.class);
        ResponseEntity<Object> response = controller.criar(dto, null, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    



    // ==========================================
    // GET /servicos (Listar)
    // ==========================================
    @Test
    @DisplayName("Deve listar todos os serviços com sucesso")
    void testListar_Sucesso() {
        when(service.listarTodos()).thenReturn(List.of(mockResponseDTO));

        ResponseEntity<List<ServicoResponseDTO>> response = controller.listar();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
    }

    // ==========================================
    // GET /servicos/{id} (Buscar por ID)
    // ==========================================
    @Test
    @DisplayName("Deve buscar serviço por ID com sucesso")
    void testBuscarPorId_Sucesso() {
        when(service.buscarPorId(1L)).thenReturn(mockResponseDTO);

        ResponseEntity<Object> response = controller.buscar(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(mockResponseDTO);
    }

    @Test
    @DisplayName("Deve retornar NOT_FOUND ao buscar por ID inexistente")
    void testBuscarPorId_NotFound() {
        when(service.buscarPorId(1L)).thenThrow(new IllegalArgumentException("Não encontrado"));

        ResponseEntity<Object> response = controller.buscar(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // ==========================================
    // PUT /servicos/{id} (Atualizar)
    // ==========================================
    @Test
    @DisplayName("Deve atualizar serviço com sucesso e retornar 200 OK")
    void testAtualizar_Sucesso() {
        ServicoUpdateDTO dto = mock(ServicoUpdateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.atualizar(1L, dto, mockUsuario.getId())).thenReturn(mockResponseDTO);

        ResponseEntity<Object> response = controller.atualizar(1L, dto, authentication, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(mfaGuard, times(1)).check(mockUsuario, "1234");
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao atualizar serviço sem estar logado")
    void testAtualizar_NaoAutenticado() {
        ResponseEntity<Object> response = controller.atualizar(1L, mock(ServicoUpdateDTO.class), null, "1234");
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }



    @Test
    @DisplayName("Deve retornar NOT_FOUND ao atualizar serviço que não existe")
    void testAtualizar_IllegalArgument() {
        ServicoUpdateDTO dto = mock(ServicoUpdateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.atualizar(1L, dto, mockUsuario.getId())).thenThrow(new IllegalArgumentException("Não achou"));

        ResponseEntity<Object> response = controller.atualizar(1L, dto, authentication, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // ==========================================
    // DELETE /servicos/{id} (Deletar)
    // ==========================================
    @Test
    @DisplayName("Deve deletar serviço com sucesso e retornar 204")
    void testDeletar_Sucesso() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);

        ResponseEntity<Object> response = controller.deletar(1L, authentication, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(service, times(1)).deletar(1L, mockUsuario.getId());
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao deletar sem estar logado")
    void testDeletar_NaoAutenticado() {
        ResponseEntity<Object> response = controller.deletar(1L, null, "1234");
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }



    @Test
    @DisplayName("Deve retornar NOT_FOUND ao deletar ID inexistente")
    void testDeletar_IllegalArgument() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        doThrow(new IllegalArgumentException("Não achou")).when(service).deletar(1L, mockUsuario.getId());

        ResponseEntity<Object> response = controller.deletar(1L, authentication, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // ==========================================
    // GET /servicos/buscar (buscarComFiltros)
    // ==========================================
    @Test
    @DisplayName("Deve buscar serviços com filtros e paginação com sucesso")
    void testBuscarComFiltros_Sucesso() {
        ServicoFiltroDTO filtro = mock(ServicoFiltroDTO.class);
        Page<ServicoResponseDTO> pagina = new PageImpl<>(List.of(mockResponseDTO));
        when(service.buscarComFiltrosPaginado(eq(filtro), any(Pageable.class))).thenReturn(pagina);

        ResponseEntity<Object> response = controller.buscarComFiltros(filtro, Pageable.unpaged());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }



    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR em buscarComFiltros por falha genérica")
    void testBuscarComFiltros_Exception() {
        when(service.buscarComFiltrosPaginado(any(), any())).thenThrow(new RuntimeException("Falha no banco"));

        ResponseEntity<Object> response = controller.buscarComFiltros(mock(ServicoFiltroDTO.class), Pageable.unpaged());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}