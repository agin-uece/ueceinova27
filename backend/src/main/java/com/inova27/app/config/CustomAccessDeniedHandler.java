package com.inova27.app.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        // Define o status HTTP como 403 Forbidden
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);

        // Define que a resposta será um JSON suportando acentuação
        response.setContentType("application/json;charset=UTF-8");

        // Escreve a mensagem personalizada no corpo da resposta
        response.getWriter().write("{\"erro\": \"Acesso negado: Você não tem o nível de permissão (ADMIN) necessário para realizar esta ação.\"}");
    }
}