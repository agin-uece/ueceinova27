package com.inova27.app.controller;

import com.inova27.app.dto.authentication.AuthenticationDTO;
import com.inova27.app.dto.authentication.LoginResponseDTO;
import com.inova27.app.dto.authentication.PrimeiroAcessoDTO;
import com.inova27.app.dto.authentication.RegisterDTO;
import com.inova27.app.dto.email.ForgotPasswordDTO;
import com.inova27.app.dto.email.ResetPasswordDTO;
import com.inova27.app.service.AuthenticationService;
import com.inova27.app.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody @Valid ForgotPasswordDTO data) {
        passwordResetService.forgotPassword(data.email());
        return ResponseEntity.ok("Email enviado com sucesso!");
    }

    @PostMapping("/primeiro-acesso")
    public ResponseEntity<String> primeiroAcesso(@RequestBody @Valid PrimeiroAcessoDTO data) {
        try {
            authenticationService.ativarPrimeiroAcesso(data.token(), data.novaSenha());
            return ResponseEntity.ok("Senha definida com sucesso! Você já pode fazer login.");
        } catch (com.inova27.app.exception.TokenInvalidoException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token inválido ou já utilizado.");
        } catch (com.inova27.app.exception.TokenExpiradoException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token expirado. Solicite um novo convite ao administrador.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno ao ativar conta.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody @Valid ResetPasswordDTO data) {
        try {
            passwordResetService.resetPassword(data.token(), data.novaSenha());
            return ResponseEntity.ok("Senha redefinida com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody @Valid AuthenticationDTO data) {
        try {
            LoginResponseDTO response = authenticationService.login(data);
            return ResponseEntity.ok(response);

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Erro: Usuário ou senha inválidos.");

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Erro: Falha na autenticação.");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> registrar(@RequestBody @Valid RegisterDTO data,
                                            @RequestHeader(value = "X-MFA-PIN", required = false) String pin,
                                            Authentication authentication) {
        try {
            authenticationService.registrar(data, authentication, pin);
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuário registrado com sucesso!");

        } catch (com.inova27.app.exception.MfaRequiredException e) {
            throw e;

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Erro: Conflito de dados ao tentar registrar o usuário. O login pode já ter sido reservado.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno no servidor ao registrar usuário. Tente novamente mais tarde.");
        }
    }
}