package com.inova27.app.controller;

import com.inova27.app.dto.laboratorio.LaboratorioCreateDTO;
import com.inova27.app.dto.laboratorio.LaboratorioFiltroDTO;
import com.inova27.app.dto.laboratorio.LaboratorioResponseDTO;
import com.inova27.app.dto.laboratorio.LaboratorioUpdateDTO;
import com.inova27.app.exception.MfaRequiredException;
import com.inova27.app.model.StatusValidacao;
import com.inova27.app.model.Usuario;
import com.inova27.app.security.MfaGuard;
import com.inova27.app.service.LaboratorioService;
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
class LaboratorioControllerTest {

    @Mock
    private LaboratorioService service;

    @Mock
    private MfaGuard mfaGuard;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private LaboratorioController controller;

    private Usuario mockUsuario;
    private LaboratorioResponseDTO mockResponseDTO;

    @BeforeEach
    void setUp() {
        mockUsuario = new Usuario();
        mockUsuario.setId(1L);

        // Instanciando o record (assumindo a estrutura base comum, ajuste se seu record tiver atributos diferentes)
        mockResponseDTO = mock(LaboratorioResponseDTO.class);
    }

    // ==========================================
    // PUT /laboratorios/{id}/validar
    // ==========================================
    @Test
    @DisplayName("Deve validar laboratório com sucesso")
    void testValidar_Sucesso() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);

        ResponseEntity<Object> response = controller.validar(1L, true, authentication);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(service, times(1)).validarLaboratorio(1L, true, mockUsuario);
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao validar sem login")
    void testValidar_NaoAutenticado() {
        ResponseEntity<Object> response = controller.validar(1L, true, null);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    @DisplayName("Deve retornar NOT_FOUND ao tentar validar id inexistente")
    void testValidar_IllegalArgument() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        doThrow(new IllegalArgumentException("Lab não encontrado")).when(service).validarLaboratorio(1L, true, mockUsuario);

        ResponseEntity<Object> response = controller.validar(1L, true, authentication);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // ==========================================
    // GET /laboratorios/status/{status}
    // ==========================================
    @Test
    @DisplayName("Deve listar por status com sucesso")
    void testListarPorStatus_Sucesso() {
        when(service.listarPorStatus(StatusValidacao.APROVADO)).thenReturn(List.of(mockResponseDTO));

        ResponseEntity<Object> response = controller.listarPorStatus(StatusValidacao.APROVADO);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR em listar por status")
    void testListarPorStatus_ErroGenerico() {
        when(service.listarPorStatus(any())).thenThrow(new RuntimeException("Erro banco"));

        ResponseEntity<Object> response = controller.listarPorStatus(StatusValidacao.APROVADO);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ==========================================
    // POST /laboratorios
    // ==========================================
    @Test
    @DisplayName("Deve criar laboratório com sucesso")
    void testCriar_Sucesso() {
        LaboratorioCreateDTO dto = mock(LaboratorioCreateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(mockResponseDTO.id()).thenReturn(1L); // Precisamos simular o ID para montar a URI do Created
        when(service.criar(dto, mockUsuario)).thenReturn(mockResponseDTO);

        ResponseEntity<Object> response = controller.criar(dto, authentication, "1234");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        verify(mfaGuard, times(1)).check(mockUsuario, "1234");
    }

    @Test
    @DisplayName("Deve criar laboratório anonimamente com sucesso")
    void testCriar_Anonimo() {
        LaboratorioCreateDTO dto = mock(LaboratorioCreateDTO.class);
        when(mockResponseDTO.id()).thenReturn(1L);
        when(service.criar(dto, null)).thenReturn(mockResponseDTO);

        ResponseEntity<Object> response = controller.criar(dto, null, null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        // Garante que o MFA NÃO foi chamado, pois o usuário é nulo
        verify(mfaGuard, never()).check(any(), any());
    }

    @Test
    @DisplayName("Deve retornar BAD_REQUEST na criação com IllegalArgumentException")
    void testCriar_IllegalArgument() {
        LaboratorioCreateDTO dto = mock(LaboratorioCreateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.criar(dto, mockUsuario)).thenThrow(new IllegalArgumentException("Dados inválidos"));

        ResponseEntity<Object> response = controller.criar(dto, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    @DisplayName("Deve retornar FORBIDDEN na criação com SecurityException")
    void testCriar_SecurityException() {
        LaboratorioCreateDTO dto = mock(LaboratorioCreateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.criar(dto, mockUsuario)).thenThrow(new SecurityException("Sem acesso"));

        ResponseEntity<Object> response = controller.criar(dto, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR na criação genérica")
    void testCriar_ErroGenerico() {
        LaboratorioCreateDTO dto = mock(LaboratorioCreateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.criar(dto, mockUsuario)).thenThrow(new RuntimeException("Falha"));

        ResponseEntity<Object> response = controller.criar(dto, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ==========================================
    // PUT /laboratorios/{id}
    // ==========================================
    @Test
    @DisplayName("Deve atualizar laboratório com sucesso")
    void testAtualizar_Sucesso() {
        LaboratorioUpdateDTO dto = mock(LaboratorioUpdateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.atualizar(1L, dto, mockUsuario)).thenReturn(mockResponseDTO);

        ResponseEntity<Object> response = controller.atualizar(1L, dto, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(mfaGuard, times(1)).check(mockUsuario, "123");
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao atualizar sem estar logado")
    void testAtualizar_NaoAutenticado() {
        ResponseEntity<Object> response = controller.atualizar(1L, null, null, null);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }



    @Test
    @DisplayName("Deve retornar NOT_FOUND ao atualizar id inexistente")
    void testAtualizar_IllegalArgument() {
        LaboratorioUpdateDTO dto = mock(LaboratorioUpdateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.atualizar(1L, dto, mockUsuario)).thenThrow(new IllegalArgumentException("Não achou"));

        ResponseEntity<Object> response = controller.atualizar(1L, dto, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Deve retornar FORBIDDEN ao atualizar laboratório de outro usuário")
    void testAtualizar_SecurityException() {
        LaboratorioUpdateDTO dto = mock(LaboratorioUpdateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.atualizar(1L, dto, mockUsuario)).thenThrow(new SecurityException("Sem acesso"));

        ResponseEntity<Object> response = controller.atualizar(1L, dto, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR na atualização com erro genérico")
    void testAtualizar_ErroGenerico() {
        LaboratorioUpdateDTO dto = mock(LaboratorioUpdateDTO.class);
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.atualizar(1L, dto, mockUsuario)).thenThrow(new RuntimeException("Falhou"));

        ResponseEntity<Object> response = controller.atualizar(1L, dto, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ==========================================
    // GET /laboratorios (listarTodos) & GET /{id} (buscarPorId)
    // ==========================================
    @Test
    @DisplayName("Deve listar todos com sucesso")
    void testListarTodos_Sucesso() {
        when(service.listarTodos()).thenReturn(List.of(mockResponseDTO));
        ResponseEntity<Object> response = controller.listarTodos();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR em listar todos")
    void testListarTodos_ErroGenerico() {
        when(service.listarTodos()).thenThrow(new RuntimeException("Erro"));
        ResponseEntity<Object> response = controller.listarTodos();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    @DisplayName("Deve buscar por ID com sucesso")
    void testBuscarPorId_Sucesso() {
        when(service.buscarPorId(1L)).thenReturn(mockResponseDTO);
        ResponseEntity<Object> response = controller.buscarPorId(1L);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("Deve retornar NOT_FOUND ao buscar por ID inexistente")
    void testBuscarPorId_NotFound() {
        when(service.buscarPorId(1L)).thenThrow(new RuntimeException("Erro")); // A sua regra de negócio joga RuntimeException como NOT_FOUND
        ResponseEntity<Object> response = controller.buscarPorId(1L);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // ==========================================
    // GET /laboratorios/buscar (buscarComFiltros)
    // ==========================================
    @Test
    @DisplayName("Deve buscar laboratórios com filtros e paginação com sucesso")
    void testBuscarComFiltros_Sucesso() {
        LaboratorioFiltroDTO filtro = mock(LaboratorioFiltroDTO.class);
        Page<LaboratorioResponseDTO> pagina = new PageImpl<>(List.of(mockResponseDTO));
        when(service.buscarComFiltrosPaginado(eq(filtro), any(Pageable.class))).thenReturn(pagina);

        ResponseEntity<Object> response = controller.buscarComFiltros(filtro, Pageable.unpaged());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("Deve retornar BAD_REQUEST em buscarComFiltros por argumento inválido")
    void testBuscarComFiltros_IllegalArgument() {
        when(service.buscarComFiltrosPaginado(any(), any())).thenThrow(new IllegalArgumentException("Filtro errado"));
        ResponseEntity<Object> response = controller.buscarComFiltros(mock(LaboratorioFiltroDTO.class), Pageable.unpaged());
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR em buscarComFiltros com falha genérica")
    void testBuscarComFiltros_Exception() {
        when(service.buscarComFiltrosPaginado(any(), any())).thenThrow(new RuntimeException("Banco fora"));
        ResponseEntity<Object> response = controller.buscarComFiltros(mock(LaboratorioFiltroDTO.class), Pageable.unpaged());
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ==========================================
    // GET /laboratorios/meus (listarMinhas)
    // ==========================================
    @Test
    @DisplayName("Deve listar meus laboratórios com status específico")
    void testListarMinhas_ComStatus() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.listarPorUsuarioEStatus(1L, StatusValidacao.APROVADO)).thenReturn(List.of(mockResponseDTO));

        ResponseEntity<Object> response = controller.listarMinhas(authentication, StatusValidacao.APROVADO);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("Deve listar meus laboratórios sem status")
    void testListarMinhas_SemStatus() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.listarPorUsuario(1L)).thenReturn(List.of(mockResponseDTO));

        ResponseEntity<Object> response = controller.listarMinhas(authentication, null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao buscar meus laboratórios sem login")
    void testListarMinhas_NaoAutenticado() {
        ResponseEntity<Object> response = controller.listarMinhas(null, null);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR ao buscar meus laboratórios")
    void testListarMinhas_ErroGenerico() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        when(service.listarPorUsuario(1L)).thenThrow(new RuntimeException("Erro"));

        ResponseEntity<Object> response = controller.listarMinhas(authentication, null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ==========================================
    // DELETE /laboratorios/{id}
    // ==========================================
    @Test
    @DisplayName("Deve deletar laboratório com sucesso e retornar 204 NO_CONTENT")
    void testDeletar_Sucesso() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);

        ResponseEntity<Object> response = controller.deletar(1L, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(service, times(1)).deletar(1L, mockUsuario);
        verify(mfaGuard, times(1)).check(mockUsuario, "123");
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao deletar sem estar logado")
    void testDeletar_NaoAutenticado() {
        ResponseEntity<Object> response = controller.deletar(1L, null, null);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }


    @Test
    @DisplayName("Deve retornar NOT_FOUND ao tentar deletar ID que não existe")
    void testDeletar_IllegalArgument() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        doThrow(new IllegalArgumentException("Não achou")).when(service).deletar(1L, mockUsuario);

        ResponseEntity<Object> response = controller.deletar(1L, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("Deve retornar FORBIDDEN ao tentar deletar laboratório de outro usuário")
    void testDeletar_SecurityException() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        doThrow(new SecurityException("Sem acesso")).when(service).deletar(1L, mockUsuario);

        ResponseEntity<Object> response = controller.deletar(1L, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR ao falhar na exclusão com erro genérico")
    void testDeletar_ErroGenerico() {
        when(authentication.getPrincipal()).thenReturn(mockUsuario);
        doThrow(new RuntimeException("Banco falhou")).when(service).deletar(1L, mockUsuario);

        ResponseEntity<Object> response = controller.deletar(1L, authentication, "123");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}