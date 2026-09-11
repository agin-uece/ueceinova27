package com.inova27.app.controller;

import com.inova27.app.dto.authentication.AuthenticationDTO;
import com.inova27.app.dto.authentication.LoginResponseDTO;
import com.inova27.app.dto.authentication.PrimeiroAcessoDTO;
import com.inova27.app.dto.authentication.RegisterDTO;
import com.inova27.app.dto.email.ForgotPasswordDTO;
import com.inova27.app.dto.email.ResetPasswordDTO;
import com.inova27.app.exception.MfaRequiredException;
import com.inova27.app.exception.TokenExpiradoException;
import com.inova27.app.exception.TokenInvalidoException;
import com.inova27.app.service.AuthenticationService;
import com.inova27.app.service.PasswordResetService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationControllerTest {

    @Mock
    private AuthenticationService authenticationService;

    @Mock
    private PasswordResetService passwordResetService;

    @InjectMocks
    private AuthenticationController controller;

    @Mock
    private Authentication authentication; // Mock do objeto de segurança do Spring

    // ==========================================
    // FORGOT PASSWORD
    // ==========================================
    @Test
    @DisplayName("Deve processar forgotPassword com sucesso")
    void testForgotPassword_Sucesso() {
        ForgotPasswordDTO dto = new ForgotPasswordDTO("teste@inova27.com");

        // Como o método é void, não precisamos fazer um when().thenReturn()
        ResponseEntity<String> response = controller.forgotPassword(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("Email enviado com sucesso!");
        verify(passwordResetService, times(1)).forgotPassword("teste@inova27.com");
    }

    // ==========================================
    // PRIMEIRO ACESSO
    // ==========================================
    @Test
    @DisplayName("Deve processar primeiroAcesso com sucesso")
    void testPrimeiroAcesso_Sucesso() {
        PrimeiroAcessoDTO dto = new PrimeiroAcessoDTO("token123", "NovaSenha@123");

        ResponseEntity<String> response = controller.primeiroAcesso(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("Senha definida com sucesso! Você já pode fazer login.");
    }

   

    @Test
    @DisplayName("Deve retornar BAD_REQUEST em primeiroAcesso com TokenExpiradoException")
    void testPrimeiroAcesso_TokenExpirado() {
        PrimeiroAcessoDTO dto = new PrimeiroAcessoDTO("token-expirado", "senha");

        doThrow(new TokenExpiradoException("Token expirado"))
                .when(authenticationService).ativarPrimeiroAcesso(dto.token(), dto.novaSenha());

        ResponseEntity<String> response = controller.primeiroAcesso(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isEqualTo("Token expirado. Solicite um novo convite ao administrador.");
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR em primeiroAcesso com erro genérico")
    void testPrimeiroAcesso_ErroGenerico() {
        PrimeiroAcessoDTO dto = new PrimeiroAcessoDTO("token", "senha");

        doThrow(new RuntimeException("Banco caiu"))
                .when(authenticationService).ativarPrimeiroAcesso(dto.token(), dto.novaSenha());

        ResponseEntity<String> response = controller.primeiroAcesso(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isEqualTo("Erro interno ao ativar conta.");
    }

    // ==========================================
    // RESET PASSWORD
    // ==========================================
    @Test
    @DisplayName("Deve processar resetPassword com sucesso")
    void testResetPassword_Sucesso() {
        ResetPasswordDTO dto = new ResetPasswordDTO("token123", "NovaSenha@123");

        ResponseEntity<String> response = controller.resetPassword(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("Senha redefinida com sucesso");
    }

    @Test
    @DisplayName("Deve retornar BAD_REQUEST em resetPassword com RuntimeException")
    void testResetPassword_Erro() {
        ResetPasswordDTO dto = new ResetPasswordDTO("token123", "senha");

        doThrow(new RuntimeException("Token não encontrado"))
                .when(passwordResetService).resetPassword(dto.token(), dto.novaSenha());

        ResponseEntity<String> response = controller.resetPassword(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isEqualTo("Token não encontrado");
    }

    // ==========================================
    // LOGIN
    // ==========================================


    @Test
    @DisplayName("Deve retornar FORBIDDEN em login com IllegalStateException")
    void testLogin_IllegalState() {
        AuthenticationDTO dto = new AuthenticationDTO("admin", "senha");
        when(authenticationService.login(dto)).thenThrow(new IllegalStateException("Conta inativa"));

        ResponseEntity<Object> response = controller.login(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody()).isEqualTo("Conta inativa");
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED em login com BadCredentialsException")
    void testLogin_BadCredentials() {
        AuthenticationDTO dto = new AuthenticationDTO("admin", "senha_errada");
        when(authenticationService.login(dto)).thenThrow(new BadCredentialsException("Bad creds"));

        ResponseEntity<Object> response = controller.login(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).isEqualTo("Erro: Usuário ou senha inválidos.");
    }

    @Test
    @DisplayName("Deve retornar UNAUTHORIZED em login com falha genérica de autenticação")
    void testLogin_AuthenticationException() {
        AuthenticationDTO dto = new AuthenticationDTO("admin", "senha");
        // AccountExpiredException estende AuthenticationException
        when(authenticationService.login(dto)).thenThrow(new AccountExpiredException("Expirado"));

        ResponseEntity<Object> response = controller.login(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).isEqualTo("Erro: Falha na autenticação.");
    }

    // ==========================================
    // REGISTER
    // ==========================================
    @Test
    @DisplayName("Deve registrar usuário com sucesso")
    void testRegistrar_Sucesso() {
        RegisterDTO dto = mock(RegisterDTO.class);

        ResponseEntity<String> response = controller.registrar(dto, "123456", authentication);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo("Usuário registrado com sucesso!");
        verify(authenticationService, times(1)).registrar(dto, authentication, "123456");
    }



    @Test
    @DisplayName("Deve retornar BAD_REQUEST no registrar com IllegalArgumentException")
    void testRegistrar_IllegalArgument() {
        RegisterDTO dto = mock(RegisterDTO.class);
        doThrow(new IllegalArgumentException("Dados inválidos"))
                .when(authenticationService).registrar(dto, authentication, null);

        ResponseEntity<String> response = controller.registrar(dto, null, authentication);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isEqualTo("Dados inválidos");
    }

    @Test
    @DisplayName("Deve retornar FORBIDDEN no registrar com AccessDeniedException")
    void testRegistrar_AccessDenied() {
        RegisterDTO dto = mock(RegisterDTO.class);
        doThrow(new AccessDeniedException("Acesso negado"))
                .when(authenticationService).registrar(dto, authentication, null);

        ResponseEntity<String> response = controller.registrar(dto, null, authentication);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        assertThat(response.getBody()).isEqualTo("Acesso negado");
    }

    @Test
    @DisplayName("Deve retornar CONFLICT no registrar com DataIntegrityViolationException")
    void testRegistrar_DataIntegrity() {
        RegisterDTO dto = mock(RegisterDTO.class);
        doThrow(new DataIntegrityViolationException("Duplicado"))
                .when(authenticationService).registrar(dto, authentication, null);

        ResponseEntity<String> response = controller.registrar(dto, null, authentication);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).isEqualTo("Erro: Conflito de dados ao tentar registrar o usuário. O login pode já ter sido reservado.");
    }

    @Test
    @DisplayName("Deve retornar INTERNAL_SERVER_ERROR no registrar com falha genérica")
    void testRegistrar_ErroGenerico() {
        RegisterDTO dto = mock(RegisterDTO.class);
        doThrow(new RuntimeException("Caiu o servidor"))
                .when(authenticationService).registrar(dto, authentication, null);

        ResponseEntity<String> response = controller.registrar(dto, null, authentication);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isEqualTo("Erro interno no servidor ao registrar usuário. Tente novamente mais tarde.");
    }
}