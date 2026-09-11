package com.inova27.app.service;

import com.inova27.app.dto.usuarios.UsuarioResponseDTO;
import com.inova27.app.dto.usuarios.UsuarioUpdateDTO;
import com.inova27.app.exception.BusinessException;
import com.inova27.app.model.AcaoAuditoria;
import com.inova27.app.model.EmailType;
import com.inova27.app.model.UserRole;
import com.inova27.app.model.Usuario;
import com.inova27.app.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UsuarioService - Testes Unitários")
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository repository;

    @Mock
    private AuditoriaService auditoriaService;

    @Mock
    private MfaService mfaService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuarioPadrao;

    @BeforeEach
    void setUp() {
        usuarioPadrao = new Usuario();
        usuarioPadrao.setId(1L);
        usuarioPadrao.setNome("João Silva");
        usuarioPadrao.setEmail("joao@email.com");
        usuarioPadrao.setEmailSecundario("joao.secundario@email.com");
        usuarioPadrao.setRole(UserRole.PROFESSOR);
        usuarioPadrao.setValidado(false);
    }

    // =========================================================
    // listarNaoValidados
    // =========================================================

    @Nested
    @DisplayName("listarNaoValidados()")
    class ListarNaoValidados {

        @Test
        @DisplayName("Deve retornar lista de usuários não validados")
        void deveRetornarListaDeUsuariosNaoValidados() {
            Usuario usuario2 = new Usuario();
            usuario2.setId(2L);
            usuario2.setNome("Maria");
            usuario2.setEmail("maria@email.com");
            usuario2.setRole(UserRole.PROFESSOR);
            usuario2.setValidado(false);

            when(repository.findByValidadoFalse()).thenReturn(List.of(usuarioPadrao, usuario2));

            List<UsuarioResponseDTO> resultado = usuarioService.listarNaoValidados();

            assertThat(resultado).hasSize(2);
            assertThat(resultado.get(0).email()).isEqualTo("joao@email.com");
            assertThat(resultado.get(1).email()).isEqualTo("maria@email.com");
            verify(repository).findByValidadoFalse();
        }

        @Test
        @DisplayName("Deve retornar lista vazia quando não há usuários não validados")
        void deveRetornarListaVaziaQuandoNaoHaUsuariosNaoValidados() {
            when(repository.findByValidadoFalse()).thenReturn(List.of());

            List<UsuarioResponseDTO> resultado = usuarioService.listarNaoValidados();

            assertThat(resultado).isEmpty();
        }
    }

    // =========================================================
    // atualizar
    // =========================================================

    @Nested
    @DisplayName("atualizar()")
    class Atualizar {

        @Test
        @DisplayName("Deve atualizar todos os campos quando fornecidos")
        void deveAtualizarTodosCampos() {
            UsuarioUpdateDTO dados = new UsuarioUpdateDTO("novo@email.com", "Novo Nome", UserRole.ADMIN, true, "novo.secundario@email.com");

            when(repository.findById(1L)).thenReturn(Optional.of(usuarioPadrao));
            when(repository.save(any(Usuario.class))).thenReturn(usuarioPadrao);

            UsuarioResponseDTO resultado = usuarioService.atualizar(1L, dados, 99L);

            assertThat(resultado).isNotNull();
            verify(repository).findById(1L);
            verify(repository).save(usuarioPadrao);
            verify(auditoriaService).registrarLog(
                    eq("Usuario"), eq(1L), eq(AcaoAuditoria.EDICAO), eq(99L), eq(dados)
            );
        }

        @Test
        @DisplayName("Deve lançar BusinessException quando usuário não encontrado")
        void deveLancarExcecaoQuandoUsuarioNaoEncontrado() {
            UsuarioUpdateDTO dados = new UsuarioUpdateDTO("email@email.com", "Nome", UserRole.PROFESSOR, true, null);
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> usuarioService.atualizar(99L, dados, 1L))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Usuário não encontrado.");

            verify(repository, never()).save(any());
        }
    }

    // =========================================================
    // atualizarMeusDados
    // =========================================================

    @Nested
    @DisplayName("atualizarMeusDados()")
    class AtualizarMeusDados {

        @Test
        @DisplayName("Deve atualizar nome e email quando dados válidos")
        void deveAtualizarNomeEEmail() {
            UsuarioUpdateDTO dados = new UsuarioUpdateDTO("novo@email.com", "Nome Atualizado", null, true, null);

            when(repository.findById(1L)).thenReturn(Optional.of(usuarioPadrao));
            when(repository.existsByEmail("novo@email.com")).thenReturn(false);
            when(repository.save(any(Usuario.class))).thenReturn(usuarioPadrao);

            UsuarioResponseDTO resultado = usuarioService.atualizarMeusDados(1L, dados);

            assertThat(resultado).isNotNull();
            assertThat(usuarioPadrao.getNome()).isEqualTo("Nome Atualizado");
            assertThat(usuarioPadrao.getEmail()).isEqualTo("novo@email.com");
            verify(auditoriaService).registrarLog(
                    eq("Usuario"), eq(1L), eq(AcaoAuditoria.EDICAO), eq(1L), anyString()
            );
        }

        @Test
        @DisplayName("Deve manter email atual quando mesmo email informado")
        void deveManterEmailAtualQuandoMesmoEmailInformado() {
            UsuarioUpdateDTO dados = new UsuarioUpdateDTO("joao@email.com", null, null, null, null);

            when(repository.findById(1L)).thenReturn(Optional.of(usuarioPadrao));
            when(repository.save(any(Usuario.class))).thenReturn(usuarioPadrao);

            usuarioService.atualizarMeusDados(1L, dados);

            // Quando o email informado é o mesmo, existsByEmail não deve ser chamado
            verify(repository, never()).existsByEmail(anyString());
        }

        @Test
        @DisplayName("Deve ignorar nome em branco")
        void deveIgnorarNomeEmBranco() {
            UsuarioUpdateDTO dados = new UsuarioUpdateDTO(null, "  ", null, null, null);

            when(repository.findById(1L)).thenReturn(Optional.of(usuarioPadrao));
            when(repository.save(any(Usuario.class))).thenReturn(usuarioPadrao);

            usuarioService.atualizarMeusDados(1L, dados);

            assertThat(usuarioPadrao.getNome()).isEqualTo("João Silva");
        }

        @Test
        @DisplayName("Deve lançar BusinessException quando usuário não encontrado")
        void deveLancarExcecaoQuandoUsuarioNaoEncontrado() {
            UsuarioUpdateDTO dados = new UsuarioUpdateDTO(null, "Nome", null, null, null);
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> usuarioService.atualizarMeusDados(99L, dados))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Usuário não encontrado.");
        }
    }

    // =========================================================
    // solicitarRecuperacaoEmail
    // =========================================================

    @Nested
    @DisplayName("solicitarRecuperacaoEmail()")
    class SolicitarRecuperacaoEmail {

        @Test
        @DisplayName("Deve gerar PIN e enviar email para endereço secundário")
        void deveGerarPinEEnviarEmailSecundario() {
            when(repository.findByEmail("joao@email.com")).thenReturn(Optional.of(usuarioPadrao));
            when(mfaService.gerarCodigoMfa(1L)).thenReturn("123456");

            usuarioService.solicitarRecuperacaoEmail("joao@email.com");

            verify(mfaService).gerarCodigoMfa(1L);
            verify(emailService).sendEmail(
                    eq("joao.secundario@email.com"),
                    eq("Recuperação de Acesso - Inova27"),
                    contains("123456"),
                    eq(EmailType.CONTACT)
            );
        }

        @Test
        @DisplayName("Deve lançar BusinessException quando conta não encontrada")
        void deveLancarExcecaoQuandoContaNaoEncontrada() {
            when(repository.findByEmail("naoexiste@email.com")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> usuarioService.solicitarRecuperacaoEmail("naoexiste@email.com"))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Conta não encontrada.");
        }

        @Test
        @DisplayName("Deve lançar BusinessException quando email secundário não cadastrado")
        void deveLancarExcecaoQuandoEmailSecundarioNaoCadastrado() {
            usuarioPadrao.setEmailSecundario(null);
            when(repository.findByEmail("joao@email.com")).thenReturn(Optional.of(usuarioPadrao));

            assertThatThrownBy(() -> usuarioService.solicitarRecuperacaoEmail("joao@email.com"))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Nenhum e-mail de recuperação (secundário) cadastrado para esta conta. Entre em contato com o suporte.");
        }

        @Test
        @DisplayName("Deve lançar BusinessException quando email secundário é em branco")
        void deveLancarExcecaoQuandoEmailSecundarioEmBranco() {
            usuarioPadrao.setEmailSecundario("   ");
            when(repository.findByEmail("joao@email.com")).thenReturn(Optional.of(usuarioPadrao));

            assertThatThrownBy(() -> usuarioService.solicitarRecuperacaoEmail("joao@email.com"))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Nenhum e-mail de recuperação (secundário) cadastrado para esta conta. Entre em contato com o suporte.");
        }
    }

    // =========================================================
    // confirmarRecuperacaoEmail
    // =========================================================

    @Nested
    @DisplayName("confirmarRecuperacaoEmail()")
    class ConfirmarRecuperacaoEmail {

        @Test
        @DisplayName("Deve alterar email principal com sucesso")
        void deveAlterarEmailPrincipalComSucesso() {
            when(repository.findByEmail("joao@email.com")).thenReturn(Optional.of(usuarioPadrao));
            when(mfaService.validarCodigoMfa(1L, "654321")).thenReturn(true);
            when(repository.existsByEmail("novo@email.com")).thenReturn(false);
            when(repository.findByEmailSecundario("novo@email.com")).thenReturn(Optional.empty());
            when(repository.save(any(Usuario.class))).thenReturn(usuarioPadrao);

            usuarioService.confirmarRecuperacaoEmail("joao@email.com", "654321", "novo@email.com", null);

            assertThat(usuarioPadrao.getEmail()).isEqualTo("novo@email.com");
            verify(repository).save(usuarioPadrao);
            verify(auditoriaService).registrarLog(
                    eq("Usuario"), eq(1L), eq(AcaoAuditoria.EDICAO), eq(1L), anyString()
            );
        }

        @Test
        @DisplayName("Deve alterar email principal e secundário com sucesso")
        void deveAlterarEmailPrincipalESecundarioComSucesso() {
            when(repository.findByEmail("joao@email.com")).thenReturn(Optional.of(usuarioPadrao));
            when(mfaService.validarCodigoMfa(1L, "654321")).thenReturn(true);
            when(repository.existsByEmail("novo@email.com")).thenReturn(false);
            when(repository.findByEmailSecundario("novo@email.com")).thenReturn(Optional.empty());
            when(repository.existsByEmail("novo.secundario@email.com")).thenReturn(false);
            when(repository.findByEmailSecundario("novo.secundario@email.com")).thenReturn(Optional.empty());
            when(repository.save(any(Usuario.class))).thenReturn(usuarioPadrao);

            usuarioService.confirmarRecuperacaoEmail("joao@email.com", "654321", "novo@email.com", "novo.secundario@email.com");

            assertThat(usuarioPadrao.getEmail()).isEqualTo("novo@email.com");
            assertThat(usuarioPadrao.getEmailSecundario()).isEqualTo("novo.secundario@email.com");
        }

        @Test
        @DisplayName("Deve lançar BusinessException quando PIN inválido")
        void deveLancarExcecaoQuandoPinInvalido() {
            when(repository.findByEmail("joao@email.com")).thenReturn(Optional.of(usuarioPadrao));
            when(mfaService.validarCodigoMfa(1L, "000000")).thenReturn(false);

            assertThatThrownBy(() ->
                    usuarioService.confirmarRecuperacaoEmail("joao@email.com", "000000", "novo@email.com", null))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Código de segurança inválido ou expirado.");
        }

        @Test
        @DisplayName("Deve lançar BusinessException quando novo email principal já em uso como principal de outra conta")
        void deveLancarExcecaoQuandoNovoEmailPrincipalJaEmUsoComoPrincipal() {
            when(repository.findByEmail("joao@email.com")).thenReturn(Optional.of(usuarioPadrao));
            when(mfaService.validarCodigoMfa(1L, "654321")).thenReturn(true);
            when(repository.existsByEmail("emuso@email.com")).thenReturn(true);

            assertThatThrownBy(() ->
                    usuarioService.confirmarRecuperacaoEmail("joao@email.com", "654321", "emuso@email.com", null))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("O novo e-mail principal informado já está em uso por outra conta.");
        }

        @Test
        @DisplayName("Deve lançar BusinessException quando novo email principal já em uso como secundário de outra conta")
        void deveLancarExcecaoQuandoNovoEmailPrincipalJaEmUsoComoSecundario() {
            when(repository.findByEmail("joao@email.com")).thenReturn(Optional.of(usuarioPadrao));
            when(mfaService.validarCodigoMfa(1L, "654321")).thenReturn(true);
            when(repository.existsByEmail("secundario.outro@email.com")).thenReturn(false);
            when(repository.findByEmailSecundario("secundario.outro@email.com"))
                    .thenReturn(Optional.of(new Usuario()));

            assertThatThrownBy(() ->
                    usuarioService.confirmarRecuperacaoEmail("joao@email.com", "654321", "secundario.outro@email.com", null))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("O novo e-mail principal informado já está em uso por outra conta.");
        }

        @Test
        @DisplayName("Deve lançar BusinessException quando novo email secundário já é principal de outra conta")
        void deveLancarExcecaoQuandoEmailSecundarioJaEPrincipalDeOutraConta() {
            when(repository.findByEmail("joao@email.com")).thenReturn(Optional.of(usuarioPadrao));
            when(mfaService.validarCodigoMfa(1L, "654321")).thenReturn(true);
            when(repository.existsByEmail("novo@email.com")).thenReturn(false);
            when(repository.findByEmailSecundario("novo@email.com")).thenReturn(Optional.empty());
            when(repository.existsByEmail("principal.outro@email.com")).thenReturn(true);

            assertThatThrownBy(() ->
                    usuarioService.confirmarRecuperacaoEmail("joao@email.com", "654321", "novo@email.com", "principal.outro@email.com"))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Erro: O e-mail secundário fornecido já é o e-mail principal de outra conta.");
        }

        @Test
        @DisplayName("Deve lançar BusinessException quando novo email secundário já é secundário de outra conta")
        void deveLancarExcecaoQuandoEmailSecundarioJaESecundarioDeOutraConta() {
            when(repository.findByEmail("joao@email.com")).thenReturn(Optional.of(usuarioPadrao));
            when(mfaService.validarCodigoMfa(1L, "654321")).thenReturn(true);
            when(repository.existsByEmail("novo@email.com")).thenReturn(false);
            when(repository.findByEmailSecundario("novo@email.com")).thenReturn(Optional.empty());
            when(repository.existsByEmail("sec.outro@email.com")).thenReturn(false);
            when(repository.findByEmailSecundario("sec.outro@email.com")).thenReturn(Optional.of(new Usuario()));

            assertThatThrownBy(() ->
                    usuarioService.confirmarRecuperacaoEmail("joao@email.com", "654321", "novo@email.com", "sec.outro@email.com"))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Erro: Este e-mail secundário já está em uso por outra conta.");
        }

        @Test
        @DisplayName("Deve manter email secundário atual quando novo secundário é blank")
        void deveManterEmailSecundarioAtualQuandoNovoSecundarioEBlank() {
            when(repository.findByEmail("joao@email.com")).thenReturn(Optional.of(usuarioPadrao));
            when(mfaService.validarCodigoMfa(1L, "654321")).thenReturn(true);
            when(repository.existsByEmail("novo@email.com")).thenReturn(false);
            when(repository.findByEmailSecundario("novo@email.com")).thenReturn(Optional.empty());
            when(repository.save(any(Usuario.class))).thenReturn(usuarioPadrao);

            usuarioService.confirmarRecuperacaoEmail("joao@email.com", "654321", "novo@email.com", "");

            assertThat(usuarioPadrao.getEmailSecundario()).isEqualTo("joao.secundario@email.com");
        }

        @Test
        @DisplayName("Deve lançar BusinessException quando conta não encontrada")
        void deveLancarExcecaoQuandoContaNaoEncontrada() {
            when(repository.findByEmail("naoexiste@email.com")).thenReturn(Optional.empty());

            assertThatThrownBy(() ->
                    usuarioService.confirmarRecuperacaoEmail("naoexiste@email.com", "123456", "novo@email.com", null))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Conta não encontrada.");
        }
    }

    // =========================================================
    // validarUsuario
    // =========================================================

    @Nested
    @DisplayName("validarUsuario()")
    class ValidarUsuario {

        @Test
        @DisplayName("Deve validar usuário com sucesso quando chamado por ADMIN")
        void deveValidarUsuarioComSucesso() {
            when(repository.findById(1L)).thenReturn(Optional.of(usuarioPadrao));
            when(repository.save(any(Usuario.class))).thenReturn(usuarioPadrao);

            UsuarioResponseDTO resultado = usuarioService.validarUsuario(1L, UserRole.ADMIN, 99L);

            assertThat(resultado).isNotNull();
            assertThat(usuarioPadrao.isValidado()).isTrue();
            assertThat(usuarioPadrao.getUserInclusaoId()).isEqualTo(99L);
            verify(auditoriaService).registrarLog(
                    eq("Usuario"), eq(1L), eq(AcaoAuditoria.VALIDACAO), eq(99L), anyString()
            );
        }

        @Test
        @DisplayName("Deve lançar BusinessException quando chamado por não-ADMIN")
        void deveLancarExcecaoQuandoChamadoPorNaoAdmin() {
            assertThatThrownBy(() -> usuarioService.validarUsuario(1L, UserRole.PROFESSOR, 99L))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Apenas administradores podem validar usuários.");

            verify(repository, never()).findById(anyLong());
        }

        @Test
        @DisplayName("Deve lançar BusinessException quando usuário já está validado")
        void deveLancarExcecaoQuandoUsuarioJaValidado() {
            usuarioPadrao.setValidado(true);
            when(repository.findById(1L)).thenReturn(Optional.of(usuarioPadrao));

            assertThatThrownBy(() -> usuarioService.validarUsuario(1L, UserRole.ADMIN, 99L))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Usuário já está validado.");

            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("Deve lançar BusinessException quando usuário não encontrado")
        void deveLancarExcecaoQuandoUsuarioNaoEncontrado() {
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> usuarioService.validarUsuario(99L, UserRole.ADMIN, 1L))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Usuário não encontrado.");
        }
    }

    // =========================================================
    // buscarPorId
    // =========================================================

    @Nested
    @DisplayName("buscarPorId()")
    class BuscarPorId {

        @Test
        @DisplayName("Deve retornar usuário quando encontrado")
        void deveRetornarUsuarioQuandoEncontrado() {
            when(repository.findById(1L)).thenReturn(Optional.of(usuarioPadrao));

            UsuarioResponseDTO resultado = usuarioService.buscarPorId(1L);

            assertThat(resultado).isNotNull();
            assertThat(resultado.id()).isEqualTo(1L);
            assertThat(resultado.email()).isEqualTo("joao@email.com");
            assertThat(resultado.nome()).isEqualTo("João Silva");
            assertThat(resultado.role()).isEqualTo(UserRole.PROFESSOR);
            assertThat(resultado.validado()).isFalse();
            assertThat(resultado.emailSecundario()).isEqualTo("joao.secundario@email.com");
        }

        @Test
        @DisplayName("Deve lançar BusinessException quando usuário não encontrado")
        void deveLancarExcecaoQuandoUsuarioNaoEncontrado() {
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> usuarioService.buscarPorId(99L))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Usuário não encontrado.");
        }
    }

    // =========================================================
    // listarTodos
    // =========================================================

    @Nested
    @DisplayName("listarTodos()")
    class ListarTodos {

        @Test
        @DisplayName("Deve retornar todos os usuários")
        void deveRetornarTodosOsUsuarios() {
            Usuario usuario2 = new Usuario();
            usuario2.setId(2L);
            usuario2.setNome("Maria");
            usuario2.setEmail("maria@email.com");
            usuario2.setRole(UserRole.ADMIN);
            usuario2.setValidado(true);

            when(repository.findAll()).thenReturn(List.of(usuarioPadrao, usuario2));

            List<UsuarioResponseDTO> resultado = usuarioService.listarTodos();

            assertThat(resultado).hasSize(2);
            assertThat(resultado).extracting(UsuarioResponseDTO::email)
                    .containsExactly("joao@email.com", "maria@email.com");
        }

        @Test
        @DisplayName("Deve retornar lista vazia quando não há usuários")
        void deveRetornarListaVaziaQuandoNaoHaUsuarios() {
            when(repository.findAll()).thenReturn(List.of());

            List<UsuarioResponseDTO> resultado = usuarioService.listarTodos();

            assertThat(resultado).isEmpty();
        }
    }

    // =========================================================
    // deletar
    // =========================================================

    @Nested
    @DisplayName("deletar()")
    class Deletar {

        @Test
        @DisplayName("Deve deletar usuário com sucesso")
        void deveDeletarUsuarioComSucesso() {
            when(repository.findById(1L)).thenReturn(Optional.of(usuarioPadrao));

            usuarioService.deletar(1L, 99L);

            verify(repository).delete(usuarioPadrao);
            verify(auditoriaService).registrarLog(
                    eq("Usuario"), eq(1L), eq(AcaoAuditoria.DELECAO), eq(99L), any(UsuarioResponseDTO.class)
            );
        }

        @Test
        @DisplayName("Deve registrar retrato do usuário antes de deletar")
        void deveRegistrarRetratoDoUsuarioAntesDeDetar() {
            when(repository.findById(1L)).thenReturn(Optional.of(usuarioPadrao));

            usuarioService.deletar(1L, 99L);

            ArgumentCaptor<Object> detalheCaptor = ArgumentCaptor.forClass(Object.class);
            verify(auditoriaService).registrarLog(
                    eq("Usuario"), eq(1L), eq(AcaoAuditoria.DELECAO), eq(99L), detalheCaptor.capture()
            );

            UsuarioResponseDTO retrato = (UsuarioResponseDTO) detalheCaptor.getValue();
            assertThat(retrato.email()).isEqualTo("joao@email.com");
            assertThat(retrato.nome()).isEqualTo("João Silva");
        }

        @Test
        @DisplayName("Deve lançar BusinessException quando usuário não encontrado")
        void deveLancarExcecaoQuandoUsuarioNaoEncontrado() {
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> usuarioService.deletar(99L, 1L))
                    .isInstanceOf(BusinessException.class)
                    .hasMessage("Usuário não encontrado.");

            verify(repository, never()).delete(any());
            verify(auditoriaService, never()).registrarLog(any(), any(), any(), any(), any());
        }
    }
}