package com.inova27.app.service;

import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.inova27.app.exception.BusinessException;
import com.inova27.app.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TokenServiceTest {

    private TokenService tokenService;

    // Um secret falso apenas para rodar a criptografia durante o teste
    private final String SECRET_TEST = "minha-chave-secreta-de-teste-inova27";

    @BeforeEach
    void setUp() {
        tokenService = new TokenService();
        // Injetamos a variável @Value manualmente para não precisar subir o contexto inteiro do Spring
        ReflectionTestUtils.setField(tokenService, "secret", SECRET_TEST);
    }

    @Test
    @DisplayName("Deve gerar um token JWT válido para o usuário")
    void testGerarToken_Sucesso() {
        // O RETURNS_DEEP_STUBS permite mockar o "getRole().name()" de uma vez só, sem precisar mockar o Enum separadamente
        Usuario usuario = mock(Usuario.class, RETURNS_DEEP_STUBS);
        when(usuario.getEmail()).thenReturn("admin@inova27.com");
        when(usuario.getRole().name()).thenReturn("ROLE_ADMIN");

        String token = tokenService.gerarToken(usuario);

        assertThat(token).isNotBlank();
        // Um JWT válido sempre tem 3 partes separadas por ponto (Header.Payload.Signature)
        assertThat(token.split("\\.")).hasSize(3);
    }

    @Test
    @DisplayName("Deve validar um token JWT e retornar o email do usuário")
    void testValidarToken_Sucesso() {
        // Geramos um token real primeiro
        Usuario usuario = mock(Usuario.class, RETURNS_DEEP_STUBS);
        when(usuario.getEmail()).thenReturn("professor@uece.br");
        when(usuario.getRole().name()).thenReturn("ROLE_PROFESSOR");

        String token = tokenService.gerarToken(usuario);

        // Validamos o token gerado passando ele pelo método de validação
        String subject = tokenService.validarToken(token);

        assertThat(subject).isEqualTo("professor@uece.br");
    }

    @Test
    @DisplayName("Deve lançar BusinessException ao tentar validar um token alterado ou falso")
    void testValidarToken_Invalido() {
        String tokenFalso = "eyJhbGciOiJIUzI1NiIsInR5cCI.Token.InvalidoAqui";

        assertThatThrownBy(() -> tokenService.validarToken(tokenFalso))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Token inválido ou expirado");
    }

    @Test
    @DisplayName("Deve gerar um UUID válido para o primeiro acesso")
    void testGerarTokenPrimeiroAcesso() {
        String token = tokenService.gerarTokenPrimeiroAcesso();

        assertThat(token).isNotBlank();
        assertThat(token).hasSize(36); // Tamanho padrão de um formato UUID
    }

}