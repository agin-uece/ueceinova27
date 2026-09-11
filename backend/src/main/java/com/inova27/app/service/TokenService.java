package com.inova27.app.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.inova27.app.exception.BusinessException;
import com.inova27.app.model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    // Essa variável vai puxar o valor lá do seu application.properties22__
    @Value("${api.security.token.secret}")
    private String secret;

    public String gerarToken(Usuario usuario) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("minha-api")
                    .withSubject(usuario.getEmail()) // Salva o login do usuário dentro do token
                    .withClaim("role", usuario.getRole().name())
                    .withExpiresAt(gerarDataExpiracao()) // Define quando o token vence
                    .sign(algoritmo);
        } catch (JWTCreationException exception) {
            throw new BusinessException("Erro ao gerar token JWT");
        }
    }

    public String gerarTokenPrimeiroAcesso() {
        return java.util.UUID.randomUUID().toString();
    }

    public String validarToken(String token) {
        try {
            Algorithm algoritmo = Algorithm.HMAC256(secret);
            return JWT.require(algoritmo)
                    .withIssuer("minha-api")
                    .build()
                    .verify(token)
                    .getSubject(); // Devolve o login (ex: "admin") que guardamos dentro do token
        } catch (JWTVerificationException exception) {
            throw new BusinessException("Token inválido ou expirado");
        }
    }

    private Instant gerarDataExpiracao() {
        // O token expira em 2 horas. O ZoneOffset de -03:00 garante que o fuso horário esteja alinhado com o seu local atual no Brasil.
        return LocalDateTime.now().plusHours(20000000).toInstant(ZoneOffset.of("-03:00"));
    }
}
