package com.inova27.app.controller;

import com.inova27.app.dto.usuarios.ConcluirRecuperacaoEmailDTO;
import com.inova27.app.dto.usuarios.ConfirmarRecuperacaoEmailDTO;
import com.inova27.app.exception.BusinessException;
import com.inova27.app.dto.usuarios.SolicitarRecuperacaoEmailDTO;
import com.inova27.app.dto.usuarios.UsuarioResponseDTO;
import com.inova27.app.dto.usuarios.UsuarioUpdateDTO;
import com.inova27.app.exception.MfaRequiredException;
import com.inova27.app.model.UserRole;
import com.inova27.app.model.Usuario;
import com.inova27.app.security.MfaGuard;
import com.inova27.app.service.UsuarioService;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioControllerTest {

    @Mock
    private UsuarioService service;

    @Mock
    private MfaGuard mfaGuard;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private UsuarioController controller;

    private Usuario adminUsuario;
    private Usuario comumUsuario;
    private UsuarioResponseDTO mockResponseDTO;


    // ==========================================
    // GET /usuarios/pendentes
    // ==========================================
   

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao listar pendentes sem autenticação")
    void testListarPendentes_NaoAutenticado() {
        ResponseEntity<Object> response = controller.listarPendentes(null);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }


    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao validar sem estar logado")
    void testValidarUsuario_NaoAutenticado() {
        ResponseEntity<Object> response = controller.validarUsuario(2L, "123", null);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }


    // ==========================================
    // GET /usuarios/{id}
    // ==========================================
    @Test
    @DisplayName("Deve buscar usuário por ID com sucesso")
    void testBuscarPorId_Sucesso() {
        when(service.buscarPorId(2L)).thenReturn(mockResponseDTO);
        ResponseEntity<Object> response = controller.buscarPorId(2L);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("Deve retornar NOT_FOUND ao buscar por ID inexistente")
    void testBuscarPorId_NotFound() {
        when(service.buscarPorId(2L)).thenThrow(new RuntimeException("Não achou"));
        assertThatThrownBy(() -> controller.buscarPorId(2L)).isInstanceOf(RuntimeException.class);
    }





    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao atualizar outro sem login")
    void testAtualizar_NaoAutenticado() {
        ResponseEntity<Object> response = controller.atualizar(1L, mock(UsuarioUpdateDTO.class), null);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }



    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao buscar meus dados sem autenticação")
    void testBuscarMeusDados_NaoAutenticado() {
        ResponseEntity<Object> response = controller.buscarMeusDados(null);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }




    @Test
    @DisplayName("Deve retornar UNAUTHORIZED ao deletar sem autenticação")
    void testDeletar_NaoAutenticado() {
        ResponseEntity<Object> response = controller.deletar(1L, null);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }


    // ==========================================
    // POST /usuarios/recuperar-email/solicitar
    // ==========================================
    @Test
    @DisplayName("Deve solicitar recuperação de email com sucesso")
    void testSolicitarRecuperacaoEmail_Sucesso() {
        SolicitarRecuperacaoEmailDTO dto = mock(SolicitarRecuperacaoEmailDTO.class);
        when(dto.emailAtual()).thenReturn("teste@uece.br");

        ResponseEntity<Object> response = controller.solicitarRecuperacaoEmail(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(service, times(1)).solicitarRecuperacaoEmail("teste@uece.br");
    }


    // ==========================================
    // POST /usuarios/recuperar-email/confirmar
    // ==========================================
    @Test
    @DisplayName("Deve confirmar recuperação de email com sucesso")
    void testConfirmarRecuperacaoEmail_Sucesso() {
        ConfirmarRecuperacaoEmailDTO dto = mock(ConfirmarRecuperacaoEmailDTO.class);
        when(dto.emailAtual()).thenReturn("teste@uece.br");
        when(dto.pin()).thenReturn("123456");
        when(dto.novoEmailPrincipal()).thenReturn("novo@uece.br");
        when(dto.novoEmailSecundario()).thenReturn("sec@uece.br");

        ResponseEntity<Object> response = controller.confirmarRecuperacaoEmail(dto);

        // A troca só é aplicada no passo "concluir"
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.ACCEPTED);
        verify(service, times(1)).confirmarRecuperacaoEmail("teste@uece.br", "123456", "novo@uece.br", "sec@uece.br");
    }

    @Test
    @DisplayName("Erro de regra na confirmação é propagado para o handler global")
    void testConfirmarRecuperacaoEmail_PropagaErro() {
        ConfirmarRecuperacaoEmailDTO dto = mock(ConfirmarRecuperacaoEmailDTO.class);
        doThrow(new BusinessException("PIN inválido")).when(service).confirmarRecuperacaoEmail(any(), any(), any(), any());

        assertThatThrownBy(() -> controller.confirmarRecuperacaoEmail(dto)).isInstanceOf(BusinessException.class);
    }

    // ==========================================
    // POST /usuarios/recuperar-email/concluir
    // ==========================================
    @Test
    @DisplayName("Deve concluir a troca de e-mail")
    void testConcluirRecuperacaoEmail_Sucesso() {
        ConcluirRecuperacaoEmailDTO dto = new ConcluirRecuperacaoEmailDTO("teste@uece.br", "999888", "novo@uece.br", "sec@uece.br");

        ResponseEntity<Object> response = controller.concluirRecuperacaoEmail(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(service).concluirRecuperacaoEmail("teste@uece.br", "999888", "novo@uece.br", "sec@uece.br");
    }
}
