package com.inova27.app.service;


import com.inova27.app.exception.TokenExpiradoException;
import com.inova27.app.exception.TokenInvalidoException;
import com.inova27.app.model.EmailType;
import com.inova27.app.model.PasswordResetToken;
import com.inova27.app.model.Usuario;
import com.inova27.app.repository.PasswordResetTokenRepository;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils; // <-- Importação necessária

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PasswordResetService - Testes Unitários")
class PasswordResetServiceTest {

    @Mock private UsuarioRepository usuarioRepository;
    @Mock private PasswordResetTokenRepository tokenRepository;
    @Mock private EmailService emailService;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private PasswordResetService passwordResetService;

    private Usuario usuarioPadrao;

    @BeforeEach
    void setUp() {
        // Injeta uma URL fictícia na variável que era anotada com @Value para evitar o NullPointerException
        ReflectionTestUtils.setField(passwordResetService, "frontendUrl", "http://localhost:3000");

        usuarioPadrao = new Usuario();
        usuarioPadrao.setId(1L);
        usuarioPadrao.setEmail("joao@email.com");
        usuarioPadrao.setSenha("senha_antiga_hash");
    }

    @Nested
    @DisplayName("forgotPassword()")
    class ForgotPassword {

        @Test
        @DisplayName("Deve lançar exceção quando usuário não encontrado")
        void deveLancarExcecaoQuandoUsuarioNaoEncontrado() {
            when(usuarioRepository.findByEmail("naoexiste@email.com")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> passwordResetService.forgotPassword("naoexiste@email.com"))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessage("Usuário não encontrado");

            verify(tokenRepository, never()).save(any());
            verify(emailService, never()).sendEmail(any(), any(), any(), any());
        }

        @Test
        @DisplayName("O token gerado deve ser único a cada chamada")
        void tokenDeveSerUnicoACadaChamada() {
            when(usuarioRepository.findByEmail("joao@email.com")).thenReturn(Optional.of(usuarioPadrao));
            when(tokenRepository.save(any())).thenAnswer(i -> i.getArgument(0));

            passwordResetService.forgotPassword("joao@email.com");
            passwordResetService.forgotPassword("joao@email.com");

            ArgumentCaptor<PasswordResetToken> captor = ArgumentCaptor.forClass(PasswordResetToken.class);
            verify(tokenRepository, times(2)).save(captor.capture());

            List<PasswordResetToken> tokens = captor.getAllValues();
            assertThat(tokens.get(0).getToken()).isNotEqualTo(tokens.get(1).getToken());
        }
    }

    @Nested
    @DisplayName("resetPassword()")
    class ResetPassword {

        @Test
        @DisplayName("Deve redefinir senha com sucesso")
        void deveRedefinirSenhaComSucesso() {
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken("token-valido");
            resetToken.setUsuario(usuarioPadrao);
            resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));

            when(tokenRepository.findByToken("token-valido")).thenReturn(Optional.of(resetToken));
            when(passwordEncoder.encode("nova-senha")).thenReturn("nova-senha-hash");
            when(usuarioRepository.save(any())).thenReturn(usuarioPadrao);

            passwordResetService.resetPassword("token-valido", "nova-senha");

            assertThat(usuarioPadrao.getSenha()).isEqualTo("nova-senha-hash");
            verify(usuarioRepository).save(usuarioPadrao);
            verify(tokenRepository).delete(resetToken);
        }

        @Test
        @DisplayName("Deve lançar TokenInvalidoException quando token não encontrado")
        void deveLancarExcecaoQuandoTokenInvalido() {
            when(tokenRepository.findByToken("token-invalido")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> passwordResetService.resetPassword("token-invalido", "nova-senha"))
                    .isInstanceOf(TokenInvalidoException.class);

            verify(usuarioRepository, never()).save(any());
        }

        @Test
        @DisplayName("Deve lançar TokenExpiradoException quando token expirado")
        void deveLancarExcecaoQuandoTokenExpirado() {
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken("token-expirado");
            resetToken.setUsuario(usuarioPadrao);
            resetToken.setExpiryDate(LocalDateTime.now().minusHours(1));

            when(tokenRepository.findByToken("token-expirado")).thenReturn(Optional.of(resetToken));

            assertThatThrownBy(() -> passwordResetService.resetPassword("token-expirado", "nova-senha"))
                    .isInstanceOf(TokenExpiradoException.class);

            verify(usuarioRepository, never()).save(any());
            verify(tokenRepository, never()).delete(any());
        }

        @Test
        @DisplayName("Deve deletar token após redefinição bem-sucedida")
        void deveDeletarTokenAposRedefinicao() {
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken("token-valido");
            resetToken.setUsuario(usuarioPadrao);
            resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));

            when(tokenRepository.findByToken("token-valido")).thenReturn(Optional.of(resetToken));
            when(passwordEncoder.encode(any())).thenReturn("hash");
            when(usuarioRepository.save(any())).thenReturn(usuarioPadrao);

            passwordResetService.resetPassword("token-valido", "nova-senha");

            verify(tokenRepository).delete(resetToken);
        }
    }
}