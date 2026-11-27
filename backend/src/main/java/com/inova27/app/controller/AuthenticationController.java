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

import java.util.Map;



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
        authenticationService.ativarPrimeiroAcesso(data.token(), data.novaSenha());
        return ResponseEntity.ok("Senha definida com sucesso! Você já pode fazer login.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody @Valid ResetPasswordDTO data) {
        passwordResetService.resetPassword(data.token(), data.novaSenha());
        return ResponseEntity.ok("Senha redefinida com sucesso");
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody @Valid AuthenticationDTO data) {
        LoginResponseDTO response = authenticationService.login(data);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register/solicitar-codigo")
    public ResponseEntity<Map<String, String>> solicitarCodigoCadastro(@RequestBody @Valid RegisterDTO data) {
        authenticationService.solicitarCodigoConfirmacaoCadastro(data);
        return ResponseEntity.ok(Map.of("mensagem", "Código de confirmação enviado para o seu e-mail institucional."));
    }

    @PostMapping("/register")
    public ResponseEntity<String> registrar(@RequestBody @Valid RegisterDTO data,
                                            @RequestHeader(value = "X-MFA-PIN", required = false) String pin,
                                            Authentication authentication) {
        authenticationService.registrar(data, authentication, pin);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuário registrado com sucesso!");
    }
}