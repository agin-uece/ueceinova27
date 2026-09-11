package com.inova27.app.service;

import com.inova27.app.dto.authentication.AuthenticationDTO;
import com.inova27.app.dto.authentication.LoginResponseDTO;
import com.inova27.app.dto.authentication.RegisterDTO;
import com.inova27.app.dto.usuarios.UsuarioResponseDTO;
import com.inova27.app.exception.TokenExpiradoException;
import com.inova27.app.exception.TokenInvalidoException;
import com.inova27.app.model.AcaoAuditoria;
import com.inova27.app.model.EmailType;
import com.inova27.app.model.UserRole;
import com.inova27.app.model.Usuario;
import com.inova27.app.repository.UsuarioRepository;
import com.inova27.app.security.MfaGuard;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthenticationService - Testes Unitários")
class AuthenticationServiceTest {

    @Mock private AuthenticationManager authenticationManager;
    @Mock private UsuarioRepository repository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private TokenService tokenService;
    @Mock private AuditoriaService auditoriaService;
    @Mock private MfaGuard mfaGuard;
    @Mock private EmailService emailService;
    @Mock private Authentication authentication;

    @InjectMocks
    private AuthenticationService authenticationService;

    private Usuario usuarioPadrao;
    private Usuario adminPadrao;

    @BeforeEach
    void setUp() {
        // Injeção da URL do frontend para os métodos que enviam e-mail
        ReflectionTestUtils.setField(authenticationService, "frontendUrl", "http://localhost:3000/");

        usuarioPadrao = new Usuario();
        usuarioPadrao.setId(1L);
        usuarioPadrao.setEmail("professor@uece.br");
        usuarioPadrao.setNome("Professor Teste");
        usuarioPadrao.setRole(UserRole.PROFESSOR);
        usuarioPadrao.setValidado(true);

        adminPadrao = new Usuario();
        adminPadrao.setId(99L);
        adminPadrao.setEmail("admin@uece.br");
        adminPadrao.setNome("Admin Teste");
        adminPadrao.setRole(UserRole.ADMIN);
        adminPadrao.setValidado(true);
    }

    // =========================================================
    // LOGIN
    // =========================================================
    @Nested
    @DisplayName("login()")
    class Login {

        @Test
        @DisplayName("Deve realizar login com sucesso e retornar token")
        void deveRealizarLoginComSucesso() {
            AuthenticationDTO authDTO = new AuthenticationDTO("professor@uece.br", "senha123");
            Authentication authMock = mock(Authentication.class);

            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authMock);
            when(authMock.getPrincipal()).thenReturn(usuarioPadrao);
            when(authMock.getName()).thenReturn("professor@uece.br");
            when(tokenService.gerarToken(usuarioPadrao)).thenReturn("token-jwt-valido");

            LoginResponseDTO resposta = authenticationService.login(authDTO);

            assertThat(resposta).isNotNull();
            assertThat(resposta.token()).isEqualTo("token-jwt-valido");
            verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
            verify(tokenService).gerarToken(usuarioPadrao);
        }

        @Test
        @DisplayName("Deve lançar IllegalStateException quando usuário não está validado")
        void deveLancarExcecaoQuandoNaoValidado() {
            usuarioPadrao.setValidado(false);
            AuthenticationDTO authDTO = new AuthenticationDTO("professor@uece.br", "senha123");
            Authentication authMock = mock(Authentication.class);

            when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authMock);
            when(authMock.getPrincipal()).thenReturn(usuarioPadrao);

            assertThatThrownBy(() -> authenticationService.login(authDTO))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Usuário ainda não foi validado por um administrador.");

            verify(tokenService, never()).gerarToken(any());
        }
    }

    // =========================================================
    // REGISTRAR
    // =========================================================
    @Nested
    @DisplayName("registrar()")
    class Registrar {

        @Test
        @DisplayName("Deve registrar usuário com sucesso via Auto-Cadastro (Sem autenticação)")
        void deveRegistrarUsuarioViaAutoCadastro() {
            // Ordem: email, senha, nome, role, emailSecundario
            RegisterDTO dto = new RegisterDTO("novo@uece.br", "senha123", "Novo Usuário", UserRole.PROFESSOR, "secundario@email.com");

            when(repository.findByEmail(dto.email())).thenReturn(Optional.empty());
            when(passwordEncoder.encode(dto.senha())).thenReturn("senha-hash");
            when(repository.save(any(Usuario.class))).thenAnswer(i -> {
                Usuario u = i.getArgument(0);
                u.setId(2L);
                return u;
            });

            UsuarioResponseDTO resposta = authenticationService.registrar(dto, null, null);

            assertThat(resposta).isNotNull();
            verify(repository).save(any(Usuario.class));
            verify(auditoriaService).registrarLog(eq("Usuario"), eq(2L), eq(AcaoAuditoria.CRIACAO), eq(2L), any(Usuario.class));
            verify(emailService, never()).sendEmail(anyString(), anyString(), anyString(), any());
        }

        @Test
        @DisplayName("Deve registrar usuário criado por Admin com MFA e enviar e-mail de primeiro acesso")
        void deveRegistrarUsuarioCriadoPorAdmin() {
            RegisterDTO dto = new RegisterDTO("novo.admin@uece.br", null, "Novo Admin", UserRole.ADMIN, "secundario.admin@email.com");

            when(authentication.isAuthenticated()).thenReturn(true);
            when(authentication.getPrincipal()).thenReturn(adminPadrao);
            when(repository.findByEmail(dto.email())).thenReturn(Optional.empty());
            when(passwordEncoder.encode("")).thenReturn("senha-vazia-hash");
            when(tokenService.gerarTokenPrimeiroAcesso()).thenReturn("token-magico-123");

            when(repository.save(any(Usuario.class))).thenAnswer(i -> {
                Usuario u = i.getArgument(0);
                u.setId(3L);
                return u;
            });

            UsuarioResponseDTO resposta = authenticationService.registrar(dto, authentication, "123456");

            assertThat(resposta).isNotNull();
            verify(mfaGuard).check(adminPadrao, "123456");
            verify(emailService).sendEmail(eq("novo.admin@uece.br"), anyString(), contains("token-magico-123"), eq(EmailType.WELCOME));
            verify(auditoriaService).registrarLog(eq("Usuario"), eq(3L), eq(AcaoAuditoria.CRIACAO), eq(99L), any(Usuario.class)); // 99L é o ID do Admin
        }

        @Test
        @DisplayName("Deve lançar exceção se auto-cadastro tiver senha vazia")
        void deveLancarExcecaoQuandoSenhaVaziaNoAutoCadastro() {
            RegisterDTO dto = new RegisterDTO("novo@uece.br", " ", "Novo Usuário", UserRole.PROFESSOR, "secundario@email.com");

            when(repository.findByEmail(dto.email())).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authenticationService.registrar(dto, null, null))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("A senha não pode estar vazia para auto-cadastro.");
        }

        @Test
        @DisplayName("Deve lançar AccessDeniedException se não-admin tentar registrar Admin")
        void deveLancarExcecaoSeNaoAdminTentarRegistrarAdmin() {
            RegisterDTO dto = new RegisterDTO("malicioso@uece.br", "senha123", "Hacker", UserRole.ADMIN, "hacker.secundario@email.com");

            // Simula um usuário PROFESSOR autenticado tentando criar um ADMIN
            when(authentication.isAuthenticated()).thenReturn(true);
            when(authentication.getPrincipal()).thenReturn(usuarioPadrao);

            when(repository.findByEmail(dto.email())).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authenticationService.registrar(dto, authentication, null))
                    .isInstanceOf(AccessDeniedException.class)
                    .hasMessage("Apenas administradores podem cadastrar novos administradores.");
        }

        @Test
        @DisplayName("Deve lançar exceção se o e-mail não terminar com @uece.br")
        void deveLancarExcecaoQuandoEmailNaoInstitucional() {
            RegisterDTO dto = new RegisterDTO("aluno@gmail.com", "senha123", "Aluno", UserRole.PROFESSOR, "aluno.secundario@email.com");

            assertThatThrownBy(() -> authenticationService.registrar(dto, null, null))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("O email deve ser institucional (@uece.br)");
        }

        @Test
        @DisplayName("Deve lançar exceção se e-mail principal já estiver em uso")
        void deveLancarExcecaoQuandoEmailEmUso() {
            RegisterDTO dto = new RegisterDTO("existente@uece.br", "senha123", "Aluno", UserRole.PROFESSOR, "aluno.secundario@email.com");
            when(repository.findByEmail(dto.email())).thenReturn(Optional.of(usuarioPadrao));

            assertThatThrownBy(() -> authenticationService.registrar(dto, null, null))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Erro: Este login já está em uso.");
        }

        @Test
        @DisplayName("Deve lançar exceção se e-mail secundário já for e-mail principal de outra pessoa")
        void deveLancarExcecaoQuandoSecundarioJaForPrincipal() {
            RegisterDTO dto = new RegisterDTO("novo@uece.br", "senha", "Nome", UserRole.PROFESSOR, "existente.principal@gmail.com");

            when(repository.findByEmail(dto.email())).thenReturn(Optional.empty());
            when(repository.findByEmailSecundario(dto.emailSecundario())).thenReturn(Optional.empty());
            when(repository.findByEmail(dto.emailSecundario())).thenReturn(Optional.of(usuarioPadrao));

            assertThatThrownBy(() -> authenticationService.registrar(dto, null, null))
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessage("Erro: O e-mail secundário fornecido já é o e-mail principal de outra conta.");
        }
    }

    // =========================================================
    // ATIVAR PRIMEIRO ACESSO
    // =========================================================
    @Nested
    @DisplayName("ativarPrimeiroAcesso()")
    class AtivarPrimeiroAcesso {

        @Test
        @DisplayName("Deve ativar acesso e definir nova senha com sucesso")
        void deveAtivarComSucesso() {
            Usuario pendente = new Usuario();
            pendente.setId(5L);
            pendente.setTokenPrimeiroAcesso("token-valido-123");
            pendente.setTokenPrimeiroAcessoExpiracao(LocalDateTime.now().plusDays(2));

            when(repository.findByTokenPrimeiroAcesso("token-valido-123")).thenReturn(Optional.of(pendente));
            when(passwordEncoder.encode("senhaForte456")).thenReturn("hash-senha-nova");

            authenticationService.ativarPrimeiroAcesso("token-valido-123", "senhaForte456");

            ArgumentCaptor<Usuario> userCaptor = ArgumentCaptor.forClass(Usuario.class);
            verify(repository).save(userCaptor.capture());

            Usuario salvo = userCaptor.getValue();
            assertThat(salvo.getSenha()).isEqualTo("hash-senha-nova");
            assertThat(salvo.getTokenPrimeiroAcesso()).isNull(); // Token deve ser invalidado
            assertThat(salvo.getTokenPrimeiroAcessoExpiracao()).isNull();
        }

        @Test
        @DisplayName("Deve lançar exceção quando token não for encontrado")
        void deveLancarExcecaoQuandoTokenNaoEncontrado() {
            when(repository.findByTokenPrimeiroAcesso("token-fantasma")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authenticationService.ativarPrimeiroAcesso("token-fantasma", "nova-senha"))
                    .isInstanceOf(TokenInvalidoException.class);

            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("Deve lançar exceção quando token estiver expirado")
        void deveLancarExcecaoQuandoTokenExpirado() {
            Usuario pendente = new Usuario();
            pendente.setTokenPrimeiroAcessoExpiracao(LocalDateTime.now().minusDays(1)); // Expirou ontem

            when(repository.findByTokenPrimeiroAcesso("token-vencido")).thenReturn(Optional.of(pendente));

            assertThatThrownBy(() -> authenticationService.ativarPrimeiroAcesso("token-vencido", "nova-senha"))
                    .isInstanceOf(TokenExpiradoException.class);

            verify(repository, never()).save(any());
        }
    }
}