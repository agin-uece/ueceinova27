package com.inova27.app.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Erros barrados pelo Spring Security (antes de chegar aos controllers),
 * no mesmo formato {"erro": "..."} do GlobalExceptionHandler.
 */
@Component
public class SecurityErrorHandler implements AuthenticationEntryPoint, AccessDeniedHandler {

    // Sem token, token inválido/expirado ou usuário inexistente
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException ex) throws IOException {
        escrever(response, HttpServletResponse.SC_UNAUTHORIZED, "Não autenticado: faça login novamente.");
    }

    // Autenticado, mas sem o perfil exigido pela rota
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException ex) throws IOException {
        escrever(response, HttpServletResponse.SC_FORBIDDEN, "Acesso negado: você não tem permissão para realizar esta ação.");
    }

    private static void escrever(HttpServletResponse response, int status, String mensagem) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write("{\"erro\": \"" + mensagem + "\"}");
    }
}
